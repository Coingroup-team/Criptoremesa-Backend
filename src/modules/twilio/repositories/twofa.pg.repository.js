import { poolSM } from "../../../db/pg.connection";
import { logger } from "../../../utils/logger";
import ObjLog from "../../../utils/ObjLog";

const twofaPGRepository = {};
const context = "TwoFA PG Repository";

/**
 * Get 2FA status by email_user
 */
twofaPGRepository.get2FAStatusByEmail = async (email_user) => {
  try {
    logger.info(`[${context}]: Getting 2FA status for ${email_user}`);
    ObjLog.log(`[${context}]: Getting 2FA status for ${email_user}`);

    await poolSM.query("SET SCHEMA 'sec_cust'");
    const resp = await poolSM.query(
      `SELECT * FROM sec_cust.get_2fa_status_by_email($1)`,
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
 * Save a pending factor (QR generated but not yet verified)
 */
twofaPGRepository.savePendingFactor = async (email_user, factorSid) => {
  try {
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
 * Get user credentials (password hash) for 2FA activation verification
 */
twofaPGRepository.getCredentialsByEmail = async (email_user) => {
  try {
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

export default twofaPGRepository;
