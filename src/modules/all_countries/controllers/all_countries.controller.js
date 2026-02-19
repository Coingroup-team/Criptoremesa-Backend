import { logger } from "../../../utils/logger";
import ObjLog from "../../../utils/ObjLog";
import all_countriesService from "../services/all_countries.service";
import authenticationPGRepository from "../../authentication/repositories/authentication.pg.repository";

const all_countriesController = {};
const context = "all_countries Controller";

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

all_countriesController.getall_countries = async (req, res, next) => {
  try {
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
    logger.info(`[${context}]: Sending service to get all_countries`);
    ObjLog.log(`[${context}]: Sending service to get all_countries`);

    let finalResp = await all_countriesService.getall_countries(req, res, next);

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

export default all_countriesController;
