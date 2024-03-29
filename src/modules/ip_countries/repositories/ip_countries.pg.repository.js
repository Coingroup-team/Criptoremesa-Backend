import { poolSM } from "../../../db/pg.connection";
import { logger } from "../../../utils/logger";
import ObjLog from "../../../utils/ObjLog";

const ip_countriesPGRepository = {};
const context = "ip_countries PG Repository";

ip_countriesPGRepository.getid_by_name = async (name) => {
  try {
    logger.info(`[${context}]: Getting id from db`);
    ObjLog.log(`[${context}]: Getting id from db`);
    await poolSM.query("SET SCHEMA 'sec_emp'");
    const resp = await poolSM.query(
      `SELECT * FROM sec_emp.v_ip_countries_get_id_by_name('${name}')`
    );
    return resp.rows;
  } catch (error) {
    throw error;
  }
};

ip_countriesPGRepository.getip_countries = async () => {
  try {
    logger.info(`[${context}]: Getting ip_countries from db`);
    ObjLog.log(`[${context}]: Getting ip_countries from db`);
    await poolSM.query("SET SCHEMA 'sec_emp'");
    const resp = await poolSM.query(
      `SELECT * FROM sec_emp.v_ip_countries_get_names_active()`
    );
    return resp.rows;
  } catch (error) {
    throw error;
  }
};

export default ip_countriesPGRepository;
