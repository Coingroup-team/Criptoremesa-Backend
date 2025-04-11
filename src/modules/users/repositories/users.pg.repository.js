import { poolSM } from "../../../db/pg.connection";
import { logger } from "../../../utils/logger";
import ObjLog from "../../../utils/ObjLog";
import mailSender from "../../../utils/mail";

const usersPGRepository = {};
const context = "users PG Repository";

usersPGRepository.createNewClient = async (body) => {
  try {
    logger.info(`[${context}]: Inserting new client in db`);
    ObjLog.log(`[${context}]: Inserting new client in db`);

    await poolSM.query("SET SCHEMA 'sec_cust'");
    const resp =
      await poolSM.query(`SELECT * FROM sec_cust.SP_MS_SIXMAP_USERS_INSERT_NEW(
        '${body.first_name}',
        '${body.second_name}',
        '${body.last_name}',
        '${body.second_last_name}',
        '${body.email_user}',
        '${body.password}',
        '${body.main_phone}',
        '${body.main_phone_code}',
        '${body.main_phone_full}',
        ${body.ok_legal_terms},
        ${body.id_resid_country}, 
        ${body.slug ? `'${body.slug}'` : null},
        '${body.referral_node}'
        )
      ;`);

      console.log('SALI DE LA QUERY ')

    if (resp && resp.rows && resp.rows[0].sp_ms_sixmap_users_insert_new) {
      if (resp.rows[0].sp_ms_sixmap_users_insert_new.includes('CR')) {
        await mailSender.sendWelcomeMail({
          email_user: body.email_user,
          first_name: body.first_name,
          last_name: body.last_name
        });
      }

      return resp.rows[0].sp_ms_sixmap_users_insert_new;
    }
  } catch (error) {
    throw error;
  }
};

usersPGRepository.approveLevelCero = async (id) => {
  try {
    logger.info(`[${context}]: Approving level cero on db`);
    ObjLog.log(`[${context}]: Approving level cero on db`);

    await poolSM.query("SET SCHEMA 'sec_cust'");
    const resp = await poolSM.query(
      `SELECT * FROM SP_APPROVE_LEVEL_CERO('${id}')`
    );
    return resp.rows;
  } catch (error) {
    throw error;
  }
};

usersPGRepository.getUUIDProfileByNameClient = async (name) => {
  try {
    logger.info(`[${context}]: Getting users from db`);
    ObjLog.log(`[${context}]: Getting users from db`);
    await poolSM.query("SET SCHEMA 'sec_cust'");
    const resp = await poolSM.query(
      `SELECT * FROM sec_cust.get_uuid_profile_by_name('${name}')`
    );
    if (resp.rows[0]) return resp.rows[0].uuid_profile;
    else return null;
  } catch (error) {
    throw error;
  }
};

usersPGRepository.getIdServiceByNameClient = async (name) => {
  try {
    logger.info(`[${context}]: Getting users from db`);
    ObjLog.log(`[${context}]: Getting users from db`);
    await poolSM.query("SET SCHEMA 'sec_emp'");
    const resp = await poolSM.query(
      `SELECT * FROM get_id_service_by_name('${name}')`
    );
    if (resp.rows[0]) return resp.rows[0].id_service;
    else return null;
  } catch (error) {
    throw error;
  }
};

usersPGRepository.getIdUTypeByNameClient = async (name) => {
  try {
    logger.info(`[${context}]: Getting users from db`);
    ObjLog.log(`[${context}]: Getting users from db`);
    await poolSM.query("SET SCHEMA 'sec_emp'");
    const resp = await poolSM.query(
      `SELECT * FROM get_id_utype_by_name('${name}')`
    );
    if (resp.rows[0]) return resp.rows[0].id_services_utype;
    else return null;
  } catch (error) {
    throw error;
  }
};

