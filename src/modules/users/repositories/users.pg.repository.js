import { poolSM } from "../../../db/pg.connection";
import { logger } from "../../../utils/logger";
import ObjLog from "../../../utils/ObjLog";

const usersPGRepository = {};
const context = "users PG Repository";

usersPGRepository.createUser = async (body) => {
  try {
    logger.info(`[${context}]: Inserting user in db`);
    ObjLog.log(`[${context}]: Inserting user in db`);

    await poolSM.query("SET SCHEMA 'sec_emp'");
    const resp =
      await poolSM.query(`SELECT * FROM sec_emp.SP_MS_SIXMAP_USERS_INSERT(
      '${body.first_name}',
      '${body.second_name}',
      '${body.last_name}',
      '${body.second_last_name}',
      '${body.username}',
      '${body.email_user}',
      '${body.password}',
      '${body.gender}',
      '${body.date_birth}',
      '${body.ident_doc_number}',
      '${body.main_phone}',
      '${body.main_phone_wha}',
      '${body.second_phone}',
      '${body.second_phone_wha}',
      '${body.delegated_phone}',
      '${body.delegated_phone_wha}',
      '${body.resid_city}',
      '${body.departments}',
      '${body.uuid_profile}',
      '${body.id_service}',
      '${body.id_services_utype}',
      '${body.id_ident_doc_type}', 
      '${body.id_resid_country}', 
      '${body.id_nationality_country}',
      '${body.main_phone_code}',
      '${body.main_phone_full}',
      '${body.second_phone_code}',
      '${body.second_phone_full}',
      '${body.delegated_phone_code}',
      '${body.delegated_phone_full}'
      );`);
    return resp.rows;
  } catch (error) {
    throw error;
  }
};

usersPGRepository.createUserClient = async (body) => {
  try {
    logger.info(`[${context}]: Inserting user client in db`);
    ObjLog.log(`[${context}]: Inserting user client in db`);

    console.log("SE ENVIA A LA BD: ", body);
    await poolSM.query("SET SCHEMA 'sec_cust'");
    const resp =
      await poolSM.query(`SELECT * FROM sec_cust.SP_MS_SIXMAP_USERS_INSERT(
      '${body.first_name}',
      '${body.second_name}',
      '${body.last_name}',
      '${body.second_last_name}',
      '${body.username}',
      '${body.email_user}',
      '${body.password}',
      '${body.cod_user_serv_public}',
      '${body.cod_rank}',
      '${body.verif_level_apb}',
      '${body.multi_country}',
      '${body.gender}',
      '${body.date_birth}',
      '${body.ident_doc_number}',
      '${body.main_phone}',
      '${body.main_phone_wha}',
      '${body.second_phone}',
      '${body.second_phone_wha}',
      '${body.delegated_phone}',
      '${body.delegated_phone_wha}',
      '${body.resid_city}',
      '${body.address}',
      '${body.referral_node}',
      '${body.main_sn_platf}',
      '${body.user_main_sn_platf}',
      '${body.ok_legal_terms}',
      '${body.date_legacy_reg}',
      '${body.departments}',
      '${body.uuid_profile}',
      '${body.id_service}',
      '${body.id_services_utype}',
      '${body.id_ident_doc_type}', 
      '${body.id_resid_country}', 
      '${body.id_nationality_country}',
      '${body.id_verif_level}',
      '${body.main_phone_code}',
      '${body.main_phone_full}',
      '${body.second_phone_code}',
      '${body.second_phone_full}',
      '${body.delegated_phone_code}',
      '${body.delegated_phone_full}')
      ;`);
    return resp.rows;
  } catch (error) {
    throw error;
  }
};

usersPGRepository.createNewClient = async (body) => {
  try {
    logger.info(`[${context}]: Inserting new client in db`);
    ObjLog.log(`[${context}]: Inserting new client in db`);

    console.log("SE ENVIA A LA BD: ", body);
    await poolSM.query("SET SCHEMA 'sec_cust'");
    const resp =
      await poolSM.query(`SELECT * FROM sec_cust.SP_MS_SIXMAP_USERS_INSERT_NEW(
      '${body.first_name}',
      '${body.second_name}',
      '${body.last_name}',
      '${body.second_last_name}',
      null,
      '${body.email_user}',
      '${body.password}',
      '${body.cust_cr_cod_pub}',
      '${body.cod_rank}',
      '${body.verif_level_apb}',
      '${body.multi_country}',
      '${body.gender}',
      null,
      null,
      '${body.main_phone}',
      '${body.main_phone_wha}',
      '${body.second_phone}',
      '${body.second_phone_wha}',
      '${body.delegated_phone}',
      '${body.delegated_phone_wha}',
      null,
      null,
      '${body.referral_node}',
      null,
      null,
      '${body.ok_legal_terms}',
      '${body.date_legacy_reg}',
      null,
      null,
      null,
      null,
      null, 
      '${body.id_resid_country}', 
      '${body.id_nationality_country}',
      null,
      '${body.main_phone_code}',
      '${body.main_phone_full}',
      '${body.second_phone_code}',
      '${body.second_phone_full}',
      '${body.delegated_phone_code}',
      '${body.delegated_phone_full}')
      ;`);
    console.log("resp: ", resp);
    return resp.rows;
  } catch (error) {
    throw error;
  }
};

