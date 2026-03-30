# Actualización a Node.js 24 - Criptoremesa-Backend

**Fecha:** 30 de Marzo, 2026
**Estado:** ✅ Completado Exitosamente

## Resumen General

Se actualizaron las dependencias de `Criptoremesa-Backend` para garantizar compatibilidad con Node.js 24, reduciendo las vulnerabilidades de seguridad de **41 a 3**. Las 3 restantes están confinadas al axios interno de `google-spreadsheet@3.x` y `transbank-sdk@4.x`, y requieren migraciones de código para resolverse.

## Situación Inicial

| Métrica                         | Antes       | Después       |
| ------------------------------- | ----------- | ------------- |
| Versión de Node.js (declarada)  | Sin definir | v24.14.1      |
| Vulnerabilidades totales        | 41          | **3**         |
| Vulnerabilidades altas          | 26          | **3**         |
| Vulnerabilidades moderadas      | 7           | **0**         |
| Vulnerabilidades bajas          | 8           | **0**         |
| Campo `engines` en package.json | No          | ✅ `>=18.0.0` |

## Cambios Realizados

### Dependencias de Producción Actualizadas

| Paquete                         | Versión Anterior    | Nueva Versión | Razón                                                               |
| ------------------------------- | ------------------- | ------------- | ------------------------------------------------------------------- |
| **axios**                       | ^0.21.1             | ^1.14.0       | Fix CSRF, SSRF y DoS (GHSA-wf5p, GHSA-jr5f, GHSA-43fc)              |
| **cors**                        | ^2.8.5              | ^2.8.6        | Actualización de parche                                             |
| **cookie-parser**               | ^1.4.5              | ^1.4.7        | Fix cookie out-of-bounds (GHSA-pxg6)                                |
| **express-session**             | ^1.17.1             | ^1.19.0       | Fix on-headers header injection (GHSA-76c9) + cookie fix            |
| **morgan**                      | ^1.10.0             | ^1.10.1       | Fix on-headers header injection (GHSA-76c9)                         |
| **multer**                      | ^1.4.5-lts.1        | ^1.4.5-lts.2  | Actualización de parche LTS                                         |
| **file-type** _(removido)_      | ^17.1.1 → eliminado | —             | Código muerto — nunca importado en `src/`, eliminado en Fase 3      |
| **multicoin-address-validator** | ^0.5.12             | ^0.5.26       | Actualización menor                                                 |
| **nodemailer**                  | ^6.6.3              | ^8.0.4        | Fix ReDoS, inyección SMTP y DoS (GHSA-9h6g, GHSA-c7w3, GHSA-rcmh)   |
| **passport**                    | ^0.4.1              | ^0.7.0        | Fix session fixation (GHSA-v923)                                    |
| **pg**                          | ^8.5.1              | ^8.20.0       | Actualización menor — mejoras de rendimiento                        |
| **request-ip**                  | ^2.1.3              | ^3.3.0        | Fix ReDoS vía is_js (GHSA-pvrw)                                     |
| **socket.io**                   | ^4.2.0              | ^4.8.3        | Fix socket.io-parser unbounded attachments + ws DoS                 |
| **twilio**                      | ^3.73.1             | ^5.13.1       | Fix jsonwebtoken forgeable tokens (GHSA-8cf7, GHSA-hjrf, GHSA-qwph) |
| **winston**                     | ^3.3.3              | ^3.19.0       | Actualización menor                                                 |
| **ws**                          | ^8.12.1             | ^8.20.0       | Fix DoS con múltiples headers HTTP (GHSA-3h5v)                      |
| **@bull-board/express**         | ^6.7.10             | ^6.20.6       | Fix path-to-regexp ReDoS + qs Prototype Pollution                   |

### Dependencias de Desarrollo Actualizadas

| Paquete               | Versión Anterior | Nueva Versión | Razón                                  |
| --------------------- | ---------------- | ------------- | -------------------------------------- |
| **@babel/cli**        | ^7.13.0          | ^7.28.6       | Actualización menor — soporte Node 24  |
| **@babel/core**       | ^7.13.8          | ^7.29.0       | Actualización menor — soporte Node 24  |
| **@babel/node**       | ^7.13.0          | ^7.29.0       | Actualización menor — soporte Node 24  |
| **@babel/preset-env** | ^7.13.9          | ^7.29.2       | Actualización menor — targets modernos |
| **concurrently**      | ^9.2.0           | ^9.2.1        | Actualización de parche                |
| **nodemon**           | ^2.0.7           | ^3.1.14       | Fix semver ReDoS + soporte moderno     |

