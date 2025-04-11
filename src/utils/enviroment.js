if (process.env.NODE_ENV !== "production")
    require('dotenv').config()

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
    MAIL_SENDER: process.env.MAIL_SENDER,
    MESSAGE_SERVER_BASE_URL: process.env.MESSAGE_SERVER_BASE_URL,
    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
    ENVIROMENT: process.env.ENVIROMENT,
    NOTIFY_ENV: process.env.NOTIFY_ENV,
    CURRENCY_FREAKS_API_KEY: process.env.CURRENCY_FREAKS_API_KEY,
    BINANCE_API_KEY: process.env.BINANCE_API_KEY,
    BINANCE_SECRET_KEY: process.env.BINANCE_SECRET_KEY,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    REDIS_DB: process.env.REDIS_DB,
    REDIS_DB_SESSION: process.env.REDIS_DB_SESSION,
    REDIS_READ_TIMEOUT: process.env.REDIS_READ_TIMEOUT,
    REDIS_DB_REM_QUEUE: process.env.REDIS_DB_REM_QUEUE,
};

export const ENVIROMENTS = {
    PRODUCTION: 'prod',
    DEVELOPMENT: 'dev'
}

export const SENTRY_ENVS = {
    DEVELOPMENT: 'development',
    PRODUCTION: 'production',
    LOCAL: 'local',
};

export const VALID_SENTRY_ENVS = [SENTRY_ENVS.DEVELOPMENT, SENTRY_ENVS.PRODUCTION, SENTRY_ENVS.LOCAL];