usersPGRepository.getUsers = async () => {
  try {
    logger.info(`[${context}]: Getting users from db`);
    ObjLog.log(`[${context}]: Getting users from db`);
    await poolSM.query("SET SCHEMA 'sec_emp'");
    const resp = await poolSM.query(
      `SELECT * FROM sp_ms_sixmap_users_get_all()`
    );
    return resp.rows;
  } catch (error) {
    throw error;
  }
};

usersPGRepository.getusersClient = async () => {
  try {
    logger.info(`[${context}]: Getting users from db`);
    ObjLog.log(`[${context}]: Getting users from db`);
    await poolSM.query("SET SCHEMA 'sec_cust'");
    const resp = await poolSM.query(
      `SELECT * FROM sp_ms_sixmap_users_get_all()`
    );
    return resp.rows;
  } catch (error) {
    throw error;
  }
};

usersPGRepository.updateUserClient = async (cols, vals, uuid) => {
  try {
    logger.info(`[${context}]: Updating user on db`);
    ObjLog.log(`[${context}]: Updating user on db`);
    console.log("COLS: ", cols);
    console.log("VALS: ", vals);
    await poolSM.query("SET SCHEMA 'sec_cust'");
    const resp = await poolSM.query(
      `SELECT * FROM sp_ms_sixmap_users_update(
      ($1),
      ($2),
      ($3)
    )
    `,
      [cols, vals, uuid]
    );
    return resp.rows;
  } catch (error) {
    throw error;
  }
};

usersPGRepository.updateUserEmployee = async (cols, vals, uuid) => {
  try {
    logger.info(`[${context}]: Updating user on db`);
    ObjLog.log(`[${context}]: Updating user on db`);
    await poolSM.query("SET SCHEMA 'sec_emp'");
    const resp = await poolSM.query(
      `SELECT * FROM sp_ms_sixmap_users_update(
      ($1),
      ($2),
      ($3)
    )
    `,
      [cols, vals, uuid]
    );
    return resp.rows;
  } catch (error) {
    throw error;
  }
};

usersPGRepository.blockClient = async (uuid) => {
  try {
    logger.info(`[${context}]: Blocking user on db`);
    ObjLog.log(`[${context}]: Blocking user on db`);
    let cols = ["user_active", "user_blocked"];
    let vals = [false, true];
    await poolSM.query("SET SCHEMA 'sec_cust'");
    const resp = await poolSM.query(
      `SELECT * FROM sp_ms_sixmap_users_update(
      ($1),
      ($2),
      ($3)
    )
    `,
      [cols, vals, uuid]
    );
    return resp.rows;
  } catch (error) {
    throw error;
  }
};

usersPGRepository.blockEmployee = async (uuid) => {
  try {
    logger.info(`[${context}]: Blocking user on db`);
    ObjLog.log(`[${context}]: Blocking user on db`);
    let cols = ["user_active", "user_blocked"];
    let vals = [false, true];
    await poolSM.query("SET SCHEMA 'sec_emp'");
    const resp = await poolSM.query(
      `SELECT * FROM sp_ms_sixmap_users_update(
      ($1),
      ($2),
      ($3)
    )
    `,
      [cols, vals, uuid]
    );
    return resp.rows;
  } catch (error) {
    throw error;
  }
};

usersPGRepository.unblockClient = async (uuid) => {
  try {
    logger.info(`[${context}]: unblocking user on db`);
    ObjLog.log(`[${context}]: unblocking user on db`);
    let cols = ["user_active", "user_blocked"];
    let vals = [true, false];
    await poolSM.query("SET SCHEMA 'sec_cust'");
    const resp = await poolSM.query(
      `SELECT * FROM sp_ms_sixmap_users_update(
      ($1),
      ($2),
      ($3)
    )
    `,
      [cols, vals, uuid]
    );
    return resp.rows;
  } catch (error) {
    throw error;
  }
};

