import { Pool, Client } from "pg";
import { logger } from "../utils/logger";
import ObjLog from "../utils/ObjLog";
import { env } from "../utils/enviroment";
import fs from "fs";
import path from "path";

// TLS verificado hacia Postgres: se valida la identidad del servidor contra el
// CA bundle oficial de AWS RDS. El certificado del RDS lo firma una CA de
// Amazon que NO esta en el trust store por defecto de Node, por eso hay que
// proveer el bundle explicitamente (si no, "self-signed certificate in
// certificate chain" y no conecta). Por defecto rejectUnauthorized=true
// (verificacion real anti-MITM app<->BD); solo se relaja poniendo
// PG_DB_SSL_REJECT_UNAUTHORIZED=false de forma explicita y temporal.
const rdsCa = fs
  .readFileSync(path.join(__dirname, "..", "utils", "cert", "rds-global-bundle.pem"))
  .toString();
const sslConfig =
  env.PG_DB_SSL === "true"
    ? {
        ca: rdsCa,
        rejectUnauthorized: env.PG_DB_SSL_REJECT_UNAUTHORIZED !== "false",
      }
    : false;

const connectionDbSixmap = {
  user: env.PG_DB_SM_USER,
  host: env.PG_DB_SM_HOST,
  database: env.PG_DB_SM_NAME,
  password: env.PG_DB_SM_PASSWORD,
  port: env.PG_DB_SM_PORT,
  max: 8,
  keepAlive: true,
  ssl: sslConfig,
  //   currentSchema: "sec_sixmap_users",
};

const connectionDbCriptoremesa = {
  user: env.PG_DB_CR_USER,
  host: env.PG_DB_CR_HOST,
  database: env.PG_DB_CR_NAME,
  password: env.PG_DB_CR_PASSWORD,
  port: env.PG_DB_CR_PORT,
  max: 8,
  keepAlive: true,
  ssl: sslConfig,
  //   currentSchema: "sec_sixmap_users",
};

export const poolSM = new Pool(connectionDbSixmap);
const clientSM = new Client(connectionDbSixmap);

poolSM
  .connect()
  .then((response) => {
    logger.info("PG-DB-SM is connected");
    ObjLog.log("PG-DB-SM is connected");
    poolSM.on("connect", (clientSM) => {
      clientSM.on("notice", (notice) => {
        console.log(notice.message);
      });
    });
  })
  .catch((err) => {
    logger.error(`PGDBSM is not connected: ${err}`);
    ObjLog.log(`PGDBSM is not connected: ${err}`);
    clientSM.end();
  });

poolSM.on("error", (err, client) => {
  console.error("[PG POOL SM] Error inesperado en cliente idle:", err.message);
});

export const poolCR = new Pool(connectionDbCriptoremesa);
const clientCR = new Client(connectionDbCriptoremesa);

poolCR
  .connect()
  .then((response) => {
    logger.info("PG-DB-CR is connected");
    ObjLog.log("PG-DB-CR is connected");
    poolCR.on("connect", (clientCR) => {
      clientCR.on("notice", (notice) => {
        console.log(notice.message);
      });
    });
  })
  .catch((err) => {
    logger.error(`PGDBCR is not connected: ${err}`);
    ObjLog.log(`PGDBCR is not connected: ${err}`);
    clientCR.end();
  });

poolCR.on("error", (err, client) => {
  console.error("[PG POOL CR] Error inesperado en cliente idle:", err.message);
});
