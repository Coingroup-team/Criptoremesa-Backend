import { poolSM } from "../../../db/pg.connection";
import { logger } from "../../../utils/logger";
import ObjLog from "../../../utils/ObjLog";

const twofaPGRepository = {};
const context = "TwoFA PG Repository";

// Emails are stored lowercased by the signup flow, but the FE may submit
// them with any casing. Normalize at the repository boundary so callers
// don't have to remember.
const norm = (email) => (email ? String(email).toLowerCase() : email);

/**
 * Get 2FA status by email_user
 */
twofaPGRepository.get2FAStatusByEmail = async (email_user) => {
  try {
    email_user = norm(email_user);
    logger.info(`[${context}]: Getting 2FA status for ${email_user}`);
    ObjLog.log(`[${context}]: Getting 2FA status for ${email_user}`);

    await poolSM.query("SET SCHEMA 'sec_cust'");
    const resp = await poolSM.query(
      `SELECT * FROM sec_cust.get_2fa_status_by_email($1)`,
      [email_user],
    );
    return resp.rows[0] || null;
  } catch (error) {
    // 42883 = undefined_function. The 2FA SPs were only deployed to
    // PRODUC-CG (Europe); LPRODUC-CG (Latam) doesn't use TOTP, so the
    // function is absent there. Don't fail the whole status response —
    // just report no 2FA so the caller can carry on with user_exists /
    // wrong_domain.
    if (error && error.code === "42883") {
      logger.warn(
        `[${context}]: get_2fa_status_by_email not in this DB, treating as no 2FA for ${email_user}`,
      );
      return null;
    }
    logger.error(`[${context}]: ${error.message}`);
    ObjLog.log(`[${context}]: ${error.message}`);
    throw error;
  }
};

/**
 * Save a pending factor (QR generated but not yet verified)
 */
twofaPGRepository.savePendingFactor = async (email_user, factorSid) => {
  try {
    email_user = norm(email_user);
    logger.info(`[${context}]: Saving pending 2FA factor for ${email_user}`);
    ObjLog.log(`[${context}]: Saving pending 2FA factor for ${email_user}`);

    await poolSM.query("SET SCHEMA 'sec_cust'");
    await poolSM.query(`SELECT sec_cust.sp_save_pending_2fa_factor($1, $2)`, [
      email_user,
      factorSid,
    ]);
  } catch (error) {
    logger.error(`[${context}]: ${error.message}`);
    ObjLog.log(`[${context}]: ${error.message}`);
    throw error;
  }
};

/**
 * Enable 2FA for a user
 */
twofaPGRepository.enable2FA = async (email_user, factorSid) => {
  try {
    email_user = norm(email_user);
    logger.info(`[${context}]: Enabling 2FA for ${email_user}`);
    ObjLog.log(`[${context}]: Enabling 2FA for ${email_user}`);

    await poolSM.query("SET SCHEMA 'sec_cust'");
    await poolSM.query(`SELECT sec_cust.sp_enable_2fa($1, $2)`, [
      email_user,
      factorSid,
    ]);
  } catch (error) {
    logger.error(`[${context}]: ${error.message}`);
    ObjLog.log(`[${context}]: ${error.message}`);
    throw error;
  }
};

/**
 * Disable 2FA for a user
 */
twofaPGRepository.disable2FA = async (email_user) => {
  try {
    email_user = norm(email_user);
    logger.info(`[${context}]: Disabling 2FA for ${email_user}`);
    ObjLog.log(`[${context}]: Disabling 2FA for ${email_user}`);

    await poolSM.query("SET SCHEMA 'sec_cust'");
    await poolSM.query(`SELECT sec_cust.sp_disable_2fa($1)`, [email_user]);
  } catch (error) {
    logger.error(`[${context}]: ${error.message}`);
    ObjLog.log(`[${context}]: ${error.message}`);
    throw error;
  }
};

/**
 * Look up the user's residence country ISO code by email, also reporting
 * whether the user exists in this region's database at all. The new
 * eu-south-2 deployment splits PRODUC-CG (Europe) and LPRODUC-CG (Latam)
 * into independent DBs, so a Latam user reaching app.bithonor.es is simply
 * not present here and the login flow must treat the request as invalid
 * credentials instead of opening a 2FA modal.
 *
 * Returns { exists: boolean, iso: string|null }.
 */
