import { poolSM } from "../../../db/pg.connection";
import { logger } from "../../../utils/logger";
import ObjLog from "../../../utils/ObjLog";

const veriflevelsPGRepository = {};
const context = "veriflevels PG Repository";


veriflevelsPGRepository.requestWholesalePartner = async (body) => {
  try {
    logger.info(`[${context}]: Requesting Wholesale Partner in db`);
    ObjLog.log(`[${context}]: Requesting Wholesale Partner in db`);
    await poolSM.query("SET SCHEMA 'sec_cust'");
    const resp = await poolSM.query(`SELECT * FROM SP_REQUEST_WHOLESALE_PARTNER(
      '${body.reasons}',
      '${body.strenghts}',
      '${body.remittance_service}',
      '${body.old_resid_client_countries}',
      '${body.profession}',
      '${body.resid_country}',
      '${body.migration_status}',
      '${body.new_resid_client_countries}',
      '${body.clients_number}',
      '${body.monthly_amount}',
      '${body.monetary_growth}',
      '${body.clients_growth}',
      '${body.bussiness_name}',
      '${body.web_page_exp}',
      '${body.logo}',
      '${body.email_user}',
      ${body.reasons_status},
      ${body.strenghts_status},
      ${body.remittance_service_status},
      ${body.old_resid_client_countries_status},
      ${body.profession_status},
      ${body.resid_country_status},
      ${body.migration_status_status},
      ${body.new_resid_client_countries_status},
      ${body.clients_number_status},
      ${body.monthly_amount_status},
      ${body.monetary_growth_status},
      ${body.clients_growth_status},
      ${body.bussiness_name_status},
      ${body.web_page_exp_status},
      ${body.logo_status}
    )`);
    return resp.rows[0].sp_request_wholesale_partner;
  } catch (error) {
    throw error;
  }
};

veriflevelsPGRepository.notifications = async (email_user) => {
  try {
    logger.info(`[${context}]: Requesting notifications in DB`);
    ObjLog.log(`[${context}]: Requesting notifications in DB`);
    await poolSM.query("SET SCHEMA 'sec_cust'");
    const resp = await poolSM.query(`SELECT * FROM v_notifications(
      '${email_user}'
    )`);
    return resp.rows[0].v_notifications;
  } catch (error) {
    throw error;
  }
};

veriflevelsPGRepository.deactivateNotification = async (id_notification) => {
  try {
    logger.info(`[${context}]: Deactivating notification`);
    ObjLog.log(`[${context}]: Deactivating notification`);
    await poolSM.query("SET SCHEMA 'sec_cust'");
    const resp = await poolSM.query(`SELECT * FROM sp_deactive_notification(
      ${id_notification}
    )`);
    return resp.rows[0].sp_deactive_notification;
  } catch (error) {
    throw error;
  }
};

veriflevelsPGRepository.readNotification = async (id_notification) => {
  try {
    logger.info(`[${context}]: Deactivating notification`);
    ObjLog.log(`[${context}]: Deactivating notification`);
    await poolSM.query("SET SCHEMA 'sec_cust'");
    const resp = await poolSM.query(`SELECT * FROM sp_read_notification(
      ${id_notification}
    )`);
    return resp.rows[0].sp_read_notification;
  } catch (error) {
    throw error;
  }
};

veriflevelsPGRepository.getWholesalePartnerRequestsCountries = async (
  email_user
) => {
  try {
    logger.info(`[${context}]: Getting countries from DB`);
    ObjLog.log(`[${context}]: Getting countries from DB`);

    await poolSM.query("SET SCHEMA 'sec_cust'");
    const resp = await poolSM.query(
      `SELECT * FROM v_wholesale_partners_requests_countries()`
    );
    return resp.rows[0].v_wholesale_partners_requests_countries;
  } catch (error) {
    throw error;
  }
};

veriflevelsPGRepository.getMigrationStatus = async (email_user) => {
  try {
    logger.info(`[${context}]: Getting migration status from DB`);
    ObjLog.log(`[${context}]: Getting migration status from DB`);

    await poolSM.query("SET SCHEMA 'sec_cust'");
    const resp = await poolSM.query(`SELECT * FROM v_migration_status()`);
    return resp.rows[0].v_migration_status;
  } catch (error) {
    throw error;
  }
};

veriflevelsPGRepository.getDisapprovedVerifLevelsRequirements = async (
  email_user
) => {
  try {
    logger.info(
      `[${context}]: Getting Disapproved VerifLevels Requirements from DB`
    );
    ObjLog.log(
      `[${context}]: Getting Disapproved VerifLevels Requirements from DB`
    );

    await poolSM.query("SET SCHEMA 'sec_cust'");
    const resp = await poolSM.query(
      `SELECT * FROM v_verif_levels_requirements_disapproved('${email_user}')`
    );
    return resp.rows[0].v_verif_levels_requirements_disapproved;
  } catch (error) {
    throw error;
  }
};

veriflevelsPGRepository.getDisapprovedWholesalePartnersRequirements = async (
  email_user
) => {
  try {
    logger.info(
      `[${context}]: Getting Disapproved WholesalePartners Requirements from DB`
    );
    ObjLog.log(
      `[${context}]: Getting Disapproved WholesalePartners Requirements from DB`
    );

    await poolSM.query("SET SCHEMA 'sec_cust'");
    const resp = await poolSM.query(
      `SELECT * FROM v_wholesale_partners_requests_requirements_disapproved('${email_user}')`
    );
    return resp.rows[0].v_wholesale_partners_requests_requirements_disapproved;
  } catch (error) {
    throw error;
  }
};

