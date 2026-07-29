# generate-local-certs.ps1
# Genera un certificado self-signed para desarrollo local (src/utils/cert/).
# Estos archivos NUNCA deben commitearse (ver .gitignore).
$ErrorActionPreference = "Stop"
$Dir = Join-Path (Split-Path -Parent $PSScriptRoot) "src\utils\cert"
New-Item -ItemType Directory -Force -Path $Dir | Out-Null

& openssl req -nodes -new -x509 `
    -keyout "$Dir\key.pem" `
    -out "$Dir\cert.pem" `
    -days 365 `
    -subj "/C=CL/ST=RM/L=Santiago/O=Dev/CN=localhost"

Write-Host "Certificado generado en $Dir (key.pem, cert.pem)"
