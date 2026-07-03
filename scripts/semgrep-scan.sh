#!/usr/bin/env bash
# semgrep-scan.sh
# Corre Semgrep sobre el proyecto con rulesets de seguridad publicos
# y guarda el resultado en JSON dentro del repo (semgrep-results.json).
#
# Uso:
#   bash scripts/semgrep-scan.sh

set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

OUTPUT_FILE="$PROJECT_ROOT/semgrep-results.json"

# 1. Verificar / instalar semgrep
if ! command -v semgrep >/dev/null 2>&1; then
  echo "Semgrep no encontrado. Instalando via pip..."
  python3 -m pip install --upgrade semgrep
fi

echo "Version de semgrep:"
semgrep --version

# 2. Rulesets aplicados (paquetes publicos del registro de Semgrep)
RULESETS=(
  "p/security-audit"
  "p/secrets"
  "p/javascript"
  "p/owasp-top-ten"
  "p/nodejsscan"
)

CONFIG_ARGS=()
for r in "${RULESETS[@]}"; do
  CONFIG_ARGS+=("--config" "$r")
done

# 3. Correr el scan excluyendo carpetas irrelevantes / pesadas
echo ""
echo "Ejecutando Semgrep sobre $PROJECT_ROOT ..."

semgrep scan \
  "${CONFIG_ARGS[@]}" \
  --exclude "node_modules" \
  --exclude ".git" \
  --exclude "dist" \
  --exclude "*.min.js" \
  --json \
  --output "$OUTPUT_FILE" \
  .

# 4. Resumen rapido en consola
if [ -f "$OUTPUT_FILE" ]; then
  echo ""
  echo "Resultado guardado en: $OUTPUT_FILE"

  TOTAL=$(python3 -c "import json;print(len(json.load(open('$OUTPUT_FILE'))['results']))")
  echo "Total de hallazgos: $TOTAL"

  python3 -c "
import json
from collections import Counter
d = json.load(open('$OUTPUT_FILE'))
c = Counter(r['extra']['severity'] for r in d['results'])
for sev, n in c.items():
    print(f' - {sev}: {n}')
if d['errors']:
    print()
    print(f\"Semgrep reporto {len(d['errors'])} error(es) durante el scan:\")
    for e in d['errors']:
        print(f\" - {e['message']}\")
"
else
  echo "No se genero el archivo de resultados." >&2
  exit 1
fi