usersPGRepository.getIdDocTypeByNameClient = async (name) => {
  try {
    logger.info(`[${context}]: Getting users from db`);
    ObjLog.log(`[${context}]: Getting users from db`);
    await poolSM.query("SET SCHEMA 'sec_emp'");
    const resp = await poolSM.query(
      `SELECT * FROM get_id_doc_type_by_name('${name}')`
    );
    if (resp.rows[0]) return resp.rows[0].id_ident_doc_type;
    else return null;
  } catch (error) {
    throw error;
  }
};

usersPGRepository.getIdResidCountryByNameClient = async (name) => {
  try {
    logger.info(`[${context}]: Getting users from db`);
    ObjLog.log(`[${context}]: Getting users from db`);
    await poolSM.query("SET SCHEMA 'sec_cust'");
    const resp = await poolSM.query(
      `SELECT * FROM get_id_resid_country_by_name('${name}')`
    );
    if (resp.rows[0]) return resp.rows[0].id_country;
    else return null;
  } catch (error) {
    throw error;
  }
};

usersPGRepository.getIdNatCountryByNameClient = async (name) => {
  try {
    logger.info(`[${context}]: Getting users from db`);
    ObjLog.log(`[${context}]: Getting users from db`);
    await poolSM.query("SET SCHEMA 'sec_cust'");
    const resp = await poolSM.query(
      `SELECT * FROM get_id_ip_country_by_name('${name}')`
    );
    if (resp.rows[0]) return resp.rows[0].id_ip_country;
    else return null;
  } catch (error) {
    throw error;
  }
};

usersPGRepository.getIdVerifLevelByNameClient = async (name) => {
  try {
    logger.info(`[${context}]: Getting users from db`);
    ObjLog.log(`[${context}]: Getting users from db`);
    await poolSM.query("SET SCHEMA 'sec_cust'");
    const resp = await poolSM.query(
      `SELECT * FROM get_id_verif_level_by_name(${name})`
    );
    if (resp.rows[0]) return resp.rows[0].id_verif_level;
    else return null;
  } catch (error) {
    throw error;
  }
};

usersPGRepository.getIdDepartmentByNameClient = async (name) => {
  try {
    logger.info(`[${context}]: Getting users from db`);
    ObjLog.log(`[${context}]: Getting users from db`);
    await poolSM.query("SET SCHEMA 'sec_cust'");
    const resp = await poolSM.query(
      `SELECT * FROM get_id_department_by_name('${name}')`
    );
    if (resp.rows[0]) return resp.rows[0].id_dpt;
    else return null;
  } catch (error) {
    throw error;
  }
};

usersPGRepository.getIdDepartmentByNameEmployee = async (name) => {
  try {
    logger.info(`[${context}]: Getting users from db`);
    ObjLog.log(`[${context}]: Getting users from db`);
    await poolSM.query("SET SCHEMA 'sec_emp'");
    const resp = await poolSM.query(
      `SELECT * FROM get_id_department_by_name('${name}')`
    );
    if (resp.rows[0]) return resp.rows[0].id_dpt;
    else return null;
  } catch (error) {
    throw error;
  }
};

