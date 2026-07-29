# Changelog de fixes de seguridad — Criptoremesa Backend

**Origen:** hallazgos de `npm audit` (27 vulnerabilidades) y un scan de Semgrep
(rulesets `security-audit`, `secrets`, `javascript`, `owasp-top-ten`,
`nodejsscan`).

**Cómo leer este documento:** cada sección es un commit, en el mismo orden en
que se aplicaron. Para cada uno se explica: qué se encontró, qué se cambió,
qué archivos toca, si puede romper algo en producción y cómo revertirlo si
hace falta.

**Variables de entorno nuevas que introduce este set de commits** (ver
detalle en el commit 2): `PG_DB_SSL_REJECT_UNAUTHORIZED`,
`WHATSAPP_TLS_INSECURE`, `GEONAMES_USERNAME`. Ninguna es obligatoria — si no
se configuran, el comportamiento por defecto es el más seguro (verificar
TLS, usar el valor de fallback de GeoNames).

---

## Índice

| # | Commit | Riesgo de romper algo en prod |
|---|--------|:---:|
| 1 | `chore(security): remove committed private keys and unused certs` | Ninguno |
| 2 | `chore(config): add env vars for TLS verification and API credentials` | Ninguno |
| 3 | `fix(db): verify Postgres TLS certificate by default` | ⚠️ Medio — ver nota |
| 4 | `fix(server): remove unenforced mTLS config from HTTPS bootstrap` | Ninguno |
| 5 | `fix(integrations): verify TLS by default for WhatsApp gateway` | ⚠️ Bajo — ver nota |
| 6 | `fix(server): constant-time comparison for x-api-key` | Ninguno |
| 7 | `fix(silt): prevent SQL injection and path traversal` | Bajo (revisar tests de silt) |
| 8 | `fix(veriflevels): move GeoNames credential to env var and use HTTPS` | Ninguno |
| 9 | `fix(security): use crypto.randomInt instead of Math.random` | Ninguno |
| 10 | `chore(fixtures): redact bcrypt hash from QA sample response` | Ninguno (archivo no usado en código) |
| 11 | `chore(scripts): remove hardcoded DB credentials from analysis tools` | Ninguno (scripts manuales, no runtime) |
| 12 | `chore(scripts): verify TLS by default and validate SQL identifiers in 2FA scripts` | ⚠️ Bajo — ver nota |
| 13 | `chore(deps): resolve npm audit vulnerabilities (27 -> 0)` | Bajo (ver nota transbank-sdk) |
| 14 | `chore(tooling): add Semgrep security scan script` | Ninguno |

---

## 1 — `chore(security): remove committed private keys and unused certs`

**Qué se encontró:** Semgrep detectó 4 archivos de llave privada versionados
en git (`private.key`, `src/utils/cert/criptoremesa.key`,
`src/utils/cert/key.pem`, `src/utils/cert/selfsigned.key`).

**Investigación:** se revisó con `grep` en todo el repo qué archivos de
`src/utils/cert/` realmente se usan en el código. Resultado: solo
`key.pem` y `cert.pem` los lee `src/index.js` (para levantar HTTPS en
desarrollo local). El resto (`private.key`, `criptoremesa.key/.cert`,
`selfsigned.key/.crt`, `csr.pem`) no se referencian en ningún archivo `.js`.

**Qué se modificó:**
- **Eliminados** (no se usaban): `private.key`, `src/utils/cert/criptoremesa.key`,
  `src/utils/cert/criptoremesa.cert`, `src/utils/cert/csr.pem`,
  `src/utils/cert/selfsigned.crt`, `src/utils/cert/selfsigned.key`.
- **Desenganchados de git** (siguen en disco, dejan de subirse):
  `src/utils/cert/key.pem`, `src/utils/cert/cert.pem`.
- **Modificado** `.gitignore`: se agregan patrones `*.key`, `*.pem`, `*.crt`,
  `*.cert` (con excepción de `src/utils/cert/.gitkeep`).
- **Agregados**: `scripts/generate-local-certs.sh` y
  `scripts/generate-local-certs.ps1` — generan un certificado self-signed
  local con `openssl` para que cada developer tenga el suyo.

