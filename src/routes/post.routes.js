import { Router } from "express";
import { submitForm } from "../controllers/form.controller.js";
import { formRateLimit } from "../middleware/security.js";
import { botProtectionGuard } from "../middleware/bot-protection.js";
import { validateSubmission } from "../services/spam.service.js";

const router = Router();

// Form submission middleware for spam check
async function spamGuard(req, res, next) {
    const { Email: email, Number: phoneNumber, Message: message } = req.body;
    const result = await validateSubmission(email, phoneNumber, message);
    if (result.blocked) {
        return res.status(result.status).json({ error: result.error });
    }
    next();
}

router.post("/SubmitForm", botProtectionGuard, formRateLimit, spamGuard, submitForm);

export default router;
