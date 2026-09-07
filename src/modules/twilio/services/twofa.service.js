import twilio from "twilio";
import QRCode from "qrcode";
import bcrypt from "bcryptjs";
import { logger } from "../../../utils/logger";
import ObjLog from "../../../utils/ObjLog";
import twofaPGRepository from "../repositories/twofa.pg.repository";
import authenticationPGRepository from "../../authentication/repositories/authentication.pg.repository";
import usersPGRepository from "../../users/repositories/users.pg.repository";
import { env } from "../../../utils/enviroment";

const twofaService = {};
const context = "TwoFA Service";

// ── Twilio client (lazy singleton) ──────────────────────────
let _client = null;
function getClient() {
  if (!_client) {
    const sid = env.TWILIO_ACCOUNT_SID;
    const token = env.TWILIO_AUTH_TOKEN;
    if (!sid || !token) throw new Error("Faltan credenciales Twilio en .env");
    _client = twilio(sid, token);
  }
  return _client;
}

const VERIFY_SID = () => env.TWILIO_VERIFY_SID;
const APP_NAME = () => env.APP_NAME || "Bithonor";

function verifyService() {
  return getClient().verify.v2.services(VERIFY_SID());
}

// Twilio identities: min 8 chars, only [a-z0-9\-]
function toIdentity(email_user) {
  return email_user
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .padEnd(8, "0");
}

async function ensureEntityExists(identity) {
  try {
    await verifyService().entities(identity).fetch();
  } catch (_) {
    await verifyService().entities.create({ identity });
  }
}

async function createChallenge(identity, factorSid, code) {
  return verifyService()
    .entities(identity)
    .challenges.create({ factorSid, authPayload: code });
}

// ISO codes considered "Latam" by the cross-region domain check. Must match
// the list in the FE router guard (src/router/index.ts) and Login.vue.
const AMERICA_ISO_CODES = new Set([
  "AR", "BO", "BR", "CL", "CO", "CR", "CU", "DO", "EC", "SV",
  "GT", "HN", "MX", "NI", "PA", "PY", "PE", "PR", "UY", "VE",
  "CA", "US", "AG", "BS", "BB", "BZ", "DM", "GD", "HT", "JM",
  "KN", "LC", "VC", "TT", "SR", "GY",
]);

function isInAmerica(iso) {
  return !!iso && AMERICA_ISO_CODES.has(iso.toUpperCase());
}

// ── 1. GET /twofa/status?email=xxx[&domain=es|com] ──────────
twofaService.getStatus = async (req, res, next) => {
  try {
    const email_user = req.query.email || req.query.email_user;
    if (!email_user)
      return res.status(400).json({ error: "email es requerido." });

    const domain = (req.query.domain || "").toString().toLowerCase();

    logger.info(`[${context}]: getStatus for ${email_user}`);
    ObjLog.log(`[${context}]: getStatus for ${email_user}`);

    const [row, country] = await Promise.all([
      twofaPGRepository.get2FAStatusByEmail(email_user),
      twofaPGRepository.getResidCountryByEmail(email_user),
    ]);

    // Each region runs against its own database (PRODUC-CG for Europe,
    // LPRODUC-CG for Latam). If the email is absent from this region's DB
    // the user simply doesn't exist here and the FE must treat the login
    // attempt as invalid credentials — no 2FA modal, no email code.
    if (!country.exists) {
      return res
        .status(200)
        .json({ success: true, user_exists: false, two_factor_enabled: false });
    }

    const response = {
      success: true,
      user_exists: true,
      two_factor_enabled: row ? row.two_factor_enabled : false,
    };

    // Cross-region check: applies only when the user does exist in this DB
    // but their country doesn't match the storefront they're trying to log
    // in on (e.g. a European user reaching app.bithonor.com).
    if (domain === "es" || domain === "com") {
      if (country.iso) {
        const userInAmerica = isInAmerica(country.iso);
        const wrong_domain =
          (userInAmerica && domain === "es") ||
          (!userInAmerica && domain === "com");
        response.wrong_domain = wrong_domain;
        response.correct_iso_code = country.iso;
      } else {
        response.wrong_domain = false;
        response.correct_iso_code = null;
      }
    }

    return res.status(200).json(response);
  } catch (error) {
    logger.error(`[${context}]: getStatus error: ${error.message}`);
    next(error);
  }
};