usersPGRepository.unblockEmployee = async (uuid) => {
  try {
    logger.info(`[${context}]: unblocking user on db`);
    ObjLog.log(`[${context}]: unblocking user on db`);
    let cols = ["user_active", "user_blocked"];
    let vals = [true, false];
    await poolSM.query("SET SCHEMA 'sec_emp'");
    const resp = await poolSM.query(
      `SELECT * FROM sp_ms_sixmap_users_update(
      ($1),
      ($2),
      ($3)
    )
    `,
      [cols, vals, uuid]
    );
    return resp.rows;
  } catch (error) {
    throw error;
  }
};

usersPGRepository.getusersClientById = async (id) => {
  try {
    logger.info(`[${context}]: Getting users from db`);
    ObjLog.log(`[${context}]: Getting users from db`);
    await poolSM.query("SET SCHEMA 'sec_cust'");
    const resp = await poolSM.query(`SELECT * FROM get_user_by_id(${id})`);
    return resp.rows;
  } catch (error) {
    throw error;
  }
};

usersPGRepository.getusersEmployeeById = async (id) => {
  try {
    logger.info(`[${context}]: Getting users from db`);
    ObjLog.log(`[${context}]: Getting users from db`);
    await poolSM.query("SET SCHEMA 'sec_emp'");
    const resp = await poolSM.query(`SELECT * FROM get_user_by_id(${id})`);
    return resp.rows;
  } catch (error) {
    throw error;
  }
};

usersPGRepository.getEmployeePhonesById = async (id) => {
  try {
    logger.info(`[${context}]: Getting phones from db`);
    ObjLog.log(`[${context}]: Getting phones from db`);
    await poolSM.query("SET SCHEMA 'sec_emp'");
    const resp = await poolSM.query(
      `SELECT * FROM get_phones_by_uuid_user(${id})`
    );
    return resp.rows;
  } catch (error) {
    throw error;
  }
};

usersPGRepository.getClientPhonesById = async (id) => {
  try {
    logger.info(`[${context}]: Getting phones from db`);
    ObjLog.log(`[${context}]: Getting phones from db`);
    await poolSM.query("SET SCHEMA 'sec_cust'");
    const resp = await poolSM.query(
      `SELECT * FROM get_phones_by_uuid_user(${id})`
    );
    return resp.rows;
  } catch (error) {
    throw error;
  }
};

usersPGRepository.getDepartmentsByUserId = async (id) => {
  try {
    logger.info(`[${context}]: Getting departments from db`);
    ObjLog.log(`[${context}]: Getting departments from db`);
    await poolSM.query("SET SCHEMA 'sec_emp'");
    const resp = await poolSM.query(
      `SELECT * FROM get_departments_by_uuid_user(${id})`
    );
    return resp.rows;
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
      `SELECT * FROM SP_APPROVE_LEVEL_CERO(${id})`
    );
    return resp.rows;
  } catch (error) {
    throw error;
  }
};

usersPGRepository.approveLevelOne = async (body) => {
  try {
    logger.info(`[${context}]: Approving level one on db`);
    ObjLog.log(`[${context}]: Approving level one on db`);
    await poolSM.query("SET SCHEMA 'sec_cust'");
    const resp = await poolSM.query(`SELECT * FROM SP_APPROVE_LEVEL_ONE(
                                                                      ${body.doc_approved},
                                                                      ${body.selfie_approved},
                                                                      ${body.date_birth_approved},
                                                                      ${body.state_name_approved},
                                                                      ${body.resid_city_approved},
                                                                      ${body.pol_exp_per_approved},
                                                                      ${body.id_doc_type_approved},
                                                                      ${body.doc_number_approved},
                                                                      ${body.occupation_approved},
                                                                      ${body.main_sn_platf_approved},
                                                                      ${body.user_main_sn_platf_approved},
                                                                      '${body.email_user}'
                                                                    )`);
    return resp.rows;
  } catch (error) {
    throw error;
  }
};

