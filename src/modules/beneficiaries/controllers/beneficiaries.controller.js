import { logger } from "../../../utils/logger";
import ObjLog from "../../../utils/ObjLog";
import beneficiariesService from "../services/beneficiaries.service";
import authenticationPGRepository from "../../authentication/repositories/authentication.pg.repository";
import { env, ENVIROMENTS } from "../../../utils/enviroment";

const beneficiariesController = {};
const context = "beneficiaries Controller";

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

beneficiariesController.getUserFrequentBeneficiaries = async (
  req,
  res,
  next
) => {
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

    // protecting route in production but not in development
    if (!req.isAuthenticated() && env.ENVIROMENT === ENVIROMENTS.PRODUCTION) {
      req.session.destroy();
      log.success = false;
      log.failed = true;
      log.params = req.params;
      log.query = req.query;
      log.body = req.body;
      log.status = 401;
      log.response = { message: "Unauthorized" };
      await authenticationPGRepository.insertLogMsg(log);
      res.status(401).json({ message: "Unauthorized" });
    } else {
      // calling service
      logger.info(
        `[${context}]: Sending service to get All ${req.query.email_user} frequent Beneficiaries`
      );
      ObjLog.log(
        `[${context}]: Sending service to get All ${req.query.email_user} frequent Beneficiaries`
      );

      let finalResp = await beneficiariesService.getUserFrequentBeneficiaries(
        req,
        res,
        next
      );

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
    }
  } catch (error) {
    next(error);
  }
};

beneficiariesController.createFrequentBeneficiary = async (req, res, next) => {
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

    // protecting route in production but not in development
    if (!req.isAuthenticated() && env.ENVIROMENT === ENVIROMENTS.PRODUCTION) {
      req.session.destroy();
      log.success = false;
      log.failed = true;
      log.params = req.params;
      log.query = req.query;
      log.body = req.body;
      log.status = 401;
      log.response = { message: "Unauthorized" };
      await authenticationPGRepository.insertLogMsg(log);
      res.status(401).json({ message: "Unauthorized" });
    } else {
      // calling service
      logger.info(
        `[${context}]: Sending service to insert ${req.body.email_user} frequent Beneficiary`
      );
      ObjLog.log(
        `[${context}]: Sending service to insert ${req.body.email_user} frequent Beneficiary`
      );

      let finalResp = await beneficiariesService.createFrequentBeneficiary(
        req,
        res,
        next
      );

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
    }
  } catch (error) {
    next(error);
  }
};

beneficiariesController.deleteFrequentBeneficiary = async (req, res, next) => {
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

    // protecting route in production but not in development
    if (!req.isAuthenticated() && env.ENVIROMENT === ENVIROMENTS.PRODUCTION) {
      req.session.destroy();
      log.success = false;
      log.failed = true;
      log.params = req.params;
      log.query = req.query;
      log.body = req.body;
      log.status = 401;
      log.response = { message: "Unauthorized" };
      await authenticationPGRepository.insertLogMsg(log);
      res.status(401).json({ message: "Unauthorized" });
    } else {
      // calling service
      logger.info(
        `[${context}]: Sending service to delete frequent Beneficiary`
      );
      ObjLog.log(
        `[${context}]: Sending service to delete frequent Beneficiary`
      );

      let finalResp = await beneficiariesService.deleteFrequentBeneficiary(
        req,
        res,
        next
      );

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
    }
  } catch (error) {
    next(error);
  }
};

beneficiariesController.updateFrequentBeneficiary = async (req, res, next) => {
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

    // protecting route in production but not in development
    if (!req.isAuthenticated() && env.ENVIROMENT === ENVIROMENTS.PRODUCTION) {
      req.session.destroy();
      log.success = false;
      log.failed = true;
      log.params = req.params;
      log.query = req.query;
      log.body = req.body;
      log.status = 401;
      log.response = { message: "Unauthorized" };
      await authenticationPGRepository.insertLogMsg(log);
      res.status(401).json({ message: "Unauthorized" });
    } else {
      // calling service
      logger.info(
        `[${context}]: Sending service to update frequent Beneficiary`
      );
      ObjLog.log(
        `[${context}]: Sending service to update frequent Beneficiary`
      );

      let finalResp = await beneficiariesService.updateFrequentBeneficiary(
        req,
        res,
        next
      );

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
    }
  } catch (error) {
    next(error);
  }
};

beneficiariesController.contactRequired = async (req, res, next) => {
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

    logger.info(
      `[${context}]: Sending service to get countries and currencies`
    );
    ObjLog.log(`[${context}]: Sending service to get countries that require beneficiaries contact`);

    let finalResp = await beneficiariesService.contactRequired(req, res, next);

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

export default beneficiariesController;
