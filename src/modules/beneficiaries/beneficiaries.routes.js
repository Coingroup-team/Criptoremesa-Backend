import Router from "express-promise-router";
import guard from "../../utils/guard";
import beneficiariesController from "./controllers/beneficiaries.controller";
const beneficiariesRouter = Router();


beneficiariesRouter.get(
  "/frequentBeneficiaries/:email_user",
  // guard.verifyAdmin("/login"),
  beneficiariesController.getUserFrequentBeneficiaries
);

beneficiariesRouter.post(
  "/frequentBeneficiaries",
  // guard.verifyAdmin("/login"),
  beneficiariesController.createFrequentBeneficiary
);

beneficiariesRouter.delete(
  "/frequentBeneficiaries/:beneficiaryId",
  // guard.verifyAdmin("/login"),
  beneficiariesController.deleteFrequentBeneficiary
);

beneficiariesRouter.put(
  "/frequentBeneficiaries/:beneficiaryId",
  // guard.verifyAdmin("/login"),
  beneficiariesController.updateFrequentBeneficiary
);

beneficiariesRouter.get(
  "/contact-required/:id_country",
  // guard.verifyAdmin("/login"),
  beneficiariesController.contactRequired
);

export default beneficiariesRouter;
