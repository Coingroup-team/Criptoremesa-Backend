import { Pool, Client } from 'pg';
import { logger } from "../utils/logger";
import ObjLog from "../utils/ObjLog";
import { env } from "../utils/enviroment";

const connectionDbSixmap = {
  user: env.PG_DB_SM_USER,
  host: env.PG_DB_SM_HOST,
  database: env.PG_DB_SM_NAME,
  password: env.PG_DB_SM_PASSWORD,
  port: env.PG_DB_SM_PORT,
  max: 8,
  //   currentSchema: "sec_sixmap_users",
};

const connectionDbCriptoremesa = {
  user: env.PG_DB_CR_USER,
  host: env.PG_DB_CR_HOST,
  database: env.PG_DB_CR_NAME,
  password: env.PG_DB_CR_PASSWORD,
  port: env.PG_DB_CR_PORT,
  max: 8,
  //   currentSchema: "sec_sixmap_users",
};

export const poolSM = new Pool(connectionDbSixmap);
const clientSM = new Client(connectionDbSixmap);

poolSM
  .connect()
  .then((response) => {
    logger.info("PG-DB-SM is connected");
    ObjLog.log("PG-DB-SM is connected");
    poolSM.on(
      'connect', clientSM => {
        clientSM.on('notice', notice => {
          console.log(notice.message)
        })
      }
    )
  })
  .catch((err) => {
    logger.error(`PGDBSM is not connected: ${err}`);
    ObjLog.log(`PGDBSM is not connected: ${err}`);
    clientSM.end();
  });

export const poolCR = new Pool(connectionDbCriptoremesa);
const clientCR = new Client(connectionDbCriptoremesa);

poolCR
  .connect()
  .then((response) => {
    logger.info("PG-DB-CR is connected");
    ObjLog.log("PG-DB-CR is connected");
    poolCR.on(
      'connect', clientCR => {
        clientCR.on('notice', notice => {
          console.log(notice.message)
        })
      }
    )
  })
  .catch((err) => {
    logger.error(`PGDBCR is not connected: ${err}`);
    ObjLog.log(`PGDBCR is not connected: ${err}`);
    clientCR.end();
  });