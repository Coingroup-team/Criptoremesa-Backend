# Client-Info Logging Implementation

Este documento describe la implementación del registro de información del cliente (dispositivo, navegador, SO, etc.) en el sistema de logs de Criptoremesa.

## Cambios Realizados

### 1. Frontend (Criptoremesa-Frontend)

#### App.vue

- **Librería agregada**: `ua-parser-js` para parsear información del User-Agent
- **Nuevo campo**: `config.clientInfo` contiene un JSON con toda la información del cliente
- **Hook modificado**: `beforeCreate()` ahora captura:
  - Browser (nombre, versión, versión mayor)
  - Engine (Blink, Gecko, WebKit, etc.)
  - Sistema Operativo (nombre y versión)
  - Dispositivo (tipo, fabricante, modelo)
  - CPU (arquitectura)
  - User Agent completo
  - Idioma del navegador
  - Plataforma
  - Resolución de pantalla
  - Tamaño del viewport
  - Zona horaria

#### clientIp.variable.ts

- **Nuevo campo**: `clientInfo` para almacenar el JSON string

**Nota**: Debes agregar el header `Client-Info` en tu interceptor de axios:

```javascript
config.headers["Client-Info"] = config.clientInfo;
```

### 2. Backend (Criptoremesa-Backend)

#### Controladores (23 archivos actualizados)

- **logConst actualizado**: Agregado campo `client_info: null`
- **Extracción del header**: Todas las funciones ahora extraen `req.header("Client-Info")`
- **Archivos modificados**:
  - `users.controller.js` (33 endpoints)
  - `veriflevels.controller.js` (13 endpoints)
  - `remittances.controller.js` (13 endpoints)
  - `exchanges.controller.js` (8 endpoints)
  - `reports.controller.js` (8 endpoints)
  - Y 18 controladores más...

#### authentication.pg.repository.js

- **insertLogMsg actualizado**:
  - Parse del JSON `client_info` si viene como string
  - Manejo de errores si el JSON es inválido
  - Envío del nuevo parámetro al stored procedure

### 3. Base de Datos (PostgreSQL)

#### Migración SQL: `010-add-client-info-to-logs.sql`

**Ubicación**: `sql-migrations/010-add-client-info-to-logs.sql`

**Cambios**:

1. Nueva columna `client_info JSONB` en tabla `sec_cust.logs_actions`
2. Stored procedure `SP_LOGS_ACTIONS_OBJ_INSERT` actualizado con parámetro `p_client_info`
3. Verificación automática de la migración

## Instalación

### 1. Frontend

```bash
cd Criptoremesa-Frontend
npm install ua-parser-js
```

Los cambios en App.vue y clientIp.variable.ts ya están aplicados.

**Agregar en tu interceptor de axios** (busca donde agregas headers):

```javascript
// Ejemplo: en http/index.ts o similar
axios.interceptors.request.use((config) => {
  config.headers["Client-Ip"] = clientConfig.clientIp;
  config.headers["Client-Info"] = clientConfig.clientInfo; // ← AGREGAR ESTA LÍNEA
  return config;
});
```

### 2. Backend

Los controladores y el repositorio ya están actualizados.

**Ejecutar migración SQL**:

```bash
# Conectarse a la base de datos
psql -h <host> -U <usuario> -d <database>

# Ejecutar la migración
\i sql-migrations/010-add-client-info-to-logs.sql
```

O usando DBeaver/pgAdmin:

1. Abrir el archivo `sql-migrations/010-add-client-info-to-logs.sql`
2. Ejecutar el script completo
3. Verificar que aparezca el mensaje "✓ Migration completed successfully"

## Verificación

### Verificar Frontend

1. Abrir la aplicación en el navegador
2. Abrir DevTools (F12) → Console
3. Buscar el log:

```
===== CLIENT INFO =====
Client Data: {...}
Client Info JSON: {...}
======================
```

4. Verificar que los datos sean correctos

### Verificar Backend

1. Hacer cualquier request autenticado
2. Revisar la tabla `sec_cust.logs_actions`:

