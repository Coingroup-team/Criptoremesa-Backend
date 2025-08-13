import { logger } from "../../../utils/logger";
import ObjLog from "../../../utils/ObjLog";
import veriflevelsPGRepository from "../repositories/veriflevels.pg.repository";
import veriflevelsHTTPRepository from "../repositories/veriflevels.http.repository";
import fs from "fs";
import authenticationPGRepository from "../../authentication/repositories/authentication.pg.repository";
import { addSiltRequestToQueue } from "../../../utils/queues/silt.queue";

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
    if (bdResp.level_one && bdResp.level_one.length > 0) {

      let doc
      if (bdResp.level_one[0] && bdResp.level_one[0].req_use_path && !bdResp.level_one[0].req_use_path.includes('http'))
        doc = fs.readFileSync(bdResp.level_one[0].req_use_path)

      let selfie
      if (bdResp.level_one[1] && bdResp.level_one[1].req_use_path && !bdResp.level_one[1].req_use_path.includes('http'))
        selfie = fs.readFileSync(bdResp.level_one[1].req_use_path)

      if(doc && selfie)
      bdResp.level_one.forEach((el) => {
        if (el.req_type === "doc") el.req_use_path = doc;
        else if (el.req_type === "selfie") el.req_use_path = selfie;
      });

    }
    if (bdResp.level_two && bdResp.level_two.length > 0) {

      let residency_proof
      if (bdResp.level_two[1] && bdResp.level_two[1].req_use_path)
      residency_proof = fs
        .readFileSync(bdResp.level_two[1].req_use_path)
      if (residency_proof)
      bdResp.level_two.forEach((el) => {
        if (el.req_type === "residency_proof")
          el.req_use_path = residency_proof;
      });
    }
    logger.silly({
      level_one: bdResp.level_one,
      level_two: bdResp.level_two,
      user: bdResp.user,
      email_user: bdResp.email_user,
    })
    return {
      data: {
        level_one: bdResp.level_one,
        level_two: bdResp.level_two,
        user: bdResp.user,
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

veriflevelsService.levelOneVerfificationSilt = async (
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
  manualReviewStatus
) => {
  logger.info(`[${context}]: getting iso codes`);
  ObjLog.log(`[${context}]: getting iso codes`);

  const countryIsoCodeDoc = countryDoc
    ? await veriflevelsHTTPRepository.getCountryIsoCodeCCA2(countryDoc)
    : null;
  const nationalityCountryIsoCode = nationalityCountry
    ? await veriflevelsHTTPRepository.getCountryIsoCodeCCA2(nationalityCountry)
    : null;

  console.log(`countryIsoCodeDoc: ${countryIsoCodeDoc}`);
  console.log(`nationalityCountryIsoCode: ${nationalityCountryIsoCode}`);

  logger.info(`[${context}]: storing silt request in BD`);
  ObjLog.log(`[${context}]: storing silt request in BD`);

  const siltRequest = {
    dateBirth,
    emailUser,
    docType,
    countryIsoCodeDoc,
    identDocNumber,
    docPath,
    selfie,
    gender,
    nationalityCountryIsoCode,
    siltID,
    siltStatus,
    manualReviewStatus
  }

  addSiltRequestToQueue(siltRequest);
};

veriflevelsService.levelOneVerfificationSiltEnhanced = async (
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
  manualReviewStatus,
  personalNumber,
  expiryDate,
  documentAddress
) => {
  logger.info(`[${context}]: getting iso codes for enhanced SILT`);
  ObjLog.log(`[${context}]: getting iso codes for enhanced SILT`);

  const countryIsoCodeDoc = countryDoc
    ? await veriflevelsHTTPRepository.getCountryIsoCodeCCA2(countryDoc)
    : null;
  const nationalityCountryIsoCode = nationalityCountry
    ? await veriflevelsHTTPRepository.getCountryIsoCodeCCA2(nationalityCountry)
    : null;

  console.log(`countryIsoCodeDoc: ${countryIsoCodeDoc}`);
  console.log(`nationalityCountryIsoCode: ${nationalityCountryIsoCode}`);

  logger.info(`[${context}]: storing enhanced silt request in BD`);
  ObjLog.log(`[${context}]: storing enhanced silt request in BD`);

  const siltRequestEnhanced = {
    dateBirth,
    emailUser,
    docType,
    countryIsoCodeDoc,
    identDocNumber,
    docPath,
    selfie,
    gender,
    nationalityCountryIsoCode,
    siltID,
    siltStatus,
    manualReviewStatus,
    personalNumber,
    expiryDate,
    documentAddress
  }

  addSiltRequestToQueue(siltRequestEnhanced);
};

veriflevelsService.getUserSiltDocumentData = async (req, res, next) => {
  try {
    logger.info(`[${context}]: Getting user SILT document data`);
    ObjLog.log(`[${context}]: Getting user SILT document data`);
      
    const siltDocumentData = await veriflevelsPGRepository.getUserSiltDocumentData(req.params.emailUser);
    
    return {
      data: siltDocumentData,
      status: 200,
      success: true,
      failed: false
    }
  } catch (error) {
    next(error);
  }
};

export default veriflevelsService;
