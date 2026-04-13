import twilio from "twilio";
import QRCode from "qrcode";
import bcrypt from "bcryptjs";
import { logger } from "../../../utils/logger";
import ObjLog from "../../../utils/ObjLog";
import twofaPGRepository from "../repositories/twofa.pg.repository";
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

// ── 1. GET /twofa/status?email=xxx ──────────────────────────
twofaService.getStatus = async (req, res, next) => {
  try {
    const email_user = req.query.email || req.query.email_user;
    if (!email_user)
      return res.status(400).json({ error: "email es requerido." });

    logger.info(`[${context}]: getStatus for ${email_user}`);
    ObjLog.log(`[${context}]: getStatus for ${email_user}`);

    const row = await twofaPGRepository.get2FAStatusByEmail(email_user);
    if (!row) return res.status(404).json({ error: "Usuario no encontrado." });

    return res.status(200).json({
      success: true,
      two_factor_enabled: row.two_factor_enabled,
    });
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
    if (!passwordOk)
      return res.status(401).json({ error: "Credenciales inválidas." });

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
      req.user?.email_user || req.session?.passport?.user || null;
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
      req.user?.email_user || req.session?.passport?.user || null;
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

export default twofaService;
