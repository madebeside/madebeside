$ErrorActionPreference = 'Stop'
$previewDirectory = $PSScriptRoot
$previewUrl = 'http://127.0.0.1:4188/'
$previewNode = 'C:\Users\spenc\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
if (-not (Test-Path -LiteralPath $previewNode)) { $previewNode = (Get-Command node -ErrorAction Stop).Source }
$previewListening = Get-NetTCPConnection -LocalPort 4188 -State Listen -ErrorAction SilentlyContinue
if (-not $previewListening) {
  $previewProcess = Start-Process -FilePath $previewNode -ArgumentList 'serve.mjs' -WorkingDirectory $previewDirectory -WindowStyle Hidden -PassThru
  $previewProcess.Id | Set-Content -LiteralPath (Join-Path $previewDirectory '.sites-runtime\preview.pid')
}
Write-Output $previewUrl
