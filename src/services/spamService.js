import { pool1 } from "../config/database.js";

// ----- Blocked Entries CRUD -----

export async function getBlockedEntries() {
    const { rows } = await pool1.query(
        "SELECT * FROM blocked_entries WHERE is_active = true ORDER BY created_at DESC"
    );
    return rows;
}

export async function addBlockedEntry(type, value, reason, createdBy) {
    await pool1.query(
        "INSERT INTO blocked_entries (type, value, reason, created_by) VALUES ($1, $2, $3, $4)",
        [type, value, reason, createdBy]
    );
}

export async function removeBlockedEntry(id) {
    await pool1.query(
        "UPDATE blocked_entries SET is_active = false WHERE id = $1",
        [id]
    );
}

// ----- Submission Validation -----

export async function validateSubmission(email, phoneNumber, message) {
    // Check blocked emails
    const { rows: blockedEmail } = await pool1.query(
        "SELECT * FROM blocked_entries WHERE type = $1 AND value = $2 AND is_active = true",
        ["email", email]
    );
    if (blockedEmail.length > 0) {
        return {
            blocked: true,
            status: 403,
            error: `Your email has been banned: ${blockedEmail[0].reason || "Contact support for more information"}`,
        };
    }

    // Check blocked phone numbers
    if (phoneNumber) {
        const { rows: blockedPhone } = await pool1.query(
            "SELECT * FROM blocked_entries WHERE type = $1 AND value = $2 AND is_active = true",
            ["phone", phoneNumber]
        );
        if (blockedPhone.length > 0) {
            return {
                blocked: true,
                status: 403,
                error: `This phone number has been banned: ${blockedPhone[0].reason || "Contact support for more information"}`,
            };
        }
    }

    // Check blocked keywords
    const { rows: keywords } = await pool1.query(
        "SELECT value, reason FROM blocked_entries WHERE type = $1 AND is_active = true",
        ["keyword"]
    );
    for (const keyword of keywords) {
        if (message.toLowerCase().includes(keyword.value.toLowerCase())) {
            return {
                blocked: true,
                status: 403,
                error: `Your message contains blocked content: ${keyword.reason || "Contact support for more information"}`,
            };
        }
    }

    return { blocked: false };
}
