import { Router } from "express";
import {
    createTicket,
    getTicket,
    getAuditTrail,
} from "../controllers/ticketController.js";
import { formRateLimit } from "../middleware/security.js";
import { botProtectionGuard } from "../middleware/botProtection.js";

const router = Router();

// Create a new support ticket (protected by anti-bot verification + rate limiting)
router.post("/tickets", botProtectionGuard, formRateLimit, createTicket);

// Get ticket by number (public tracking)
router.get("/tickets/:ticketNumber", getTicket);

// Get ticket audit trail
router.get("/tickets/:ticketNumber/audit", getAuditTrail);

export default router;
