import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createTestDb, cleanupTestDb } from "../helpers/createTestDb.js";
import { ticketRepository } from "../../src/repositories/ticket.repository.js";

describe("TicketRepository", () => {
  beforeAll(async () => {
    await createTestDb();
  });

  afterAll(async () => {
    await cleanupTestDb();
  });

  it("should generate a valid ticket number format (T + 9 digits)", () => {
    const num = ticketRepository.generateTicketNumber();
    expect(num).toMatch(/^T\d{9}$/);
  });

  it("should create a new support ticket and return id and ticketNumber", async () => {
    const ticket = await ticketRepository.createTicket({
      name: "John Doe",
      email: "john@example.com",
      phone: "+1234567890",
      subject: "Support",
      category: "Billing",
      message: "Need help with subscription invoice.",
      pageUrl: "https://mbktech.org/Support",
    });

    expect(ticket).toBeDefined();
    expect(ticket.id).toBeGreaterThan(0);
    expect(ticket.ticketNumber).toMatch(/^T\d{9}$/);

    const retrieved = await ticketRepository.findByTicketNumber(ticket.ticketNumber);
    expect(retrieved).not.toBeNull();
    expect(retrieved.name).toBe("John Doe");
    expect(retrieved.status).toBe("Pending");
    expect(retrieved.priority).toBe("Normal");
    expect(retrieved.auditTrail).toBeInstanceOf(Array);
    expect(retrieved.auditTrail.length).toBeGreaterThanOrEqual(1);
    expect(retrieved.auditTrail[0].action).toBe("Ticket created");
  });

  it("should retrieve audit trail correctly", async () => {
    const ticket = await ticketRepository.createTicket({
      name: "Jane Smith",
      email: "jane@example.com",
      message: "Testing audit trail retrieval.",
    });

    const trail = await ticketRepository.getAuditTrail(ticket.ticketNumber);
    expect(trail).toBeInstanceOf(Array);
    expect(trail.length).toBeGreaterThanOrEqual(1);
    expect(trail[0].by).toBe("system");
  });

  it("should return null for non-existent ticket number", async () => {
    const result = await ticketRepository.findByTicketNumber("T999999999");
    expect(result).toBeNull();
  });

  it("should create a contact form submission", async () => {
    const submission = await ticketRepository.createFormSubmission({
      name: "Alex Client",
      email: "alex@example.com",
      subject: "Get Quote",
      message: "Looking for full stack development services.",
      phoneNumber: "123456789",
      rating: 5,
      support: null,
      projectCato: "WebDev",
      blogCato: null,
      additionalFields: { budget: "$5000", timeline: "2 weeks" },
    });

    expect(submission).toBeDefined();
    expect(submission.id).toBeGreaterThan(0);
  });
});
