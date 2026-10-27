$ErrorActionPreference = 'Stop'
Push-Location $PSScriptRoot
function Invoke-Docker {
    & docker @args
    if ($LASTEXITCODE -ne 0) { throw "Docker command failed: $args" }
}
try {
    Get-Command docker -ErrorAction Stop | Out-Null
    Invoke-Docker info | Out-Null
    Invoke-Docker compose version
    if (-not (Test-Path -LiteralPath '.env')) {
        Copy-Item -LiteralPath '.env.example' -Destination '.env'
        Write-Host 'Created .env with local defaults. Edit it to set your server port and origin.'
    }
    Invoke-Docker compose config --quiet
    Invoke-Docker compose build --pull app
    try { Invoke-Docker compose up -d --no-build --wait --wait-timeout 120 app }
    catch { & docker compose logs --tail=80 app; throw }
    Invoke-Docker compose ps
    Write-Host 'Deployment is healthy. Use docker compose logs -f app to follow logs.'
} finally { Pop-Location }
