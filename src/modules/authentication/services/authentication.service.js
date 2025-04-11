import { logger } from "../../../utils/logger";
import ObjLog from "../../../utils/ObjLog";
import authenticationPGRepository from "../repositories/authentication.pg.repository";
import auth from "../../../utils/auth";
import { env } from "../../../utils/enviroment";
import axios from "axios";

const authenticationService = {};
const context = "Authentication Service";

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

authenticationService.login = async (req, res, next) => {
  try {
    // filling log object info
    let log = logConst;

    log.is_auth = req.isAuthenticated();
    log.ip = req.header("Client-Ip");
    log.route = req.method + " " + req.originalUrl;
    
    /*
    const resp = await authenticationPGRepository.getIpInfo(
      req.header("Client-Ip")
    );
    */
    // const resp = null;/*await authenticationPGRepository.getIpInfo(
    //   req.header("Client-Ip")
    // );*/
    // if (resp)
    //   log.country = resp.country_name
    //     ? resp.country_name
    //     : "Probably Localhost";
    if (await authenticationPGRepository.getSessionById(req.sessionID))
      log.session = req.sessionID;

    log.params = req.params;
    log.query = req.query;
    log.body = req.body;

    

    // logger.info(`[${context}]: Verifying captcha`);
    // ObjLog.log(`[${context}]: Verifying captcha`);

    // if (!req.body.captcha) {
    //   log.success = false;
    //   log.failed = true;
    //   log.status = 500;
    //   log.response = {
    //     captchaSuccess: false,
    //     msg: "Ha ocurrido un error. Por favor completa el captcha",
    //   };
    //   await authenticationPGRepository.insertLogMsg(log);
    //   res.status(500).json({
    //     captchaSuccess: false,
    //     msg: "Ha ocurrido un error. Por favor completa el captcha",
    //   });
    // } else {
    //   // Secret key
    //   const secretKey = env.reCAPTCHA_SECRET_KEY;

    //   // Verify URL
    //   const verifyURL = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${
    //     req.body.captcha
    //   }&remoteip=${req.header("Client-Ip")}`;

    //   // Make a request to verifyURL
    //   const body = await axios.get(verifyURL);

    //   // If not successful
    //   if (body.data.success === false) {
    //     log.success = false;
    //     log.failed = true;
    //     log.status = 500;
    //     log.response = {
    //       captchaSuccess: false,
    //       msg: "Falló la verificación del Captcha",
    //     };
    //     await authenticationPGRepository.insertLogMsg(log);
    //     res
    //       .status(500)
    //       .json({
    //         captchaSuccess: false,
    //         msg: "Falló la verificación del Captcha",
    //       });
    //   } else {
        // If successful

        logger.info(`[${context}]: Sending module to verify`);
        ObjLog.log(`[${context}]: Sending module to verify`);

    auth.verify(req, res, next);
    await authenticationPGRepository.insertLogMsg(log);
    //   }
    // }
  } catch (error) {
    next(error);
  }
};

authenticationService.logout = async (req, res, next) => {
  try {
    logger.info(`[${context}]: Sending module to logout`);
    ObjLog.log(`[${context}]: Sending module to logout`);
    auth.logout(req, res, next);
  } catch (error) {
    next(error);
  }
};

authenticationService.protected = async (req, res, next) => {
  try {
    logger.info(`[${context}]: Protected`);
    ObjLog.log(`[${context}]: Protected`);
    let countryResp = null;
    let sess = null;
    if (req.isAuthenticated()) {
      const resp = authenticationPGRepository.getIpInfo(
        req.header("Client-Ip")
      );
      if (resp) countryResp = resp.country_name;
      if (await authenticationPGRepository.getSessionById(req.sessionID))
        sess = req.sessionID;

      const log = {
        is_auth: req.isAuthenticated(),
        success: true,
        failed: false,
        ip: req.header("Client-Ip"),
        country: countryResp,
        route: "/protected-route",
        session: sess,
      };
      authenticationPGRepository.insertLogMsg(log);

      res.status(200).json({ message: "nice" });
    } else {
      req.session.destroy();

      const resp = authenticationPGRepository.getIpInfo(
        req.header("Client-Ip")
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
        ip: req.header("Client-Ip"),
        country: countryResp,
        route: "/protected-route",
        session: sess,
      };
      authenticationPGRepository.insertLogMsg(log);

      res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    next(error);
  }
};

export default authenticationService;
