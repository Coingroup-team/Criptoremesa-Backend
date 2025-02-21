import Router from "express-promise-router";
import usersController from "./controllers/users.controller";
import guard from "../../utils/guard";
const usersRouter = Router();

// IF YOU WERE USING cg/auth/login
usersRouter.post(
  "/createNewClient",
  // guard.verifyAdmin("/login"),
  usersController.createNewClient
);

usersRouter.get(
  "/approveLevelCero/:id",
  // guard.verifyAdmin("/login"),
  usersController.approveLevelCero
);

usersRouter.post(
  "/files",
  // guard.verifyAdmin("/login"),
  usersController.files
);

usersRouter.post(
  "/requestLevelOne1stQ",
  // guard.verifyAdmin("/login"),
  usersController.requestLevelOne1stQ
);

usersRouter.post(
  "/requestLevelOne2ndQ",
  // guard.verifyAdmin("/login"),
  usersController.requestLevelOne2ndQ
);

usersRouter.post(
  "/requestLevelOne3rdQ",
  // guard.verifyAdmin("/login"),
  usersController.requestLevelOne3rdQ
);

usersRouter.post(
  "/requestLevelTwo",
  // guard.verifyAdmin("/login"),
  usersController.requestLevelTwo
);

usersRouter.post(
  "/forgotPassword",
  // guard.verifyAdmin("/login"),
  usersController.forgotPassword
);

usersRouter.post(
  "/newPassword",
  // guard.verifyAdmin("/login"),
  usersController.newPassword
);

usersRouter.post(
  "/sendVerificationCodeByEmail",
  // guard.verifyAdmin("/login"),
  usersController.sendVerificationCodeByEmail
);

usersRouter.post(
  "/sendVerificationCodeByWhatsApp",
  // guard.verifyAdmin("/login"),
  usersController.sendVerificationCodeByWhatsApp
);

usersRouter.post(
  "/sendSMS",
  // guard.verifyAdmin("/login"),
  usersController.sendSMS
);

usersRouter.post(
  "/sendVerificationCodeBySMS",
  // guard.verifyAdmin("/login"),
  usersController.sendVerificationCodeBySMS
);

usersRouter.get(
  "/getLevelQuestions/:id_resid_country",
  // guard.verifyAdmin("/login"),
  usersController.getLevelQuestions
);

usersRouter.post(
  "/verifyIdentUser",
  // guard.verifyAdmin("/login"),
  usersController.verifyIdentUser
);

usersRouter.post(
  "/deactivateUser",
  // guard.verifyAdmin("/login"),
  usersController.deactivateUser
);

usersRouter.get(
  "/referrals",
  // guard.verifyAdmin("/login"),
  usersController.getReferrals
);

usersRouter.get(
  "/:email_user/referrals/operations",
  // guard.verifyAdmin("/login"),
  usersController.getReferralsOperations
);

usersRouter.get(
  "/:email_user/referrals/totalByCountry",
  // guard.verifyAdmin("/login"),
  usersController.getReferralsByCountry
);

usersRouter.get(
  "/:email_user/referrals/totalByStatus",
  // guard.verifyAdmin("/login"),
  usersController.getReferralsByStatus
);

usersRouter.post(
  "/:email_user/ambassador/request",
  // guard.verifyAdmin("/login"),
  usersController.ambassadorRequest
);

usersRouter.head(
  "/referrers/:cust_cr_cod_pub",
  // guard.verifyAdmin("/login"),
  usersController.verifReferrallByCodPub
);

usersRouter.post(
  "/accounts/:email_user",
  // guard.verifyAdmin("/login"),
  usersController.insertUserAccount
);

usersRouter.get(
  "/accounts/:email_user",
  // guard.verifyAdmin("/login"),
  usersController.getUserAccounts
);

usersRouter.delete(
  "/accounts/:email_user",
  // guard.verifyAdmin("/login"),
  usersController.deleteUserAccount
);

usersRouter.post(
  "/fileName",
  // guard.verifyAdmin("/login"),
  usersController.getFileName
);

usersRouter.get(
  "/migrated/:id",
  // guard.verifyAdmin("/login"),
  usersController.getMigratedInfo
);

usersRouter.get(
  "/validate/:email",
  // guard.verifyAdmin("/login"),
  usersController.validateEmail
);

usersRouter.post(
  "/validate-code",
  // guard.verifyAdmin("/login"),
  usersController.validateCode
);

usersRouter.patch(
  "/edit-phone/:uuid_user",
  // guard.verifyAdmin("/login"),
  usersController.editPhone
);

usersRouter.post(
  "/edit-level-one-info",
  // guard.verifyAdmin("/login"),
  usersController.editLevelOneInfo
);

usersRouter.post(
  "/save-extra-info-third-modal",
  // guard.verifyAdmin("/login"),
  usersController.saveExtraInfoThirdModal
);

usersRouter.get(
  "/full-info/:email_user",
  usersController.getFullInfo
);

export default usersRouter;
