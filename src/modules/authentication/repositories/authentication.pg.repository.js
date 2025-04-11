import { poolSM, poolCR } from "../../../db/pg.connection";
import { logger } from "../../../utils/logger";
import ObjLog from "../../../utils/ObjLog";

const authenticationPGRepository = {};
const context = "Authentication PG Repository";

authenticationPGRepository.getUserById = async (id) => {
  try {
    logger.info(`[${context}]: Getting user by id from db`);
    ObjLog.log(`[${context}]: Getting user by id from db`);
    await poolSM.query("SET SCHEMA 'sec_cust'");
    const resp = await poolSM.query(`SELECT * FROM get_user_by_id('${id}')`);
    return resp.rows[0];
  } catch (error) {
    throw error;
  }
};

authenticationPGRepository.loginFailed = async (email_user) => {
  try {
    logger.info(`[${context}]: Checking login failed in db`);
    ObjLog.log(`[${context}]: Checking login failed in db`);
    await poolSM.query("SET SCHEMA 'sec_cust'");
    const resp = await poolSM.query(
      `SELECT * FROM sp_login_failed('${email_user}')`
    );
    return resp.rows[0].sp_login_failed;
  } catch (error) {
    throw error;
  }
};

authenticationPGRepository.getUserByUsername = async (username) => {
  try {
    logger.info(`[${context}]: Getting user by username from db`);
    ObjLog.log(`[${context}]: Getting user by username from db`);
    await poolSM.query("SET SCHEMA 'sec_cust'");
    const resp = await poolSM.query(
      `SELECT * FROM get_user_by_username('${username}')`
    );
    return resp.rows[0];
  } catch (error) {
    throw error;
  }
};

authenticationPGRepository.getUserByEmail = async (email) => {
  try {
    logger.info(`[${context}]: Getting user by email from db`);
    ObjLog.log(`[${context}]: Getting user by email from db`);
    await poolSM.query("SET SCHEMA 'sec_cust'");
    const resp = await poolSM.query(
      `SELECT * FROM get_all_users_by_email('${email}')`
    );
    // console.log(resp.rows[0]);
    return resp.rows[0];
  } catch (error) {
    throw error;
  }
};

// IF YOU WANT TO INSERT A USER TEMPORALY

authenticationPGRepository.insert = async (body) => {
  try {
    logger.info(`[${context}]: Inserting in pg`);
    ObjLog.log(`[${context}]: Inserting in pg`);

    await poolSM.query("SET SCHEMA 'sec_cust'");
    await poolSM.query(
      `
      SELECT *
        FROM sec_cust.SP_MS_SIXMAP_USERS_INSERT_SIGNUP(
          '${body.first_name}',
          '${body.second_name}',
          '${body.last_name}',
          '${body.second_last_name}',
          '${body.username}',
          '${body.email_user}',
          '${body.password}',
          '${body.gender}',
          '${body.date_birth}',
          '${body._ident_doc_number}',
          '${body.main_phone}',
          '${body.main_phone_wha}',
          '${body.resid_city}',
          '{1,2}',
          (
            SELECT sec_cust.ms_doc_type.id_ident_doc_type
            FROM sec_cust.ms_doc_type
            LIMIT 1
        ), (
            SELECT sec_cust.ms_countries.id_country
            FROM sec_cust.ms_countries
            LIMIT 1
        ), (
            SELECT sec_cust.ms_ip_countries.id_ip_country
            FROM sec_cust.ms_ip_countries
            LIMIT 1
        )
    );
      `
    );
  } catch (error) {
    throw error;
  }
};

