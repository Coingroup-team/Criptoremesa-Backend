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

twofaController.getConfig = (req, res, next) => {
  try {
    twofaService.getConfig(req, res, next);
  } catch (error) {
    next(error);
  }
};

twofaController.activateWithEmailCode = (req, res, next) => {
  try {
    twofaService.activateWithEmailCode(req, res, next);
  } catch (error) {
    next(error);
  }
};

twofaController.disableWithEmailCode = (req, res, next) => {
  try {
    twofaService.disableWithEmailCode(req, res, next);
  } catch (error) {
    next(error);
  }
};

twofaController.setConfig = (req, res, next) => {
  try {
    twofaService.setConfig(req, res, next);
  } catch (error) {
    next(error);
  }
};

export default twofaController;
