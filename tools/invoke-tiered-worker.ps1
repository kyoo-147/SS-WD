[CmdletBinding()]
param(
    [Parameter(Mandatory = $true, Position = 0)]
    [string]$Prompt,

    [ValidateSet('auto', 'implementation', 'architecture', 'review', 'scan', 'ui')]
    [string]$TaskProfile = 'auto',

    [string]$WorkingDirectory = (Get-Location).Path,
    [int]$MaxAttempts = 3,
    [ValidateRange(1, 3)]
    [int]$StartTier = 1,
    [switch]$NoYolo,
    [switch]$DryRun,
    [string]$EvidencePath
)

$ErrorActionPreference = 'Continue'

function New-Candidate([int]$Tier, [string]$Agent, [string]$Model, [string]$Source, [string]$Evidence) {
    [pscustomobject]@{
        Tier = $Tier
        Agent = $Agent
        Model = $Model
        Source = $Source
        Evidence = $Evidence
    }
}

$commandCodeModel = switch ($TaskProfile) {
    'architecture' { 'claude-fable-5-1' }
    'review' { 'claude-opus-5-5' }
    'implementation' { 'claude-sonnet-5-5' }
    'ui' { 'minimaxai/minimax-m3' }
    'scan' { 'deepseek/deepseek-v4-flash' }
    default { 'claude-sonnet-5-5' }
}

$agyModel = switch ($TaskProfile) {
    'architecture' { 'gemini-3.1-pro-high' }
    'review' { 'gemini-3.1-pro-high' }
    'implementation' { 'claude-sonnet-5-5-high' }
    'ui' { 'claude-sonnet-5-5-high' }
    'scan' { 'gemini-3.8-flash-low' }
    default { 'gemini-3.8-flash-high' }
}

$nativeFree = switch ($TaskProfile) {
    'architecture' { @('stealth/space-bunny-alpha', 'poolside/laguna-s-2.1-free', 'inclusionai/ling-3.1-flash:free') }
    'review' { @('inclusionai/ling-3.1-flash:free', 'poolside/laguna-s-2.1-free', 'stealth/space-bunny-alpha') }
    'scan' { @('inclusionai/ling-3.1-flash:free', 'poolside/laguna-s-2.1-free', 'stealth/space-bunny-alpha') }
    default { @('poolside/laguna-s-2.1-free', 'inclusionai/ling-3.1-flash:free', 'stealth/space-bunny-alpha') }
}

$candidates = [System.Collections.Generic.List[object]]::new()
$candidates.Add((New-Candidate 1 'commandcode' $commandCodeModel 'native-account' 'live-status-and-model-list-required'))
$candidates.Add((New-Candidate 1 'agy' $agyModel 'native-account' 'live-model-list-required'))
$candidates.Add((New-Candidate 2 'opencode' '9router/free' 'navin-gateway' 'authenticated-smoke-required'))
foreach ($model in $nativeFree) {
    $candidates.Add((New-Candidate 3 'commandcode' $model 'native-free' 'catalog-and-smoke-required'))
}

# OpenCode Console free models are optional. Include them only when the local
# OpenCode model list proves that the provider is connected on this machine.
$openCodeModels = @()
try { $openCodeModels = @(& opencode models 2>$null | ForEach-Object { $_.Trim() }) } catch {}
foreach ($model in @('laguna-s-2.1-free', 'ling-3.0-tiny-free', 'longcat-2.0-free', 'north-mini-code-free', 'nemotron-3-ultra-free', 'deepseek-v4-flash-free')) {
    if ($openCodeModels -contains "opencode/$model") {
        $candidates.Add((New-Candidate 3 'opencode' "opencode/$model" 'opencode-native-free' 'live-model-list-verified'))
    }
}

function Test-TransientFailure([string]$Text) {
    $Text -match '(?i)(timeout|timed out|ECONN|ETIMEDOUT|429|502|503|504|temporarily unavailable|overloaded|rate limit|capacity|network error|connection reset)'
}

function Test-FallbackEligible([string]$Text) {
    $Text -match '(?i)(insufficient credits|credit_balance_exhausted|quota|billing|authentication|unauthorized|forbidden|invalid api key|invalid token|expired|model unavailable|model .* not (supported|recognized|found)|provider unavailable|401|402|403|406|410|429|502|503|504|timeout|timed out|ECONN|ETIMEDOUT|overloaded|rate limit|capacity)'
}

function Invoke-Candidate($Candidate) {
    $old = Get-Location
    try {
        Set-Location -LiteralPath $WorkingDirectory -ErrorAction Stop
        $output = switch ($Candidate.Agent) {
            'commandcode' {
                $args = @('-p', $Prompt, '--output-format', 'text')
                if ($Candidate.Model) { $args += '-m'; $args += $Candidate.Model }
                if (-not $NoYolo) { $args += '--yolo' }
                & cmdc @args 2>&1 | Out-String
            }
            'agy' {
                $args = @('-p', $Prompt, '--model', $Candidate.Model, '--output-format', 'json', '--print-timeout', '30m')
                if (-not $NoYolo) { $args += '--dangerously-skip-permissions' }
                & agy @args 2>&1 | Out-String
            }
            'opencode' {
                $args = @('run', '--standalone', '--model', $Candidate.Model, $Prompt, '--log-level', 'error')
                if (-not $NoYolo) { $args += '--auto' }
                & opencode @args 2>&1 | Out-String
            }
        }
        [pscustomobject]@{ ExitCode = $LASTEXITCODE; Output = $output }
    } finally {
        Set-Location $old
    }
}

$events = [System.Collections.Generic.List[object]]::new()
if ($DryRun) {
    $candidates | Where-Object Tier -ge $StartTier | Select-Object Tier, Agent, Model, Source, Evidence | Format-Table -AutoSize
    exit 0
}

foreach ($candidate in ($candidates | Where-Object Tier -ge $StartTier)) {
    for ($attempt = 1; $attempt -le [Math]::Max(1, $MaxAttempts); $attempt++) {
        $started = [DateTimeOffset]::UtcNow
        $result = Invoke-Candidate $candidate
        $event = [pscustomobject]@{
            at = $started.ToString('o')
            tier = $candidate.Tier
            agent = $candidate.Agent
            model = $(if ($candidate.Model) { $candidate.Model } else { '<account-default>' })
            attempt = $attempt
            exitCode = $result.ExitCode
            transient = Test-TransientFailure $result.Output
            fallbackEligible = Test-FallbackEligible $result.Output
        }
        $events.Add($event)

        if ($result.ExitCode -eq 0) {
            Write-Output "[VERIFIED] tier=$($candidate.Tier) agent=$($candidate.Agent) model=$($event.model) attempt=$attempt"
            Write-Output $result.Output
            if ($EvidencePath) {
                $events | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath $EvidencePath
            }
            exit 0
        }

        Write-Warning "[FAILED] tier=$($candidate.Tier) agent=$($candidate.Agent) model=$($event.model) attempt=$attempt exit=$($result.ExitCode)"
        Write-Warning $result.Output

        if ($event.transient -and $attempt -lt $MaxAttempts) {
            Start-Sleep -Seconds ([Math]::Pow(2, $attempt - 1))
            continue
        }
        if (-not $event.fallbackEligible) {
            if ($EvidencePath) {
                $events | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath $EvidencePath
            }
            Write-Error '[BLOCKED] non-provider task/runtime failure; refusing to hide it with a model fallback'
            exit 2
        }
        break
    }
}

if ($EvidencePath) {
    $events | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath $EvidencePath
}
Write-Error '[BLOCKED] all three routing tiers are unavailable'
exit 1
