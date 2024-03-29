import { poolSM } from "../../../db/pg.connection";
import { logger } from "../../../utils/logger";
import ObjLog from "../../../utils/ObjLog";

const chatPGRepository = {};
const context = "chat PG Repository";

chatPGRepository.sendMessage = async (body) => {
  try {
    logger.info(`[${context}]: Sending message to db`);
    ObjLog.log(`[${context}]: Sending message to db`);
    const resp = await poolSM.query(
      `SELECT * FROM msg_app.sp_app_msg_insert(${
        body.email_user ? `'${body.email_user}'` : null
      },
                                               null,
                                               $$${JSON.stringify(
                                                 body.message_body
                                               )}$$,
                                               ${
                                                 body.file
                                                   ? `'${body.file}'`
                                                   : null
                                               },
                                               '${body.msg_date}',
                                               ${body.is_sent},
                                               ${
                                                 body.uniq_id
                                                   ? `'${body.uniq_id}'`
                                                   : null
                                               },
                                               ${
                                                 body.time_zone
                                                   ? `'${body.time_zone}'`
                                                   : null
                                               }
                                               )`
    );
    return resp.rows;
  } catch (error) {
    throw error;
  }
};

chatPGRepository.getMessages = async (user_email) => {
  try {
    logger.info(`[${context}]: Getting messages from db`);
    ObjLog.log(`[${context}]: Getting messages from db`);
    const resp = await poolSM.query(
      `SELECT * FROM msg_app.sp_chat_msgs_get_by_email('${user_email}')`
    );
    return resp.rows[0].sp_chat_msgs_get_by_email;
  } catch (error) {
    throw error;
  }
};

chatPGRepository.getMessagesByUniqId = async (uniq_id) => {
  try {
    logger.info(`[${context}]: Getting messages from db`);
    ObjLog.log(`[${context}]: Getting messages from db`);
    const resp = await poolSM.query(
      `SELECT * FROM msg_app.sp_chat_msgs_get_by_uniq_id('${uniq_id}')`
    );
    return resp.rows[0].sp_chat_msgs_get_by_uniq_id;
  } catch (error) {
    throw error;
  }
};

export default chatPGRepository;
