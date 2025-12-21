import { logger } from "../../../utils/logger";
import ObjLog from "../../../utils/ObjLog";
import veriflevelsPGRepository from "../repositories/veriflevels.pg.repository";
import veriflevelsHTTPRepository from "../repositories/veriflevels.http.repository";
import personaHTTPRepository from "../repositories/persona.http.repository";
import fs from "fs";
import authenticationPGRepository from "../../authentication/repositories/authentication.pg.repository";
import usersService from "../../users/services/users.service";
import { addSiltRequestToQueue } from "../../../utils/queues/silt.queue";

const veriflevelsService = {};
const context = "veriflevels Service";

veriflevelsService.requestWholesalePartner = async (req, res, next) => {
  try {
    logger.info(`[${context}]: Requesting Wholesale Partner profile`);
    ObjLog.log(`[${context}]: Requesting Wholesale Partner profile`);

    let request = req.body;
    request.old_resid_client_countries =
      req.body.old_resid_client_countries.join();
    request.new_resid_client_countries =
      req.body.new_resid_client_countries.join();
    request.clients_number = req.body.clients_number.toString();
    request.clients_growth = req.body.clients_growth.toString();

    const data = await veriflevelsPGRepository.requestWholesalePartner(request);

    return {
      data,
      status: 200,
      success: true,
      failed: false,
    };
  } catch (error) {
    next(error);
  }
};

veriflevelsService.notifications = async (req, res, next) => {
  try {
    logger.info(`[${context}]: Getting user notifications`);
    ObjLog.log(`[${context}]: Getting user notifications`);

    const data = await veriflevelsPGRepository.notifications(
      req.params.email_user
    );

    if (data === null)
      return {
        data: [],
        status: 200,
        success: true,
        failed: false,
      };
    else
      return {
        data,
        status: 200,
        success: true,
        failed: false,
      };
  } catch (error) {
    next(error);
  }
};

veriflevelsService.deactivateNotification = async (req, res, next) => {
  try {
    logger.info(`[${context}]: Deactivating notification`);
    ObjLog.log(`[${context}]: Deactivating notification`);

    const dbResp = await veriflevelsPGRepository.deactivateNotification(
      req.params.id
    );
    return {
      data: dbResp,
      status: 200,
      success: true,
      failed: false,
    };
  } catch (error) {
    next(error);
  }
};

veriflevelsService.readNotification = async (req, res, next) => {
  try {
    logger.info(`[${context}]: Reading notification`);
    ObjLog.log(`[${context}]: Reading notification`);

    const dbResp = await veriflevelsPGRepository.readNotification(
      req.params.id
    );
    return {
      data: dbResp,
      status: 200,
      success: true,
      failed: false,
    };
  } catch (error) {
    next(error);
  }
};

veriflevelsService.getWholesalePartnerRequestsCountries = async (
  req,
  res,
  next
) => {
  try {
    logger.info(`[${context}]: Getting wholesale partner requests countries`);
    ObjLog.log(`[${context}]: Getting wholesale partner requests countries`);

    const bdResp =
      await veriflevelsPGRepository.getWholesalePartnerRequestsCountries();
    return {
      data: bdResp,
      status: 200,
      success: true,
      failed: false,
    };
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
      failed: false,
    };
  } catch (error) {
    next(error);
  }
};

veriflevelsService.getDisapprovedVerifLevelsRequirements = async (
  req,
  res,
  next
) => {
  try {
    logger.info(
      `[${context}]: Getting Disapproved VerifLevels Requirements from DB`
    );
    ObjLog.log(
      `[${context}]: Getting Disapproved VerifLevels Requirements from DB`
    );

    const bdResp =
      await veriflevelsPGRepository.getDisapprovedVerifLevelsRequirements(
        req.params.id
      );
    return {
      data: bdResp,
      status: 200,
      success: true,
      failed: false,
    };
  } catch (error) {
    next(error);
  }
};

