import { pool } from "../config/database.js";

// ----- Ticket Service (clean) -----

/**
 * Generates a unique ticket number: T + random 9 digits, zero-padded.
 */
function generateTicketNumber() {
    return "T" + String(Math.floor(Math.random() * 1_000_000_000)).padStart(9, "0");
}

/**
 * Creates a new support ticket.
 * Returns { id, ticketNumber } or throws.
 */
export async function createTicket({
    name,
    email,
    phone,
    subject,
    category,
    message,
    pageUrl,
}) {
    let ticketNumber;
    let isUnique = false;
    while (!isUnique) {
        ticketNumber = generateTicketNumber();
        const { rows } = await pool.query(
            "SELECT id FROM support_submissions WHERE ticket_number = $1",
            [ticketNumber]
        );
        if (rows.length === 0) isUnique = true;
    }

    const auditTrail = [
        {
            type: "created",
            action: "Ticket created",
            timestamp: new Date().toISOString(),
            by: "system",
        },
    ];

    const result = await pool.query(
        `INSERT INTO support_submissions (
            ticket_number, subject, support_type, project_category,
            name, email, phone_number, message,
            status, priority, page_url, audit_trail
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
        RETURNING id, ticket_number`,
        [
            ticketNumber,
            "Support",
            category || null,
            subject === "Support" ? subject : null,
            name,
            email,
            phone || null,
            message,
            "pending",
            "normal",
            pageUrl || null,
            JSON.stringify(auditTrail),
        ]
    );

    return {
        id: result.rows[0].id,
        ticketNumber: result.rows[0].ticket_number,
    };
}

/**
 * Retrieves a ticket by its ticket number (public-facing data only).
 */
export async function getTicketByNumber(ticketNumber) {
    const { rows } = await pool.query(
        `SELECT
            ticket_number,
            subject,
            support_type AS category,
            project_category AS project,
            name,
            status,
            priority,
            submission_timestamp AS "createdAt",
            last_updated AS "updatedAt",
            audit_trail AS "auditTrail"
         FROM support_submissions
         WHERE ticket_number = $1`,
        [ticketNumber]
    );

    if (rows.length === 0) return null;

    const t = rows[0];
    const parts = ["Support"];
    if (t.category) parts.push(t.category);
    if (t.project) parts.push(t.project);

    return {
        ticketNumber: t.ticket_number,
        title: parts.join(" / "),
        name: t.name,
        status: _capitalize(t.status),
        priority: _capitalize(t.priority),
        createdAt: t.createdAt,
        updatedAt: t.updatedAt,
        auditTrail: Array.isArray(t.auditTrail)
            ? t.auditTrail
            : _parseJson(t.auditTrail),
    };
}

/**
 * Retrieves only the audit trail for a ticket.
 */
export async function getAuditTrail(ticketNumber) {
    const { rows } = await pool.query(
        "SELECT audit_trail FROM support_submissions WHERE ticket_number = $1",
        [ticketNumber]
    );
    if (rows.length === 0) return null;
    const trail = rows[0].audit_trail;
    return Array.isArray(trail) ? trail : _parseJson(trail);
}

// ----- helpers -----

function _capitalize(str) {
    if (!str) return "Unknown";
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function _parseJson(val) {
    if (typeof val === "string") {
        try {
            return JSON.parse(val);
        } catch {
            return [];
        }
    }
    return val || [];
}

