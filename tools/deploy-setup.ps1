# NDRS — One-time deploy setup (SSH-key-based, no installs)
#
# Runs once on your Windows machine to set up passwordless SFTP/SCP to your Foundry server.
# Uses ONLY Windows built-in OpenSSH client (ssh-keygen, ssh, scp) — no PowerShell modules,
# no third-party tools.
#
# Steps:
#   1. Verify OpenSSH client is available (built-in on Windows 10/11; otherwise enable feature).
#   2. Generate an Ed25519 SSH keypair dedicated to NDRS deploys.
#   3. Push the public key to the server's ~/.ssh/authorized_keys (one-time password prompt).
#   4. Add an SSH config alias 'foundry-server' so subsequent scp calls don't need -i flags.
#   5. Test that scp now works without prompting for a password.
#   6. Write tools/deploy-config.json with host/user/path (no secrets).
#
# Re-running this script is safe: it skips steps that are already done.
#
# Usage (in PowerShell):
#   .\tools\deploy-setup.ps1

[CmdletBinding()]
param(
    [string]$Server = "192.168.178.176",
    [int]$Port = 22,
    [string]$User = "foundry",
    [string]$RemoteModulesPath = "/home/foundry/foundryuserdata/Data/modules",
    [string]$KeyName = "id_ndrs",
    [string]$HostAlias = "foundry-server"
)

$ErrorActionPreference = "Stop"

function Write-Step($msg) { Write-Host "`n==> $msg" -ForegroundColor Cyan }
function Write-OK($msg)   { Write-Host "    OK: $msg" -ForegroundColor Green }
function Write-Warn2($msg){ Write-Host "    WARN: $msg" -ForegroundColor Yellow }
function Write-Info($msg) { Write-Host "    $msg" -ForegroundColor White }

# ─── 1. Verify OpenSSH client ────────────────────────────────────────
Write-Step "Checking OpenSSH client (ssh, ssh-keygen, scp)"

foreach ($exe in @("ssh", "ssh-keygen", "scp")) {
    $found = Get-Command $exe -ErrorAction SilentlyContinue
    if (-not $found) {
        Write-Host "    MISSING: $exe.exe is not on PATH." -ForegroundColor Red
        Write-Host "    Enable it via: Settings -> Apps -> Optional features -> OpenSSH Client" -ForegroundColor Red
        Write-Host "    Or in PowerShell (admin): Add-WindowsCapability -Online -Name OpenSSH.Client~~~~0.0.1.0" -ForegroundColor Red
        exit 1
    }
    Write-OK "$exe -> $($found.Source)"
}

# ─── 2. Generate keypair ─────────────────────────────────────────────
Write-Step "Generating Ed25519 keypair (if missing)"

$sshDir  = Join-Path $env:USERPROFILE ".ssh"
$keyPath = Join-Path $sshDir $KeyName
$pubPath = "$keyPath.pub"

if (-not (Test-Path $sshDir)) {
    New-Item -ItemType Directory -Path $sshDir -Force | Out-Null
    Write-OK "Created $sshDir"
}

if (Test-Path $keyPath) {
    Write-OK "Key already exists: $keyPath (reusing it)"
} else {
    & ssh-keygen -t ed25519 -f $keyPath -N '""' -C "ndrs-deploy" | Out-Null
    if (-not (Test-Path $keyPath)) { throw "Key generation failed." }
    Write-OK "Generated $keyPath"
}

# ─── 3. Push public key to server ────────────────────────────────────
Write-Step "Authorizing key on $User@$Server (one-time password prompt)"

# Check if the key is already in authorized_keys to avoid duplicates
$pubKey = (Get-Content $pubPath -Raw).Trim()
$checkCmd = "grep -qxF '$pubKey' ~/.ssh/authorized_keys 2>/dev/null && echo present || echo missing"

Write-Info "Checking if key is already authorized..."
$present = $false
try {
    $result = & ssh -o StrictHostKeyChecking=accept-new -p $Port "$User@$Server" $checkCmd 2>$null
    if ($result -match "present") {
        $present = $true
        Write-OK "Public key is already in authorized_keys."
    }
} catch {
    # First connection or no key yet — fall through to install
}

if (-not $present) {
    Write-Info "Pushing public key (you will be asked for the SFTP password ONCE)..."
    $installCmd = "mkdir -p ~/.ssh && chmod 700 ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys"
    Get-Content $pubPath | & ssh -o StrictHostKeyChecking=accept-new -p $Port "$User@$Server" $installCmd
    if ($LASTEXITCODE -ne 0) { throw "Failed to install public key on server." }
    Write-OK "Public key installed."
}

# ─── 4. Add SSH config alias ─────────────────────────────────────────
Write-Step "Setting up SSH config alias '$HostAlias'"

$sshConfig = Join-Path $sshDir "config"
$blockMarker = "# === NDRS deploy alias ==="
$keyPathPosix = $keyPath -replace '\\', '/'

$aliasBlock = @"
$blockMarker
Host $HostAlias
    HostName $Server
    Port $Port
    User $User
    IdentityFile $keyPathPosix
    IdentitiesOnly yes
# === end NDRS deploy alias ===
"@

if (-not (Test-Path $sshConfig)) {
    Set-Content -Path $sshConfig -Value $aliasBlock -Encoding utf8
    Write-OK "Created $sshConfig with alias '$HostAlias'."
} else {
    $existing = Get-Content $sshConfig -Raw
    if ($existing -match [regex]::Escape($blockMarker)) {
        Write-OK "Alias '$HostAlias' already present in $sshConfig (left as-is)."
    } else {
        Add-Content -Path $sshConfig -Value "`n$aliasBlock" -Encoding utf8
        Write-OK "Appended alias '$HostAlias' to $sshConfig."
    }
}

# ─── 5. Test passwordless connection ─────────────────────────────────
Write-Step "Testing passwordless SSH"

$testResult = & ssh -o BatchMode=yes -o ConnectTimeout=5 $HostAlias "echo connected && test -d '$RemoteModulesPath' && echo path-ok || echo path-missing"
if ($LASTEXITCODE -ne 0) {
    throw "Passwordless SSH test failed. Output: $testResult"
}

if ($testResult -match "connected") { Write-OK "Passwordless SSH works via alias '$HostAlias'." }
if ($testResult -match "path-ok")   { Write-OK "Remote modules path exists: $RemoteModulesPath" }
if ($testResult -match "path-missing") {
    Write-Warn2 "Remote modules path does NOT exist: $RemoteModulesPath"
    Write-Warn2 "Create it manually before deploying, or update -RemoteModulesPath."
}

# ─── 6. Write config file ────────────────────────────────────────────
Write-Step "Saving deploy config"

$configPath = Join-Path $PSScriptRoot "deploy-config.json"
@{
    HostAlias         = $HostAlias
    Server            = $Server
    Port              = $Port
    User              = $User
    RemoteModulesPath = $RemoteModulesPath
    KeyPath           = $keyPath
} | ConvertTo-Json | Set-Content -Path $configPath -Encoding utf8
Write-OK "Wrote $configPath (no secrets inside)."

Write-Host "`n==> Setup complete. Use .\tools\deploy-ndrs.ps1 for every deploy from now on." -ForegroundColor Green
