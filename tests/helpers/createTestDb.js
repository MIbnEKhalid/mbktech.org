import path from "path";
import { fileURLToPath } from "url";
import { applySchema, closeAllConnections } from "mbkauthe";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SCHEMA_PATH = path.resolve(__dirname, "../../src/db/schema/schema.sqlite.sql");

/**
 * Initializes and returns the shared singleton database adapter with the mbktech schema applied.
 */
export async function createTestDb() {
  const { defaultAdapter } = await import("../../src/db/index.js");
  await applySchema(defaultAdapter, SCHEMA_PATH, { silent: true, name: "mbktech-test-schema" });
  return defaultAdapter;
}

/**
 * Clean up connections gracefully after test completion.
 */
export async function cleanupTestDb() {
  try {
    await closeAllConnections();
  } catch {
    // ignore
  }
}