usersPGRepository.requestLevelOne1stQ = async (body) => {
  try {
    logger.info(`[${context}]: Requesting level one in db`);
    ObjLog.log(`[${context}]: Requesting level one in db`);
    logger.silly(body)
    await poolSM.query("SET SCHEMA 'sec_cust'");

console.log('REPO BODY: ', body)

    const resp = await poolSM.query(
      `SELECT * FROM SP_REQUEST_LEVEL_ONE_1st_Q(
        ${body.date_birth === null ? null : `'${body.date_birth}'`},
        ${body.state_name === null ? null : `'${body.state_name}'`},
        ${body.resid_city === null ? null : `'${body.resid_city}'`},
        ${body.email_user === null ? null : `'${body.email_user}'`},
        ${body.id_ident_doc_type === null ? null : `'${body.id_ident_doc_type}'`},
        ${body.ident_doc_number === null ? null : `'${body.ident_doc_number}'`},
        ${body.occupation === null ? null : `'${body.occupation}'`},
        ${body.doc_path === null ? null : `'${body.doc_path}'`},
        ${body.selfie_path === null ? null : `'${body.selfie_path}'`},
        ${body.main_sn_platf === null ? null : `'${body.main_sn_platf}'`},
        ${body.user_main_sn_platf === null ? null : `'${body.user_main_sn_platf}'`},
        ${body.address === null ? null : `'${body.address}'`},
        ${body.gender === null ? null : `'${body.gender}'`},
        ${body.id_nationality_country === null ? null : `'${body.id_nationality_country}'`},
        ${body.main_phone === null ? null : `'${body.main_phone}'`},
        ${body.main_phone_code === null ? null : `'${body.main_phone_code}'`},
        ${body.main_phone_full === null ? null : `'${body.main_phone_full}'`},
        ${body.pol_exp_per},
        ${body.truthful_information},
        ${body.lawful_funds},
        ${body.legal_terms},
        ${body.new_password === null ? null : `'${body.new_password}'`},
        ${body.new_email === null ? null : `'${body.new_email}'`},
        ${body.id_resid_country === null ? null : `${body.id_resid_country}`}
        )`
    );
    if (resp.rows[0]) return resp.rows[0];
    else return null;
  } catch (error) {
    throw error;
  }
};

usersPGRepository.requestLevelOne2ndQ = async (body) => {
  try {
    logger.info(`[${context}]: Requesting level one in db`);
    ObjLog.log(`[${context}]: Requesting level one in db`);
    logger.silly(body)
    await poolSM.query("SET SCHEMA 'sec_cust'");

    console.log('REPO BODY: ', body)

    const resp = await poolSM.query(
      `SELECT * FROM SP_REQUEST_LEVEL_ONE_2nd_Q(
        ${body.date_birth === null ? null : `'${body.date_birth}'`},
        ${body.state_name === null ? null : `'${body.state_name}'`},
        ${body.resid_city === null ? null : `'${body.resid_city}'`},
        ${body.email_user === null ? null : `'${body.email_user}'`},
        ${body.id_country === null ? null : `'${body.id_country}'`},
        ${body.ident_doc_number === null ? null : `'${body.ident_doc_number}'`},
        ${body.occupation === null ? null : `'${body.occupation}'`},
        ${body.doc_path === null ? null : `'${body.doc_path}'`},
        ${body.selfie_path === null ? null : `'${body.selfie_path}'`},
        ${body.main_sn_platf === null ? null : `'${body.main_sn_platf}'`},
        ${body.user_main_sn_platf === null ? null : `'${body.user_main_sn_platf}'`},
        ${body.address === null ? null : `'${body.address}'`},
        ${body.gender === null ? null : `'${body.gender}'`},
        ${body.id_nationality_country === null ? null : `'${body.id_nationality_country}'`},
        ${body.main_phone === null ? null : `'${body.main_phone}'`},
        ${body.main_phone_code === null ? null : `'${body.main_phone_code}'`},
        ${body.main_phone_full === null ? null : `'${body.main_phone_full}'`},
        ${body.pol_exp_per},
        ${body.truthful_information},
        ${body.lawful_funds},
        ${body.legal_terms},
        ${body.new_password === null ? null : `'${body.new_password}'`},
        ${body.new_email === null ? null : `'${body.new_email}'`},
        ${body.id_resid_country === null ? null : `${body.id_resid_country}`}
        )`
    );
    if (resp.rows[0]) return resp.rows[0];
    else return null;
  } catch (error) {
    throw error;
  }
};