**¿Puede romper algo?** No. Los archivos que sí usa `src/index.js`
(`key.pem`, `cert.pem`) siguen existiendo en disco, solo dejaron de estar
en git. Si alguien clona el repo desde cero, **debe correr**
`scripts/generate-local-certs.ps1` (o `.sh`) antes de levantar el server en
modo HTTPS local, porque esos archivos ya no vienen en el repo.

**Si algo falla:** error tipo `ENOENT: no such file or directory,
open 'src/utils/cert/key.pem'` al arrancar → correr el script de
generación de certs.

**Pendiente (no resuelto por este commit):** estos archivos siguen
recuperables desde commits viejos del historial de git
(`19870a1`, `9a619e1`, `4901599`, `fb22857`). Si se quiere borrarlos
también del historial, hay que coordinar un `git filter-repo` / BFG +
force-push con todo el equipo (fuera del alcance de este changelog).

---

## 2 — `chore(config): add env vars for TLS verification and API credentials`

**Qué se encontró:** los commits 3, 5 y 8 necesitan nuevas variables de
entorno para funcionar.

**Qué se modificó:** `src/utils/enviroment.js` — se agregan 3 lecturas de
`process.env`:
- `PG_DB_SSL_REJECT_UNAUTHORIZED`
- `WHATSAPP_TLS_INSECURE`
- `GEONAMES_USERNAME`

**¿Puede romper algo?** No. Solo declara las variables; ningún archivo las
consume todavía en este commit (eso pasa en los commits siguientes).

**Si algo falla:** no debería fallar nada con este commit aislado.

---

## 3 — `fix(db): verify Postgres TLS certificate by default`

**Qué se encontró:** `src/db/pg.connection.js` tenía
`rejectUnauthorized: false` fijo cuando `PG_DB_SSL=true`, es decir, la app
se conectaba a Postgres **sin validar el certificado del servidor** —
vulnerable a un ataque de intermediario (MITM).

**Qué se modificó:**
```js
// Antes
const sslConfig = env.PG_DB_SSL === "true" ? { rejectUnauthorized: false } : false;

// Ahora
const sslConfig = env.PG_DB_SSL === "true"
  ? { rejectUnauthorized: env.PG_DB_SSL_REJECT_UNAUTHORIZED !== "false" }
  : false;
```

**¿Puede romper algo? ⚠️ Sí, potencialmente.** Si el proveedor de Postgres
usa un certificado autofirmado o de una CA que Node no reconoce por
defecto, la conexión a la base de datos **puede empezar a fallar** en el
ambiente donde `PG_DB_SSL=true`.

**Cómo probarlo antes de producción:** desplegar en staging primero con
`PG_DB_SSL=true` y confirmar que la app conecta bien a la base de datos.

**Si falla:** el error típico es algo como
`self signed certificate` o `unable to verify the first certificate` en
los logs al intentar conectar a Postgres. Solución rápida (temporal,
mientras se arregla el certificado del proveedor): agregar
`PG_DB_SSL_REJECT_UNAUTHORIZED=false` al `.env` de ese ambiente — vuelve
exactamente al comportamiento de antes de este commit, pero de forma
explícita y documentada.

---

## 4 — `fix(server): remove unenforced mTLS config from HTTPS bootstrap`

**Qué se encontró:** en `src/index.js`, ambos bloques donde se levanta el
servidor HTTPS tenían `requestCert: true, rejectUnauthorized: false`.
Se confirmó (con `grep`) que **ningún archivo del proyecto** revisa
`req.client.authorized` ni nada relacionado a certificados de cliente —
es decir, esa configuración no protegía nada, solo activaba la alerta de
Semgrep.

**Qué se modificó:** se eliminaron las líneas `requestCert: true` y
`rejectUnauthorized: false` en los dos `https.createServer(...)` de
`src/index.js`.

**¿Puede romper algo?** No. Como ningún cliente real presentaba certificado
de cliente y nadie lo validaba, el comportamiento observable es idéntico.

**Si algo falla:** no debería fallar nada por este commit.

---

## 5 — `fix(integrations): verify TLS by default for WhatsApp gateway`

**Qué se encontró:** `src/utils/whatsapp.js` creaba su `https.Agent` con
`rejectUnauthorized: false` fijo — todas las peticiones salientes al
gateway de WhatsApp (`env.MESSAGE_SERVER_BASE_URL`) viajaban sin validar
el certificado del servidor destino.

