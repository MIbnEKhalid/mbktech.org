import { BaseRepository } from "mbkauthe";
import { defaultAdapter } from "../db/index.js";

function capitalize(str) {
  if (!str) return "Unknown";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function parseJson(val) {
  if (typeof val === "string") {
    try {
      return JSON.parse(val);
    } catch {
      return [];
    }
  }
  return val || [];
}

export class TicketRepository extends BaseRepository {
  constructor(adapter = defaultAdapter) {
    super(adapter);
  }

  /**
   * Generates a 10-character ticket number: T + 9 zero-padded digits.
   */
  generateTicketNumber() {
    return "T" + String(Math.floor(Math.random() * 1_000_000_000)).padStart(9, "0");
  }

  /**
   * Generates a collision-checked unique ticket number.
   */
  async generateUniqueTicketNumber() {
    let ticketNumber;
    let isUnique = false;
    while (!isUnique) {
      ticketNumber = this.generateTicketNumber();
      const { rows } = await this.query(
        "SELECT id FROM mbkcore_support_submissions WHERE ticket_number = $1",
        [ticketNumber]
      );
      if (rows.length === 0) isUnique = true;
    }
    return ticketNumber;
  }

  /**
   * Creates a new support ticket.
   */
  async createTicket({
    name,
    email,
    phone,
    subject = "Support",
    category,
    message,
    pageUrl,
  }) {
    const ticketNumber = await this.generateUniqueTicketNumber();

    const auditTrail = [
      {
        type: "created",
        action: "Ticket created",
        timestamp: new Date().toISOString(),
        by: "system",
      },
    ];

    const { rows } = await this.query(
      `INSERT INTO mbkcore_support_submissions (
          ticket_number, subject, support_type, project_category,
          name, email, phone_number, message,
          status, priority, page_url, audit_trail
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING id, ticket_number`,
      [
        ticketNumber,
        subject || "Support",
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
      id: rows[0].id,
      ticketNumber: rows[0].ticket_number,
    };
  }

  /**
   * Handles general contact / feedback form submission.
   */
  async createFormSubmission({
    name,
    email,
    subject,
    message,
    pageUrl,
    phoneNumber,
    rating,
    support,
    projectCato,
    blogCato,
    additionalFields = {},
  }) {
    const auditTrail = [
      {
        type: "created",
        action: "Submission received",
        timestamp: new Date().toISOString(),
        by: "system",
      },
    ];

    const { rows } = await this.query(
      `INSERT INTO mbkcore_support_submissions (
          subject, support_type, project_category, blog_category,
          name, email, phone_number, message, rating,
          status, priority, page_url,
          audit_trail, additional_fields
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
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
        rating ? parseInt(rating, 10) : null,
        "pending",
        "normal",
        pageUrl || null,
        JSON.stringify(auditTrail),
        JSON.stringify(additionalFields),
      ]
    );

    return { id: rows[0].id };
  }

  /**
   * Retrieves public ticket info by ticket number.
   */
  async findByTicketNumber(ticketNumber) {
    const { rows } = await this.query(
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
       FROM mbkcore_support_submissions
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
      status: capitalize(t.status),
      priority: capitalize(t.priority),
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
      auditTrail: Array.isArray(t.auditTrail)
        ? t.auditTrail
        : parseJson(t.auditTrail),
    };
  }

  /**
   * Retrieves only the audit trail for a ticket.
   */
  async getAuditTrail(ticketNumber) {
    const { rows } = await this.query(
      "SELECT audit_trail FROM mbkcore_support_submissions WHERE ticket_number = $1",
      [ticketNumber]
    );
    if (rows.length === 0) return null;
    const trail = rows[0].audit_trail;
    return Array.isArray(trail) ? trail : parseJson(trail);
  }
}

export const ticketRepository = new TicketRepository();
export default ticketRepository;