### Campo `engines` Agregado a `package.json`

```json
"engines": {
  "node": ">=18.0.0"
}
```

Declara explícitamente que la aplicación requiere Node.js 18 o superior, documentando la compatibilidad con Node.js 24.

## Paquetes Evaluados Sin Cambios de Versión Mayor

Los siguientes paquetes tienen versiones más recientes disponibles pero se mantuvieron en sus versiones actuales para evitar refactorizaciones en el código de la aplicación:

| Paquete                    | Versión Actual      | Última Versión | Razón para Mantener                                               |
| -------------------------- | ------------------- | -------------- | ----------------------------------------------------------------- |
| **@babel/polyfill**        | ^7.12.1             | deprecado      | Paquete deprecado — reemplazar por `core-js` en el futuro         |
| **@sentry/node**           | ^8.19.0             | 10.x           | Cambio de versión mayor — API de instrumentación distinta         |
| **@sentry/profiling-node** | ^8.19.0             | 10.x           | Requiere compilación nativa (node-gyp) — vinculado a @sentry/node |
| **bcryptjs**               | ^2.4.3              | 3.0.3          | Cambio de versión mayor — requiere evaluación de API              |
| **bull**                   | ^4.16.5             | deprecado      | Paquete archivado — migrar a `bullmq` en el futuro                |
| **connect-pg-simple**      | ^6.2.1              | 10.0.0         | Cambio de versión mayor — cambios en integración de sesión        |
| **connect-flash**          | ^0.1.1              | sin cambios    | Sin versión mayor nueva                                           |
| **date-and-time**          | ^1.0.0              | 4.4.0          | Cambio de versión mayor                                           |
| **dotenv**                 | ^8.2.0              | 17.3.1         | Cambio de versión mayor — funcional en versión actual             |
| **express**                | ^5.0.0-alpha.8      | 5.2.1          | En beta/alpha de v5 — actualizar a 5.2.1 estable                  |
| **express-promise-router** | ^4.0.1              | 4.1.1          | Conflicto peer con express@5                                      |
| **express-queue**          | ^0.0.13             | sin cambios    | Sin versión mayor nueva                                           |
| **file-type** _(removido)_ | ^17.1.1 → eliminado | 22.0.0         | ✅ Eliminado en Fase 3 — código muerto, nunca importado en `src/` |
| **formidable**             | ^1.2.2              | 3.5.4          | Cambio de versión mayor — API completamente distinta              |
| **google-spreadsheet**     | ^3.1.15             | 5.2.0          | Cambio de versión mayor — API de autenticación renovada           |
| **helmet**                 | ^4.4.1              | 8.1.0          | Cambio de versión mayor                                           |
| **multer** (v2)            | lts.2               | 2.1.1          | v2 rompe API de `req.file` — requiere pruebas                     |
| **node-cron**              | ^3.0.2              | 4.2.1          | Cambio de versión mayor                                           |
| **passport-local**         | ^1.0.0              | sin cambios    | Sin versión mayor nueva                                           |
| **redis**                  | ^3.1.2              | 5.11.0         | Cambio de versión mayor — API de cliente completamente nueva      |
| **transbank-sdk**          | ^4.0.0              | 6.1.1          | Cambio de versión mayor — migrar cuando haya tiempo               |
| **uuid**                   | implícito           | 13.0.0         | Cambio de versión mayor                                           |

## Vulnerabilidades Residuales (3)

Todas las vulnerabilidades restantes provienen del axios interno que bundlean `google-spreadsheet@3.x` y `transbank-sdk@4.x`. La solución requiere migraciones de código con cambios de API.

### Pendientes

| Severidad | Paquete Raíz         | Vulnerabilidad                                          | Solución Requerida                 |
| --------- | -------------------- | ------------------------------------------------------- | ---------------------------------- |
| Alta      | `google-spreadsheet` | Axios CSRF (GHSA-wf5p-g6vw-rhxx)                        | Migrar a `google-spreadsheet@^5.x` |
| Alta      | `google-spreadsheet` | Axios SSRF / Credential Leak (GHSA-jr5f-v2jv-69x6)      | Migrar a `google-spreadsheet@^5.x` |
| Alta      | `transbank-sdk`      | Axios CSRF / SSRF (mismos CVEs — axios bundled interno) | Migrar a `transbank-sdk@^6.x`      |

