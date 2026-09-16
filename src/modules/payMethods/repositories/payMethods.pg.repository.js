import { poolSM } from "../../../db/pg.connection";
import { logger } from "../../../utils/logger";
import ObjLog from "../../../utils/ObjLog";

const payMethodsRepository = {};
const context = "pay Methods PG Repository";

payMethodsRepository.getPayMethodsByCountryAndCurrency = async (idCountry,idCurrency,onlyPay) => {
  try {
    logger.info(`[${context}]: Getting Pay Methods by Country and Currency from db`);
    ObjLog.log(`[${context}]: Getting Pay Methods by Country and Currency from db`);
    await poolSM.query("SET SCHEMA 'msg_app'");
    if (onlyPay && onlyPay === 'null') onlyPay = false
    else if (onlyPay && onlyPay === 'false') onlyPay = false
    else if (onlyPay && onlyPay === 'true') onlyPay = true
    else if (!onlyPay) onlyPay = false

    const resp = await poolSM.query(
      `select * from msg_app.sp_ms_pay_methods_get(
                                                  ${idCountry},
                                                  ${idCurrency},
                                                  ${onlyPay}
                                                  )`
    );
    return resp.rows;
  } catch (error) {
    throw error;
  }
};

payMethodsRepository.getPayMethodById = async (idPayMethod) => {
  try {
    logger.info(`[${context}]: Getting Pay Methods by id from db`);
    ObjLog.log(`[${context}]: Getting Pay Methods by id from db`);
    await poolSM.query("SET SCHEMA 'msg_app'");
    const resp = await poolSM.query(
      `select * from msg_app.sp_ms_pay_methods_by_id_get($1::integer)`,
      [idPayMethod]
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
    await poolSM.query("SET SCHEMA 'sec_cust'");
    const resp = await poolSM.query(
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
    await poolSM.query("SET SCHEMA 'sec_cust'");
    const resp = await poolSM.query(
      `select * from msg_app.sp_ms_pay_methods_by_id_get($1::integer)`,
      [idPayMethod]
    );
    return resp.rows[0];
  } catch (error) {
    throw error;
  }
};
export default payMethodsRepository;
