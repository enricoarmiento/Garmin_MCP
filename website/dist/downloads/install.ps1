# Garmin MCP installer for Windows PowerShell. No administrator privileges required.
param([Parameter(Mandatory=$true)][ValidateSet('claude','codex')][string]$Client)
$ErrorActionPreference = 'Stop'
$BaseUrl = 'https://garmin-mcp-connect.enricoarmiento.chatgpt.site'
$Wheel = 'garmin_readonly_mcp-0.1.0-py3-none-any.whl'
$ExpectedHash = '6afcc9a4e5ad4e062e5567d504420d57db71cecefd7707a8a1b7f7ba3243effd'
Write-Host "Garmin MCP — installazione locale per $Client"
Write-Host 'Il login avviene con Garmin. Le credenziali non vengono inviate al sito.'
$UvCommand = Get-Command uv -ErrorAction SilentlyContinue
if ($UvCommand) { $UvExe = $UvCommand.Source }
else {
    $UvExe = Join-Path $env:USERPROFILE '.local\bin\uv.exe'
    if (-not (Test-Path $UvExe)) {
        Write-Host 'Installazione di uv dal sito ufficiale Astral…'
        Invoke-Expression (Invoke-RestMethod 'https://astral.sh/uv/install.ps1')
    }
}
if (-not (Test-Path $UvExe)) { throw 'uv non trovato. Installa uv da https://docs.astral.sh/uv/ e riprova.' }
$TaskTemp = Join-Path ([IO.Path]::GetTempPath()) ([Guid]::NewGuid().ToString())
New-Item -ItemType Directory -Path $TaskTemp | Out-Null
try {
    $WheelPath = Join-Path $TaskTemp $Wheel
    Invoke-WebRequest "$BaseUrl/downloads/$Wheel" -OutFile $WheelPath -UseBasicParsing
    if ((Get-FileHash $WheelPath -Algorithm SHA256).Hash.ToLowerInvariant() -ne $ExpectedHash) { throw 'Verifica pacchetto fallita. Nessuna installazione eseguita.' }
    & $UvExe tool install --force --python 3.12 $WheelPath
    if ($LASTEXITCODE -ne 0) { throw 'Installazione del server fallita.' }
    $ToolBin = & $UvExe tool dir --bin
    if ($LASTEXITCODE -ne 0) { throw 'Cartella dei comandi uv non disponibile.' }
    $GarminExe = Join-Path ($ToolBin.Trim()) 'garmin-mcp.exe'
    & $GarminExe login
    if ($LASTEXITCODE -ne 0) { throw 'Login non completato. Riprova dopo aver verificato credenziali e MFA.' }
    & $GarminExe connect $Client
    if ($LASTEXITCODE -ne 0) { throw 'Configurazione del client fallita.' }
    Write-Host 'Configurazione completata. Riavvia il client e chiedi di usare Garmin.'
} finally {
    Remove-Item -LiteralPath $TaskTemp -Recurse -Force
}
