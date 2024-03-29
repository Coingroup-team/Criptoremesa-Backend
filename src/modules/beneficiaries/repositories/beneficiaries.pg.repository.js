import { poolSM } from "../../../db/pg.connection";
import { logger } from "../../../utils/logger";
import ObjLog from "../../../utils/ObjLog";

const beneficiariesPGRepository = {};
const context = "beneficiaries PG Repository";

beneficiariesPGRepository.getUserFrequentBeneficiaries = async (emailUser) => {
  try {
    logger.info(`[${context}]: Getting user frequent beneficiaries from db`);
    ObjLog.log(`[${context}]: Getting user frequent beneficiaries from db`);
    await poolSM.query("SET SCHEMA 'prc_mng'");
    const resp = await poolSM.query(
      `SELECT * FROM prc_mng.sp_ms_frequents_beneficiaries_get_all($$${emailUser}$$)`
    );
    return resp.rows;
  } catch (error) {
    throw error;
  }
};

beneficiariesPGRepository.createFrequentBeneficiary = async (
  body,
  emailUser
) => {
  try {
    logger.info(
      `[${context}]: Inserting ${emailUser} new frequent beneficiary to db`
    );
    ObjLog.log(
      `[${context}]: Inserting ${emailUser} new frequent beneficiary to db`
    );
    await poolSM.query("SET SCHEMA 'prc_mng'");

    logger.silly(body)

    const resp = await poolSM.query(
      `SELECT * FROM prc_mng.sp_ms_frequents_beneficiaries_insert(
        $$${body.nickname}$$,
        ${body.owner_name === null ? null : `$$${body.owner_name}$$`},
        ${body.identification === null ? null : `'${body.identification}'`},
        ${body.account === null ? null : `'${body.account}'`},
        ${body.account_type === null ? null : `'${body.account_type}'`},
        ${body.phone_number === null ? null : `'${body.phone_number}'`},
        ${body.email === null ? null : `'${body.email}'`},
        ${body.id_doc_type},
        ${body.id_bank === null ? null : `'${body.id_bank}'`},
        '${emailUser}',
        ${body.id_pay_method},
        ${body.id_optional_field},
        '${body.relation_type}',
        2,
        ${body.notification.email_notif === null ? null : `'${body.notification.email_notif}'`},
        ${body.notification.phone_notif === null ? null : `'${body.notification.phone_notif}'`},
        ${body.notification.address_notif === null ? null : `'${body.notification.address_notif}'`},
        ${body.notification.city_notif === null ? null : `'${body.notification.city_notif}'`}
        )`
    );
    return resp.rows[0];
  } catch (error) {
    throw error;
  }
};

beneficiariesPGRepository.deleteFrequentBeneficiary = async (beneficiaryId) => {
  try {
    logger.info(`[${context}]: Deleting user frequent beneficiary from DB`);
    ObjLog.log(`[${context}]: Deleting user frequent beneficiary from DB`);
    await poolSM.query("SET SCHEMA 'prc_mng'");
    const resp = await poolSM.query(
      `SELECT * FROM prc_mng.sp_ms_frequents_beneficiaries_delete('${beneficiaryId}')`
    );
    return resp.rows[0];
  } catch (error) {
    throw error;
  }
};

beneficiariesPGRepository.updateFrequentBeneficiary = async (
  body,
  emailUser
) => {
  try {
    logger.info(`[${context}]: Updating user frequent beneficiary in DB`);
    ObjLog.log(`[${context}]: Updating user frequent beneficiary in DB`);
    await poolSM.query("SET SCHEMA 'prc_mng'");
    const resp = await poolSM.query(
      `SELECT * FROM prc_mng.sp_ms_frequents_beneficiaries_update('${emailUser}',$$${JSON.stringify(
        body
      )}$$::jsonb)`
    );
    return resp.rows;
  } catch (error) {
    throw error;
  }
};

beneficiariesPGRepository.contactRequired = async (id_country) => {
  try {
    logger.info(`[${context}]: Getting countries that require beneficiaries contact from db`);
    ObjLog.log(`[${context}]: Getting countries that require beneficiaries contact from db`);
    await poolSM.query("SET SCHEMA 'sec_cust'");

    let resp = await poolSM.query(`SELECT * FROM sp_get_required_contact_countries(${id_country})`)
    if (resp.rows[0].sp_get_required_contact_countries)
      return resp.rows[0].sp_get_required_contact_countries;
    else return null;
  } catch (error) {
    throw error;
  }
};

export default beneficiariesPGRepository;
