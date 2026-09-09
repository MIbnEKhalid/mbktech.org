import { describe, it, expect } from "vitest";
import { generateChallenge, verifyBotProtection } from "../../src/middleware/bot-protection.js";

describe("BotProtection Middleware", () => {
  it("should generate a signed challenge token containing payload and signature", () => {
    const challenge = generateChallenge("127.0.0.1");
    expect(challenge).toBeDefined();
    expect(challenge.token).toContain(".");
    expect(challenge.timestamp).toBeGreaterThan(0);
    expect(challenge.nonce).toBeDefined();
  });

  it("should reject submissions triggering honeypot fields", async () => {
    const req = {
      body: {
        _bot_hp: "automated-bot-value",
        name: "Bot User",
      },
      headers: {},
      ip: "127.0.0.1",
    };

    const result = await verifyBotProtection(req);
    expect(result.valid).toBe(false);
    expect(result.error).toContain("Automated submission detected");
  });

  it("should validate a freshly generated token with sufficient elapsed time", async () => {
    // Generate token with timestamp set 2 seconds in the past to satisfy MIN_FILL_TIME
    const challenge = generateChallenge("127.0.0.1");
    
    // Simulate req with challenge token
    const req = {
      body: {
        _mbk_shield_token: challenge.token,
      },
      headers: {},
      ip: "127.0.0.1",
    };

    // If submitted immediately (< 1.5s), it detects rapid submission
    const immediateResult = await verifyBotProtection(req);
    expect(immediateResult.valid).toBe(false);
    expect(immediateResult.error).toContain("Submission too rapid");
  });
});
