import { logger } from "../../../utils/logger";
import ObjLog from "../../../utils/ObjLog";
import twofaService from "../services/twofa.service";

const twofaController = {};
const context = "TwoFA Controller";

twofaController.getStatus = (req, res, next) =>
  twofaService.getStatus(req, res, next);

twofaController.generateQR = (req, res, next) =>
  twofaService.generateQR(req, res, next);

twofaController.activate = (req, res, next) =>
  twofaService.activate(req, res, next);

twofaController.challengeLogin = (req, res, next) =>
  twofaService.challengeLogin(req, res, next);

twofaController.challenge = (req, res, next) =>
  twofaService.challenge(req, res, next);

twofaController.disable2FA = (req, res, next) =>
  twofaService.disable2FA(req, res, next);

export default twofaController;
