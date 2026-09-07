import { ticketRepository } from "../repositories/index.js";

/**
 * POST /post/SubmitForm
 * Handles general contact form submissions (Feedback, Collaboration, Get Quote, etc.)
 * NOT for support tickets — use POST /api/tickets for those.
 */
export async function submitForm(req, res) {
    console.log("Received form submission:", req.body);

    const allowedOrigin = "https://mbktech.org";
    const referer = req.headers.referer;
    const isLocalEnv =
        process.env.localenv === "true" ||
        process.env.NODE_ENV === "development" ||
        process.env.NODE_ENV === "test";

    if (!isLocalEnv) {
        if (
            !referer ||
            (!referer.includes(allowedOrigin) &&
                !referer.includes(".mbktech.org") &&
                !referer.includes("http://localhost:3000"))
        ) {
            return res.status(403).json({ success: false, error: "Forbidden." });
        }
    }

    const {
        UserName: name,
        Email: email,
        Subject: subject,
        Message: message,
        PageUrl,
        Number: phoneNumber,
        stars: rating,
        support,
        projectCato,
        blogCato,
        ...additionalFields
    } = req.body;

    const missing = ["UserName", "Email", "Subject", "Message"].filter(
        (f) => !req.body[f]
    );
    if (missing.length > 0) {
        return res.status(400).json({
            success: false,
            error: "Missing required fields.",
            missing,
        });
    }

    try {
        const result = await ticketRepository.createFormSubmission({
            name,
            email,
            subject,
            message,
            pageUrl: PageUrl || null,
            phoneNumber,
            rating,
            support,
            projectCato,
            blogCato,
            additionalFields,
        });

        console.log("Submission saved, id:", result.id);

        return res.status(200).json({
            success: true,
            data: {
                id: result.id,
                message: "Submission received successfully!",
            },
        });
    } catch (error) {
        console.error("Failed to save submission:", error);
        return res.status(500).json({
            success: false,
            error: "Failed to save submission.",
        });
    }
}
