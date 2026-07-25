import { Router } from "express";
import { submitForm } from "../controllers/formController.js";
import { formRateLimit } from "../middleware/security.js";
import { validateSubmission } from "../services/spamService.js";

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

router.post("/SubmitForm", formRateLimit, spamGuard, submitForm);

export default router;
