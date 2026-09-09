import { validateSubmission } from "../services/spam.service.js";

/**
 * Form-submission spam guard middleware. Runs a spam/abuse check on the
 * submitted contact-form payload and short-circuits with an error if blocked.
 */
export async function spamGuard(req, res, next) {
    const { Email: email, Number: phoneNumber, Message: message } = req.body;
    const result = await validateSubmission(email, phoneNumber, message);
    if (result.blocked) {
        return res.status(result.status).json({ error: result.error });
    }
    next();
}
