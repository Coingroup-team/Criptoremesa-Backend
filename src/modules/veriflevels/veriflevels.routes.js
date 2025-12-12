import Router from "express-promise-router";
import veriflevelsController from "./controllers/veriflevels.controller";
import guard from "../../utils/guard";
const veriflevelsRouter = Router();

veriflevelsRouter.post(
  "/requestWholesalePartner",
  // guard.verifyAdmin("/login"),
  veriflevelsController.requestWholesalePartner
);

veriflevelsRouter.get(
  "/notifications/:email_user",
  // guard.verifyAdmin("/login"),
  veriflevelsController.notifications
);

veriflevelsRouter.delete(
  "/notifications/:id",
  // guard.verifyAdmin("/login"),
  veriflevelsController.deactivateNotification
);

veriflevelsRouter.patch(
  "/notifications/:id",
  // guard.verifyAdmin("/login"),
  veriflevelsController.readNotification
);

veriflevelsRouter.get(
  "/getWholesalePartnerRequestsCountries",
  // guard.verifyAdmin("/login"),
  veriflevelsController.getWholesalePartnerRequestsCountries
);

veriflevelsRouter.get(
  "/getMigrationStatus",
  // guard.verifyAdmin("/login"),
  veriflevelsController.getMigrationStatus
);

veriflevelsRouter.get(
  "/getDisapprovedVerifLevelsRequirements/:id",
  // guard.verifyAdmin("/login"),
  veriflevelsController.getDisapprovedVerifLevelsRequirements
);

veriflevelsRouter.get(
  "/getDisapprovedWholesalePartnersRequirements/:id",
  // guard.verifyAdmin("/login"),
  veriflevelsController.getDisapprovedWholesalePartnersRequirements
);

veriflevelsRouter.get(
  "/getLimitationsByCountry/:id",
  // guard.verifyAdmin("/login"),
  veriflevelsController.getLimitationsByCountry
);

veriflevelsRouter.get(
  "/getVerifLevelRequirements/:id",
  // guard.verifyAdmin("/login"),
  veriflevelsController.getVerifLevelRequirements
);

veriflevelsRouter.get(
  "/getWholesalePartnerRequestsRequirementsByEmail/:id",
  // guard.verifyAdmin("/login"),
  veriflevelsController.getWholesalePartnerRequestsRequirementsByEmail
);

veriflevelsRouter.post(
  "/silt/webhook",
  veriflevelsController.levelOneVerfificationSilt
);

veriflevelsRouter.get(
  "/silt/document-data/:emailUser",
  veriflevelsController.getUserSiltDocumentData
);

// ========================================
// PERSONA INTEGRATION ENDPOINTS - PHASE 1
// ========================================

/**
 * Create Persona inquiry and get session token
 * POST /veriflevels/persona/create-inquiry
 * Body: { email_user: string }
 * Returns: { inquiryId, sessionToken, status, isNewInquiry }
 */
veriflevelsRouter.post(
  "/persona/create-inquiry",
  // guard.verifyAdmin("/login"), // Uncomment when ready for production
  veriflevelsController.createPersonaInquiry
);

/**
 * Get Persona inquiry status for a user
 * GET /veriflevels/persona/inquiry-status/:email_user
 * Returns: { hasInquiry, inquiryId, status, createdAt, completedAt }
 */
veriflevelsRouter.get(
  "/persona/inquiry-status/:email_user",
  // guard.verifyAdmin("/login"), // Uncomment when ready for production
  veriflevelsController.getPersonaInquiryStatus
);

export default veriflevelsRouter;