authenticationPGRepository.updateIPSession = async (sessionID, ip) => {
  try {
    logger.info(`[${context}]: Updating IP in pg`);
    ObjLog.log(`[${context}]: Updating IP in pg`);

    let ipInfo = {
      network: null,
      city_name: null,
      country_name: null,
      country_iso_code: null,
      time_zone: null,
    };
    await poolSM.query("SET SCHEMA 'sec_emp'");

    let resp = await poolSM.query(
      `SELECT *
    FROM get_ip_info('${ip}')`
    );

    if (resp.rows[0] === undefined) {
      ipInfo.network = "Probably localhost";
    } else {
      ipInfo.network = resp.rows[0].network;
      ipInfo.city_name = resp.rows[0].city_name;
      ipInfo.country_name = resp.rows[0].country_name;
      ipInfo.country_iso_code = resp.rows[0].country_iso_code;
      ipInfo.time_zone = resp.rows[0].time_zone;
    }

    let colsArray = [];
    let valsArray = [];
    colsArray.push("ip_current_con");
    colsArray.push("country_ip_current_con");

    valsArray.push(ip);
    valsArray.push(ipInfo.country_name);

    await poolSM.query("SET SCHEMA 'sec_cust'");

    resp = await poolCR.query(
      `
      SELECT *
      FROM basics.sp_session_obj_update(
        ($1),
        ($2),
        ($3),
        false
      )
      `,
      [colsArray, valsArray, sessionID]
    );
    return resp.rows;
  } catch (error) {
    throw error;
  }
};

authenticationPGRepository.updateIPUser = async (uuid_user, ip, sessionID) => {
  try {
    logger.info(`[${context}]: Updating IP in pg`);
    ObjLog.log(`[${context}]: Updating IP in pg`);

    let ipInfo = {
      network: null,
      city_name: null,
      country_name: null,
      country_iso_code: null,
      time_zone: null,
    };
    await poolSM.query("SET SCHEMA 'sec_emp'");

    logger.silly(`ip a pasar en get_ip_info(): ${ip}`);

    let resp = await poolSM.query(
      `SELECT *
    FROM get_ip_info('${ip}')`
    );

    // logger.silly(`pais de la ip ${resp.rows[0].country_name}`);

    if (resp.rows[0] === undefined) {
      ipInfo.network = "Probably localhost";
    } else {
      ipInfo.network = resp.rows[0].network;
      ipInfo.city_name = resp.rows[0].city_name;
      ipInfo.country_name = resp.rows[0].country_name;
      ipInfo.country_iso_code = resp.rows[0].country_iso_code;
      ipInfo.time_zone = resp.rows[0].time_zone;
    }

    let colsArray = [];
    let valsArray = [];
    colsArray.push("last_session_reg");
    colsArray.push("last_ip_reg");
    colsArray.push("last_ip_city_reg");

    valsArray.push(sessionID);
    valsArray.push(ip);
    valsArray.push(ipInfo.city_name);

    let userResp = await poolSM.query(`SELECT * FROM sec_cust.get_user_by_id('${uuid_user}')`);

    let fullUser = userResp.rows[0];

    //UPDATE USER
    await poolSM.query("SET SCHEMA 'sec_cust'");

    resp = await poolSM.query(
      `
      SELECT *
      FROM sec_cust.sp_ms_sixmap_users_update(
        ($1),
        ($2),
        ($3)
      )
      `,
      [colsArray, valsArray, fullUser.email_user]
    );
    //UPDATE SESSION

    colsArray = [];
    valsArray = [];

    colsArray.push("uuid_user");
    colsArray.push("first_name");
    colsArray.push("second_name");
    colsArray.push("last_name");
    colsArray.push("second_last_name");
    colsArray.push("username");
    colsArray.push("email_user");
    colsArray.push("last_session_reg");
    colsArray.push("last_ip_reg");
    colsArray.push("last_ip_city_reg");
    colsArray.push("date_last_conn");
    colsArray.push("gender");
    colsArray.push("date_birth");
    colsArray.push("ident_doc_number");
    colsArray.push("main_phone");
    colsArray.push("resid_city");
    colsArray.push("user_active");
    colsArray.push("user_blocked");
    colsArray.push("uuid_profile");
    colsArray.push("id_service");
    colsArray.push("id_services_utype");
    colsArray.push("id_ident_doc_type");
    colsArray.push("id_resid_country");
    colsArray.push("id_nationality_country");

    if (fullUser.uuid_profile === undefined) fullUser.uuid_profile = "null";

    valsArray.push(fullUser.id_user);
    valsArray.push(fullUser.first_name);
    valsArray.push(fullUser.second_name);
    valsArray.push(fullUser.last_name);
    valsArray.push(fullUser.second_last_name);
    valsArray.push(fullUser.username);
    valsArray.push(fullUser.email_user);
    valsArray.push(fullUser.last_session_reg);
    valsArray.push(fullUser.last_ip_reg);
    valsArray.push(fullUser.last_ip_city_reg);
    valsArray.push(fullUser.date_last_conn);
    valsArray.push(fullUser.gender);
    valsArray.push(fullUser.date_birth);
    valsArray.push(fullUser.ident_doc_number);
    valsArray.push(fullUser.main_phone);
    valsArray.push(fullUser.resid_city);
    valsArray.push(fullUser.user_active);
    valsArray.push(fullUser.user_blocked);
    valsArray.push(fullUser.uuid_profile);
    valsArray.push(fullUser.id_service);
    valsArray.push(fullUser.id_services_utype);
    valsArray.push(fullUser.id_ident_doc_type);
    valsArray.push(fullUser.id_resid_country);
    valsArray.push(fullUser.id_nationality_country);

    resp = await poolCR.query(
      `
      SELECT *
      FROM basics.sp_session_obj_update(
        ($1),
        ($2),
        ($3),
        true
      )
      `,
      [colsArray, valsArray, sessionID]
    );
    return resp.rows;
  } catch (error) {
    throw error;
  }
};

