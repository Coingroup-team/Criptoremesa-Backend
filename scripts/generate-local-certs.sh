#!/usr/bin/env bash
# generate-local-certs.sh
# Genera un certificado self-signed para desarrollo local (src/utils/cert/).
# Estos archivos NUNCA deben commitearse (ver .gitignore).
set -euo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/src/utils/cert"
mkdir -p "$DIR"
openssl req -nodes -new -x509 \
  -keyout "$DIR/key.pem" \
  -out "$DIR/cert.pem" \
  -days 365 \
  -subj "/C=CL/ST=RM/L=Santiago/O=Dev/CN=localhost"
echo "Certificado generado en $DIR (key.pem, cert.pem)"
