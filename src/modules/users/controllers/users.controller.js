import { logger } from "../../../utils/logger";
import ObjLog from "../../../utils/ObjLog";
import usersService from "../services/users.service";
import authenticationPGRepository from "../../authentication/repositories/authentication.pg.repository";
import limitByIpPGRepository from "../../limit_by_ip/repositories/limit_by_ip.pg.repository";
import { env, ENVIROMENTS } from "../../../utils/enviroment";

const usersController = {};
const context = "users Controller";

// declaring log object
const logConst = {
  is_auth: null,
  success: true,
  failed: false,
  ip: null,
  country: null,
  route: null,
  session: null,
};

usersController.createNewClient = async (req, res, next) => {
  try {
    // filling log object info
    let log = logConst;

    log.is_auth = req.isAuthenticated();
    log.ip = req.header("Client-Ip");
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
    logger.info(`[${context}]: Sending service to create new Client`);
    ObjLog.log(`[${context}]: Sending service to create new Client`);

    let finalResp = await usersService.createNewClient(req, res, next);

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

usersController.approveLevelCero = async (req, res, next) => {
  try {
    // filling log object info
    let log = logConst;

    log.is_auth = req.isAuthenticated();
    log.ip = req.header("Client-Ip");
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
    logger.info(`[${context}]: Sending service to approve level zero`);
    ObjLog.log(`[${context}]: Sending service to approve level zero`);

    let finalResp = await usersService.approveLevelCero(req, res, next);

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

usersController.files = async (req, res, next) => {
  try {
    // filling log object info
    let log = logConst;

    log.is_auth = req.isAuthenticated();
    log.ip = req.header("Client-Ip");
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
      logger.info(`[${context}]: Sending service to download file`);
      ObjLog.log(`[${context}]: Sending service to download file`);

      let finalResp = await usersService.files(req, res, next);

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

usersController.requestLevelOne1stQ = async (req, res, next) => {
  try {
    // filling log object info
    let log = logConst;

    log.is_auth = req.isAuthenticated();
    log.ip = req.header("Client-Ip");
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
      log.body = null;
      log.status = 401;
      log.response = { message: "Unauthorized" };
      await authenticationPGRepository.insertLogMsg(log);
      res.status(401).json({ message: "Unauthorized" });
    } else {
      // calling service
      logger.info(`[${context}]: Sending service to request level one`);
      ObjLog.log(`[${context}]: Sending service to request level one`);

      let finalResp = await usersService.requestLevelOne1stQ(req, res, next);

      if (finalResp) {
        //logging on DB
        log.success = finalResp.success;
        log.failed = finalResp.failed;
        log.params = req.params;
        log.query = req.query;
        log.body = null;
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

usersController.requestLevelOne2ndQ = async (req, res, next) => {
  try {
    // filling log object info
    let log = logConst;

    log.is_auth = req.isAuthenticated();
    log.ip = req.header("Client-Ip");
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
      log.body = null;
      log.status = 401;
      log.response = { message: "Unauthorized" };
      await authenticationPGRepository.insertLogMsg(log);
      res.status(401).json({ message: "Unauthorized" });
    } else {
      // calling service
      logger.info(`[${context}]: Sending service to request level one`);
      ObjLog.log(`[${context}]: Sending service to request level one`);

      let finalResp = await usersService.requestLevelOne2ndQ(req, res, next);

      if (finalResp) {
        //logging on DB
        log.success = finalResp.success;
        log.failed = finalResp.failed;
        log.params = req.params;
        log.query = req.query;
        log.body = null;
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

usersController.requestLevelOne3rdQ = async (req, res, next) => {
  try {
    // filling log object info
    let log = logConst;

    log.is_auth = req.isAuthenticated();
    log.ip = req.header("Client-Ip");
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
      log.body = null;
      log.status = 401;
      log.response = { message: "Unauthorized" };
      await authenticationPGRepository.insertLogMsg(log);
      res.status(401).json({ message: "Unauthorized" });
    } else {
      // calling service
      logger.info(`[${context}]: Sending service to request level one`);
      ObjLog.log(`[${context}]: Sending service to request level one`);

      let finalResp = await usersService.requestLevelOne3rdQ(req, res, next);

      if (finalResp) {
        //logging on DB
        log.success = finalResp.success;
        log.failed = finalResp.failed;
        log.params = req.params;
        log.query = req.query;
        log.body = null;
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

usersController.requestLevelTwo = async (req, res, next) => {
  try {
    // filling log object info
    let log = logConst;

    log.is_auth = req.isAuthenticated();
    log.ip = req.header("Client-Ip");
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
      log.body = null;
      log.status = 401;
      log.response = { message: "Unauthorized" };
      await authenticationPGRepository.insertLogMsg(log);
      res.status(401).json({ message: "Unauthorized" });
    } else {
      // calling service
      logger.info(`[${context}]: Sending service to request level two`);
      ObjLog.log(`[${context}]: Sending service to request level two`);

      let finalResp = await usersService.requestLevelTwo(req, res, next);

      if (finalResp) {
        //logging on DB
        log.success = finalResp.success;
        log.failed = finalResp.failed;
        log.params = req.params;
        log.query = req.query;
        log.body = null;
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

usersController.forgotPassword = async (req, res, next) => {
  try {
    // filling log object info
    let log = logConst;

    log.is_auth = req.isAuthenticated();
    log.ip = req.header("Client-Ip");
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
    logger.info(`[${context}]: Sending service to verify email`);
    ObjLog.log(`[${context}]: Sending service to verify email`);

    let finalResp = await usersService.forgotPassword(req, res, next);

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

usersController.newPassword = async (req, res, next) => {
  try {
    // filling log object info
    let log = logConst;

    log.is_auth = req.isAuthenticated();
    log.ip = req.header("Client-Ip");
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
    logger.info(`[${context}]: Sending service to change password`);
    ObjLog.log(`[${context}]: Sending service to change password`);

    let finalResp = await usersService.newPassword(req, res, next);

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

usersController.sendVerificationCodeByEmail = async (req, res, next) => {
  try {
    // filling log object info
    let log = logConst;

    log.is_auth = req.isAuthenticated();
    log.ip = req.header("Client-Ip");
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
    logger.info(`[${context}]: Sending service to verify email`);
    ObjLog.log(`[${context}]: Sending service to verify email`);
    let finalResp;

    let verif = await limitByIpPGRepository.verifyRouteByIp(
      "/users/sendVerificationCodeByEmail",
      req.header("Client-Ip")
    );
    if (verif === "Requests limit by ip hasnt been reached")
      finalResp = await usersService.sendVerificationCodeByEmail(
        req,
        res,
        next
      );
    else res.status(400).json({ msg: verif });

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

usersController.sendSMS = async (req, res, next) => {
  try {
    // filling log object info
    let log = logConst;

    log.is_auth = req.isAuthenticated();
    log.ip = req.header("Client-Ip");
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
    logger.info(`[${context}]: Sending service to send SMS`);
    ObjLog.log(`[${context}]: Sending service to send SMS`);

    let finalResp = await usersService.sendSMS(req, res, next);

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

usersController.sendVerificationCodeByWhatsApp = async (req, res, next) => {
  try {
    // filling log object info
    let log = logConst;

    log.is_auth = req.isAuthenticated();
    log.ip = req.header("Client-Ip");
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
    logger.info(`[${context}]: Sending service to send SMS`);
    ObjLog.log(`[${context}]: Sending service to send SMS`);

    let finalResp = await usersService.sendVerificationCodeByWhatsApp(req, res, next);

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

usersController.sendVerificationCodeBySMS = async (req, res, next) => {
  try {
    // filling log object info
    let log = logConst;

    log.is_auth = req.isAuthenticated();
    log.ip = req.header("Client-Ip");
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
    logger.info(`[${context}]: Sending service to verify SMS`);
    ObjLog.log(`[${context}]: Sending service to verify SMS`);
    let finalResp;

    let verif = await limitByIpPGRepository.verifyRouteByIp(
      "/users/sendVerificationCodeBySMS",
      req.header("Client-Ip")
    );
    if (verif === "Requests limit by ip hasnt been reached")
      finalResp = await usersService.sendVerificationCodeBySMS(req, res, next);
    else res.status(400).json({ msg: verif });

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

usersController.getLevelQuestions = async (req, res, next) => {
  try {
    // filling log object info
    let log = logConst;

    log.is_auth = req.isAuthenticated();
    log.ip = req.header("Client-Ip");
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
      logger.info(`[${context}]: Sending service to get questions`);
      ObjLog.log(`[${context}]: Sending service to get questions`);

      let finalResp = await usersService.getLevelQuestions(req, res, next);

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

usersController.verifyIdentUser = async (req, res, next) => {
  try {
    // filling log object info
    let log = logConst;

    log.is_auth = req.isAuthenticated();
    log.ip = req.header("Client-Ip");
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
    logger.info(`[${context}]: Sending service to verify ident user`);
    ObjLog.log(`[${context}]: Sending service to verify ident user`);

    let finalResp = await usersService.verifyIdentUser(req, res, next);

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

usersController.deactivateUser = async (req, res, next) => {
  try {
    // filling log object info
    let log = logConst;

    log.is_auth = req.isAuthenticated();
    log.ip = req.header("Client-Ip");
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
      logger.info(`[${context}]: Sending service to deactivate user`);
      ObjLog.log(`[${context}]: Sending service to deactivate user`);

      let finalResp = await usersService.deactivateUser(req, res, next);

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

usersController.getReferrals = async (req, res, next) => {
  try {
    // filling log object info
    let log = logConst;

    log.is_auth = req.isAuthenticated();
    log.ip = req.header("Client-Ip");
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
      logger.info(`[${context}]: Sending service to get questions`);
      ObjLog.log(`[${context}]: Sending service to get questions`);

      let finalResp = await usersService.getReferrals(req, res, next);

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

usersController.getReferralsOperations = async (req, res, next) => {
  try {
    // filling log object info
    let log = logConst;

    log.is_auth = req.isAuthenticated();
    log.ip = req.header("Client-Ip");
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
      logger.info(`[${context}]: Sending service to get questions`);
      ObjLog.log(`[${context}]: Sending service to get questions`);

      let finalResp = await usersService.getReferralsOperations(req, res, next);

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

usersController.getReferralsByCountry = async (req, res, next) => {
  try {
    // filling log object info
    let log = logConst;

    log.is_auth = req.isAuthenticated();
    log.ip = req.header("Client-Ip");
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
      logger.info(`[${context}]: Sending service to get questions`);
      ObjLog.log(`[${context}]: Sending service to get questions`);

      let finalResp = await usersService.getReferralsByCountry(req, res, next);

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

usersController.getReferralsByStatus = async (req, res, next) => {
  try {
    // filling log object info
    let log = logConst;

    log.is_auth = req.isAuthenticated();
    log.ip = req.header("Client-Ip");
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
      logger.info(`[${context}]: Sending service to get questions`);
      ObjLog.log(`[${context}]: Sending service to get questions`);

      let finalResp = await usersService.getReferralsByStatus(req, res, next);

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

usersController.ambassadorRequest = async (req, res, next) => {
  try {
    // filling log object info
    let log = logConst;

    log.is_auth = req.isAuthenticated();
    log.ip = req.header("Client-Ip");
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
        `[${context}]: Sending service to send ambassador Request questions`
      );
      ObjLog.log(
        `[${context}]: Sending service to send ambassador Request questions`
      );

      let finalResp = await usersService.ambassadorRequest(req, res, next);

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

usersController.verifReferrallByCodPub = async (req, res, next) => {
  try {
    // filling log object info
    let log = logConst;

    log.is_auth = req.isAuthenticated();
    log.ip = req.header("Client-Ip");
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
    logger.info(`[${context}]: Sending service to verify referral`);
    ObjLog.log(`[${context}]: Sending service to verify referral`);

    let finalResp = await usersService.verifReferrallByCodPub(req, res, next);

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

usersController.insertUserAccount = async (req, res, next) => {
  try {
    // filling log object info
    let log = logConst;

    log.is_auth = req.isAuthenticated();
    log.ip = req.header("Client-Ip");
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
    logger.info(`[${context}]: Sending service to insert user account`);
    ObjLog.log(`[${context}]: Sending service to insert user account`);

    let finalResp = await usersService.insertUserAccount(req, res, next);

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

usersController.getUserAccounts = async (req, res, next) => {
  try {
    // filling log object info
    let log = logConst;

    log.is_auth = req.isAuthenticated();
    log.ip = req.header("Client-Ip");
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
    logger.info(`[${context}]: Sending service to get user accounts`);
    ObjLog.log(`[${context}]: Sending service to get user accounts`);

    let finalResp = await usersService.getUserAccounts(req, res, next);

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

usersController.deleteUserAccount = async (req, res, next) => {
  try {
    // filling log object info
    let log = logConst;

    log.is_auth = req.isAuthenticated();
    log.ip = req.header("Client-Ip");
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
    logger.info(`[${context}]: Sending service to get user accounts`);
    ObjLog.log(`[${context}]: Sending service to get user accounts`);

    let finalResp = await usersService.deleteUserAccount(req, res, next);

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

usersController.getFileName = async (req, res, next) => {
  try {
    // filling log object info
    let log = logConst;

    log.is_auth = req.isAuthenticated();
    log.ip = req.header("Client-Ip");
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
    logger.info(`[${context}]: Sending service to get file name`);
    ObjLog.log(`[${context}]: Sending service to get file name`);

    let finalResp = await usersService.getFileName(req, res, next);

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

usersController.getMigratedInfo = async (req, res, next) => {
  try {
    // filling log object info
    let log = logConst;

    log.is_auth = req.isAuthenticated();
    log.ip = req.header("Client-Ip");
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
    logger.info(`[${context}]: Sending service to get migrated info`);
    ObjLog.log(`[${context}]: Sending service to get migrated info`);

    let finalResp = await usersService.getMigratedInfo(req, res, next);

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

usersController.validateEmail = async (req, res, next) => {
  try {
    // filling log object info
    let log = logConst;

    log.is_auth = req.isAuthenticated();
    log.ip = req.header("Client-Ip");
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
    logger.info(`[${context}]: Sending service to validate email`);
    ObjLog.log(`[${context}]: Sending service to validate email`);

    let finalResp = await usersService.validateEmail(req, res, next);

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

usersController.validateCode = async (req, res, next) => {
  try {
    // filling log object info
    let log = logConst;

    log.is_auth = req.isAuthenticated();
    log.ip = req.header("Client-Ip");
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
    logger.info(`[${context}]: Sending service to validate email`);
    ObjLog.log(`[${context}]: Sending service to validate email`);

    let finalResp = await usersService.validateCode(req, res, next);

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

export default usersController;
