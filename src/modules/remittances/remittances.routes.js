import Router from "express-promise-router";
import remittancesController from "./controllers/remittances.controller";
import guard from "../../utils/guard";
import {env} from '../../utils/enviroment'
import path from 'path'
import multer from "multer";
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, env.FILES_DIR)
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
  }
})
const upload = multer({ storage: storage })

const remittancesRouter = Router();

// IF YOU WERE USING cg/auth/login
remittancesRouter.get(
  "/notificationTypes",
  // guard.verifyAdmin("/login"),
  remittancesController.notificationTypes
);

remittancesRouter.get(
  "/chat/:email_user",
  // guard.verifyAdmin("/login"),
  remittancesController.getRemittances
);

remittancesRouter.get(
  "/limitationsByCodPub/:cust_cr_cod_pub",
  // guard.verifyAdmin("/login"),
  remittancesController.limitationsByCodPub
);

remittancesRouter.post(
  "/",
  upload.single('firstCapture'),
  remittancesController.startRemittance
);

remittancesRouter.post(
  "/webpay",
  // guard.verifyAdmin("/login"),
  remittancesController.webpayRemittance
);

remittancesRouter.post(
  "/preRemittance",
  // guard.verifyAdmin("/login"),
  remittancesController.startPreRemittance
);

remittancesRouter.get(
  "/preRemittance/:email_user",
  // guard.verifyAdmin("/login"),
  remittancesController.getPreRemittanceByUser
);

remittancesRouter.delete(
  "/preRemittance/:id_pre_remittance",
  // guard.verifyAdmin("/login"),
  remittancesController.cancelPreRemittance
);

remittancesRouter.get(
  "/:email_user",
  // guard.verifyAdmin("/login"),
  remittancesController.lastRemittances
);

remittancesRouter.get(
  "/countries/minAmounts",
  // guard.verifyAdmin("/login"),
  remittancesController.getMinAmounts
);

remittancesRouter.post(
  "/tumipay",
  // guard.verifyAdmin("/login"),
  remittancesController.tumipayRemittance
);

remittancesRouter.get(
  "/info/:countryIsoCodOrigin/:countryIsoCodDestiny",
  // guard.verifyAdmin("/login"),
  remittancesController.getInfoByOriginAndDestination
);

export default remittancesRouter;