### Resueltas en Esta Sesión

| Severidad | Paquete / Cadena                                     | Vulnerabilidad                                     | Resolución                                            |
| --------- | ---------------------------------------------------- | -------------------------------------------------- | ----------------------------------------------------- |
| Alta × 3  | `twilio@3.x` → `jsonwebtoken@8.x` → `jws`            | Tokens JWT forgeables, bypass de firma             | ✅ twilio actualizado a v5.13.1                       |
| Alta × 2  | `request-ip@2.x` → `is_js`                           | ReDoS en validación de IPs                         | ✅ request-ip actualizado a v3.3.0                    |
| Alta × 3  | `axios@0.21.x` (directo)                             | CSRF, SSRF, DoS via `__proto__`                    | ✅ axios actualizado a v1.14.0                        |
| Alta      | `socket.io@4.7.x` → `socket.io-parser`               | Unbounded binary attachments (DoS)                 | ✅ socket.io actualizado a v4.8.3                     |
| Alta × 2  | `ws@8.16.x` + `engine.io`                            | DoS con múltiples HTTP headers                     | ✅ ws actualizado a v8.20.0                           |
| Alta × 3  | `node-forge` (transitiva)                            | ASN.1 recursión, bypass de certificados, firma RSA | ✅ Resuelto via audit fix                             |
| Alta × 3  | `minimatch` (transitiva)                             | ReDoS (múltiples CVEs)                             | ✅ Resuelto via audit fix                             |
| Alta      | `base-x` (transitiva)                                | Homograph attack en validación de direcciones      | ✅ Resuelto via audit fix                             |
| Alta      | `path-to-regexp` (`@bull-board/express`)             | ReDoS con parámetros de ruta múltiples             | ✅ @bull-board/express actualizado a v6.20.6          |
| Alta      | `braces` (transitiva de nodemon@2)                   | Consumo incontrolado de recursos                   | ✅ nodemon actualizado a v3.1.14                      |
| Alta      | `semver@7.x` (transitiva de nodemon@2)               | ReDoS                                              | ✅ nodemon actualizado a v3.1.14                      |
| Alta      | `picomatch` (transitiva)                             | ReDoS + Method Injection                           | ✅ Resuelto via audit fix                             |
| Moderada  | `passport@0.4.x`                                     | Session fixation                                   | ✅ passport actualizado a v0.7.0                      |
| Moderada  | `file-type@17.x`                                     | Infinite loop en ASF parser (GHSA-5v7r)            | ✅ Paquete eliminado — código muerto, nunca importado |
| Moderada  | `@sentry/node@8.10-8.48`                             | DoS vía ContextLines integration                   | ✅ Resuelto via audit fix (v8.55.x)                   |
| Moderada  | `@babel/helpers` + `@babel/runtime` (<7.26.10)       | RegExp DoS en código generado por Babel            | ✅ Resuelto via audit fix                             |
| Moderada  | `follow-redirects` (transitiva)                      | Proxy-Authorization header leaked                  | ✅ Resuelto via audit fix                             |
| Moderada  | `brace-expansion` (transitiva)                       | ReDoS (múltiples CVEs)                             | ✅ Resuelto via audit fix                             |
| Moderada  | `lodash` (transitiva)                                | Prototype Pollution en `_.unset` / `_.omit`        | ✅ Resuelto via audit fix                             |
| Moderada  | `qs@6.x` (`@bull-board/express`)                     | Prototype Pollution + DoS por bracket notation     | ✅ @bull-board/express actualizado a v6.20.6          |
| Moderada  | `cookie@<0.7.0` (`express-session`, `cookie-parser`) | Cookie name/path/domain con caracteres OOB         | ✅ express-session y cookie-parser actualizados       |
| Moderada  | `morgan` → `on-headers`                              | HTTP response header manipulation                  | ✅ morgan actualizado a v1.10.1                       |
| Baja × 8  | Transitivas varias                                   | Múltiples CVEs menores                             | ✅ Resueltos via audit fix                            |

## Proceso de Actualización

### Fase 1 — Actualizaciones Seguras (Menores/Parche)

1. Análisis inicial: `npm audit` → **41 vulnerabilidades** (8 low, 7 moderate, 26 high)
2. Análisis de desactualizados: `npm outdated`
3. Actualización de producción (minor/patch sin breaking changes):
   ```
   npm install --save cors express-session pg socket.io winston morgan cookie-parser
     multer multicoin-address-validator ws @bull-board/express --legacy-peer-deps
   ```
   → 41 → **28 vulnerabilidades**

