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
)

export default veriflevelsRouter;