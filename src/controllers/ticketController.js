import * as ticketService from "../services/ticketService.js";

/**
 * POST /api/tickets
 * Creates a new support ticket.
 */
export async function createTicket(req, res) {
    try {
        const { name, email, phone, subject, category, message, pageUrl } = req.body;

        // Validate required fields
        const missing = [];
        if (!name) missing.push("name");
        if (!email) missing.push("email");
        if (!message) missing.push("message");

        if (missing.length > 0) {
            return res.status(400).json({
                success: false,
                error: "Missing required fields",
                missing,
            });
        }

        // Validate email format
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({
                success: false,
                error: "Invalid email address",
            });
        }

        const result = await ticketService.createTicket({
            name,
            email,
            phone: phone || null,
            subject: subject || "Support",
            category: category || null,
            message,
            pageUrl: pageUrl || null,
        });

        return res.status(201).json({
            success: true,
            data: {
                ticketNumber: result.ticketNumber,
                status: "pending",
                message: "Ticket created successfully. Save your ticket number to track progress.",
            },
        });
    } catch (error) {
        console.error("Error creating ticket:", error);
        return res.status(500).json({
            success: false,
            error: "Failed to create ticket. Please try again.",
        });
    }
}

/**
 * GET /api/tickets/:ticketNumber
 * Retrieves public ticket information.
 */
export async function getTicket(req, res) {
    try {
        const { ticketNumber } = req.params;

        if (!ticketNumber || !/^T\d{9}$/.test(ticketNumber)) {
            return res.status(400).json({
                success: false,
                error: "Invalid ticket number format. Expected: T followed by 9 digits.",
            });
        }

        const ticket = await ticketService.getTicketByNumber(ticketNumber);

        if (!ticket) {
            return res.status(404).json({
                success: false,
                error: "Ticket not found. Please check the number and try again.",
            });
        }

        return res.json({ success: true, data: ticket });
    } catch (error) {
        console.error("Error fetching ticket:", error);
        return res.status(500).json({
            success: false,
            error: "Failed to retrieve ticket. Please try again.",
        });
    }
}

/**
 * GET /api/tickets/:ticketNumber/audit
 * Retrieves only the audit trail for a ticket.
 */
export async function getAuditTrail(req, res) {
    try {
        const { ticketNumber } = req.params;

        if (!ticketNumber || !/^T\d{9}$/.test(ticketNumber)) {
            return res.status(400).json({
                success: false,
                error: "Invalid ticket number format.",
            });
        }

        const auditTrail = await ticketService.getAuditTrail(ticketNumber);

        if (auditTrail === null) {
            return res.status(404).json({
                success: false,
                error: "Ticket not found.",
            });
        }

        return res.json({ success: true, data: { auditTrail } });
    } catch (error) {
        console.error("Error fetching audit trail:", error);
        return res.status(500).json({
            success: false,
            error: "Failed to retrieve audit trail.",
        });
    }
}
