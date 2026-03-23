import { logger } from "../../../utils/logger";
import ObjLog from "../../../utils/ObjLog";
import banksService from "../services/banks.service";
import authenticationPGRepository from "../../authentication/repositories/authentication.pg.repository";
import { env, ENVIROMENTS } from "../../../utils/enviroment";

const banksController = {};
const context = "banks Controller";

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

banksController.getBanks = async (req, res, next) => {
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
        `[${context}]: Sending service to get ${
          req.query.origin === "true" ? "origin" : "destiny"
        } banks`
      );
      ObjLog.log(
        `[${context}]: Sending service to get ${
          req.query.origin === "true" ? "origin" : "destiny"
        } banks`
      );

      let finalResp = await banksService.getBanks(req, res, next);

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

banksController.getBankById = async (req, res, next) => {
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
        `[${context}]: Sending service to get bank by Id ${req.params.bank_id}`
      );
      ObjLog.log(
        `[${context}]: Sending service to get bank by Id ${req.params.bank_id}`
      );

      let finalResp = await banksService.getBankById(req, res, next);

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

banksController.getBankAccountsById = async (req, res, next) => {
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
      logger.info(`[${context}]: Sending service to get bank accounts`);
      ObjLog.log(`[${context}]: Sending service to get bank accounts`);

      let finalResp = await banksService.getBankAccountsById(req, res, next);

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

banksController.getBankAccountById = async (req, res, next) => {
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
      logger.info(`[${context}]: Sending service to get bank account by id`);
      ObjLog.log(`[${context}]: Sending service to get bank account by id`);

      let finalResp = await banksService.getBankAccountById(req, res, next);

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

banksController.getBankAccountByPayMethod = async (req, res, next) => {
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
        `[${context}]: Sending service to get bank account by pay method`
      );
      ObjLog.log(
        `[${context}]: Sending service to get bank account by pay method`
      );

      let finalResp = await banksService.getBankAccountByPayMethod(
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

banksController.getBanksByPayMethod = async (req, res, next) => {
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
      logger.info(`[${context}]: Sending service to get banks by pay methods`);
      ObjLog.log(`[${context}]: Sending service to get banks by pay methods`);

      let finalResp = await banksService.getBanksByPayMethod(req, res, next);

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

export default banksController;
