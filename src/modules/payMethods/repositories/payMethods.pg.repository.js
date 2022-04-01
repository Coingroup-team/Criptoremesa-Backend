import { poolSM } from "../../../db/pg.connection";
import { logger } from "../../../utils/logger";
import ObjLog from "../../../utils/ObjLog";

const payMethodsRepository = {};
const context = "pay Methods PG Repository";

payMethodsRepository.getPayMethodsByCountry = async (idCountry) => {
  try {
    logger.info(`[${context}]: Getting Pay Methods by Country from db`);
    ObjLog.log(`[${context}]: Getting Pay Methods by Country from db`);
    await pool.query("SET SCHEMA 'msg_app'");
    const resp = await pool.query(
      `select * from msg_app.sp_ms_pay_methods_get(${idCountry})`
    );
    return resp.rows;
  } catch (error) {
    throw error;
  }
};

payMethodsRepository.depositMethodsByBank = async (id_bank) => {
  try {
    logger.info(`[${context}]: Getting deposit Methods by Country from db`);
    ObjLog.log(`[${context}]: Getting deposit Methods by Country from db`);
    await pool.query("SET SCHEMA 'sec_cust'");
    const resp = await pool.query(
      `select * from sec_cust.sp_get_deposit_methods_by_bank(${id_bank})`
    );
    return resp.rows[0].sp_get_deposit_methods_by_bank;
  } catch (error) {
    throw error;
  }
};

payMethodsRepository.getPayMethodById = async (idPayMethod) => {
  try {
    logger.info(
      `[${context}]: Getting Pay Method by id ${idPayMethod} from db`
    );
    ObjLog.log(`[${context}]: Getting Pay Method by id ${idPayMethod} from db`);
    await pool.query("SET SCHEMA 'sec_cust'");
    const resp = await pool.query(
      `select * from sp_ms_pay_methods_by_id_get(${idPayMethod})`
    );
    return resp.rows[0];
  } catch (error) {
    throw error;
  }
};
export default payMethodsRepository;
