import { logger } from "../../../utils/logger";
import ObjLog from "../../../utils/ObjLog";
import veriflevelsPGRepository from "../repositories/veriflevels.pg.repository";
import fs from "fs";
import authenticationPGRepository from "../../authentication/repositories/authentication.pg.repository";

const veriflevelsService = {};
const context = "veriflevels Service";

veriflevelsService.requestWholesalePartner = async (req, res, next) => {
  try {
    logger.info(`[${context}]: Requesting Wholesale Partner profile`);
    ObjLog.log(`[${context}]: Requesting Wholesale Partner profile`);

    let request = req.body;
    request.old_resid_client_countries = req.body.old_resid_client_countries.join();
    request.new_resid_client_countries = req.body.new_resid_client_countries.join();
    request.clients_number = req.body.clients_number.toString();
    request.clients_growth = req.body.clients_growth.toString()
    
    const data = await veriflevelsPGRepository.requestWholesalePartner(request);

    return {
      data,
      status: 200,
      success: true,
      failed: false
    }
  } catch (error) {
    next(error);
  }
};

veriflevelsService.notifications = async (req, res, next) => {
  try {
    logger.info(`[${context}]: Getting user notifications`);
    ObjLog.log(`[${context}]: Getting user notifications`);

    const data = await veriflevelsPGRepository.notifications(req.params.email_user);
  
    if (data === null)
      return {
        data: [],
        status: 200,
        success: true,
        failed: false
      }
    else
      return {
        data,
        status: 200,
        success: true,
        failed: false
      }
  } catch (error) {
    next(error);
  }
};

veriflevelsService.deactivateNotification = async (req, res, next) => {
  try {
    logger.info(`[${context}]: Deactivating notification`);
    ObjLog.log(`[${context}]: Deactivating notification`);

    const dbResp = await veriflevelsPGRepository.deactivateNotification(req.params.id);
    return {
      data: dbResp,
      status: 200,
      success: true,
      failed: false
    }
  } catch (error) {
    next(error);
  }
};

veriflevelsService.readNotification = async (req, res, next) => {
  try {
    logger.info(`[${context}]: Reading notification`);
    ObjLog.log(`[${context}]: Reading notification`);

    const dbResp = await veriflevelsPGRepository.readNotification(req.params.id);
    return {
      data: dbResp,
      status: 200,
      success: true,
      failed: false
    }
  } catch (error) {
    next(error);
  }
};

veriflevelsService.getWholesalePartnerRequestsCountries = async (req, res, next) => {
  try {
    logger.info(`[${context}]: Getting wholesale partner requests countries`);
    ObjLog.log(`[${context}]: Getting wholesale partner requests countries`);

    const bdResp = await veriflevelsPGRepository.getWholesalePartnerRequestsCountries();
    return {
      data: bdResp,
      status: 200,
      success: true,
      failed: false
    }
  } catch (error) {
    next(error);
  }
};

veriflevelsService.getMigrationStatus = async (req, res, next) => {
  try {
    logger.info(`[${context}]: Getting wholesale partner requests countries`);
    ObjLog.log(`[${context}]: Getting wholesale partner requests countries`);

    const bdResp = await veriflevelsPGRepository.getMigrationStatus();
    return {
      data: bdResp,
      status: 200,
      success: true,
      failed: false
    }
  } catch (error) {
    next(error);
  }
};

veriflevelsService.getDisapprovedVerifLevelsRequirements = async (req, res, next) => {
  try {
    logger.info(`[${context}]: Getting Disapproved VerifLevels Requirements from DB`);
    ObjLog.log(`[${context}]: Getting Disapproved VerifLevels Requirements from DB`);
    
    const bdResp = await veriflevelsPGRepository.getDisapprovedVerifLevelsRequirements(
      req.params.id
    );
    return {
      data: bdResp,
      status: 200,
      success: true,
      failed: false
    }
  } catch (error) {
    next(error);
  }
};

veriflevelsService.getDisapprovedWholesalePartnersRequirements = async (req, res, next) => {
  try {
    logger.info(`[${context}]: Getting Disapproved Wholesale Partners Requirements from DB`);
    ObjLog.log(`[${context}]: Getting Disapproved Wholesale Partners Requirements from DB`);

    const bdResp = await veriflevelsPGRepository.getDisapprovedWholesalePartnersRequirements(
      req.params.id
    );
    return {
      data: bdResp,
      status: 200,
      success: true,
      failed: false
    }
  } catch (error) {
    next(error);
  }
};

veriflevelsService.getLimitationsByCountry = async (req, res, next) => {
  try {
    logger.info(`[${context}]: Getting Limitations from DB`);
    ObjLog.log(`[${context}]: Getting Limitations from DB`);

    const bdResp = await veriflevelsPGRepository.getLimitationsByCountry(
      req.params.id
    );

    bdResp.limitations.forEach(e => {
      if (e.destiny_countries.length > 0)
        e.destiny_countries.forEach(c => {
          if (c.country_iso_code === 'DO')
            c.viewing_name = 'Rep. Dominicana'
        })
    });

    return {
      data: bdResp,
      status: 200,
      success: true,
      failed: false
    }
  } catch (error) {
    next(error);
  }
};

veriflevelsService.getVerifLevelRequirements = async (req, res, next) => {
  try {
    logger.info(`[${context}]: Getting requirements from DB`);
    ObjLog.log(`[${context}]: Getting requirements from DB`);
      
    const bdResp = await veriflevelsPGRepository.getVerifLevelRequirements(
      req.params.id
    );
    if (bdResp.level_one) {
      let doc = fs.readFileSync(bdResp.level_one[0].req_use_path)
      let selfie = fs.readFileSync(bdResp.level_one[1].req_use_path)

      bdResp.level_one.forEach((el) => {
        if (el.req_type === "doc") el.req_use_path = doc;
        else if (el.req_type === "selfie") el.req_use_path = selfie;
      });
    }
    if (bdResp.level_two) {
      let residency_proof = fs
        .readFileSync(bdResp.level_two[1].req_use_path)
      bdResp.level_two.forEach((el) => {
        if (el.req_type === "residency_proof")
          el.req_use_path = residency_proof;
      });
    }
    return {
      data: {
        level_one: bdResp.level_one,
        level_two: bdResp.level_two,
        email_user: bdResp.email_user,
      },
      status: 200,
      success: true,
      failed: false
    }
  } catch (error) {
    next(error);
  }
};

veriflevelsService.getWholesalePartnerRequestsRequirementsByEmail = async (
  req,
  res,
  next
) => {
  try {
    logger.info(`[${context}]: Getting wholesale partner request requirements by email`);
    ObjLog.log(`[${context}]: Getting wholesale partner request requirements by email`);
      
    const bdResp =
      await veriflevelsPGRepository.getWholesalePartnerRequestsRequirementsByEmail(
        req.params.id
      );
    return {
      data: bdResp,
      status: 200,
      success: true,
      failed: false
    }
  } catch (error) {
    next(error);
  }
};

export default veriflevelsService;