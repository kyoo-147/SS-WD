[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [ValidateSet('claude', 'opencode', 'commandcode')]
    [string]$Agent,

    [Parameter(Mandatory = $true, Position = 0)]
    [string]$Prompt,

    [string[]]$Model,
    [string]$WorkingDirectory = (Get-Location).Path,
    [switch]$NoYolo,
    [int]$MaxAttempts = 3
)

$ErrorActionPreference = 'Continue'

if (-not $Model -or $Model.Count -eq 0) {
    $Model = switch ($Agent) {
        'claude' { @('free', 'gemini/gemini-3.8-flash', 'ollama/gpt-oss:120b') }
        'opencode' { @('9router/free', '9router/gemini/gemini-3.8-flash', '9router/ollama/gpt-oss:120b') }
        'commandcode' { @('poolside/laguna-s-2.1-free', 'inclusionai/ling-3.1-flash:free', 'stealth/space-bunny-alpha') }
    }
}

function Test-TransientFailure([string]$Text) {
    return $Text -match '(?i)(timeout|timed out|ECONN|ETIMEDOUT|429|502|503|504|temporarily unavailable|overloaded|rate limit|capacity|network error)'
}

function Invoke-Agent([string]$SelectedModel) {
    $old = Get-Location
    try {
        Set-Location -LiteralPath $WorkingDirectory
        $result = switch ($Agent) {
            'claude' {
                $args = @('-p', $Prompt, '--model', $SelectedModel, '--output-format', 'text')
                if (-not $NoYolo) { $args += '--dangerously-skip-permissions' }
                & claude @args 2>&1 | Out-String
            }
            'opencode' {
                $args = @('run', '--model', $SelectedModel, $Prompt, '--log-level', 'error')
                if (-not $NoYolo) { $args += '--auto' }
                & opencode @args 2>&1 | Out-String
            }
            'commandcode' {
                $args = @('-p', $Prompt, '-m', $SelectedModel, '--output-format', 'text')
                if (-not $NoYolo) { $args += '--permission-mode'; $args += 'yolo' }
                & commandcode @args 2>&1 | Out-String
            }
        }
        $code = $LASTEXITCODE
        return [pscustomobject]@{ ExitCode = $code; Output = $result }
    } finally {
        Set-Location $old
    }
}

foreach ($selected in $Model) {
    for ($attempt = 1; $attempt -le [Math]::Max(1, $MaxAttempts); $attempt++) {
        $result = Invoke-Agent $selected
        if ($result.ExitCode -eq 0) {
            Write-Output "[VERIFIED] agent=$Agent model=$selected attempt=$attempt"
            Write-Output $result.Output
            exit 0
        }

        Write-Error "[FAILED] agent=$Agent model=$selected attempt=$attempt exit=$($result.ExitCode)"
        Write-Error $result.Output
        if (-not (Test-TransientFailure $result.Output)) {
            break
        }
        if ($attempt -lt $MaxAttempts) {
            Start-Sleep -Seconds ([Math]::Pow(2, $attempt - 1))
        }
    }
}

Write-Error '[BLOCKED] all configured agent/model candidates failed'
exit 1
