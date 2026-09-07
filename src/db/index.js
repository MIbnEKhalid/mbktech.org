import {
  PostgresAdapter,
  SqliteAdapter,
  postgresDialect,
  sqliteDialect,
  BaseRepository,
  registerGracefulShutdown,
} from "mbkauthe";
import { pool, poolConfig, sqlitePath, dbType, initSchema, testDbConnection } from "./connection.js";

let defaultAdapter;

if (dbType === "sqlite") {
  const adapter = new SqliteAdapter(sqlitePath, {
    dialect: sqliteDialect,
    jsonColumns: ["audit_trail", "additional_fields"],
    booleanColumns: ["is_active"],
  });
  registerGracefulShutdown(adapter);
  defaultAdapter = adapter;

  // Auto-initialize SQLite schema idempotently outside test runs
  if (process.env.NODE_ENV !== "test") {
    initSchema(adapter).catch((err) => {
      console.error("[sqlite] Schema initialization error:", err.message);
    });
  }
} else {
  defaultAdapter = new PostgresAdapter(pool, postgresDialect);
}

export const adapter = defaultAdapter;

export {
  defaultAdapter,
  pool,
  poolConfig,
  sqlitePath,
  dbType,
  initSchema,
  testDbConnection,
  PostgresAdapter,
  postgresDialect,
  SqliteAdapter,
  sqliteDialect,
  BaseRepository,
};

export default defaultAdapter;