// ── 2. POST /twofa/generate-qr ─────────────────────────────
twofaService.generateQR = async (req, res, next) => {
  try {
    const { email_user } = req.body;
    if (!email_user)
      return res.status(400).json({ error: "email_user es requerido." });

    logger.info(`[${context}]: generateQR for ${email_user}`);
    ObjLog.log(`[${context}]: generateQR for ${email_user}`);

    const row = await twofaPGRepository.get2FAStatusByEmail(email_user);
    const identity = toIdentity(email_user);

    if (row && row.two_factor_enabled)
      return res.status(400).json({ error: "2FA ya está activo." });

    // Remove any pending factor (best-effort)
    if (row && row.two_factor_factor_sid) {
      try {
        await verifyService()
          .entities(identity)
          .factors(row.two_factor_factor_sid)
          .remove();
      } catch (_) {}
    }

    await ensureEntityExists(identity);

    const factor = await verifyService()
      .entities(identity)
      .newFactors.create({
        friendlyName: `${APP_NAME()} - ${email_user}`,
        factorType: "totp",
      });

    const secret = factor.binding?.secret;
    const otpauthUri = factor.binding?.uri;

    if (!secret && !otpauthUri)
      throw new Error("Twilio no devolvió el secreto TOTP.");

    await twofaPGRepository.savePendingFactor(email_user, factor.sid);

    const qrUri =
      otpauthUri ||
      `otpauth://totp/${encodeURIComponent(APP_NAME())}:${encodeURIComponent(
        email_user,
      )}?secret=${secret}&issuer=${encodeURIComponent(APP_NAME())}`;

    const qrCode = await QRCode.toDataURL(qrUri);

    return res.status(200).json({
      success: true,
      factorSid: factor.sid,
      qrCode,
      secret,
    });
  } catch (error) {
    logger.error(`[${context}]: generateQR error: ${error.message}`);
    next(error);
  }
};

// ── 3. POST /twofa/activate ────────────────────────────────
twofaService.activate = async (req, res, next) => {
  try {
    const { email_user, password, factorSid, code } = req.body;

    if (!email_user || !password)
      return res
        .status(400)
        .json({ error: "email_user y password son requeridos." });
    if (!factorSid)
      return res.status(400).json({ error: "factorSid es requerido." });
    if (!code || !/^\d{6}$/.test(code))
      return res
        .status(400)
        .json({ error: "El código debe ser de 6 dígitos." });

    logger.info(`[${context}]: activate 2FA for ${email_user}`);
    ObjLog.log(`[${context}]: activate 2FA for ${email_user}`);

    // Verify credentials
    const creds = await twofaPGRepository.getCredentialsByEmail(email_user);
    if (!creds)
      return res.status(401).json({ error: "Credenciales inválidas." });

    const passwordOk = await bcrypt.compare(password, creds.password);
    if (!passwordOk) {
      // Mismo mecanismo de bloqueo del login clásico (sp_login_failed).
      try {
        await authenticationPGRepository.loginFailed(email_user.toLowerCase());
      } catch (blockError) {
        logger.error(`[${context}]: loginFailed error: ${blockError.message}`);
      }
      return res.status(401).json({ error: "Credenciales inválidas." });
    }

    // Verify first TOTP code with Twilio
    const identity = toIdentity(email_user);
    const updatedFactor = await verifyService()
      .entities(identity)
      .factors(factorSid)
      .update({ authPayload: code });

    if (updatedFactor.status === "verified") {
      await twofaPGRepository.enable2FA(email_user, factorSid);
      return res
        .status(200)
        .json({ success: true, message: "2FA activado correctamente." });
    }

    return res
      .status(400)
      .json({ success: false, error: "Código incorrecto." });
  } catch (error) {
    logger.error(`[${context}]: activate error: ${error.message}`);
    next(error);
  }
};

