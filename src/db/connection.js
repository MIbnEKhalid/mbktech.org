import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { dblogin, dbType as mbkDbType, mbkautheVar } from "mbkauthe";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "../../");

dotenv.config();

export const dbType = (process.env.DB_TYPE || mbkautheVar.DB_TYPE || mbkDbType || "postgres").toLowerCase();

/** Path to SQLite database file (used when DB_TYPE=sqlite). */
export const sqlitePath =
  process.env.SQLITE_PATH || mbkautheVar.SQLITE_PATH || path.join(ROOT_DIR, "data", "mbktech.org.db");

// Ensure data directory exists if using SQLite file path
if (dbType === "sqlite" && sqlitePath !== ":memory:") {
  const dir = path.dirname(path.resolve(sqlitePath));
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Utilize same connection pool as mbkauthe (dblogin) for host app and auth queries
export const pool = dblogin;

export const poolConfig = {
  connectionString: mbkautheVar.LOGIN_DB || process.env.LOGIN_DB || process.env.NEON_POSTGRES || process.env.DATABASE_URL,
  application_name: `${mbkautheVar.APP_NAME || "mbktech.org"}-shared`,
};

/**
 * Tests database connectivity using the shared pool.
 */
export async function testDbConnection() {
  if (dbType === "sqlite") return true;
  try {
    const client = await pool.connect();
    client.release();
    return true;
  } catch (err) {
    console.error("Database connection test error:", err?.message || err);
    return false;
  }
}

export default pool;