usersPGRepository.getUUIDProfileByNameEmployee = async (name) => {
  try {
    logger.info(`[${context}]: Getting users from db`);
    ObjLog.log(`[${context}]: Getting users from db`);
    await poolSM.query("SET SCHEMA 'sec_emp'");
    const resp = await poolSM.query(
      `SELECT * FROM get_uuid_profile_by_name('${name}')`
    );
    if (resp.rows[0]) return resp.rows[0].uuid_profile;
    else return null;
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

usersPGRepository.getIdServiceByNameEmployee = async (name) => {
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

usersPGRepository.getIdUTypeByNameEmployee = async (name) => {
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

usersPGRepository.getIdDocTypeByNameEmployee = async (name) => {
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

usersPGRepository.getIdResidCountryByNameEmployee = async (name) => {
  try {
    logger.info(`[${context}]: Getting users from db`);
    ObjLog.log(`[${context}]: Getting users from db`);
    await poolSM.query("SET SCHEMA 'sec_emp'");
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

usersPGRepository.getIdNatCountryByNameEmployee = async (name) => {
  try {
    logger.info(`[${context}]: Getting users from db`);
    ObjLog.log(`[${context}]: Getting users from db`);
    await poolSM.query("SET SCHEMA 'sec_emp'");
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
    await poolSM.query("SET SCHEMA 'sec_cust'");
    const resp = await poolSM.query(
      `SELECT * FROM SP_REQUEST_LEVEL_ONE_1st_Q(
        '${body.date_birth}',
        '${body.state_name}',
        '${body.resid_city}',
        '${body.pol_exp_per}',
        '${body.email_user}',
        '${body.id_ident_doc_type}',
        '${body.ident_doc_number}',
        '${body.occupation}',
        '${body.doc_path}',
        '${body.selfie_path}',
        '${body.main_sn_platf}',
        '${body.user_main_sn_platf}'
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
    await poolSM.query("SET SCHEMA 'sec_cust'");
    const resp = await poolSM.query(
      `SELECT * FROM SP_REQUEST_LEVEL_ONE_2nd_Q(
        '${body.date_birth}',
        '${body.state_name}',
        '${body.resid_city}',
        '${body.pol_exp_per}',
        '${body.email_user}',
        '${body.id_country}',
        '${body.ident_doc_number}',
        '${body.occupation}',
        '${body.doc_path}',
        '${body.selfie_path}',
        '${body.main_sn_platf}',
        '${body.user_main_sn_platf}'
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
    console.log("se pasa esto: ", body);
    await poolSM.query("SET SCHEMA 'sec_cust'");
    const resp = await poolSM.query(
      `SELECT * FROM SP_REQUEST_LEVEL_ONE_3rd_Q(
        '${body.date_birth}',
        '${body.state_name}',
        '${body.resid_city}',
        '${body.pol_exp_per}',
        '${body.email_user}',
        ${body.id_country},
        '${body.ident_doc_number}',
        '${body.occupation}',
        '${body.doc_path}',
        '${body.selfie_path}',
        '${body.main_sn_platf}',
        '${body.user_main_sn_platf}'
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
    console.log("BODY A PASAR A BD: ", body);
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

usersPGRepository.getLevelAnswers = async () => {
  try {
    logger.info(`[${context}]: Getting answers from db`);
    ObjLog.log(`[${context}]: Getting answers from db`);
    await poolSM.query("SET SCHEMA 'sec_cust'");
    const resp = await poolSM.query(
      `SELECT * FROM v_level_answers_get_active()`
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
    await poolSM.query("SET SCHEMA 'sec_cust'");
    console.log("en el repository: ", body.answers);
    const resp = await poolSM.query(
      `SELECT * FROM SP_REQUEST_LEVEL_TWO(
        '${body.funds_source}',
        '${body.residency_proof_path}',
        ${body.answers},
        '${body.email_user}'
        )`
    );
    if (resp.rows[0]) return resp.rows[0];
    else return null;
  } catch (error) {
    throw error;
  }
};

usersPGRepository.getATCNumberByIdCountry = async (id) => {
  try {
    logger.info(`[${context}]: Looking for ATC Number in db`);
    ObjLog.log(`[${context}]: Looking for ATC Number in db`);
    await poolSM.query("SET SCHEMA 'msg_app'");
    console.log("id", id);
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
    console.log('cust_cr_cod_pub: ',cust_cr_cod_pub)
    const resp = await poolSM.query(
      `SELECT * FROM sp_get_referrals_by_user(
                                                '${cust_cr_cod_pub}'
                                              )`
    );
    console.log('resp.rows[0].sp_get_referrals_by_user: ',resp.rows[0].sp_get_referrals_by_user)
    return resp.rows[0].sp_get_referrals_by_user;
  } catch (error) {
    throw error;
  }
};

export default usersPGRepository;
