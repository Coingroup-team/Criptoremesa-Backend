import { logger } from "../../../utils/logger";
import ObjLog from "../../../utils/ObjLog";
import authenticationPGRepository from "../repositories/authentication.pg.repository";
import auth from "../../../utils/auth";
import { env } from "../../../utils/enviroment";
import axios from "axios";

const authenticationService = {};
const context = "Authentication Service";

// Todos los emails de clientes existentes cumplen este patron (verificado en BD).
const EMAIL_RE = /^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$/;

// IP real de la peticion (Client-Ip la pone el FE y cualquiera la puede falsear)
function networkInfo(req) {
  return {
    cf_connecting_ip: req.header("cf-connecting-ip") || null,
    x_forwarded_for: req.header("x-forwarded-for") || null,
    remote_address: req.socket ? req.socket.remoteAddress : null,
    client_ip_header: req.header("Client-Ip") || null,
    user_agent: req.header("user-agent") || null,
  };
}

authenticationService.login = async (req, res, next) => {
  try {
    // objeto de log nuevo por peticion (antes se compartia entre peticiones)
    const log = {
      is_auth: req.isAuthenticated(),
      success: true,
      failed: false,
      ip: req.header("Client-Ip"),
      country: null,
      route: req.method + " " + req.originalUrl,
      session: null,
      params: req.params,
      query: req.query,
      // nunca se guarda la contrasena en el log
      body: Object.assign({}, req.body, { password: undefined, captcha: undefined }),
      client_info: networkInfo(req),
    };

    const email = req.body ? req.body.email : undefined;
    if (
      typeof email !== "string" ||
      email.length > 254 ||
      !EMAIL_RE.test(email.trim()) ||
      typeof (req.body ? req.body.password : undefined) !== "string"
    ) {
      logger.warn(
        `[${context}]: Login rechazado por formato invalido desde ${JSON.stringify(log.client_info)}`
      );
      log.success = false;
      log.failed = true;
      log.status = 400;
      log.response = { rejected: "invalid_login_payload" };
      authenticationPGRepository.insertLogMsg(log).catch((e) =>
        logger.error(`[${context}]: insertLogMsg: ${e.message}`)
      );
      // misma forma que un login fallido con usuario inexistente
      return res.json({
        isAuthenticated: false,
        loginAttempts: "NA",
        atcPhone: "NA",
        userExists: false,
        captchaSuccess: true,
      });
    }
    req.body.email = email.trim();

    // CAPTCHA OBLIGATORIO.
    // Evidencia del incidente 2026-09-16: en los 7 dias previos, el 100% de los
    // logins legitimos trajo este campo informado, y ninguna de las ~10.300
    // peticiones del ataque lo traia (mandaban "captchaToken" vacio).
    const captcha = req.body ? req.body.captcha : undefined;
    if (typeof captcha !== "string" || captcha.trim() === "") {
      logger.warn(
        `[${context}]: Login rechazado sin captcha desde ${JSON.stringify(log.client_info)}`
      );
      log.success = false;
      log.failed = true;
      log.status = 400;
      log.response = { rejected: "missing_captcha" };
      authenticationPGRepository.insertLogMsg(log).catch((e) =>
        logger.error(`[${context}]: insertLogMsg: ${e.message}`)
      );
      return res.status(400).json({
        captchaSuccess: false,
        msg: "Ha ocurrido un error. Por favor completa el captcha",
      });
    }

    // Validacion del token contra Google, detras de interruptor RECAPTCHA_VERIFY.
    // Si Google no responde o da error de red se DEJA PASAR (y se registra), para
    // que una caida de Google no bloquee el login de todos los clientes.
    if (env.RECAPTCHA_VERIFY === "true" && env.reCAPTCHA_SECRET_KEY) {
      let veredicto = null;
      try {
        const verificacion = await axios.post(
          "https://www.google.com/recaptcha/api/siteverify",
          new URLSearchParams({
            secret: env.reCAPTCHA_SECRET_KEY,
            response: captcha.trim(),
          }).toString(),
          {
            timeout: 5000,
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
          }
        );
        veredicto = verificacion && verificacion.data ? verificacion.data : null;
      } catch (e) {
        logger.warn(
          `[${context}]: no se pudo validar el captcha con Google (${e.message}); se deja pasar`
        );
      }
      if (veredicto && veredicto.success === false) {
        logger.warn(
          `[${context}]: captcha invalido (${JSON.stringify(veredicto["error-codes"] || [])}) desde ${JSON.stringify(log.client_info)}`
        );
        log.success = false;
        log.failed = true;
        log.status = 400;
        log.response = { rejected: "invalid_captcha" };
        authenticationPGRepository.insertLogMsg(log).catch((e) =>
          logger.error(`[${context}]: insertLogMsg: ${e.message}`)
        );
        return res.status(400).json({
          captchaSuccess: false,
          msg: "Falló la verificación del Captcha",
        });
      }
    }

    if (await authenticationPGRepository.getSessionById(req.sessionID))
      log.session = req.sessionID;

    logger.info(`[${context}]: Sending module to verify`);
    ObjLog.log(`[${context}]: Sending module to verify`);

    auth.verify(req, res, next);
    await authenticationPGRepository.insertLogMsg(log);
  } catch (error) {
    next(error);
  }
};

authenticationService.logout = async (req, res, next) => {
  try {
    logger.info(`[${context}]: Sending module to logout`);
    ObjLog.log(`[${context}]: Sending module to logout`);
    auth.logout(req, res, next);
  } catch (error) {
    next(error);
  }
};

authenticationService.protected = async (req, res, next) => {
  try {
    logger.info(`[${context}]: Protected`);
    ObjLog.log(`[${context}]: Protected`);
    let countryResp = null;
    let sess = null;
    if (req.isAuthenticated()) {
      const resp = authenticationPGRepository.getIpInfo(
        req.header("Client-Ip")
      );
      if (resp) countryResp = resp.country_name;
      if (await authenticationPGRepository.getSessionById(req.sessionID))
        sess = req.sessionID;

      const log = {
        is_auth: req.isAuthenticated(),
        success: true,
        failed: false,
        ip: req.header("Client-Ip"),
        country: countryResp,
        route: "/protected-route",
        session: sess,
      };
      authenticationPGRepository.insertLogMsg(log);

      res.status(200).json({ message: "nice" });
    } else {
      req.session.destroy();

      const resp = authenticationPGRepository.getIpInfo(
        req.header("Client-Ip")
      );
      let countryResp = null;
      sess = null;

      if (resp) countryResp = resp.country_name;

      if (await authenticationPGRepository.getSessionById(req.sessionID))
        sess = req.sessionID;

      const log = {
        is_auth: req.isAuthenticated(),
        success: false,
        failed: true,
        ip: req.header("Client-Ip"),
        country: countryResp,
        route: "/protected-route",
        session: sess,
      };
      authenticationPGRepository.insertLogMsg(log);

      res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    next(error);
  }
};

export default authenticationService;
