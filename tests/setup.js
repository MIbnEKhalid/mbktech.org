/**
 * Global test setup for mbktech.org — runs before every test file.
 */
import { vi } from "vitest";

// Force SQLite in-memory mode for tests
process.env.NODE_ENV = "test";
process.env.DB_TYPE = "sqlite";
process.env.SQLITE_PATH = ":memory:";
process.env.BOT_PROTECTION_SECRET = "test-bot-protection-secret-2026";
process.env.localenv = "true";
process.env.site = "main";
process.env.PortalVersionControlJson = JSON.stringify({
  latestVersion: "1.5.0",
  downloadUrl: "https://mbktech.org/download",
  mandatory: false,
});