authenticationPGRepository.insertLogMsg = async (log) => {
  try {
    await poolSM.query("SET SCHEMA 'sec_cust'");
    if (typeof log.response === 'string' || typeof log.response === 'number' || typeof log.response === 'boolean')
      log.response = {response: log.response}
    else
      log.response = Object.assign({},log.response)
    let resp = await poolSM.query(`SELECT * FROM SP_LOGS_ACTIONS_OBJ_INSERT(
                                                                            ${log.is_auth},
                                                                            ${log.success},
                                                                            ${log.failed},
                                                                            '${log.ip}',
                                                                            '${log.country}',
                                                                            '${log.route}',
                                                                            ($1),
                                                                            ($2),
                                                                            ($3),
                                                                            ${log.status ? log.status : null},
                                                                            ($4),
                                                                            ${log.session ? `'${log.session}'` : null}
                                                                        )`,
                                                                        [
                                                                          log.params ? log.params : null,
                                                                          log.query ? log.query : null,
                                                                          log.body ? log.body : null,
                                                                          log.response ? log.response : null,
                                                                        ]                                                                        
                                  );

    return resp.rows[0];
  } catch (error) {
    throw error;
  }
};

authenticationPGRepository.getIpInfo = async (ip) => {
  try {
    logger.info(`[${context}]: Getting ipInfo from DB`);
    ObjLog.log(`[${context}]: Getting ipInfo from DB`);
    await poolSM.query("SET SCHEMA 'sec_emp'");

    let resp = await poolSM.query(
      `SELECT *
        FROM get_ip_info('${ip ? ip : '0.0.0.0'}')`
    );
    if (resp.rows[0] === undefined) return "Probably localhost";
    return resp.rows[0];
  } catch (error) {
    throw error;
  }
};

authenticationPGRepository.getSomeSession = async () => {
  try {
    logger.info(`[${context}]: Getting session from db`);
    ObjLog.log(`[${context}]: Getting session from db`);
    await poolSM.query("SET SCHEMA 'basics'");
    const resp = await poolSM.query(`SELECT * FROM get_some_session()`);
    return resp.rows[0];
  } catch (error) {
    throw error;
  }
};

authenticationPGRepository.getSessionById = async (id) => {
  try {
    logger.info(`[${context}]: Getting session from db`);
    ObjLog.log(`[${context}]: Getting session from db`);
    await poolSM.query("SET SCHEMA 'basics'");
    const resp = await poolCR.query(`SELECT * FROM basics.get_session_by_id('${id}')`);
    return resp.rows[0];
  } catch (error) {
    throw error;
  }
};

authenticationPGRepository.userHasAnActiveSession = async (email) => {
  try {
    logger.info(`[${context}]: Checking session on db`);
    ObjLog.log(`[${context}]: Checking session on db`);
    await poolSM.query("SET SCHEMA 'basics'");
    const resp = await poolCR.query(`SELECT * FROM basics.user_has_an_active_session('${email}')`);
    return resp.rows[0].user_has_an_active_session;
  } catch (error) {
    throw error;
  }
};

export default authenticationPGRepository;