### Fase 2 — Actualizaciones con Breaking Changes (Necesarias por Seguridad)

4. Actualización de producción (major con fix de seguridad activo):

   ```
   npm install --save axios nodemailer request-ip twilio passport --legacy-peer-deps
   ```

   → 28 → **20 vulnerabilidades**

5. Actualización de desarrollo (Babel + nodemon):

   ```
   npm install --save-dev @babel/cli @babel/core @babel/node @babel/preset-env
     nodemon concurrently --legacy-peer-deps
   ```

   → 20 → **15 vulnerabilidades**

6. Fix automático de vulnerabilidades transitivas:

   ```
   npm audit fix --legacy-peer-deps --ignore-scripts
   ```

   > `--ignore-scripts` necesario porque `@sentry/profiling-node` requiere Visual Studio
   > Build Tools (compilación nativa con node-gyp) para su módulo C++.

   → 15 → **4 vulnerabilidades residuales**

7. Verificación final: `npm audit` → **4 vulnerabilidades** (3 altas, 1 moderada)
8. Agregado del campo `engines` en `package.json`
9. Fix `src/utils/sentry.js` — el `import` estático de `@sentry/profiling-node` causaba crash en Node 24 porque el binario nativo `.node` (ABI 137) no estaba compilado (requiere Visual Studio Build Tools en Windows). Solución: reemplazar el `import` estático por un `require()` dentro de `try/catch`. Si el módulo nativo está disponible (producción Linux) funciona igual que antes; si no, Sentry arranca sin profiling de CPU y emite un `warn` en el log.

> **Nota sobre `--legacy-peer-deps`:** Se usó en todas las instalaciones porque algunos paquetes declaran peer dependencies con rangos estrictos que entran en conflicto con las versiones actualizadas bajo el algoritmo de resolución estricto de npm 7+. Es una práctica estándar para proyectos con dependencias de distintas generaciones.

> **Nota sobre `--ignore-scripts`:** `@sentry/profiling-node` compila un módulo nativo de C++ usando `node-gyp`, que requiere Visual Studio Build Tools instalado en Windows. Al no estar disponible en el entorno de desarrollo actual, se usó `--ignore-scripts` para omitir ese paso. El servidor continúa funcionando: el profiling de Sentry se degrada gracefully si el módulo nativo no está compilado.

## Stack Tecnológico Actual

### Dependencias de Producción Principales

| Paquete                 | Versión      | Estado                                      |
| ----------------------- | ------------ | ------------------------------------------- |
| **express**             | 5.0.0-beta.1 | ⚠️ Beta — actualizar a 5.2.1 estable        |
| **pg**                  | 8.20.0       | ✅ Actualizado                              |
| **axios**               | 1.14.0       | ✅ Actualizado — sin vulnerabilidades       |
| **socket.io**           | 4.8.3        | ✅ Actualizado                              |
| **winston**             | 3.19.0       | ✅ Actualizado                              |
| **nodemailer**          | 8.0.4        | ✅ Actualizado — fix seguridad SMTP         |
| **passport**            | 0.7.0        | ✅ Actualizado — fix session fixation       |
| **twilio**              | 5.13.1       | ✅ Actualizado — fix JWT vulnerabilities    |
| **request-ip**          | 3.3.0        | ✅ Actualizado — fix ReDoS                  |
| **ws**                  | 8.20.0       | ✅ Actualizado — fix DoS                    |
| **@bull-board/express** | 6.20.6       | ✅ Actualizado — fix path-to-regexp + qs    |
| **redis**               | 3.1.2        | ⚠️ Estable en v3 — migrar a v5 en el futuro |
| **bull**                | 4.16.5       | ⚠️ Paquete archivado — migrar a `bullmq`    |
| **google-spreadsheet**  | 3.3.0        | 🔴 Vulnerable (axios interno) — migrar a v5 |
| **transbank-sdk**       | 4.0.0        | 🔴 Vulnerable (axios interno) — migrar a v6 |
| ~~file-type~~           | ~~17.1.6~~   | ✅ Eliminado en Fase 3 — código muerto      |

### Dependencias de Desarrollo