// ── 4. POST /twofa/challenge-login ─────────────────────────
twofaService.challengeLogin = async (req, res, next) => {
  try {
    const { email_user, code } = req.body;

    if (!email_user)
      return res.status(400).json({ error: "email_user es requerido." });
    if (!code || !/^\d{6}$/.test(code))
      return res
        .status(400)
        .json({ error: "El código debe ser de 6 dígitos." });

    logger.info(`[${context}]: challengeLogin for ${email_user}`);
    ObjLog.log(`[${context}]: challengeLogin for ${email_user}`);

    const row = await twofaPGRepository.get2FAStatusByEmail(email_user);
    if (!row) return res.status(404).json({ error: "Usuario no encontrado." });

    if (!row.two_factor_enabled)
      return res.status(200).json({ success: true, twofa_required: false });

    const identity = toIdentity(email_user);
    const result = await createChallenge(
      identity,
      row.two_factor_factor_sid,
      code,
    );

    if (result.status === "approved") {
      return res
        .status(200)
        .json({ success: true, twofa_required: true, verified: true });
    }

    return res.status(401).json({
      success: false,
      error: "Código 2FA incorrecto. No se puede iniciar sesión.",
    });
  } catch (error) {
    logger.error(`[${context}]: challengeLogin error: ${error.message}`);
    next(error);
  }
};

// ── 5. POST /twofa/challenge (requires active session) ─────
twofaService.challenge = async (req, res, next) => {
  try {
    const email_user =
      req.user?.email_user ||
      req.session?.passport?.user ||
      req.body?.email_user ||
      null;
    if (!email_user) return res.status(401).json({ error: "No autenticado." });

    const { code } = req.body;
    if (!code || !/^\d{6}$/.test(code))
      return res
        .status(400)
        .json({ error: "El código debe ser de 6 dígitos." });

    logger.info(`[${context}]: challenge for ${email_user}`);
    ObjLog.log(`[${context}]: challenge for ${email_user}`);

    const row = await twofaPGRepository.get2FAStatusByEmail(email_user);
    if (!row || !row.two_factor_enabled)
      return res.status(400).json({ error: "2FA no está activo." });

    const identity = toIdentity(email_user);
    const result = await createChallenge(
      identity,
      row.two_factor_factor_sid,
      code,
    );

    if (result.status === "approved") {
      return res.status(200).json({ success: true, verified: true });
    }

    return res
      .status(401)
      .json({ success: false, error: "Código incorrecto." });
  } catch (error) {
    logger.error(`[${context}]: challenge error: ${error.message}`);
    next(error);
  }
};

// ── 6. DELETE /twofa/disable (requires active session) ──────
twofaService.disable2FA = async (req, res, next) => {
  try {
    const email_user =
      req.user?.email_user ||
      req.session?.passport?.user ||
      req.body?.email_user ||
      null;
    if (!email_user) return res.status(401).json({ error: "No autenticado." });

    const { code } = req.body;
    if (!code || !/^\d{6}$/.test(code))
      return res
        .status(400)
        .json({ error: "El código debe ser de 6 dígitos." });

    logger.info(`[${context}]: disable2FA for ${email_user}`);
    ObjLog.log(`[${context}]: disable2FA for ${email_user}`);

    const row = await twofaPGRepository.get2FAStatusByEmail(email_user);
    if (!row || !row.two_factor_enabled)
      return res.status(400).json({ error: "Sin 2FA activo." });

    const identity = toIdentity(email_user);
    const result = await createChallenge(
      identity,
      row.two_factor_factor_sid,
      code,
    );

    if (result.status !== "approved")
      return res.status(401).json({ error: "Código incorrecto." });

    // Remove factor from Twilio (best-effort)
    try {
      await verifyService()
        .entities(identity)
        .factors(row.two_factor_factor_sid)
        .remove();
    } catch (_) {}

    await twofaPGRepository.disable2FA(email_user);
    return res.status(200).json({ success: true, message: "2FA desactivado." });
  } catch (error) {
    logger.error(`[${context}]: disable2FA error: ${error.message}`);
    next(error);
  }
};

