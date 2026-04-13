import Router from "express-promise-router";
import twofaController from "./controllers/twofa.controller";

const router = Router();

// ── Public routes (no session required) ─────────────────────
router.get("/status", twofaController.getStatus);
router.post("/challenge-login", twofaController.challengeLogin);
router.post("/generate-qr", twofaController.generateQR);
router.post("/activate", twofaController.activate);

// ── Protected routes (require active session) ───────────────
// These rely on req.user or req.session.passport.user being set
// by Passport after login. No extra middleware needed since
// the service checks for the authenticated user internally.
router.post("/challenge", twofaController.challenge);
router.delete("/disable", twofaController.disable2FA);

export default router;