**Qué se modificó:**
```js
// Antes
const agent = new https.Agent({ rejectUnauthorized: false });

// Ahora
const agent = new https.Agent({
  rejectUnauthorized: env.WHATSAPP_TLS_INSECURE !== "true"
});
```

**¿Puede romper algo? ⚠️ Bajo riesgo.** Si el gateway de WhatsApp usa un
certificado válido de una CA pública (lo normal — Let's Encrypt, DigiCert,
etc.), no debería haber ningún cambio. Si usa un certificado interno/
autofirmado, las peticiones a WhatsApp empezarían a fallar.

**Cómo probarlo:** enviar un mensaje/código de verificación por WhatsApp
en staging y confirmar que llega.

**Si falla:** error de certificado al llamar a la API de WhatsApp en los
logs → agregar `WHATSAPP_TLS_INSECURE=true` al `.env` como solución
temporal, o revisar el certificado del gateway.

---

## 6 — `fix(server): constant-time comparison for x-api-key`

**Qué se encontró (por revisión manual, no estaba en el reporte de
Semgrep):** el middleware de `src/app/server.js` que protege casi todos
los endpoints comparaba el header `x-api-key` así: `key !== API_KEY`. Esa
comparación es carácter por carácter y se detiene en la primera
diferencia — en teoría explotable con un ataque de timing para adivinar
la key de a poco.

**Qué se modificó:** se agregó una función `isValidApiKey()` que usa
`crypto.timingSafeEqual` (con una validación de longitud previa, porque
esa función lanza error si los buffers tienen tamaños distintos).

**¿Puede romper algo?** No. Cualquier request que mande la key correcta
sigue autenticándose igual; solo cambia *cómo* se compara internamente.

**Si algo falla:** si por error se manda un `x-api-key` vacío o `undefined`,
sigue devolviendo `401` igual que antes (se probó explícitamente con un
smoke test).

---

## 7 — `fix(silt): prevent SQL injection and path traversal`

Este es el commit más grande y el de mayor severidad real. Dos problemas
distintos, mismo archivo: `src/modules/silt/silt.controller.js`.

### 7a. SQL injection en `getSiltRecords`

**Qué se encontró:** los query params `silt_id` y `flow_name` se pegaban
directo dentro de dos consultas SQL (`UNION ALL`) con template strings,
p. ej. `` AND flow_name = '${flowFilter}' ``. Un request como
`?flow_name=' OR '1'='1` podía alterar la consulta.

**Qué se modificó:** se reescribieron ambas queries (conteo y datos
paginados) para usar placeholders parametrizados (`$1`, `$2`, ...)
armados dinámicamente según qué filtros vengan presentes, en vez de
interpolación de strings.

### 7b. Path traversal en `getSiltImage` / `getSiltById`

**Qué se encontró:** `silt_id`, `flow_name` y `filename` (todos vienen del
cliente, por `req.params`/`req.query`) se combinaban con `path.join` y se
pasaban directo a `fs.readdirSync` / `res.sendFile`, sin validar. Un
`filename` con `../../../../etc/passwd` permitía leer cualquier archivo
del servidor.

**Qué se modificó:** se agregaron dos funciones de validación:
- `isSafePathSegment(segment)`: solo permite letras, números, `_ . -`, y
  rechaza cualquier cosa con `..`.
- `resolveWithinBase(baseDir, ...segments)`: resuelve la ruta final
  absoluta y la rechaza si queda **fuera** de la carpeta base esperada.

Ambas se aplican antes de cualquier acceso a filesystem en `getSiltImage`
y `getSiltById`.

**¿Puede romper algo?** Bajo riesgo — para requests legítimos (silt_id,
flow_name y nombres de archivo "normales", sin caracteres raros), el
comportamiento es idéntico. Solo bloquea payloads maliciosos.

**Cómo probarlo:** correr los flujos normales de consulta/descarga de
imágenes SILT (el visor de KYC, si lo usan desde un panel admin) y
confirmar que las imágenes se siguen viendo igual.

**Si algo falla:** si algún `silt_id` o `flow_name` real en la base de
datos tuviera caracteres fuera de `[a-zA-Z0-9_.-]` (poco probable, pero
posible si algún flujo externo generó IDs raros), esos registros
puntuales dejarían de mostrar sus imágenes (devolverían 400/404 en vez
del archivo). Si eso pasa, avisar para ampliar el patrón permitido en
`SAFE_SEGMENT`.

