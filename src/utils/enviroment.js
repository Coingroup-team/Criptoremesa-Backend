if (process.env.NODE_ENV !== "production") require("dotenv").config();

export const env = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  DBMS: process.env.DBMS,
  PG_DB_SM_NAME: process.env.PG_DB_SM_NAME,
  PG_DB_SM_HOST: process.env.PG_DB_SM_HOST,
  PG_DB_SM_PORT: process.env.PG_DB_SM_PORT,
  PG_DB_SM_USER: process.env.PG_DB_SM_USER,
  PG_DB_SM_PASSWORD: process.env.PG_DB_SM_PASSWORD,
  PG_DB_CR_NAME: process.env.PG_DB_CR_NAME,
  PG_DB_CR_HOST: process.env.PG_DB_CR_HOST,
  PG_DB_CR_PORT: process.env.PG_DB_CR_PORT,
  PG_DB_CR_USER: process.env.PG_DB_CR_USER,
  PG_DB_CR_PASSWORD: process.env.PG_DB_CR_PASSWORD,
  reCAPTCHA_SECRET_KEY: process.env.reCAPTCHA_SECRET_KEY,
  FILES_DIR: process.env.FILES_DIR,
  LOCAL_FILES_DIR: process.env.LOCAL_FILES_DIR,
  SILT_DATA_DIR: process.env.SILT_DATA_DIR || "/repo-cr",
  MAIL_SENDER: process.env.MAIL_SENDER,
  MESSAGE_SERVER_BASE_URL: process.env.MESSAGE_SERVER_BASE_URL,
  WHATSAPP_TLS_INSECURE: process.env.WHATSAPP_TLS_INSECURE,
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
  TWILIO_VERIFY_SID: process.env.TWILIO_VERIFY_SID,
  // Interruptor del 2FA obligatorio. Mientras sea false el usuario puede
  // entrar sin 2FA y solo se le muestra el aviso. Al ponerlo en true, quien
  // no lo tenga activo es enviado directo al flujo de activacion.
  TWOFA_REQUIRED: process.env.TWOFA_REQUIRED === "true",
  // Token para cambiar la fecha obligatoria con POST /cr/twofa/config.
  // Es distinto del x-api-key: ese lo lleva horneado el frontend y no
  // sirve como control de administracion.
  TWOFA_CONFIG_TOKEN: process.env.TWOFA_CONFIG_TOKEN,
  APP_NAME: process.env.APP_NAME || "Bithonor",
  ENVIROMENT: process.env.ENVIROMENT,
  NOTIFY_ENV: process.env.NOTIFY_ENV,
  CURRENCY_FREAKS_API_KEY: process.env.CURRENCY_FREAKS_API_KEY,
  BINANCE_API_KEY: process.env.BINANCE_API_KEY,
  BINANCE_SECRET_KEY: process.env.BINANCE_SECRET_KEY,
  REDIS_HOST: process.env.REDIS_DB_HOST || process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_DB_PORT || process.env.REDIS_PORT,
  REDIS_PASSWORD: process.env.REDIS_DB_PASSWORD || process.env.REDIS_PASSWORD,
  REDIS_DB: process.env.REDIS_DB,
  REDIS_DB_SESSION: process.env.REDIS_DB_SESSION,
  REDIS_READ_TIMEOUT: process.env.REDIS_READ_TIMEOUT,
  REDIS_DB_REM_QUEUE: process.env.REDIS_DB_REM_QUEUE,
  REDIS_DB_SILT_QUEUE: process.env.REDIS_DB_SILT_QUEUE,
  REDIS_DB_PERSONA_QUEUE: process.env.REDIS_DB_PERSONA_QUEUE,
  PERSONA_API_URL: process.env.PERSONA_API_URL,
  PERSONA_API_KEY: process.env.PERSONA_API_KEY,
  PERSONA_INQUIRY_TEMPLATE_ID: process.env.PERSONA_INQUIRY_TEMPLATE_ID,
  // Usuario de la API de GeoNames (antes hardcodeado en el codigo)
  GEONAMES_USERNAME: process.env.GEONAMES_USERNAME,
  // PostgreSQL SSL
  PG_DB_SSL: process.env.PG_DB_SSL,
  // Verificación estricta del certificado TLS de Postgres (por defecto: true/seguro).
  // Solo se debe poner en "false" temporalmente si el proveedor de la BD usa
  // un certificado que aun no se ha podido validar contra una CA de confianza.
  PG_DB_SSL_REJECT_UNAUTHORIZED: process.env.PG_DB_SSL_REJECT_UNAUTHORIZED,
  // API Key for frontend authentication
  INTERNAL_API_KEY: process.env.INTERNAL_API_KEY,
  // Deployment region: "europe" or unset (Latam)
  DEPLOYMENT_REGION: process.env.DEPLOYMENT_REGION,
};

export const ENVIROMENTS = {
  PRODUCTION: "prod",
  DEVELOPMENT: "dev",
};

export const SENTRY_ENVS = {
  DEVELOPMENT: "development",
  PRODUCTION: "production",
  LOCAL: "local",
};

export const VALID_SENTRY_ENVS = [
  SENTRY_ENVS.DEVELOPMENT,
  SENTRY_ENVS.PRODUCTION,
  SENTRY_ENVS.LOCAL,
];