twofaPGRepository.getResidCountryByEmail = async (email_user) => {
  try {
    email_user = norm(email_user);
    await poolSM.query("SET SCHEMA 'sec_cust'");
    const resp = await poolSM.query(
      `SELECT iso_code_resid_country
       FROM sec_cust.get_all_users_by_email($1)
       LIMIT 1`,
      [email_user],
    );
    if (resp.rows.length === 0) {
      return { exists: false, iso: null };
    }
    return {
      exists: true,
      iso: resp.rows[0].iso_code_resid_country || null,
    };
  } catch (error) {
    logger.error(
      `[${context}]: getResidCountryByEmail: ${error.message}`,
    );
    ObjLog.log(`[${context}]: getResidCountryByEmail: ${error.message}`);
    throw error;
  }
};

/**
 * Get user credentials (password hash) for 2FA activation verification
 */
twofaPGRepository.getCredentialsByEmail = async (email_user) => {
  try {
    email_user = norm(email_user);
    logger.info(`[${context}]: Getting credentials for ${email_user}`);
    ObjLog.log(`[${context}]: Getting credentials for ${email_user}`);

    await poolSM.query("SET SCHEMA 'sec_cust'");
    const resp = await poolSM.query(
      `SELECT password, user_active, user_blocked
       FROM sec_cust.ms_sixmap_users
       WHERE email_user = $1 LIMIT 1`,
      [email_user],
    );
    return resp.rows[0] || null;
  } catch (error) {
    logger.error(`[${context}]: ${error.message}`);
    ObjLog.log(`[${context}]: ${error.message}`);
    throw error;
  }
};

/**
 * Fecha en la que el 2FA pasa a ser obligatorio.
 *
 * Vive en sec_cust.env_variables, la tabla de configuracion que ya existia.
 * Ojo: esa tabla no tiene clave primaria y arrastra filas duplicadas de otras
 * claves, por eso se lee con LIMIT 1.
 *
 * Para cambiarla:
 *   UPDATE sec_cust.env_variables SET value = 'AAAA-MM-DD'
 *    WHERE key = 'twofa_mandatory_date';
 */
twofaPGRepository.getMandatoryDate = async () => {
  try {
    await poolSM.query("SET SCHEMA 'sec_cust'");
    const resp = await poolSM.query(
      `SELECT value FROM sec_cust.env_variables WHERE key = $1 LIMIT 1`,
      ["twofa_mandatory_date"],
    );
    return resp.rows[0] ? resp.rows[0].value : null;
  } catch (error) {
    // Nunca hacemos fallar el login por no poder leer la configuracion.
    logger.error(`[${context}]: getMandatoryDate: ${error.message}`);
    return null;
  }
};

/**
 * Cambia la fecha en la que el 2FA pasa a ser obligatorio.
 *
 * sec_cust.env_variables no tiene clave primaria y arrastra filas duplicadas
 * de otras claves, asi que un UPDATE normal podria dejar dos valores
 * distintos para la misma clave. Por eso se borra y se inserta una sola fila,
 * dentro de una transaccion y tocando UNICAMENTE nuestra clave.
 */
twofaPGRepository.setMandatoryDate = async (value) => {
  const client = await poolSM.connect();
  try {
    await client.query("BEGIN");
    await client.query(`DELETE FROM sec_cust.env_variables WHERE key = $1`, [
      "twofa_mandatory_date",
    ]);
    await client.query(
      `INSERT INTO sec_cust.env_variables (key, value) VALUES ($1, $2)`,
      ["twofa_mandatory_date", value],
    );
    await client.query("COMMIT");
    logger.info(`[${context}]: mandatory_date actualizada a ${value}`);
    return value;
  } catch (error) {
    try {
      await client.query("ROLLBACK");
    } catch (_) {}
    logger.error(`[${context}]: setMandatoryDate: ${error.message}`);
    throw error;
  } finally {
    client.release();
  }
};

export default twofaPGRepository;