veriflevelsPGRepository.getLimitationsByCountry = async (id_country) => {
  try {
    logger.info(`[${context}]: Getting Limitations from DB`);
    ObjLog.log(`[${context}]: Getting Limitations from DB`);

    await poolSM.query("SET SCHEMA 'sec_cust'");
    const resp = await poolSM.query(
      `SELECT * FROM get_limitations_by_country(${id_country})`
    );
    return resp.rows[0].get_limitations_by_country;
  } catch (error) {
    throw error;
  }
};

veriflevelsPGRepository.getVerifLevelRequirements = async (email_user) => {
  try {
    logger.info(`[${context}]: Getting requirements from DB`);
    ObjLog.log(`[${context}]: Getting requirements from DB`);

    await poolSM.query("SET SCHEMA 'sec_cust'");
    const resp = await poolSM.query(
      `SELECT * FROM v_verif_levels_requirements('${email_user}')`
    );
      logger.silly(resp.rows[0].v_verif_levels_requirements)

    return resp.rows[0].v_verif_levels_requirements;
  } catch (error) {
    throw error;
  }
};

veriflevelsPGRepository.getWholesalePartnerRequestsRequirementsByEmail = async (
  email_user
) => {
  try {
    logger.info(`[${context}]: Getting requirements from DB`);
    ObjLog.log(`[${context}]: Getting requirements from DB`);

    await poolSM.query("SET SCHEMA 'sec_cust'");
    const resp = await poolSM.query(
      `SELECT * FROM v_wholesale_partners_requests_requirements_by_email('${email_user}')`
    );
    return resp.rows[0].v_wholesale_partners_requests_requirements_by_email;
  } catch (error) {
    throw error;
  }
};

veriflevelsPGRepository.validateRemittance = async (remittance) => {
  try {
    logger.info(`[${context}]: prooving from DB`);
    ObjLog.log(`[${context}]: prooving from DB`);

    await poolSM.query("SET SCHEMA 'sec_cust'");
    const resp = await poolSM.query(
      `SELECT * FROM validate_remittance('${JSON.stringify(remittance)}')`
    );
    return resp.rows[0].validate_remittance;
  } catch (error) {
    throw error;
  }
};

veriflevelsPGRepository.levelOneVerfificationSilt = async (
siltRequest
) => {
  logger.info(`[${context}]: Sending SILT request to DB`);
  ObjLog.log(`[${context}]: Sending SILT request to DB`);

  const {
    dateBirth,
    emailUser,
    docType,
    countryIsoCodeDoc,
    identDocNumber,
    docPath,
    selfie,
    gender,
    nationalityCountryIsoCode,
    siltID,
    siltStatus,
    manualReviewStatus,
  } = siltRequest;

  // console.log(`dateBirth: ${dateBirth}`);
  // console.log(`emailUser: ${emailUser}`);
  // console.log(`docType: ${docType}`);
  // console.log(`identDocNumber: ${identDocNumber}`);
  // console.log(`docPath: ${docPath}`);
  // console.log(`selfie: ${selfie}`);
  // console.log(`gender: ${gender}`);
  // console.log(`siltID: ${siltID}`);
  // console.log(`siltStatus: ${siltStatus}`);
  // console.log(`manualReviewStatus: ${manualReviewStatus}`);
  // console.log(`countryIsoCodeDoc: ${countryIsoCodeDoc}`);
  // console.log(`nationalityCountryIsoCode: ${nationalityCountryIsoCode}`);

  await poolSM.query({
    text: `select sec_cust.sp_request_level_one_silt($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
    values: [
      dateBirth,
      emailUser,
      docType,
      countryIsoCodeDoc,
      identDocNumber,
      docPath,
      selfie,
      gender,
      nationalityCountryIsoCode,
      siltID,
      siltStatus,
      manualReviewStatus,
    ],
  });
};

veriflevelsPGRepository.levelOneVerfificationSiltEnhanced = async (
siltRequest
) => {
  logger.info(`[${context}]: Sending enhanced SILT request to DB`);
  ObjLog.log(`[${context}]: Sending enhanced SILT request to DB`);

  const {
    dateBirth,
    emailUser,
    docType,
    countryIsoCodeDoc,
    identDocNumber,
    docPath,
    selfie,
    gender,
    nationalityCountryIsoCode,
    siltID,
    siltStatus,
    manualReviewStatus,
    personalNumber,
    expiryDate,
    documentAddress,
  } = siltRequest;

  console.log(`Enhanced SILT data - Personal Number: ${personalNumber}, Expiry: ${expiryDate}, Address: ${documentAddress}`);

  await poolSM.query({
    text: `select sec_cust.sp_request_level_one_silt_enhanced($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
    values: [
      dateBirth,
      emailUser,
      docType,
      countryIsoCodeDoc,
      identDocNumber,
      docPath,
      selfie,
      gender,
      nationalityCountryIsoCode,
      siltID,
      siltStatus,
      manualReviewStatus,
      personalNumber,
      expiryDate,
      documentAddress,
    ],
  });
};

veriflevelsPGRepository.getUserSiltDocumentData = async (emailUser) => {
  logger.info(`[${context}]: Getting SILT document data for user ${emailUser}`);
  ObjLog.log(`[${context}]: Getting SILT document data for user ${emailUser}`);

  try {
    await poolSM.query("SET SCHEMA 'sec_cust'");
    const resp = await poolSM.query(
      `SELECT * FROM v_user_silt_document_data WHERE email_user = $1`,
      [emailUser]
    );
    return resp.rows[0] || null;
  } catch (error) {
    logger.error(`[${context}] Error getting SILT document data: ${error}`);
    throw error;
  }
};

export default veriflevelsPGRepository;
