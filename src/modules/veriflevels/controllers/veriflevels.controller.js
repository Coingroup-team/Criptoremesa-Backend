import { logger } from "../../../utils/logger";
import ObjLog from "../../../utils/ObjLog";
import veriflevelsService from "../services/veriflevels.service";
import authenticationPGRepository from "../../authentication/repositories/authentication.pg.repository";
import { env, ENVIROMENTS } from "../../../utils/enviroment";

const veriflevelsController = {};
const context = "veriflevels Controller";
let sess = null;

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

veriflevelsController.requestWholesalePartner = async (req, res, next) => {
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
      logger.info(`[${context}]: Sending service to request Wholesale Partner`);
      ObjLog.log(`[${context}]: Sending service to request Wholesale Partner`);

      let finalResp = await veriflevelsService.requestWholesalePartner(
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

veriflevelsController.notifications = async (req, res, next) => {
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
      logger.info(`[${context}]: Sending service to get notifications`);
      ObjLog.log(`[${context}]: Sending service to get notifications`);

      let finalResp = await veriflevelsService.notifications(req, res, next);

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

veriflevelsController.deactivateNotification = async (req, res, next) => {
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
      logger.info(`[${context}]: Sending service to deactivate notification`);
      ObjLog.log(`[${context}]: Sending service to deactivate notification`);

      let finalResp = await veriflevelsService.deactivateNotification(
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

veriflevelsController.readNotification = async (req, res, next) => {
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
      logger.info(`[${context}]: Sending service to read notification`);
      ObjLog.log(`[${context}]: Sending service to read notification`);

      let finalResp = await veriflevelsService.readNotification(req, res, next);

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

veriflevelsController.getWholesalePartnerRequestsCountries = async (
  req,
  res,
  next
) => {
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
      logger.info(`[${context}]: Sending service to get countries`);
      ObjLog.log(`[${context}]: Sending service to get countries`);

      let finalResp =
        await veriflevelsService.getWholesalePartnerRequestsCountries(
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

veriflevelsController.getMigrationStatus = async (req, res, next) => {
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
      logger.info(`[${context}]: Sending service to get migration status`);
      ObjLog.log(`[${context}]: Sending service to get migration status`);

      let finalResp = await veriflevelsService.getMigrationStatus(
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

veriflevelsController.getDisapprovedVerifLevelsRequirements = async (
  req,
  res,
  next
) => {
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
        `[${context}]: Sending service to get Disapproved VerifLevels Requirements`
      );
      ObjLog.log(
        `[${context}]: Sending service to get Disapproved VerifLevels Requirements`
      );

      let finalResp =
        await veriflevelsService.getDisapprovedVerifLevelsRequirements(
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

veriflevelsController.getDisapprovedWholesalePartnersRequirements = async (
  req,
  res,
  next
) => {
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
        `[${context}]: Sending service to get Disapproved VerifLevels Requirements`
      );
      ObjLog.log(
        `[${context}]: Sending service to get Disapproved VerifLevels Requirements`
      );

      let finalResp =
        await veriflevelsService.getDisapprovedWholesalePartnersRequirements(
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

veriflevelsController.getLimitationsByCountry = async (req, res, next) => {
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
      logger.info(`[${context}]: Sending service to get Limitations`);
      ObjLog.log(`[${context}]: Sending service to get Limitations`);

      let finalResp = await veriflevelsService.getLimitationsByCountry(
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

veriflevelsController.getVerifLevelRequirements = async (req, res, next) => {
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
        `[${context}]: Sending service to get veriflevels requirements`
      );
      ObjLog.log(
        `[${context}]: Sending service to get veriflevels requirements`
      );

      let finalResp = await veriflevelsService.getVerifLevelRequirements(
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
        log.response = null;
        await authenticationPGRepository.insertLogMsg(log);

        logger.silly(log);

        //sendind response to FE
        res.status(finalResp.status).json(finalResp.data);
      }
    }
  } catch (error) {
    next(error);
  }
};

veriflevelsController.getWholesalePartnerRequestsRequirementsByEmail = async (
  req,
  res,
  next
) => {
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
        `[${context}]: Sending service to get WholesalePartner Requests requirements`
      );
      ObjLog.log(
        `[${context}]: Sending service to get WholesalePartner Requests requirements`
      );

      let finalResp =
        await veriflevelsService.getWholesalePartnerRequestsRequirementsByEmail(
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

const getEvaluatedStatus = (
  globalStatus,
  userStatus,
  verifications,
  manualReviewStatus
) => {
  if (manualReviewStatus) {
    return manualReviewStatus;
  } else if (userStatus === "SUCCESS") {
    const hasAML = verifications.some((v) => v.verification_type === "AML");
    const hasPEP = verifications.some((v) => v.verification_type === "PEP");
    const hasMisconduct = verifications.some(
      (v) => v.verification_type === "MISCONDUCT"
    );

    if (!hasAML || !hasPEP || !hasMisconduct) {
      return "PENDING";
    }
    return "SUCCESS";
  } else if (
    globalStatus === "SUCCESS" &&
    (userStatus === "MANUAL_REVIEW" || userStatus === "BLOCKED")
  ) {
    return "PENDING";
  } else if (globalStatus === "SUCCESS") {
    return "SUCCESS";
  } else if (
    globalStatus === "ERROR" ||
    globalStatus === "VERIFICATION_ERROR" ||
    (userStatus === "ERROR" && globalStatus === "SUCCESS")
  ) {
    return "ERROR";
  } else {
    return "PENDING";
  }
};

veriflevelsController.levelOneVerfificationSilt = async (req, res, next) => {
  try {
    const dateBirth = req.body.user.birth_date;
    const emailUser =
      req.body.user_meta?.email_user ||
      req.body.user.company_app_meta?.email_user;
    const selfie = req.body.user.selfie ? req.body.user.selfie.file_url : "";
    const gender = req.body.user.sex;
    const nationalityCountry = req.body.user.nationality;
    const siltID = req.body.user.id;
    const siltStatus = getEvaluatedStatus(
      req.body.status,
      req.body.user.status,
      req.body.user.verifications,
      req.body.manual_review_status
    );
    console.log(req.body);

    let docType;
    let countryDoc;
    let identDocNumber;
    let docPath;
    let personalNumber = null;
    let expiryDate = null;
    let documentAddress = null;

    if (req.body.user.national_id) {
      docType = 1;
      countryDoc = req.body.user.national_id.country;
      identDocNumber = req.body.user.national_id.document_number;
      docPath =
        req.body.user.national_id.files &&
        req.body.user.national_id.files.length > 0
          ? req.body.user.national_id.files[0].file_url
          : "";

      // Extract additional SILT document data
      personalNumber =
        req.body.user.national_id.personal_number ||
        req.body.user.national_id.personal_id ||
        null;
      expiryDate =
        req.body.user.national_id.expiry_date ||
        req.body.user.national_id.date_of_expiry ||
        req.body.user.national_id.expiration_date ||
        null;
      documentAddress =
        req.body.user.national_id.address +
          " " +
          req.body.user.national_id.province +
          " " +
          req.body.user.national_id.city ||
        req.body.user.address +
          " " +
          req.body.user.province +
          " " +
          req.body.user.city ||
        null;
    } else if (req.body.user.passport) {
      docType = 2;
      countryDoc = req.body.user.passport.country;
      identDocNumber = req.body.user.passport.document_number;
      docPath =
        req.body.user.passport.files && req.body.user.passport.files.length > 0
          ? req.body.user.passport.files[0].file_url
          : "";

      // Extract additional SILT document data
      personalNumber =
        req.body.user.passport.personal_number ||
        req.body.user.passport.personal_id ||
        null;
      expiryDate =
        req.body.user.passport.expiry_date ||
        req.body.user.passport.date_of_expiry ||
        req.body.user.passport.expiration_date ||
        null;
      documentAddress =
        req.body.user.passport.address +
          " " +
          req.body.user.passport.province +
          " " +
          req.body.user.passport.city ||
        req.body.user.address +
          " " +
          req.body.user.province +
          " " +
          req.body.user.city ||
        null;
    } else if (req.body.user.driving_license) {
      docType = 3;
      countryDoc = req.body.user.driving_license.country;
      identDocNumber = req.body.user.driving_license.document_number;
      docPath =
        req.body.user.driving_license.files &&
        req.body.user.driving_license.files.length > 0
          ? req.body.user.driving_license.files[0].file_url
          : "";

      // Extract additional SILT document data
      personalNumber =
        req.body.user.driving_license.personal_number ||
        req.body.user.driving_license.personal_id ||
        null;
      expiryDate =
        req.body.user.driving_license.expiry_date ||
        req.body.user.driving_license.date_of_expiry ||
        req.body.user.driving_license.expiration_date ||
        null;
      documentAddress =
        req.body.user.driving_license.address +
          " " +
          req.body.user.driving_license.province +
          " " +
          req.body.user.driving_license.city ||
        req.body.user.address +
          " " +
          req.body.user.province +
          " " +
          req.body.user.city ||
        null;
    }

    // if countryDoc is CHL and docType is 1 (national ID), format the identDocNumber to XXX.XXX.XXX-X
    if (countryDoc === "CHL" && docType === 1) {
      identDocNumber = identDocNumber.replace(
        /(\d{3})(\d{3})(\d{3})[-\s]*(\d)/,
        "$1.$2.$3-$4"
      );
    }

    logger.info(`[${context}]: Sending service to request level one SILT`);
    ObjLog.log(`[${context}]: Sending service to request level one SILT`);

    console.log(
      `Doc Country ${countryDoc} - nationality ${nationalityCountry}`
    );
    console.log(
      `Additional SILT data - Personal Number: ${personalNumber}, Expiry: ${expiryDate}, Address: ${documentAddress}`
    );
    console.log(
      `Document identification - Type: ${docType}, Number: ${identDocNumber}`
    );

    if (req.body.processing_attempt) {
      await veriflevelsService.levelOneVerfificationSiltEnhanced(
        dateBirth,
        emailUser,
        docType,
        countryDoc,
        identDocNumber,
        docPath,
        selfie,
        gender,
        nationalityCountry,
        siltID,
        siltStatus,
        req.body.manual_review_status,
        personalNumber,
        expiryDate,
        documentAddress,
        docType,
        identDocNumber
      );
    }

    res.status(200).send({
      message: "OK",
    });
  } catch (error) {
    next(error);
  }
};

veriflevelsController.getUserSiltDocumentData = async (req, res, next) => {
  try {
    logger.info(`[${context}]: Getting user SILT document data controller`);
    ObjLog.log(`[${context}]: Getting user SILT document data controller`);

    const resp = await veriflevelsService.getUserSiltDocumentData(
      req,
      res,
      next
    );

    res.status(resp.status).send(resp);
  } catch (error) {
    next(error);
  }
};

/**
 * PHASE 1: Create Persona inquiry and get session token
 * POST /veriflevels/persona/create-inquiry
 * Body: { email_user: string }
 * Returns: { inquiryId, sessionToken, status, isNewInquiry, verificationUrl }
 */
veriflevelsController.createPersonaInquiry = async (req, res, next) => {
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

    logger.info(`[${context}]: Creating Persona inquiry`);
    ObjLog.log(`[${context}]: Creating Persona inquiry`);

    let finalResp = await veriflevelsService.createPersonaInquiry(
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

      //sending response to FE
      res.status(finalResp.status).json(finalResp.data);
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Get Persona inquiry status
 * GET /veriflevels/persona/inquiry-status/:email_user
 */
veriflevelsController.getPersonaInquiryStatus = async (req, res, next) => {
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

    logger.info(`[${context}]: Getting Persona inquiry status`);
    ObjLog.log(`[${context}]: Getting Persona inquiry status`);

    let finalResp = await veriflevelsService.getPersonaInquiryStatus(
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

      //sending response to FE
      res.status(finalResp.status).json(finalResp.data);
    }
  } catch (error) {
    next(error);
  }
};

/**
 * PHASE 2: Persona webhook handler
 * POST /veriflevels/persona/webhook
 * This endpoint receives Persona inquiry webhooks and processes them asynchronously
 * Mirrors the SILT webhook pattern for consistency
 *
 * Maps Persona webhook events to internal status:
 * - inquiry.approved → SUCCESS
 * - inquiry.declined → ERROR
 * - inquiry.marked-for-review → PENDING (manual review needed)
 * - inquiry.completed (with needs_review) → PENDING
 */
veriflevelsController.levelOneVerificationPersona = async (req, res, next) => {
  try {
    logger.info(`[${context}]: Persona webhook received`);
    ObjLog.log(`[${context}]: Processing Persona webhook`);
    console.log("Persona webhook payload:", JSON.stringify(req.body, null, 2));

    // Extract data from Persona webhook payload
    const webhookData = req.body.data;
    const inquiryData = webhookData.attributes.payload.data;
    const inquiryAttributes = inquiryData.attributes;
    const inquiryFields = inquiryAttributes.fields;
    const includedData = webhookData.attributes.payload.included || [];

    // Get reference ID (user's email)
    const emailUser = inquiryAttributes["reference-id"];
    const personaInquiryId = inquiryData.id;

    // Map Persona status to internal status
    const personaStatus = inquiryAttributes.status; // approved, declined, needs_review
    let mappedStatus;

    switch (personaStatus) {
      case "approved":
        mappedStatus = "SUCCESS";
        break;
      case "declined":
        mappedStatus = "ERROR";
        break;
      case "needs_review":
      case "marked-for-review":
        mappedStatus = "PENDING";
        break;
      default:
        mappedStatus = "PENDING";
    }

    // Find the government ID document in included array (use the current one from relationships)
    const currentGovIdRef = inquiryFields.current_government_id?.value;
    const governmentIdDoc = includedData.find(
      (item) =>
        item.type === "document/government-id" &&
        (currentGovIdRef ? item.id === currentGovIdRef.id : true)
    );

    // Get document type from id-class in the document object
    const selectedIdClass =
      governmentIdDoc?.attributes?.["id-class"] ||
      inquiryFields["selected_id_class"]?.value;
    let docType;
    switch (selectedIdClass) {
      case "id":
      case "dl": // driver's license
        docType = selectedIdClass === "id" ? 1 : 3;
        break;
      case "pp": // passport
        docType = 2;
        break;
      default:
        docType = 1;
    }

    // Extract document data from the government ID document attributes
    const docAttributes = governmentIdDoc?.attributes || {};
    const birthdate = docAttributes.birthdate;
    const gender =
      docAttributes.sex === "Male"
        ? "M"
        : docAttributes.sex === "Female"
        ? "F"
        : null;

    // Get country codes - use issuing-authority field for document country
    const countryIsoCodeDoc =
      inquiryFields["selected_country_code"]?.value || "US";
    const nationalityCountryIsoCode =
      docAttributes.nationality ||
      inquiryFields["address_country_code"]?.value ||
      countryIsoCodeDoc;

    // Get document number from extracted data
    const identDocNumber =
      docAttributes["identification-number"] ||
      docAttributes["document-number"];

    // Get document paths (from relationships)
    const govIdData = inquiryData.relationships?.documents?.data?.find(
      (doc) => doc.type === "document/government-id"
    );
    const selfieData = inquiryData.relationships?.selfies?.data?.[0];

    const docPath = govIdData?.id ? `persona://document/${govIdData.id}` : "";
    const selfie = selfieData?.id ? `persona://selfie/${selfieData.id}` : "";

    // Extract enhanced document data from government ID document
    const personalNumber = docAttributes["identification-number"];
    const expiryDate = docAttributes["expiration-date"];

    // Construct address from document attributes
    const addressParts = [
      docAttributes["address-street-1"],
      docAttributes["address-street-2"],
      docAttributes["address-city"],
      docAttributes["address-subdivision"],
      docAttributes["address-postal-code"],
    ].filter(Boolean);
    const documentAddress =
      addressParts.length > 0 ? addressParts.join(" ") : null;

    // Get document type and number for enhanced data
    const documentType = selectedIdClass;
    const documentNumber = identDocNumber;

    // Manual review status
    const manualReviewStatus = inquiryAttributes["reviewer-comment"]
      ? true
      : false;

    logger.info(
      `[${context}]: Sending Persona webhook to service for processing`
    );
    console.log(
      `Persona data - Status: ${mappedStatus}, DocType: ${docType}, Country: ${countryIsoCodeDoc}`
    );
    console.log(
      `Enhanced Persona data - Personal Number: ${personalNumber}, Expiry: ${expiryDate}, Address: ${documentAddress}`
    );

    // Process webhook asynchronously via service/queue
    await veriflevelsService.levelOneVerificationPersonaEnhanced({
      dateBirth: birthdate,
      emailUser,
      docType,
      countryIsoCodeDoc,
      identDocNumber,
      docPath,
      selfie,
      gender,
      nationalityCountryIsoCode,
      personaInquiryId,
      personaStatus: mappedStatus,
      manualReviewStatus,
      personalNumber,
      expiryDate,
      documentAddress,
      documentType,
      documentNumber,
    });

    // Respond immediately to Persona (webhook should return 200 quickly)
    res.status(200).send({
      message: "Persona webhook received and queued for processing",
    });
  } catch (error) {
    logger.error(
      `[${context}]: Error processing Persona webhook: ${error.message}`
    );
    logger.error(`[${context}]: Error stack: ${error.stack}`);

    // Still return 200 to Persona to avoid retries
    res.status(200).send({
      message: "Persona webhook received but encountered processing error",
      error: error.message,
    });

    next(error);
  }
};

export default veriflevelsController;
