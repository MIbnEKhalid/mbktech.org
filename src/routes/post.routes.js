import { Router } from "express";
import { submitForm } from "../controllers/form.controller.js";
import { formRateLimit } from "../middleware/security.js";
import { botProtectionGuard } from "../middleware/bot-protection.js";
import { spamGuard } from "../middleware/spam-guard.js";

const router = Router();

// Form submission (spam-guarded + rate limited + bot protected)
router.post("/SubmitForm", botProtectionGuard, formRateLimit, spamGuard, submitForm);

export default router;
