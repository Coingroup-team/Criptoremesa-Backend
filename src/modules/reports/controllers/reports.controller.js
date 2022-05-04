import { logger } from "../../../utils/logger";
import ObjLog from "../../../utils/ObjLog";
import reportsService from "../services/reports.service";
import authenticationPGRepository from "../../authentication/repositories/authentication.pg.repository";
import {env,ENVIROMENTS} from '../../../utils/enviroment'
const reportsController = {};
const context = "reports Controller";

let sess = null;

reportsController.reportAmountSentByBenef = async (req, res, next) => {
  try {
    if (!req.isAuthenticated() && env.ENVIROMENT === ENVIROMENTS.PRODUCTION){
      req.session.destroy();

      const resp = authenticationPGRepository.getIpInfo(
        req.connection.remoteAddress
      );
      let countryResp = null;
      sess = null;

      if (resp) countryResp = resp.country_name;

      if (await authenticationPGRepository.getSessionById(req.sessionID))
        sess = req.sessionID;

      const log = {
        is_auth: req.isAuthenticated(),
        success: false,
        failed: true,
        ip: req.connection.remoteAddress,
        country: countryResp,
        route: "/reports/users/:email_user/remittances/totalAmount",
        session: sess,
      };
      authenticationPGRepository.insertLogMsg(log);

      res.status(401).json({ message: "Unauthorized" });
    } else {
      logger.info(`[${context}]: Sending service to get report`);
      ObjLog.log(`[${context}]: Sending service to get report`);

      reportsService.reportAmountSentByBenef(req, res, next);
    }
  } catch (error) {
    next(error);
  }
};

reportsController.reportAmountSentByCurrency = async (req, res, next) => {
  try {
    if (!req.isAuthenticated() && env.ENVIROMENT === ENVIROMENTS.PRODUCTION){
      req.session.destroy();

      const resp = authenticationPGRepository.getIpInfo(
        req.connection.remoteAddress
      );
      let countryResp = null;
      sess = null;

      if (resp) countryResp = resp.country_name;

      if (await authenticationPGRepository.getSessionById(req.sessionID))
        sess = req.sessionID;

      const log = {
        is_auth: req.isAuthenticated(),
        success: false,
        failed: true,
        ip: req.connection.remoteAddress,
        country: countryResp,
        route: "/reports/users/:email_user/currencies/totalAmount",
        session: sess,
      };
      authenticationPGRepository.insertLogMsg(log);

      res.status(401).json({ message: "Unauthorized" });
    } else {
      logger.info(`[${context}]: Sending service to get report`);
      ObjLog.log(`[${context}]: Sending service to get report`);

      reportsService.reportAmountSentByCurrency(req, res, next);
    }
  } catch (error) {
    next(error);
  }
};

export default reportsController;