usersPGRepository.requestLevelOne3rdQ = async (body) => {
  try {
    logger.info(`[${context}]: Requesting level one in db`);
    ObjLog.log(`[${context}]: Requesting level one in db`);
    logger.silly(body)
    await poolSM.query("SET SCHEMA 'sec_cust'");
    const resp = await poolSM.query(
      `SELECT * FROM SP_REQUEST_LEVEL_ONE_3rd_Q(
        ${body.date_birth === null ? null : `'${body.date_birth}'`},
        ${body.state_name === null ? null : `'${body.state_name}'`},
        ${body.resid_city === null ? null : `'${body.resid_city}'`},
        ${body.email_user === null ? null : `'${body.email_user}'`},
        ${body.id_country === null ? null : `'${body.id_country}'`},
        ${body.ident_doc_number === null ? null : `'${body.ident_doc_number}'`},
        ${body.occupation === null ? null : `'${body.occupation}'`},
        ${body.doc_path === null ? null : `'${body.doc_path}'`},
        ${body.selfie_path === null ? null : `'${body.selfie_path}'`},
        ${body.main_sn_platf === null ? null : `'${body.main_sn_platf}'`},
        ${body.user_main_sn_platf === null ? null : `'${body.user_main_sn_platf}'`},
        ${body.address === null ? null : `'${body.address}'`},
        ${body.gender === null ? null : `'${body.gender}'`},
        ${body.id_nationality_country === null ? null : `'${body.id_nationality_country}'`},
        ${body.main_phone === null ? null : `'${body.main_phone}'`},
        ${body.main_phone_code === null ? null : `'${body.main_phone_code}'`},
        ${body.main_phone_full === null ? null : `'${body.main_phone_full}'`},
        ${body.pol_exp_per},
        ${body.truthful_information},
        ${body.lawful_funds},
        ${body.legal_terms},
        ${body.new_password === null ? null : `'${body.new_password}'`},
        ${body.new_email === null ? null : `'${body.new_email}'`},
        ${body.id_resid_country === null ? null : `${body.id_resid_country}`}
        )`
    );
    if (resp.rows[0]) return resp.rows[0];
    else return null;
  } catch (error) {
    throw error;
  }
};

usersPGRepository.generateCode = async (email_user, mode) => {
  try {
    logger.info(`[${context}]: Generating code in db`);
    ObjLog.log(`[${context}]: Generating code in db`);
    await poolSM.query("SET SCHEMA 'sec_cust'");
    const resp = await poolSM.query(
      `SELECT * FROM sp_generate_code('${email_user}','${mode}')`
    );
    return resp.rows[0].sp_generate_code;
  } catch (error) {
    throw error;
  }
};

usersPGRepository.verifCode = async (email_user, code) => {
  try {
    logger.info(`[${context}]: Verifying code in db`);
    ObjLog.log(`[${context}]: Verifying code in db`);
    await poolSM.query("SET SCHEMA 'sec_cust'");
    const resp = await poolSM.query(
      `SELECT * FROM sp_verif_code('${email_user}',${code})`
    );
    return resp.rows[0].sp_verif_code;
  } catch (error) {
    throw error;
  }
};

usersPGRepository.getLastPasswords = async (email_user) => {
  try {
    logger.info(`[${context}]: Getting passwords from db`);
    ObjLog.log(`[${context}]: Getting passwords from db`);
    await poolSM.query("SET SCHEMA 'sec_cust'");
    const resp = await poolSM.query(
      `SELECT * FROM SP_GET_LAST_PASSWORDS('${email_user}')`
    );
    return resp.rows;
  } catch (error) {
    throw error;
  }
};

usersPGRepository.newPassword = async (body) => {
  try {
    logger.info(`[${context}]: Updating password on db`);
    ObjLog.log(`[${context}]: Updating password on db`);
    await poolSM.query("SET SCHEMA 'sec_cust'");
    const resp = await poolSM.query(
      `SELECT * FROM SP_UPDATE_USER_PASSWORD('${body.new_password}','${body.email_user}')`
    );
    return resp.rows[0].sp_update_user_password;
  } catch (error) {
    throw error;
  }
};

usersPGRepository.getusersClientByEmail = async (email) => {
  try {
    logger.info(`[${context}]: Getting user from db`);
    ObjLog.log(`[${context}]: Getting user from db`);
    await poolSM.query("SET SCHEMA 'sec_cust'");
    const resp = await poolSM.query(
      `SELECT * FROM get_user_by_email(${email})`
    );
    return resp.rows;
  } catch (error) {
    throw error;
  }
};

