import pkg from "pg";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { applySchema, registerGracefulShutdown } from "mbkauthe";

const { Pool } = pkg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "../../");

dotenv.config();

export const dbType = (process.env.DB_TYPE || "postgres").toLowerCase();

/** Path to SQLite database file (used when DB_TYPE=sqlite). */
export const sqlitePath =
  process.env.SQLITE_PATH || path.join(ROOT_DIR, "data", "mbktech.org.db");

// Ensure data directory exists if using SQLite file path
if (dbType === "sqlite" && sqlitePath !== ":memory:") {
  const dir = path.dirname(path.resolve(sqlitePath));
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// PostgreSQL connection configuration
const connectionString = process.env.NEON_POSTGRES || process.env.DATABASE_URL;

export const poolConfig = {
  connectionString,
  ssl:
    process.env.NODE_ENV === "production" || !connectionString?.includes("localhost")
      ? { rejectUnauthorized: false }
      : false,
  max: process.env.VERCEL ? 3 : 15,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
};

const dummyPool = {
  query: async () => ({ rows: [], rowCount: 0 }),
  connect: async () => ({ query: async () => ({ rows: [], rowCount: 0 }), release: () => {} }),
  on: () => {},
  end: async () => {},
};

export const pool = dbType !== "sqlite" ? new Pool(poolConfig) : dummyPool;

if (dbType !== "sqlite" && pool && typeof pool.on === "function") {
  registerGracefulShutdown(pool);

  pool.on("error", (err) => {
    console.error("[PostgreSQL Pool] Idle client error:", err.message);
  });

  if (process.env.NODE_ENV !== "test" && connectionString) {
    (async () => {
      try {
        const client = await pool.connect();
        console.log("Connected to PostgreSQL database!");
        client.release();
      } catch (err) {
        console.error("PostgreSQL database connection error:", err.message);
      }
    })();
  }
}

/**
 * Initializes schema using mbkauthe applySchema helper.
 */
export async function initSchema(adapter) {
  try {
    const isSqlite = adapter?.dialect?.name === "sqlite" || dbType === "sqlite";
    const schemaFile = isSqlite ? "schema.sqlite.sql" : "schema.sql";
    const schemaPath = path.resolve(__dirname, "schema", schemaFile);

    if (fs.existsSync(schemaPath)) {
      await applySchema(adapter || pool, schemaPath, { name: "mbktech.org" });
    }
  } catch (err) {
    console.error("[db] Schema initialization error:", err.message);
  }
}

/**
 * Tests database connectivity.
 */
export async function testDbConnection() {
  if (dbType === "sqlite") return true;
  try {
    const client = await pool.connect();
    client.release();
    return true;
  } catch (err) {
    console.error("Database connection test error:", err.message);
    return false;
  }
}

export default pool;