veriflevelsService.getDisapprovedWholesalePartnersRequirements = async (
  req,
  res,
  next
) => {
  try {
    logger.info(
      `[${context}]: Getting Disapproved Wholesale Partners Requirements from DB`
    );
    ObjLog.log(
      `[${context}]: Getting Disapproved Wholesale Partners Requirements from DB`
    );

    const bdResp =
      await veriflevelsPGRepository.getDisapprovedWholesalePartnersRequirements(
        req.params.id
      );
    return {
      data: bdResp,
      status: 200,
      success: true,
      failed: false,
    };
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

    bdResp.limitations.forEach((e) => {
      if (e.destiny_countries.length > 0)
        e.destiny_countries.forEach((c) => {
          if (c.country_iso_code === "DO") c.viewing_name = "Rep. Dominicana";
        });
    });

    return {
      data: bdResp,
      status: 200,
      success: true,
      failed: false,
    };
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
      let doc;
      if (
        bdResp.level_one[0] &&
        bdResp.level_one[0].req_use_path &&
        !bdResp.level_one[0].req_use_path.includes("http")
      )
        doc = fs.readFileSync(bdResp.level_one[0].req_use_path);

      let selfie;
      if (
        bdResp.level_one[1] &&
        bdResp.level_one[1].req_use_path &&
        !bdResp.level_one[1].req_use_path.includes("http")
      )
        selfie = fs.readFileSync(bdResp.level_one[1].req_use_path);

      if (doc && selfie)
        bdResp.level_one.forEach((el) => {
          if (el.req_type === "doc") el.req_use_path = doc;
          else if (el.req_type === "selfie") el.req_use_path = selfie;
        });
    }
    if (bdResp.level_two && bdResp.level_two.length > 0) {
      let residency_proof;
      if (bdResp.level_two[1] && bdResp.level_two[1].req_use_path)
        residency_proof = fs.readFileSync(bdResp.level_two[1].req_use_path);
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
    });
    return {
      data: {
        level_one: bdResp.level_one,
        level_two: bdResp.level_two,
        user: bdResp.user,
        email_user: bdResp.email_user,
      },
      status: 200,
      success: true,
      failed: false,
    };
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
    logger.info(
      `[${context}]: Getting wholesale partner request requirements by email`
    );
    ObjLog.log(
      `[${context}]: Getting wholesale partner request requirements by email`
    );

    const bdResp =
      await veriflevelsPGRepository.getWholesalePartnerRequestsRequirementsByEmail(
        req.params.id
      );
    return {
      data: bdResp,
      status: 200,
      success: true,
      failed: false,
    };
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
    manualReviewStatus,
  };

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
  documentAddress,
  documentType,
  documentNumber
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
    documentAddress,
    documentType,
    documentNumber,
  };

  addSiltRequestToQueue(siltRequestEnhanced);
};

veriflevelsService.getUserSiltDocumentData = async (req, res, next) => {
  try {
    logger.info(`[${context}]: Getting user SILT document data`);
    ObjLog.log(`[${context}]: Getting user SILT document data`);

    const siltDocumentData =
      await veriflevelsPGRepository.getUserSiltDocumentData(
        req.params.emailUser
      );

    return {
      data: siltDocumentData,
      status: 200,
      success: true,
      failed: false,
    };
  } catch (error) {
    next(error);
  }
};

/**
 * PHASE 1: Create Persona inquiry and get session token
 * This endpoint creates a new Persona inquiry for a user and returns the session token
 * needed to embed the verification flow in the frontend
 *
 * @param {Object} req - Request object with email_user in body
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns inquiryId and sessionToken
 */
veriflevelsService.createPersonaInquiry = async (req, res, next) => {
  try {
    logger.info(`[${context}]: Creating Persona inquiry - Phase 1`);
    ObjLog.log(`[${context}]: Creating Persona inquiry - Phase 1`);

    const { email_user } = req.body;

    if (!email_user) {
      throw new Error("email_user is required");
    }

    // Step 1: Get user full information using the EXACT same service as GET /users/full-info/:email_user
    logger.info(`[${context}]: Step 1 - Getting user info for: ${email_user}`);

    // Create mock request object to call usersService.getFullInfo
    const mockReq = { params: { email_user: email_user.toLowerCase() } };
    const userInfoResponse = await usersService.getFullInfo(mockReq, res, next);

    if (!userInfoResponse || !userInfoResponse.data) {
      throw new Error(`User not found with email: ${email_user}`);
    }

    const userInfo = userInfoResponse.data;

    // Check if user already has an inquiry
    if (userInfo.persona_inquiry_id) {
      logger.info(
        `[${context}]: User already has inquiry ID: ${userInfo.persona_inquiry_id}`
      );

      // Get session token for existing inquiry
      const sessionData = await personaHTTPRepository.getSessionToken(
        userInfo.persona_inquiry_id
      );

      // Build verification URL with inquiryId and sessionToken
      const verificationUrl = `https://withpersona.com/verify?inquiry-id=${userInfo.persona_inquiry_id}&session-token=${sessionData.sessionToken}`;

      return {
        data: {
          inquiryId: userInfo.persona_inquiry_id,
          sessionToken: sessionData.sessionToken,
          status: sessionData.status,
          isNewInquiry: false,
          verificationUrl,
          message: "Using existing Persona inquiry",
        },
        status: 200,
        success: true,
        failed: false,
      };
    }

    // Step 2: Create new inquiry in Persona
    logger.info(`[${context}]: Step 2 - Creating new inquiry in Persona`);
    const inquiryData = await personaHTTPRepository.createInquiry(email_user, {
      email: email_user,
      name: userInfo.name_user,
    });

    // Step 3: Store inquiry ID in database
    logger.info(`[${context}]: Step 3 - Storing inquiry ID in database`);
    await veriflevelsPGRepository.storePersonaInquiryId(
      email_user,
      inquiryData.inquiryId
    );

    // Step 4: Get session token for the new inquiry
    logger.info(`[${context}]: Step 4 - Getting session token`);
    const sessionData = await personaHTTPRepository.getSessionToken(
      inquiryData.inquiryId
    );

    logger.info(
      `[${context}]: Persona inquiry created successfully - Phase 1 complete`
    );

    // Build verification URL with inquiryId and sessionToken
    const verificationUrl = `https://withpersona.com/verify?inquiry-id=${inquiryData.inquiryId}&session-token=${sessionData.sessionToken}`;

    return {
      data: {
        inquiryId: inquiryData.inquiryId,
        sessionToken: sessionData.sessionToken,
        status: sessionData.status,
        isNewInquiry: true,
        verificationUrl,
        message: "Persona inquiry created successfully",
      },
      status: 200,
      success: true,
      failed: false,
    };
  } catch (error) {
    logger.error(
      `[${context}]: Error in createPersonaInquiry: ${error.message}`
    );
    ObjLog.log(`[${context}]: Error in createPersonaInquiry: ${error.message}`);
    next(error);
  }
};

