import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { SqliteAdapter, applySchema } from "mbkauthe";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "../../");
const SCHEMA_PATH = path.join(ROOT_DIR, "src", "db", "schema", "schema.sqlite.sql");

// Priority: CLI argument (excluding flags) > process.env.SQLITE_PATH > default path
const args = process.argv.slice(2);
const customPath = args.find((arg) => !arg.startsWith("-"));
const dbPath = customPath || process.env.SQLITE_PATH || path.join(ROOT_DIR, "data", "mbktech.org.db");
const isReset = args.includes("--reset") || args.includes("--force");

async function initSqliteDb() {
  console.log(`[init-sqlite] Target database: ${dbPath}`);

  if (dbPath !== ":memory:") {
    const resolvedPath = path.resolve(dbPath);
    const dir = path.dirname(resolvedPath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`[init-sqlite] Created directory: ${dir}`);
    }

    if (isReset && fs.existsSync(resolvedPath)) {
      console.log(`[init-sqlite] Resetting database file: ${resolvedPath}`);
      fs.unlinkSync(resolvedPath);
    }
  }

  if (!fs.existsSync(SCHEMA_PATH)) {
    console.error(`[init-sqlite] Schema file not found: ${SCHEMA_PATH}`);
    process.exit(1);
  }

  const adapter = new SqliteAdapter(dbPath);

  try {
    console.log(`[init-sqlite] Applying SQLite schema from: ${SCHEMA_PATH}`);
    await applySchema(adapter, SCHEMA_PATH, { name: "mbktech.org-sqlite" });

    // Inspect created tables
    const tables = adapter.db
      .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")
      .all()
      .map((t) => t.name);

    console.log(`[init-sqlite] Successfully initialized ${tables.length} tables:`, tables.join(", "));
  } catch (err) {
    console.error("[init-sqlite] Failed to initialize SQLite database:", err.message || err);
    process.exit(1);
  } finally {
    adapter.close();
  }
}

initSqliteDb();