| Paquete               | Versión | Estado                            |
| --------------------- | ------- | --------------------------------- |
| **@babel/cli**        | 7.28.6  | ✅ Actualizado — soporte Node 24  |
| **@babel/core**       | 7.29.0  | ✅ Actualizado                    |
| **@babel/node**       | 7.29.0  | ✅ Actualizado                    |
| **@babel/preset-env** | 7.29.2  | ✅ Actualizado                    |
| **nodemon**           | 3.1.14  | ✅ Actualizado — fix semver ReDoS |
| **concurrently**      | 9.2.1   | ✅ Actualizado                    |

## Compatibilidad con Node.js

- **Soporte Declarado:** Node.js ≥ 18.0.0 (campo `engines` en package.json)
- **Probado Con:** Node.js v24.14.1 ✅
- **Compilador JS:** Babel (`@babel/node` + `@babel/preset-env`) — compatibilidad con ESModules vía transpilación

## Mejoras Futuras Recomendadas

### Actualizaciones de Versión Mayor (Requieren Refactorización)

1. **Migrar `google-spreadsheet` a v5** ⚠️ Urgente — 3 CVEs activos
   - Cambia la API de autenticación (GoogleAuth en lugar de tokens directos)
   - Impacto: archivos que importan de `src/utils/googleSpreadSheets.js`

2. **Migrar `transbank-sdk` a v6** ⚠️ Urgente — 3 CVEs activos (mismos axios)
   - Revisar breaking changes en la API de pagos de Transbank
   - Impacto: módulos que gestionan pagos con Transbank

3. ✅ **`file-type` eliminado** _(Fase 3 — completado)_
   - Confirmado que no era importado en ningún archivo de `src/`
   - Eliminado con `npm uninstall file-type --legacy-peer-deps`
   - CVE moderado GHSA-5v7r cerrado

4. **Migrar `redis` de v3 a v5**
   - v5 tiene API completamente nueva (promesas nativas, sin callbacks)
   - Impacto: todos los archivos que usan `redisClient.get/set/del/publish`
   - Beneficio: soporte a largo plazo, mejor rendimiento

5. **Migrar `express` de beta a estable**
   - Express 5 ya tiene versión estable (5.2.1)
   - Actualizar desde `^5.0.0-beta.1` a `^5.2.1`

6. **Migrar `bull` a `bullmq`**
   - `bull` está archivado y sin mantenimiento activo
   - `bullmq` es el sucesor oficial con mejor soporte de Node moderno
   - Impacto: workers de `createRemittance`, `silt` y `persona`

7. **Remover `@babel/polyfill`**
   - Paquete deprecado — reemplazar por `core-js@3` + configuración `useBuiltIns` en `@babel/preset-env`

8. ✅ **Graceful degradation para `@sentry/profiling-node`** _(completado)_
   - El binario nativo (ABI 137 para Node 24) no puede compilarse en Windows sin Visual Studio Build Tools
   - Solución aplicada en `src/utils/sentry.js`: `import` estático reemplazado por `require()` en `try/catch`
   - En producción (Linux): el módulo compila normalmente, profiling activo
   - En desarrollo (Windows sin VS Build Tools): Sentry inicia sin profiling, emite `warn` en el log
   - **Opcional:** instalar Visual Studio Build Tools con "Desktop development with C++" para habilitar profiling también en Windows local. Luego: `npm rebuild @sentry/profiling-node`

## Comandos Útiles

```bash
# Desarrollo (API principal)
npm run dev:api          # nodemon + babel-node en src/index.js

# Desarrollo (workers individuales)
npm run dev:rem          # Worker de creación de remesas
npm run dev:silt         # Worker de verificación SILT
npm run dev:persona      # Worker de verificación Persona

# Producción
npm run start:api        # Ejecutar API con babel-node
npm run start:all        # Ejecutar todos los procesos en paralelo (concurrently)
npm run build            # Compilar con Babel a /dist

# Análisis
npm audit                # Verificar vulnerabilidades
npm outdated             # Verificar paquetes desactualizados
```

---

**Actualizado Por:** Anthony Rodriguez
**Última actualización:** 30 de Marzo, 2026 — Fase 3 (auditoría y limpieza de código muerto)
**Estado de Revisión:** Verificado con Node.js v24.14.1
**Vulnerabilidades activas:** 3 altas (`google-spreadsheet` y `transbank-sdk` — axios interno)
**Listo para Despliegue:** ✅ Sí (con conocimiento de las 3 vulns residuales en dependencias de terceros)