usersPGRepository.getLevelQuestions = async () => {
  try {
    logger.info(`[${context}]: Getting questions from db`);
    ObjLog.log(`[${context}]: Getting questions from db`);
    await poolSM.query("SET SCHEMA 'sec_cust'");
    const resp = await poolSM.query(
      `SELECT * FROM v_level_questions_get_active()`
    );
    return resp.rows;
  } catch (error) {
    throw error;
  }
};

usersPGRepository.getLevelAnswers = async (id_resid_country) => {
  try {
    logger.info(`[${context}]: Getting answers from db`);
    ObjLog.log(`[${context}]: Getting answers from db`);
    await poolSM.query("SET SCHEMA 'sec_cust'");
    const resp = await poolSM.query(
      `SELECT * FROM v_level_answers_get_active(${id_resid_country})`
    );
    return resp.rows;
  } catch (error) {
    throw error;
  }
};

usersPGRepository.requestLevelTwo = async (body) => {
  try {
    logger.info(`[${context}]: Requesting level two in db`);
    ObjLog.log(`[${context}]: Requesting level two in db`);
    logger.silly(body)
    logger.silly(body.answers)

    await poolSM.query("SET SCHEMA 'sec_cust'");
    const resp = await poolSM.query(
      `SELECT * FROM SP_REQUEST_LEVEL_TWO(
        '${body.residency_proof_path}',
        '${body.job_title}',
        ${body.answers},
        '${body.email_user}'
        )`
    );
    if (resp.rows[0]) return resp.rows[0];
    else return null;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

usersPGRepository.getATCNumberByIdCountry = async (id) => {
  try {
    logger.info(`[${context}]: Looking for ATC Number in db`);
    ObjLog.log(`[${context}]: Looking for ATC Number in db`);
    await poolSM.query("SET SCHEMA 'msg_app'");
    const resp = await poolSM.query(
      `SELECT * FROM msg_app.get_atc_number_by_id_resid_country(
        ${id}
        )`
    );
    if (resp.rows[0]) return resp.rows[0].get_atc_number_by_id_resid_country;
    else return null;
  } catch (error) {
    throw error;
  }
};

usersPGRepository.verifyIdentUser = async (email_user, phone_number) => {
  try {
    logger.info(`[${context}]: Verifying ident user on db`);
    ObjLog.log(`[${context}]: Verifying ident user on db`);
    await poolSM.query("SET SCHEMA 'sec_cust'");
    const resp = await poolSM.query(
      `SELECT * FROM verif_ident_user(
        '${email_user}',
        '${phone_number}'
        )`
    );
    if (resp.rows[0]) return resp.rows[0].verif_ident_user;
    else return null;
  } catch (error) {
    throw error;
  }
};

usersPGRepository.verifyIdentUserExceptThemself = async (email_user, phone_number) => {
  try {
    logger.info(`[${context}]: Verifying ident user on db`);
    ObjLog.log(`[${context}]: Verifying ident user on db`);
    await poolSM.query("SET SCHEMA 'sec_cust'");
    const resp = await poolSM.query(
      `SELECT * FROM verif_ident_user_except_themself(
        '${phone_number}',
        '${email_user}'
        )`
    );
    if (resp.rows[0]) return resp.rows[0].verif_ident_user_except_themself;
    else return null;
  } catch (error) {
    throw error;
  }
};

usersPGRepository.deactivateUser = async (email_user) => {
  try {
    logger.info(`[${context}]: Deactivating user on db`);
    ObjLog.log(`[${context}]: Deactivating user on db`);
    await poolSM.query("SET SCHEMA 'sec_cust'");
    const resp = await poolSM.query(
      `SELECT * FROM SP_DEACTIVATE_USER('${email_user}')`
    );
    if (resp.rows[0]) return resp.rows[0].sp_deactivate_user;
    else return null;
  } catch (error) {
    throw error;
  }
};

usersPGRepository.getReferrals = async (cust_cr_cod_pub) => {
  try {
    logger.info(`[${context}]: Getting referrals from db`);
    ObjLog.log(`[${context}]: Getting referrals from db`);
    await poolSM.query("SET SCHEMA 'sec_cust'");
    const resp = await poolSM.query(
      `SELECT * FROM sp_get_referrals_by_user(
                                                '${cust_cr_cod_pub}'
                                              )`
    );
    return resp.rows[0].sp_get_referrals_by_user;
  } catch (error) {
    throw error;
  }
};

usersPGRepository.getReferralsOperations = async (email_user) => {
  try {
    logger.info(`[${context}]: Getting referrals from db`);
    ObjLog.log(`[${context}]: Getting referrals from db`);
    await poolSM.query("SET SCHEMA 'sec_cust'");
    const resp = await poolSM.query(
      `SELECT * FROM sp_get_referral_operations_by_user(
                                                '${email_user}'
                                              )`
    );
    return resp.rows[0].sp_get_referral_operations_by_user;
  } catch (error) {
    throw error;
  }
};

usersPGRepository.getReferralsByCountry = async (email_user) => {
  try {
    logger.info(`[${context}]: Getting referrals from db`);
    ObjLog.log(`[${context}]: Getting referrals from db`);
    await poolSM.query("SET SCHEMA 'sec_cust'");
    const resp = await poolSM.query(
      `SELECT * FROM sp_get_country_referrals_by_user(
                                                '${email_user}'
                                              )`
    );
    return resp.rows[0].sp_get_country_referrals_by_user;
  } catch (error) {
    throw error;
  }
};

usersPGRepository.getReferralsByStatus = async (email_user) => {
  try {
    logger.info(`[${context}]: Getting referrals from db`);
    ObjLog.log(`[${context}]: Getting referrals from db`);
    await poolSM.query("SET SCHEMA 'sec_cust'");
    const resp = await poolSM.query(
      `SELECT * FROM sp_get_status_referrals_by_user(
                                                '${email_user}'
                                              )`
    );
    return resp.rows[0].sp_get_status_referrals_by_user;
  } catch (error) {
    throw error;
  }
};

usersPGRepository.verifReferrallByCodPub = async (cust_cr_cod_pub) => {
  try {
    logger.info(`[${context}]: Verifying referrall cod pub on db`);
    ObjLog.log(`[${context}]: Verifying referrall cod pub on db`);
    await poolSM.query("SET SCHEMA 'sec_cust'");
    const resp = await poolSM.query(
      `SELECT * FROM sp_cod_pub_exists('${cust_cr_cod_pub}')`
    );
    if (resp.rows[0]) return resp.rows[0].sp_cod_pub_exists;
    else return null;
  } catch (error) {
    throw error;
  }
};

usersPGRepository.insertUserAccount = async (body,email_user) => {
  try {
    logger.info(`[${context}]: Inserting user account on db`);
    ObjLog.log(`[${context}]: Inserting user account on db`);

    await poolSM.query("SET SCHEMA 'sec_cust'");
    const resp = await poolSM.query(
      `SELECT * FROM sp_ms_user_accounts_insert(
                                                  ${email_user === null ? null : `'${email_user}'`},
                                                  ${body.owner_name === null ? null : `'${body.owner_name}'`},
                                                  ${body.owner_id === null ? null : `'${body.owner_id}'`},
                                                  ${body.account_id === null ? null : `'${body.account_id}'`},
                                                  ${body.account_type === null ? null : `'${body.account_type}'`},
                                                  ${body.phone_number === null ? null : `'${body.phone_number}'`},
                                                  ${body.email === null ? null : `'${body.email}'`},
                                                  ${body.id_doc_type}, 
                                                  ${body.id_bank}, 
                                                  ${body.id_pay_method}, 
                                                  ${body.id_optional_field}
                                                )`
    );
    if (resp.rows[0]) return resp.rows[0];
    else return null;
  } catch (error) {
    throw error;
  }
};

usersPGRepository.getUserAccounts = async (email_user) => {
  try {
    logger.info(`[${context}]: Getting user accounts from db`);
    ObjLog.log(`[${context}]: Getting user accounts from db`);
    await poolSM.query("SET SCHEMA 'sec_cust'");
    const resp = await poolSM.query(
      `SELECT * FROM sp_ms_user_accounts_get_all(
                                                  '${email_user}'
                                                )`
    );
    if (resp.rows) return resp.rows;
    else return null;
  } catch (error) {
    throw error;
  }
};

usersPGRepository.deleteUserAccount = async (email_user) => {
  try {
    logger.info(`[${context}]: Deleting user account on db`);
    ObjLog.log(`[${context}]: Deleting user account on db`);
    await poolSM.query("SET SCHEMA 'sec_cust'");
    const resp = await poolSM.query(
      `SELECT * FROM sp_ms_user_accounts_delete(
                                                  '${email_user}'
                                                )`
    );
    if (resp.rows[0]) return resp.rows[0].sp_ms_user_accounts_delete;
    else return null;
  } catch (error) {
    throw error;
  }
};

usersPGRepository.getMigratedInfo = async (id) => {
  try {
    logger.info(`[${context}]: Getting migrated info from db`);
    ObjLog.log(`[${context}]: Getting migrated info from db`);
    await poolSM.query("SET SCHEMA 'sec_cust'");
    const resp = await poolSM.query(
      `SELECT * FROM get_migrated_info_to_complete(
                                                  ${id}
                                                )`
    );
    if (resp.rows) return resp.rows[0].get_migrated_info_to_complete;
    else return null;
  } catch (error) {
    throw error;
  }
};

usersPGRepository.validateEmail = async (email) => {
  try {
    logger.info(`[${context}]: Validating email on db`);
    ObjLog.log(`[${context}]: Validating email on db`);
    await poolSM.query("SET SCHEMA 'sec_cust'");
    const resp = await poolSM.query(
      `SELECT * FROM validate_email(
                                      '${email}'
                                    )`
    );
    if (resp.rows[0]) return resp.rows[0].validate_email;
    else return null;
  } catch (error) {
    throw error;
  }
};

usersPGRepository.editPhone = async (uuid_user, main_phone, main_phone_code, main_phone_full) => {
  try {
    logger.info(`[${context}]: Editing phone on db`);
    ObjLog.log(`[${context}]: Editing phone on db`);
    await poolSM.query("SET SCHEMA 'sec_cust'");
    await poolSM.query(
      `SELECT * FROM sp_ms_phone_insert(
                                      '${uuid_user}',
                                      'main_phone',
                                      '${main_phone_code}',
                                      '${main_phone}',
                                      '${main_phone_full}',
                                      true,
                                      false,
                                      false,
                                      false,
                                      false
                                    )`
    );
  }
  catch (error) {
    throw error;
  }
}

usersPGRepository.editLevelOneInfo = async (body) => {
  try {
    logger.info(`[${context}]: Editing level one info on db`);
    ObjLog.log(`[${context}]: Editing level one info on db`);
    await poolSM.query("SET SCHEMA 'sec_cust'");
    await poolSM.query(
      `SELECT * FROM update_level_one_info(
        '${body.state_name}',
        '${body.resid_city}',
        '${body.email_user}',
        '${body.occupation}',
        '${body.address}'
      )`
    );
  } catch (error) {
    throw error;
  }
};  

usersPGRepository.saveExtraInfoThirdModal = async (idUser, industry, range) => {
  logger.info(`[${context}]: Saving extra info info on db`);
  ObjLog.log(`[${context}]: Saving extra info info on db`);
  await poolSM.query("SET SCHEMA 'sec_cust'");
  const resp = await poolSM.query({
    text: `
        select sec_cust.sp_create_user_extra_data_third_modal($1, $2, $3) as info;
    `,
    values: [idUser, industry, range]
  });
  return resp.rows[0].info
};  

export default usersPGRepository;
