import Router from "express-promise-router";
import authenticationController from "../modules/authentication/controllers/authentication.controller";
import guard from "../utils/guard";
import usersRouter from "../modules/users/users.routes";
import doc_typesRouter from "../modules/doc_types/doc_types.routes";
import ip_countriesRouter from "../modules/ip_countries/ip_countries.routes";
import resid_countriesRouter from "../modules/resid_countries/resid_countries.routes";
import veriflevelsRouter from "../modules/veriflevels/veriflevels.routes";
import beneficiariesRouter from "../modules/beneficiaries/beneficiaries.routes";
import countriesRouter from "../modules/countries/countries.routes";
import currenciesRouter from "../modules/currencies/currencies.routes";
import payMethodRouter from "../modules/payMethods/payMethods.routes";
import banksRouter from "../modules/banks/banks.routes";
import allCountriesRouter from "../modules/all_countries/all_countries.routes";
import chatRouter from "../modules/chat/chat.routes";
import remittancesRouter from "../modules/remittances/remittances.routes";
import ratesRouter from "../modules/rates/rates.routes";
import balancesRouter from "../modules/balances/balances.routes";
import cryptomilesRouter from "../modules/cryptomiles/cryptomiles.routes";
import reportsRouter from "../modules/reports/reports.routes";
import operationRoutesRouter from "../modules/operation_routes/operation_routes.routes";
import exchangesRouter from "../modules/exchanges/exchanges.routes";
import walletsRouter from "../modules/wallets/wallets.routes";
import wholesale_partnersRouter from "../modules/wholesale_partners/wholesale_partners.routes";
import transbankRouter from "../modules/transbank/transbank.routes";
import siltRouter from "../modules/silt/silt.routes";
import mail from "../utils/mail";

const router = Router();

router.post("/login", authenticationController.login);

router.get("/logout/:email_user", authenticationController.logout);

router.get("/", authenticationController.logout);

router.get(
  "/protected-route",
  // guard.verifyAdmin("/protected-route"),
  authenticationController.protected
);

router.post("/mail", mail.sendAnyMail);

// IF YOU WANT TO CREATE MORE ROUTES
router.use("/users", usersRouter);
router.use("/ip_countries", ip_countriesRouter);
router.use("/resid_countries", resid_countriesRouter);
router.use("/doc_types", doc_typesRouter);
router.use("/veriflevels", veriflevelsRouter);
router.use("/beneficiaries", beneficiariesRouter);
router.use("/countries", countriesRouter);
router.use("/currencies", currenciesRouter);
router.use("/pay_methods", payMethodRouter);
router.use("/banks", banksRouter);
router.use("/all_countries", allCountriesRouter);
router.use("/chat", chatRouter);
router.use("/remittances", remittancesRouter);
router.use("/rates", ratesRouter);
router.use("/balances", balancesRouter);
router.use("/cryptomiles", cryptomilesRouter);
router.use("/reports", reportsRouter);
router.use("/operation_routes", operationRoutesRouter);
router.use("/exchanges", exchangesRouter);
router.use("/wallets", walletsRouter);
router.use("/wholesale_partners", wholesale_partnersRouter);
router.use("/transbank", transbankRouter);
router.use("/silt", siltRouter);

export default router;
