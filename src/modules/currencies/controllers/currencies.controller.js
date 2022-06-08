import { logger } from "../../../utils/logger";
import ObjLog from "../../../utils/ObjLog";
import currenciesService from "../services/currencies.service";
import authenticationPGRepository from "../../authentication/repositories/authentication.pg.repository";
import {env,ENVIROMENTS} from '../../../utils/enviroment'

const currenciesController = {};
const context = "destiny Countries Controller";

// declaring log object
const logConst = {
  is_auth: null,
  success: true,
  failed: false,
  ip: null,
  country: null,
  route: null,
  session: null
};

currenciesController.getCurrenciesByCountry = async (req, res, next) => {
  try {
    // filling log object info
    let log  = logConst;

    log.is_auth = req.isAuthenticated()
    log.ip = req.connection.remoteAddress;
    log.route = req.method + ' ' + req.originalUrl;
    const resp = await authenticationPGRepository.getIpInfo(req.connection.remoteAddress);
    if (resp) log.country = resp.country_name ? resp.country_name : 'Probably Localhost';
    if (await authenticationPGRepository.getSessionById(req.sessionID)) log.session = req.sessionID;

    // protecting route in production but not in development
    if (!req.isAuthenticated() && env.ENVIROMENT === ENVIROMENTS.PRODUCTION){
      req.session.destroy();
      log.success = false;
      log.failed = true;
      await authenticationPGRepository.insertLogMsg(log);
      res.status(401).json({ message: "Unauthorized" });
    }else{
      // calling service
    logger.info(`[${context}]: Sending service to get currencies by Country`);
    ObjLog.log(`[${context}]: Sending service to get currencies by Country`);

    let finalResp = await currenciesService.getCurrenciesByCountry(req, res, next);

    if (finalResp) {
      //logging on DB
      log.success = finalResp.success
      log.failed = finalResp.failed
      await authenticationPGRepository.insertLogMsg(log);

      //sendind response to FE
      res.status(finalResp.status).json(finalResp.data);
    }
  }
  } catch (error) {
    next(error);
  }
};

export default currenciesController;
