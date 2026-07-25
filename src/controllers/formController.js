import { pool } from "../config/database.js";

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
        process.env.localenv === "true" || process.env.NODE_ENV === "development";

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

    const auditTrail = [
        {
            type: "created",
            action: "Submission received",
            timestamp: new Date().toISOString(),
            by: "system",
        },
    ];

    try {
        const result = await pool.query(
            `INSERT INTO support_submissions (
                subject, support_type, project_category, blog_category,
                name, email, phone_number, message, rating,
                status, priority, page_url,
                audit_trail, additional_fields
            ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
            RETURNING id`,
            [
                subject,
                support || null,
                projectCato || null,
                blogCato || null,
                name,
                email,
                phoneNumber || null,
                message,
                rating ? parseInt(rating) : null,
                "pending",
                "normal",
                PageUrl || null,
                JSON.stringify(auditTrail),
                JSON.stringify(additionalFields),
            ]
        );

        console.log("Submission saved, id:", result.rows[0].id);

        return res.status(200).json({
            success: true,
            data: {
                id: result.rows[0].id,
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