/**
 * Get Persona inquiry status
 * @param {Object} req - Request object with email_user in params
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns inquiry details and status
 */
veriflevelsService.getPersonaInquiryStatus = async (req, res, next) => {
  try {
    logger.info(`[${context}]: Getting Persona inquiry status`);
    ObjLog.log(`[${context}]: Getting Persona inquiry status`);

    const { email_user } = req.params;

    // Get inquiry ID from database
    const inquiryId = await veriflevelsPGRepository.getPersonaInquiryId(
      email_user
    );

    if (!inquiryId) {
      return {
        data: {
          hasInquiry: false,
          message: "No Persona inquiry found for this user",
        },
        status: 200,
        success: true,
        failed: false,
      };
    }

    // Get inquiry details from Persona
    const inquiryDetails = await personaHTTPRepository.getInquiryDetails(
      inquiryId
    );

    return {
      data: {
        hasInquiry: true,
        inquiryId: inquiryDetails.inquiryId,
        status: inquiryDetails.status,
        createdAt: inquiryDetails.createdAt,
        completedAt: inquiryDetails.completedAt,
        referenceId: inquiryDetails.referenceId,
      },
      status: 200,
      success: true,
      failed: false,
    };
  } catch (error) {
    logger.error(
      `[${context}]: Error getting Persona inquiry status: ${error.message}`
    );
    next(error);
  }
};

/**
 * PHASE 2: Process Persona webhook (Enhanced version with extra document data)
 * This service processes Persona inquiry webhooks asynchronously using Bull queue
 * Mirrors the SILT webhook pattern for consistency
 * @param {Object} webhookData - Persona webhook payload
 */
veriflevelsService.levelOneVerificationPersonaEnhanced = async (
  webhookData
) => {
  logger.info(
    `[${context}]: Processing Persona webhook - inquiry.${webhookData.status}`
  );
  ObjLog.log(`[${context}]: Processing Persona webhook`);

  // Import the queue function (needs to be imported at the top of the file)
  const { addPersonaRequestToQueue } = await import(
    "../../../utils/queues/persona.queue.js"
  );

  const personaRequestEnhanced = {
    dateBirth: webhookData.dateBirth,
    emailUser: webhookData.emailUser,
    docType: webhookData.docType,
    countryIsoCodeDoc: webhookData.countryIsoCodeDoc,
    identDocNumber: webhookData.identDocNumber,
    docPath: webhookData.docPath,
    selfie: webhookData.selfie,
    gender: webhookData.gender,
    nationalityCountryIsoCode: webhookData.nationalityCountryIsoCode,
    personaInquiryId: webhookData.personaInquiryId,
    personaStatus: webhookData.personaStatus,
    manualReviewStatus: webhookData.manualReviewStatus,
    personalNumber: webhookData.personalNumber,
    expiryDate: webhookData.expiryDate,
    documentAddress: webhookData.documentAddress,
    documentType: webhookData.documentType,
    documentNumber: webhookData.documentNumber,
  };

  logger.info(
    `[${context}]: Adding Persona request to queue for async processing`
  );
  addPersonaRequestToQueue(personaRequestEnhanced);
};

export default veriflevelsService;