---

## 8 — `fix(veriflevels): move GeoNames credential to env var and use HTTPS`

**Qué se encontró:** en `veriflevels.http.repository.js`, el `username` de
la API de GeoNames (funciona como credencial) estaba hardcodeado
(`'thonygrz'`), y la petición se hacía por `http://` sin cifrar.

**Qué se modificó:**
```js
// Antes
const username = 'thonygrz';
const url = `http://api.geonames.org/countryInfoJSON?username=${username}`;

// Ahora
const username = env.GEONAMES_USERNAME || "thonygrz";
const url = `https://api.geonames.org/countryInfoJSON?username=${username}`;
```

**¿Puede romper algo?** No. GeoNames soporta HTTPS en la misma ruta, y si
no se configura `GEONAMES_USERNAME` en el `.env`, usa el mismo valor de
antes como fallback.

**Recomendado (no obligatorio):** agregar `GEONAMES_USERNAME=thonygrz` al
`.env` para sacar el valor por completo del código fuente.

---

## 9 — `fix(security): use crypto.randomInt instead of Math.random`

**Qué se encontró:** una función `between(min, max)` duplicada en 4
archivos (`chat-socket.service.js`, `exchanges.service.js`,
`remittances.service.js`, `users.service.js`) usaba `Math.random()` para
generar un número de 5 dígitos usado como sufijo de nombre de archivo (no
para tokens/OTP de seguridad — se confirmó revisando cada uso).

**Qué se modificó:** se reemplazó la implementación por
`crypto.randomInt(min, max + 1)` en los 4 archivos, manteniendo el mismo
rango inclusive de antes.

**¿Puede romper algo?** No. Mismo comportamiento observable (un número
entre `min` y `max`, ambos inclusive), solo cambia la fuente de
aleatoriedad.

---

## 10 — `chore(fixtures): redact bcrypt hash from QA sample response`

**Qué se encontró:** `src/db/qa_response_login.json` (confirmado que no lo
usa ningún archivo de código — es solo un ejemplo guardado) tenía un hash
bcrypt real de una cuenta de QA.

**Qué se modificó:** se reemplazó el valor del campo `password` por
`"[REDACTED-BCRYPT-HASH]"`.

**¿Puede romper algo?** No. El archivo no se usa en ningún flujo de la
aplicación.

---

## 11 — `chore(scripts): remove hardcoded DB credentials from analysis tools`

**Qué se encontró (por revisión manual, mientras se investigaba el hallazgo
de SQLi de Semgrep en estos archivos):** `scripts/analyze-database-commonjs.js`,
`scripts/comprehensive-database-analyzer.js` y `scripts/database-query-tool.js`
tenían las **credenciales reales de la base de datos** hardcodeadas y
duplicadas: usuario `postgres`, password `XTesta/819021!`, e IP del
servidor.

**Qué se modificó:**
- Las credenciales se movieron a variables de entorno (via `dotenv`,
  mismo patrón que el resto de la app).
- Se agregó `isSafeIdentifier()` para validar `schemaName`/`tableName`
  antes de interpolarlos en la query de `COUNT(*)` (vienen de
  `information_schema`, no de input externo, pero se valida como defensa
  extra).

**¿Puede romper algo?** No para el runtime de la API (son scripts que se
corren a mano, no forman parte del servidor). **Sí requieren** que quien
los corra tenga configuradas las variables `PG_DB_SM_USER`,
`PG_DB_SM_HOST`, `PG_DB_SM_PASSWORD`, etc. en su `.env` local para seguir
funcionando.

**⚠️ Acción pendiente importante:** la contraseña `XTesta/819021!` estuvo
en texto plano en 3 archivos y quedó en el historial de git. Sacarla del
código **no la invalida** — hay que **rotarla en el servidor de base de
datos** cuanto antes.

---

## 12 — `chore(scripts): verify TLS by default and validate SQL identifiers in 2FA scripts`

**Qué se encontró:** `scripts/disable-2fa.cjs` y
`sql-migrations/run-2fa-migration.js` (scripts de administración/
migración, no parte del servidor en producción) tenían el mismo
`rejectUnauthorized: false` fijo que se arregló en el commit 3, para sus
propias conexiones directas a Postgres. `disable-2fa.cjs` también
interpolaba un nombre de schema (de `pg_tables`) directo en un `UPDATE`.

**Qué se modificó:** mismo fix de TLS que el commit 3 (verificar por
defecto, override vía `PG_DB_SSL_REJECT_UNAUTHORIZED=false`), y la misma
validación de identificador seguro del commit 11.

**¿Puede romper algo? ⚠️ Bajo riesgo.** Solo afecta a quien corra estos
scripts manualmente. Si el certificado de Postgres es válido (lo normal),
no cambia nada.

---

## 13 — `chore(deps): resolve npm audit vulnerabilities (27 -> 0)`

**Qué se encontró:** `npm audit` reportaba 27 vulnerabilidades (23
moderadas, 4 altas).

**Qué se modificó** (`package.json` / `package-lock.json`):
- **Eliminadas** (sin ninguna referencia en `src/`): `@sentry/node`,
  `@sentry/profiling-node`, `nodemailer`, `google-spreadsheet`.
- **Actualizado** `axios` a `^1.18.1` (ya resolvía a esa versión, se fijó
  explícitamente).
- **Actualizado** `transbank-sdk` de `^4.0.0` a `^6.1.1` — se verificó que
  la API usada (`WebpayPlus`, `Options`, `IntegrationApiKeys`,
  `Environment`, `IntegrationCommerceCodes`) es idéntica en ambas
  versiones (smoke test de imports + instanciación incluido).
- **Agregado** `"overrides": { "uuid": "^11.1.1" }` para parchear la
  dependencia transitiva de `bull` y `node-cron` sin bajarles la versión.

**¿Puede romper algo? Bajo riesgo**, ya validado: se hizo `npm install`
limpio y `npm audit` reportó 0 vulnerabilidades. El único cambio de API
real es `transbank-sdk`, ya verificado compatible con el uso actual del
proyecto (`transbank.service.js`, `tumipay.service.js`).

**Si algo falla:** si algún flujo de pago con Webpay/Transbank se
comporta distinto, revisar el
[CHANGELOG oficial de transbank-sdk](https://www.npmjs.com/package/transbank-sdk)
entre v4 y v6 — el cambio más relevante ahí es que v6 eliminó el
constructor sin argumentos de `WebpayPlus.Transaction()`, pero este
proyecto siempre pasa `Options` explícito, así que no debería aplicar.

---

## 14 — `chore(tooling): add Semgrep security scan script`

**Qué se agregó:** `scripts/semgrep-scan.sh` y `scripts/semgrep-scan.ps1`
— instalan Semgrep (via `pip`) si no está presente, corren los rulesets
públicos `security-audit`, `secrets`, `javascript`, `owasp-top-ten` y
`nodejsscan` contra el proyecto, y guardan el resultado en
`semgrep-results.json` en la raíz.

**¿Puede romper algo?** No. Es una herramienta de análisis, no toca código
de la aplicación. Se recomienda correrla periódicamente (o integrarla a
futuro en CI) para detectar regresiones.

---

## Resumen de tareas pendientes (no resueltas por estos commits)

1. **Rotar la contraseña `XTesta/819021!`** en el servidor de Postgres —
   estuvo hardcodeada en 3 scripts (commit 11) y sigue en el historial de
   git.
2. **Probar en staging antes de producción** los commits **3** (TLS de
   Postgres) y **5** (TLS del gateway de WhatsApp) — son los dos con
   chance real de romper una conexión si algún certificado no está
   firmado por una CA pública estándar.
3. **Decidir si se limpia el historial de git** de las llaves privadas
   viejas (commit 1) — siguen recuperables desde commits anteriores a
   menos que se haga un `git filter-repo`/BFG + force-push coordinado con
   todo el equipo.
4. **Configurar en `.env`** (opcional, tienen fallback seguro):
   `GEONAMES_USERNAME`. Y solo si hace falta un override temporal:
   `PG_DB_SSL_REJECT_UNAUTHORIZED=false` o `WHATSAPP_TLS_INSECURE=true`.

## Cómo verificar que todo quedó bien

```bash
npm install
npm audit                 # debería dar 0 vulnerabilities
npm run security:semgrep  # vuelve a correr el scan completo
```
