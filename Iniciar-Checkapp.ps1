param([switch]$SemAbrirNavegador)
$ErrorActionPreference = 'Stop'
$projectRoot = $PSScriptRoot
Set-Location -LiteralPath $projectRoot
$runtimeRoot = Join-Path $projectRoot '.tools'
if (-not (Test-Path -LiteralPath (Join-Path $projectRoot '.env'))) { throw 'Configure o arquivo .env antes de iniciar.' }
function Test-LocalPort([int]$Port) {
  $client = [System.Net.Sockets.TcpClient]::new()
  try { return $client.ConnectAsync('127.0.0.1', $Port).Wait(600) -and $client.Connected } catch { return $false } finally { $client.Dispose() }
}
$nodeCommand = Get-Command node -ErrorAction SilentlyContinue
if ($nodeCommand) { $nodeExe=$nodeCommand.Source } else { $nodeExe=(Get-Content -LiteralPath (Join-Path $runtimeRoot 'node-path.txt') -Raw).Trim() }
if (-not (Test-Path -LiteralPath $nodeExe)) { throw 'Node.js ausente. Instale Node.js 24.' }
$npmCli = Join-Path $runtimeRoot 'package\bin\npm-cli.js'
if (-not (Test-Path -LiteralPath $npmCli)) { throw 'npm local ausente. Instale Node.js com npm para preparar as dependências.' }
$env:PATH = $runtimeRoot + ';' + (Split-Path $nodeExe) + ';' + $env:PATH
if (-not (Test-LocalPort 5432)) {
  $pgBin = (Get-Content -LiteralPath (Join-Path $runtimeRoot 'postgres-bin.txt') -Raw).Trim()
  $pgData = Join-Path $runtimeRoot 'pgdata'
  Start-Process -FilePath (Join-Path $pgBin 'postgres.exe') -ArgumentList @('-D', ('"'+$pgData+'"')) -WindowStyle Hidden -RedirectStandardOutput (Join-Path $runtimeRoot 'postgres.log') -RedirectStandardError (Join-Path $runtimeRoot 'postgres-error.log') | Out-Null
  for ($i=0; $i -lt 40 -and -not (Test-LocalPort 5432); $i++) { Start-Sleep -Milliseconds 250 }
  if (-not (Test-LocalPort 5432)) { throw 'PostgreSQL não iniciou. Consulte .tools/postgres-error.log.' }
}
if (-not (Test-LocalPort 3000)) {
  & $nodeExe $npmCli run db:generate
  if ($LASTEXITCODE -ne 0) { throw 'Falha ao gerar Prisma Client.' }
  & $nodeExe $npmCli run db:migrate
  if ($LASTEXITCODE -ne 0) { throw 'Falha ao aplicar migrations.' }
  & $nodeExe $npmCli run build -w apps/api
  if ($LASTEXITCODE -ne 0) { throw 'Falha ao compilar API.' }
  Start-Process -FilePath $nodeExe -ArgumentList @('dist/main.js') -WorkingDirectory (Join-Path $projectRoot 'apps\api') -WindowStyle Hidden -RedirectStandardOutput (Join-Path $runtimeRoot 'api.log') -RedirectStandardError (Join-Path $runtimeRoot 'api-error.log') | Out-Null
}
if (-not (Test-LocalPort 5173)) {
  $vite = Join-Path $projectRoot 'node_modules\vite\bin\vite.js'
  Start-Process -FilePath $nodeExe -ArgumentList @(('"'+$vite+'"'),'--host','127.0.0.1','--port','5173','--strictPort') -WorkingDirectory (Join-Path $projectRoot 'apps\web') -WindowStyle Hidden -RedirectStandardOutput (Join-Path $runtimeRoot 'web-server.log') -RedirectStandardError (Join-Path $runtimeRoot 'web-server-error.log') | Out-Null
}
$ready = $false
for ($i=0; $i -lt 40; $i++) {
  try { $api = Invoke-WebRequest -UseBasicParsing 'http://127.0.0.1:5173/api/auth/health' -TimeoutSec 2; if ($api.StatusCode -eq 200) { $ready=$true; break } } catch { Start-Sleep -Milliseconds 250 }
}
if (-not $ready) { throw 'API indisponível. Consulte .tools/api-error.log e .tools/web-server-error.log.' }
Write-Host 'Checkapp disponível em http://127.0.0.1:5173/novo'
if (-not $SemAbrirNavegador) { Start-Process 'http://127.0.0.1:5173/novo' -WindowStyle Hidden }

