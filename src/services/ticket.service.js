import { ticketRepository } from "../repositories/index.js";

// ----- Ticket Service (delegates to TicketRepository) -----

/**
 * Creates a new support ticket.
 * Returns { id, ticketNumber } or throws.
 */
export async function createTicket(ticketData) {
    return ticketRepository.createTicket(ticketData);
}

/**
 * Retrieves a ticket by its ticket number (public-facing data only).
 */
export async function getTicketByNumber(ticketNumber) {
    return ticketRepository.findByTicketNumber(ticketNumber);
}

/**
 * Retrieves only the audit trail for a ticket.
 */
export async function getAuditTrail(ticketNumber) {
    return ticketRepository.getAuditTrail(ticketNumber);
}

export { ticketRepository };
