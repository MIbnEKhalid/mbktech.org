import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createTestDb, cleanupTestDb } from "../helpers/createTestDb.js";
import { spamRepository } from "../../src/repositories/SpamRepository.js";
import { validateSubmission } from "../../src/services/spamService.js";

describe("SpamRepository & SpamService", () => {
  beforeAll(async () => {
    await createTestDb();
  });

  afterAll(async () => {
    await cleanupTestDb();
  });

  it("should add a blocked email and retrieve it", async () => {
    const entry = await spamRepository.addBlockedEntry(
      "email",
      "spammer@malicious.com",
      "Repeated spam bot activity",
      "admin"
    );

    expect(entry).toBeDefined();
    expect(entry.id).toBeGreaterThan(0);
    expect(entry.type).toBe("email");
    expect(entry.value).toBe("spammer@malicious.com");

    const found = await spamRepository.findBlocked("email", "spammer@malicious.com");
    expect(found).not.toBeNull();
    expect(found.reason).toBe("Repeated spam bot activity");
  });

  it("should add a blocked keyword and identify spam messages", async () => {
    await spamRepository.addBlockedEntry(
      "keyword",
      "viagra-deal-2026",
      "Phishing spam term",
      "admin"
    );

    const keywords = await spamRepository.getActiveKeywords();
    expect(keywords.some((k) => k.value === "viagra-deal-2026")).toBe(true);

    const checkSpam = await validateSubmission(
      "legit@example.com",
      "123456789",
      "Check out this viagra-deal-2026 right now!"
    );
    expect(checkSpam.blocked).toBe(true);
    expect(checkSpam.status).toBe(403);
  });

  it("should block submissions from banned emails", async () => {
    const check = await validateSubmission(
      "spammer@malicious.com",
      "9999999",
      "Hello world"
    );
    expect(check.blocked).toBe(true);
    expect(check.status).toBe(403);
  });

  it("should allow clean submissions", async () => {
    const check = await validateSubmission(
      "cleanjohn@example.com",
      "555123456",
      "Hello, I would like to inquire about your web development package."
    );
    expect(check.blocked).toBe(false);
  });

  it("should soft-remove a blocked entry", async () => {
    const entry = await spamRepository.addBlockedEntry(
      "phone",
      "+19998887777",
      "Temporary ban",
      "admin"
    );

    await spamRepository.removeBlockedEntry(entry.id);
    const found = await spamRepository.findBlocked("phone", "+19998887777");
    expect(found).toBeNull();
  });
});
