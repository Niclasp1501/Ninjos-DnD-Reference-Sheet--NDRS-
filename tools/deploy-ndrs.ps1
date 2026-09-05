# NDRS - Deploy module to Foundry server via scp (SSH-key auth)
#
# Uploads only the runtime module files to the server. No password handling at all -
# authentication uses the SSH key set up by deploy-setup.ps1.
#
# Usage:
#   .\tools\deploy-ndrs.ps1
#   .\tools\deploy-ndrs.ps1 -DryRun     # show what would be uploaded, do nothing

[CmdletBinding()]
param(
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"

function Write-Step($msg) { Write-Host "`n==> $msg" -ForegroundColor Cyan }
function Write-OK($msg)   { Write-Host "    OK: $msg" -ForegroundColor Green }
function Write-Info($msg) { Write-Host "    $msg" -ForegroundColor White }

# --- 1. Load config ---
$configPath = Join-Path $PSScriptRoot "deploy-config.json"
if (-not (Test-Path $configPath)) {
    throw "Missing $configPath. Run .\tools\deploy-setup.ps1 first."
}
$cfg = Get-Content $configPath -Raw | ConvertFrom-Json

$HostAlias         = $cfg.HostAlias
$RemoteModulesPath = $cfg.RemoteModulesPath
$ModuleId          = "ndrs"
$RemoteTarget      = "$RemoteModulesPath/$ModuleId"
$ProjectRoot       = Split-Path -Parent $PSScriptRoot

Write-Step "Deploy NDRS to ${HostAlias}:$RemoteTarget"
Write-Info "Project root: $ProjectRoot"

# --- 2. Allowlist and denylist ---
# Explicit allowlist: only runtime module files reach the server.
$uploadItems = @(
    "module.json",
    "README.md",
    "CHANGELOG.md",
    "LICENSE",
    "scripts",
    "styles",
    "templates",
    "lang",
    "assets"
)

# Hard denylist for safety.
$denylistPatterns = @(
    ".claude", "tools", "AGENTS.md", "DEVELOPER_GUIDE.md",
    "CONTENT-INVENTORY.md", "TODO.md", "deploy-config.json",
    "node_modules", ".git", ".vscode", "*.log"
)

function Should-Skip($name) {
    foreach ($p in $denylistPatterns) {
        if ($name -like $p) { return $true }
    }
    return $false
}

$resolved = @()
foreach ($item in $uploadItems) {
    if (Should-Skip $item) { continue }
    $full = Join-Path $ProjectRoot $item
    if (-not (Test-Path $full)) {
        Write-Info "Skip (missing): $item"
        continue
    }
    $resolved += $full
}

if ($resolved.Count -eq 0) {
    throw "Nothing to upload - allowlist resolved to zero items."
}

Write-OK "$($resolved.Count) item(s) ready to upload."

# --- 3. Ensure remote module folder exists ---
Write-Step "Ensuring remote folder exists"

if ($DryRun) {
    Write-Info "[DryRun] Would ensure: $RemoteTarget"
} else {
    & ssh $HostAlias "mkdir -p '$RemoteTarget'"
    if ($LASTEXITCODE -ne 0) { throw "Failed to create remote folder $RemoteTarget" }
    Write-OK "Remote folder ready: $RemoteTarget"
}

# --- 4. Upload via scp ---
Write-Step "Uploading"

$uploaded = 0
foreach ($localItem in $resolved) {
    $leafName = Split-Path -Leaf $localItem

    if ($DryRun) {
        Write-Info "[DryRun] scp -r `"$localItem`" ${HostAlias}:$RemoteTarget/"
        $uploaded++
        continue
    }

    try {
        # -r works for both files and directories; -p preserves timestamps.
        & scp -r -p -q $localItem "${HostAlias}:$RemoteTarget/"
        if ($LASTEXITCODE -ne 0) { throw "scp returned exit code $LASTEXITCODE" }
        Write-OK "Uploaded: $leafName"
        $uploaded++
    } catch {
        Write-Host "    FAILED uploading $leafName : $_" -ForegroundColor Red
        throw
    }
}

# --- 5. Summary ---
Write-Step "Summary"
Write-OK "$uploaded item(s) uploaded."
Write-Info "Remote target: ${HostAlias}:$RemoteTarget"

if ($DryRun) {
    Write-Host "`n==> DryRun complete. Nothing was uploaded." -ForegroundColor Yellow
} else {
    Write-Host "`n==> Done. Reload the world in Foundry to pick up changes." -ForegroundColor Green
}
