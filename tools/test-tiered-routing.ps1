$ErrorActionPreference = 'Stop'

$runner = Join-Path $PSScriptRoot 'invoke-tiered-worker.ps1'
$tokens = $null
$errors = $null
[System.Management.Automation.Language.Parser]::ParseFile($runner, [ref]$tokens, [ref]$errors) | Out-Null
if ($errors.Count -gt 0) {
    $errors | Format-List | Out-String | Write-Error
    exit 1
}

$board = & $runner -Prompt 'offline validation' -TaskProfile implementation -DryRun 2>&1 | Out-String
$required = @(
    'commandcode',
    'deepseek/deepseek-v4-flash',
    'agy',
    '9router/free',
    'poolside/laguna-s-2.1-free',
    'inclusionai/ling-3.1-flash:free',
    'stealth/space-bunny-alpha'
)
foreach ($value in $required) {
    if ($board -notmatch [regex]::Escape($value)) {
        Write-Error "Missing expected routing candidate: $value"
        exit 1
    }
}

$architecture = & $runner -Prompt 'offline validation' -TaskProfile architecture -DryRun 2>&1 | Out-String
if ($architecture -notmatch 'deepseek/deepseek-v4-pro' -or $architecture -notmatch 'gemini-3.1-pro-high') {
    Write-Error 'Architecture profile did not resolve to the expected Tier 1 models'
    exit 1
}

$tierTwo = & $runner -Prompt 'offline validation' -StartTier 2 -DryRun 2>&1 | Out-String
if ($tierTwo -match '(?m)\s1\s+(commandcode|agy)') {
    Write-Error 'StartTier 2 unexpectedly included a Tier 1 candidate'
    exit 1
}
if ($tierTwo -notmatch '9router/free') {
    Write-Error 'StartTier 2 did not include the Navin gateway candidate'
    exit 1
}

$blockedCmdc = & $runner -Prompt 'offline validation' -TaskProfile implementation -DryRun -CommandCodeUsageState blocked -AntigravityUsageState available 2>&1 | Out-String
if ($blockedCmdc -match 'deepseek/deepseek-v4-flash' -or $blockedCmdc -notmatch 'gemini-3.8-flash-medium') {
    Write-Error 'Usage-state filtering did not skip blocked Command Code and retain available Antigravity'
    exit 1
}

$powerShellExecutable = (Get-Process -Id $PID).Path
$ErrorActionPreference = 'Continue'
$missingPreflightOutput = & $powerShellExecutable -NoProfile -File $runner -Prompt 'must fail before launch' -TaskProfile implementation -WorkingDirectory $PSScriptRoot 2>&1 | Out-String
$missingPreflightExitCode = $LASTEXITCODE
$ErrorActionPreference = 'Stop'
if ($missingPreflightExitCode -ne 3 -or $missingPreflightOutput -notmatch 'requires fresh operator-attested') {
    Write-Error 'Tier 1 execution did not fail closed when usage states were unknown'
    exit 1
}

Write-Output 'tiered routing offline checks passed'
