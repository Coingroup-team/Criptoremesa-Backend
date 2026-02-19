import { logger } from "../../../utils/logger";
import ObjLog from "../../../utils/ObjLog";
import transbankService from "../services/transbank.service";
import authenticationPGRepository from "../../authentication/repositories/authentication.pg.repository";
import { env, ENVIROMENTS } from "../../../utils/enviroment";

const transbankController = {};
const context = "transbank Controller";

// declaring log object
const logConst = {
  is_auth: null,
  success: true,
  failed: false,
  ip: null,
  country: null,
  route: null,
  session: null,
  client_info: null,
};

transbankController.getWebpayTransaction = async (req, res, next) => {
  try {
    console.log('CONTROLLER')
    // filling log object info
    let log = logConst;

    log.is_auth = req.isAuthenticated();
    log.ip = req.header("Client-Ip");
    log.client_info = req.header("Client-Info") || null;
    log.route = req.method + " " + req.originalUrl;
    const resp = await authenticationPGRepository.getIpInfo(
      req.header("Client-Ip")
    );
    if (resp)
      log.country = resp.country_name
        ? resp.country_name
        : "Probably Localhost";
    if (await authenticationPGRepository.getSessionById(req.sessionID))
      log.session = req.sessionID;

    // calling service
    logger.info(`[${context}]: Sending service to get Webpay Transaction`);
    ObjLog.log(`[${context}]: Sending service to get Webpay Transaction`);

    let finalResp = await transbankService.getWebpayTransaction(req, res, next);

    if (finalResp) {
      //logging on DB
      log.success = finalResp.success;
      log.failed = finalResp.failed;
      log.params = req.params;
      log.query = req.query;
      log.body = req.body;
      log.status = finalResp.status;
      log.response = finalResp.data;
      await authenticationPGRepository.insertLogMsg(log);

      //sendind response to FE
      res.status(finalResp.status).json(finalResp.data);
    }
  } catch (error) {
    next(error);
  }
};

transbankController.confirmWebpayTransaction = async (req, res, next) => {
  try {
    console.log('CONTROLLER')
    // filling log object info
    let log = logConst;

    log.is_auth = req.isAuthenticated();
    log.ip = req.header("Client-Ip");
    log.client_info = req.header("Client-Info") || null;
    log.route = req.method + " " + req.originalUrl;
    const resp = await authenticationPGRepository.getIpInfo(
      req.header("Client-Ip")
    );
    if (resp)
      log.country = resp.country_name
        ? resp.country_name
        : "Probably Localhost";
    if (await authenticationPGRepository.getSessionById(req.sessionID))
      log.session = req.sessionID;

    // calling service
    logger.info(`[${context}]: Sending service to confirm Webpay Transaction`);
    ObjLog.log(`[${context}]: Sending service to confirm Webpay Transaction`);

    let finalResp = await transbankService.confirmWebpayTransaction(req, res, next);

    if (finalResp) {
      //logging on DB
      log.success = finalResp.success;
      log.failed = finalResp.failed;
      log.params = req.params;
      log.query = req.query;
      log.body = req.body;
      log.status = finalResp.status;
      log.response = finalResp.data;
      await authenticationPGRepository.insertLogMsg(log);

      //sendind response to FE
      res.status(finalResp.status).json(finalResp.data);
    }
  } catch (error) {
    next(error);
  }
};

export default transbankController;