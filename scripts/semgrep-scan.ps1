<#
  semgrep-scan.ps1
  Corre Semgrep sobre el proyecto con rulesets de seguridad publicos
  y guarda el resultado en JSON dentro del repo (semgrep-results.json).

  Uso:
    powershell -ExecutionPolicy Bypass -File .\scripts\semgrep-scan.ps1
#>

$ErrorActionPreference = "Stop"

# Carpeta raiz del proyecto (un nivel arriba de /scripts)
$ProjectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $ProjectRoot

$OutputFile = Join-Path $ProjectRoot "semgrep-results.json"

# 1. Verificar / instalar semgrep
$semgrepInstalled = Get-Command semgrep -ErrorAction SilentlyContinue
if (-not $semgrepInstalled) {
    Write-Host "Semgrep no encontrado. Instalando via pip..." -ForegroundColor Yellow
    python -m pip install --upgrade semgrep
    if ($LASTEXITCODE -ne 0) {
        Write-Error "No se pudo instalar semgrep. Instala Python 3 y vuelve a intentar."
        exit 1
    }
}

Write-Host "Version de semgrep:" -ForegroundColor Cyan
semgrep --version

# 2. Rulesets aplicados (paquetes publicos del registro de Semgrep)
#    - security-audit: vulnerabilidades generales (injection, path traversal, etc.)
#    - secrets:         credenciales/keys hardcodeadas
#    - javascript:      bugs y anti-patrones generales de JS
#    - owasp-top-ten:   cobertura del OWASP Top 10
#    - nodejsscan:      reglas especificas de Node.js/Express
$rulesets = @(
    "p/security-audit",
    "p/secrets",
    "p/javascript",
    "p/owasp-top-ten",
    "p/nodejsscan"
)

$configArgs = @()
foreach ($r in $rulesets) {
    $configArgs += "--config"
    $configArgs += $r
}

# 3. Correr el scan excluyendo carpetas irrelevantes / pesadas
Write-Host "`nEjecutando Semgrep sobre $ProjectRoot ..." -ForegroundColor Cyan

semgrep scan `
    @configArgs `
    --exclude "node_modules" `
    --exclude ".git" `
    --exclude "dist" `
    --exclude "scripts/*.txt" `
    --exclude "*.min.js" `
    --json `
    --output $OutputFile `
    .

# 4. Resumen rapido en consola
if (Test-Path $OutputFile) {
    Write-Host "`nResultado guardado en: $OutputFile" -ForegroundColor Green

    $json = Get-Content $OutputFile -Raw | ConvertFrom-Json
    $total = $json.results.Count
    $bySeverity = $json.results | Group-Object { $_.extra.severity } | Select-Object Name, Count

    Write-Host "`nTotal de hallazgos: $total"
    $bySeverity | ForEach-Object { Write-Host " - $($_.Name): $($_.Count)" }

    if ($json.errors.Count -gt 0) {
        Write-Host "`nSemgrep reporto $($json.errors.Count) error(es) durante el scan:" -ForegroundColor Yellow
        $json.errors | ForEach-Object { Write-Host " - $($_.message)" }
    }
} else {
    Write-Error "No se genero el archivo de resultados."
    exit 1
}