// ── 7. GET /twofa/config ───────────────────────────────────
// Lo consume el FE para saber si el 2FA ya es obligatorio y que fecha
// mostrar en el aviso. Esta pensado para no fallar nunca: ante cualquier
// problema responde required=false, que es el comportamiento permisivo.
twofaService.getConfig = async (req, res, next) => {
  try {
    const mandatory_date = await twofaPGRepository.getMandatoryDate();
    return res.status(200).json({
      success: true,
      required: env.TWOFA_REQUIRED === true,
      mandatory_date,
    });
  } catch (error) {
    logger.error(`[${context}]: getConfig error: ${error.message}`);
    return res
      .status(200)
      .json({ success: true, required: false, mandatory_date: null });
  }
};

// ── 8. POST /twofa/activate-email ──────────────────────────
// Alta de 2FA para Latam. Alli el segundo factor es un codigo enviado al
// correo, no TOTP, asi que se guarda SIN factorSid (queda en NULL).
// El codigo se pide antes con POST /cr/users/sendActionVerificationCode.
twofaService.activateWithEmailCode = async (req, res, next) => {
  try {
    const email_user = (req.body && req.body.email_user
      ? String(req.body.email_user)
      : ""
    ).toLowerCase();
    const code = req.body ? req.body.code : null;

    if (!email_user)
      return res.status(400).json({ error: "email_user es requerido." });
    if (!code || !/^\d{4,8}$/.test(String(code)))
      return res.status(400).json({ error: "Código inválido." });

    logger.info(`[${context}]: activateWithEmailCode for ${email_user}`);
    ObjLog.log(`[${context}]: activateWithEmailCode for ${email_user}`);

    const check = await usersPGRepository.verifCode(email_user, code);
    const msg = check && check.msg;
    if (msg !== "Valid code") {
      return res.status(401).json({
        success: false,
        error: msg === "Expired code" ? "El código expiró." : "Código incorrecto.",
      });
    }

    await twofaPGRepository.enable2FA(email_user, null);
    return res
      .status(200)
      .json({ success: true, message: "2FA activado correctamente." });
  } catch (error) {
    logger.error(`[${context}]: activateWithEmailCode error: ${error.message}`);
    next(error);
  }
};

// ── 9. POST /twofa/disable-email ───────────────────────────
// Baja de 2FA para Latam, verificando un codigo enviado al correo.
twofaService.disableWithEmailCode = async (req, res, next) => {
  try {
    const email_user = (req.body && req.body.email_user
      ? String(req.body.email_user)
      : ""
    ).toLowerCase();
    const code = req.body ? req.body.code : null;

    if (!email_user)
      return res.status(400).json({ error: "email_user es requerido." });
    if (!code || !/^\d{4,8}$/.test(String(code)))
      return res.status(400).json({ error: "Código inválido." });

    logger.info(`[${context}]: disableWithEmailCode for ${email_user}`);
    ObjLog.log(`[${context}]: disableWithEmailCode for ${email_user}`);

    const row = await twofaPGRepository.get2FAStatusByEmail(email_user);
    if (!row || !row.two_factor_enabled)
      return res.status(400).json({ error: "Sin 2FA activo." });

    const check = await usersPGRepository.verifCode(email_user, code);
    const msg = check && check.msg;
    if (msg !== "Valid code") {
      return res.status(401).json({
        success: false,
        error: msg === "Expired code" ? "El código expiró." : "Código incorrecto.",
      });
    }

    await twofaPGRepository.disable2FA(email_user);
    return res.status(200).json({ success: true, message: "2FA desactivado." });
  } catch (error) {
    logger.error(`[${context}]: disableWithEmailCode error: ${error.message}`);
    next(error);
  }
};

export default twofaService;