```sql
SELECT
  id_log_action,
  route,
  ip,
  country,
  client_info,
  created_at
FROM sec_cust.logs_actions
ORDER BY created_at DESC
LIMIT 10;
```

3. Verificar que `client_info` contenga el JSON:

```sql
SELECT
  route,
  client_info->>'browser' as browser,
  client_info->'os'->>'name' as os,
  client_info->'device'->>'type' as device_type
FROM sec_cust.logs_actions
WHERE client_info IS NOT NULL
ORDER BY created_at DESC
LIMIT 5;
```

## Estructura del JSON client_info

```json
{
  "browser": {
    "name": "Chrome",
    "version": "121.0.0.0",
    "major": "121"
  },
  "engine": {
    "name": "Blink",
    "version": "121.0.0.0"
  },
  "os": {
    "name": "Windows",
    "version": "10"
  },
  "device": {
    "type": "desktop",
    "vendor": "unknown",
    "model": "unknown"
  },
  "cpu": {
    "architecture": "amd64"
  },
  "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36...",
  "language": "es-CL",
  "platform": "Win32",
  "screenResolution": "1920x1080",
  "viewport": "1366x768",
  "timezone": "America/Santiago"
}
```

## Queries Útiles

### Estadísticas de navegadores

```sql
SELECT
  client_info->'browser'->>'name' as browser,
  COUNT(*) as count
FROM sec_cust.logs_actions
WHERE client_info IS NOT NULL
GROUP BY client_info->'browser'->>'name'
ORDER BY count DESC;
```

### Estadísticas de SO

```sql
SELECT
  client_info->'os'->>'name' as os,
  COUNT(*) as count
FROM sec_cust.logs_actions
WHERE client_info IS NOT NULL
GROUP BY client_info->'os'->>'name'
ORDER BY count DESC;
```

### Tipo de dispositivos

```sql
SELECT
  client_info->'device'->>'type' as device_type,
  COUNT(*) as count
FROM sec_cust.logs_actions
WHERE client_info IS NOT NULL
GROUP BY client_info->'device'->>'type'
ORDER BY count DESC;
```

### Usuarios por zona horaria

```sql
SELECT
  client_info->>'timezone' as timezone,
  COUNT(DISTINCT session) as unique_users
FROM sec_cust.logs_actions
WHERE client_info IS NOT NULL
GROUP BY client_info->>'timezone'
ORDER BY unique_users DESC;
```

## Compatibilidad

- ✅ Retrocompatible: Si `client_info` es NULL, el sistema funciona normalmente
- ✅ Frontend: Funciona en todos los navegadores modernos
- ✅ Backend: Compatible con versiones anteriores del log
- ✅ Base de datos: La columna acepta NULL, no rompe logs existentes

## Notas Importantes

1. **Performance**: El JSON es tipo JSONB (binario), permite queries eficientes
2. **Tamaño**: El JSON pesa aproximadamente 500-800 bytes por log
3. **Privacidad**: No se guarda información sensible, solo datos técnicos del cliente
4. **Mantenimiento**: La librería `ua-parser-js` se actualiza regularmente con nuevos dispositivos

## Archivos Modificados

### Frontend

- `src/App.vue`
- `src/constants/clientIp.variable.ts`

### Backend

- `src/modules/*/controllers/*.controller.js` (23 archivos)
- `src/modules/authentication/repositories/authentication.pg.repository.js`
- `sql-migrations/010-add-client-info-to-logs.sql` (nuevo)
- `update-log-client-info.js` (script temporal)

## Rollback

Si necesitas revertir los cambios:

```sql
-- Eliminar columna
ALTER TABLE sec_cust.logs_actions DROP COLUMN client_info;

-- Restaurar stored procedure original (sin p_client_info)
-- Ver backup de la función original si es necesario
```

## Soporte

Para dudas o problemas, revisar:

1. Console del navegador (frontend)
2. Logs del backend
3. Tabla `sec_cust.logs_actions` (database)
