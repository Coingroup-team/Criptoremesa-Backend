import Router from "express-promise-router";
import ratesController from "./controllers/rates.controller";
import guard from "../../utils/guard";
const ratesRouter = Router();

// IF YOU WERE USING cg/auth/login
ratesRouter.get(
  "/rangeRates",
  // guard.verifyAdmin("/login"),
  ratesController.rangeRates
);

ratesRouter.get(
  "/rateTypes",
  // guard.verifyAdmin("/login"),
  ratesController.rateTypes
);

ratesRouter.get(
  "/userRates",
  // guard.verifyAdmin("/login"),
  ratesController.userRates
);

ratesRouter.get(
  "/fullRates",
  // guard.verifyAdmin("/login"),
  ratesController.fullRates
);

export default ratesRouter;
