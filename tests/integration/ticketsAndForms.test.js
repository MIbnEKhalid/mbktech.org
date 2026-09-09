import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import { createTestDb, cleanupTestDb } from "../helpers/createTestDb.js";
import { spamRepository } from "../../src/repositories/spam.repository.js";
import crypto from "crypto";

// Helper to generate a valid bot challenge token that bypasses the 1.5s time check
function generateTestBotToken() {
  const secretKey = process.env.BOT_PROTECTION_SECRET || "test-bot-protection-secret-2026";
  const timestamp = Date.now() - 3000; // 3 seconds ago
  const nonce = crypto.randomBytes(16).toString("hex");
  const payloadObj = { ts: timestamp, nonce, ip: "" };
  const payload = Buffer.from(JSON.stringify(payloadObj)).toString("base64url");
  const signature = crypto.createHmac("sha256", secretKey).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

describe("Tickets and Form Submissions Integration", () => {
  beforeAll(async () => {
    await createTestDb();
  });

  afterAll(async () => {
    await cleanupTestDb();
  });

  it("POST /api/tickets rejects missing required fields", async () => {
    const res = await request(app)
      .post("/api/tickets")
      .send({
        _mbk_shield_token: generateTestBotToken(),
        email: "test@example.com",
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.missing).toContain("name");
    expect(res.body.missing).toContain("message");
  });

  it("POST /api/tickets rejects invalid email", async () => {
    const res = await request(app)
      .post("/api/tickets")
      .send({
        _mbk_shield_token: generateTestBotToken(),
        name: "Test User",
        email: "not-an-email",
        message: "Hello support",
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain("Invalid email");
  });

  let createdTicketNumber = null;

  it("POST /api/tickets successfully creates a ticket", async () => {
    const res = await request(app)
      .post("/api/tickets")
      .send({
        _mbk_shield_token: generateTestBotToken(),
        name: "Alice Wonderland",
        email: "alice@example.com",
        subject: "Support",
        category: "General",
        message: "Need help accessing my dashboard.",
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("ticketNumber");
    createdTicketNumber = res.body.data.ticketNumber;
    expect(createdTicketNumber).toMatch(/^T\d{9}$/);
  });

  it("GET /api/tickets/:ticketNumber retrieves the created ticket", async () => {
    const res = await request(app).get(`/api/tickets/${createdTicketNumber}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("Alice Wonderland");
    expect(res.body.data.status).toBe("Pending");
  });

  it("GET /api/tickets/:ticketNumber/audit returns audit history", async () => {
    const res = await request(app).get(`/api/tickets/${createdTicketNumber}/audit`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.auditTrail).toBeInstanceOf(Array);
    expect(res.body.data.auditTrail.length).toBeGreaterThanOrEqual(1);
  });

  it("GET /api/tickets/:ticketNumber rejects invalid format", async () => {
    const res = await request(app).get("/api/tickets/invalid123");
    expect(res.status).toBe(400);
    expect(res.body.error).toContain("Invalid ticket number format");
  });

  it("GET /api/tickets/:ticketNumber returns 404 for non-existent ticket", async () => {
    const res = await request(app).get("/api/tickets/T999999999");
    expect(res.status).toBe(404);
  });

  it("POST /post/SubmitForm saves general contact submissions", async () => {
    const res = await request(app)
      .post("/post/SubmitForm")
      .send({
        _mbk_shield_token: generateTestBotToken(),
        UserName: "Bob Builder",
        Email: "bob@example.com",
        Subject: "Collaboration",
        Message: "We would like to partner on open source tooling.",
        PageUrl: "https://mbktech.org/Contact",
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("id");
  });

  it("POST /post/SubmitForm blocks banned emails", async () => {
    await spamRepository.addBlockedEntry("email", "banned-spammer@test.com", "Spam", "test");

    const res = await request(app)
      .post("/post/SubmitForm")
      .send({
        _mbk_shield_token: generateTestBotToken(),
        UserName: "Spam Bot",
        Email: "banned-spammer@test.com",
        Subject: "Buy Cheap Stuff",
        Message: "Buy this now!",
      });

    expect(res.status).toBe(403);
    expect(res.body.error).toContain("banned");
  });
});
