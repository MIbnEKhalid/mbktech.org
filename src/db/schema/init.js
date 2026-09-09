import path from "node:path";
import { fileURLToPath } from "node:url";
import { applySchema } from "mbkauthe";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Initializes PostgreSQL schema for mbktech.org.
 * @param {import("pg").Pool} pool
 */
export async function initPostgresSchema(pool) {
  if (!pool) return;
  const schemaPath = path.join(__dirname, "postgres.sql");
  await applySchema(pool, schemaPath, { name: "mbktech.org-postgres" });
  console.log("[mbktech.org] PostgreSQL schema initialized successfully.");
}

/**
 * Initializes SQLite schema for mbktech.org.
 * @param {object} db - Sqlite handle or adapter
 */
export async function initSqliteSchema(db) {
  if (!db) return;
  const schemaPath = path.join(__dirname, "sqlite.sql");
  await applySchema(db, schemaPath, { name: "mbktech.org-sqlite" });
  console.log("[mbktech.org] SQLite schema initialized successfully.");
}

export default { initPostgresSchema, initSqliteSchema };
