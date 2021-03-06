import { logger } from "../../../utils/logger";
import ObjLog from "../../../utils/ObjLog";
import veriflevelsService from "../services/veriflevels.service";
import authenticationPGRepository from "../../authentication/repositories/authentication.pg.repository";
import {env,ENVIROMENTS} from '../../../utils/enviroment'
const veriflevelsController = {};
const context = "veriflevels Controller";
let sess = null;

//AUTENTICACION CON PASSPORT
veriflevelsController.getveriflevels = (req, res, next) => {
  try {
    logger.info(`[${context}]: Sending service to get veriflevels`);
    ObjLog.log(`[${context}]: Sending service to get veriflevels`);

    veriflevelsService.getveriflevels(req, res, next);
  } catch (error) {
    next(error);
  }
};

veriflevelsController.requestWholesalePartner = async (req, res, next) => {
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
        route: "/requestWholesalePartner",
        session: sess,
      };
      authenticationPGRepository.insertLogMsg(log);
  
      res.status(401).json({ message: "Unauthorized" });
    } else {
      logger.info(`[${context}]: Sending service to request Wholesale Partner`);
      ObjLog.log(`[${context}]: Sending service to request Wholesale Partner`);

      veriflevelsService.requestWholesalePartner(req, res, next);
    }
  } catch (error) {
    next(error);
  }
};

veriflevelsController.notifications = async (req, res, next) => {
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
        route: "/notifications",
        session: sess,
      };
      authenticationPGRepository.insertLogMsg(log);
  
      res.status(401).json({ message: "Unauthorized" });
    } else {
      logger.info(`[${context}]: Sending service to get notifications`);
      ObjLog.log(`[${context}]: Sending service to get notifications`);

      veriflevelsService.notifications(req, res, next);
    }
  } catch (error) {
    next(error);
  }
};

veriflevelsController.deactivateNotification = async (req, res, next) => {
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
        route: "/notifications",
        session: sess,
      };
      authenticationPGRepository.insertLogMsg(log);
  
      res.status(401).json({ message: "Unauthorized" });
    } else {
      logger.info(`[${context}]: Sending service to deactivate notification`);
      ObjLog.log(`[${context}]: Sending service to deactivate notification`);

      veriflevelsService.deactivateNotification(req, res, next);
    }
  } catch (error) {
    next(error);
  }
};

veriflevelsController.readNotification = async (req, res, next) => {
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
        route: "/notifications",
        session: sess,
      };
      authenticationPGRepository.insertLogMsg(log);
  
      res.status(401).json({ message: "Unauthorized" });
    } else {
      logger.info(`[${context}]: Sending service to read notification`);
      ObjLog.log(`[${context}]: Sending service to read notification`);

      veriflevelsService.readNotification(req, res, next);
    }
  } catch (error) {
    next(error);
  }
};

veriflevelsController.getWholesalePartnerRequestsCountries = async (req, res, next) => {
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
        route: "/getWholesalePartnerRequestsCountries",
        session: sess,
      };
      authenticationPGRepository.insertLogMsg(log);
  
      res.status(401).json({ message: "Unauthorized" });
    } else {
      logger.info(`[${context}]: Sending service to get countries`);
      ObjLog.log(`[${context}]: Sending service to get countries`);
      veriflevelsService.getWholesalePartnerRequestsCountries(req, res, next);
    }
  } catch (error) {
    next(error);
  }
};

veriflevelsController.getMigrationStatus = async (req, res, next) => {
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
        route: "/getMigrationStatus",
        session: sess,
      };
      authenticationPGRepository.insertLogMsg(log);
  
      res.status(401).json({ message: "Unauthorized" });
    } else {
      logger.info(`[${context}]: Sending service to get migration status`);
      ObjLog.log(`[${context}]: Sending service to get migration status`);
      veriflevelsService.getMigrationStatus(req, res, next);
    }
  } catch (error) {
    next(error);
  }
};

veriflevelsController.getDisapprovedVerifLevelsRequirements = async (req, res, next) => {
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
        route: "/getDisapprovedVerifLevelsRequirements",
        session: sess,
      };
      authenticationPGRepository.insertLogMsg(log);
  
      res.status(401).json({ message: "Unauthorized" });
    } else {
      logger.info(`[${context}]: Sending service to get Disapproved VerifLevels Requirements`);
      ObjLog.log(`[${context}]: Sending service to get Disapproved VerifLevels Requirements`);
      veriflevelsService.getDisapprovedVerifLevelsRequirements(req, res, next);
    }
  } catch (error) {
    next(error);
  }
};

veriflevelsController.getDisapprovedWholesalePartnersRequirements = async (req, res, next) => {
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
        route: "/getDisapprovedWholesalePartnersRequirements",
        session: sess,
      };
      authenticationPGRepository.insertLogMsg(log);
  
      res.status(401).json({ message: "Unauthorized" });
    } else {
      logger.info(`[${context}]: Sending service to get Disapproved VerifLevels Requirements`);
      ObjLog.log(`[${context}]: Sending service to get Disapproved VerifLevels Requirements`);
      veriflevelsService.getDisapprovedWholesalePartnersRequirements(req, res, next);
    }
  } catch (error) {
    next(error);
  }
};

veriflevelsController.getLimitationsByCountry = async (req, res, next) => {
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
        route: "/getLimitationsByCountry",
        session: sess,
      };
      authenticationPGRepository.insertLogMsg(log);
  
      res.status(401).json({ message: "Unauthorized" });
    } else {
      logger.info(`[${context}]: Sending service to get Limitations`);
      ObjLog.log(`[${context}]: Sending service to get Limitations`);
      veriflevelsService.getLimitationsByCountry(req, res, next);
    }
  } catch (error) {
    next(error);
  }
};

veriflevelsController.getVerifLevelRequirements = async (req, res, next) => {
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
        route: "/getVerifLevelRequirements",
        session: sess,
      };
      authenticationPGRepository.insertLogMsg(log);
  
      res.status(401).json({ message: "Unauthorized" });
    } else {
      logger.info(`[${context}]: Sending service to get veriflevels requirements`);
      ObjLog.log(`[${context}]: Sending service to get veriflevels requirements`);

      veriflevelsService.getVerifLevelRequirements(req, res, next);
    }
  } catch (error) {
    next(error);
  }
};

veriflevelsController.getWholesalePartnerRequestsRequirementsByEmail = async (req, res, next) => {
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
        route: "/getWholesalePartnerRequestsRequirementsByEmail",
        session: sess,
      };
      authenticationPGRepository.insertLogMsg(log);
  
      res.status(401).json({ message: "Unauthorized" });
    } else {
      logger.info(`[${context}]: Sending service to get WholesalePartner Requests requirements`);
      ObjLog.log(`[${context}]: Sending service to get WholesalePartner Requests requirements`);

      veriflevelsService.getWholesalePartnerRequestsRequirementsByEmail(req, res, next);
    }
  } catch (error) {
    next(error);
  }
};

veriflevelsController.validateRemittance = async (req, res, next) => {
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
        route: "/validateRemittance",
        session: sess,
      };
      authenticationPGRepository.insertLogMsg(log);
  
      res.status(401).json({ message: "Unauthorized" });
    } else {
      logger.info(`[${context}]: Sending service to proove`);
      ObjLog.log(`[${context}]: Sending service to proove`);

      veriflevelsService.validateRemittance(req, res, next);
    }
  } catch (error) {
    next(error);
  }
};

export default veriflevelsController;
