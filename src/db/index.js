import { PostgresAdapter, SqliteAdapter, postgresDialect, sqliteDialect, BaseRepository, registerGracefulShutdown } from "mbkauthe";
import { pool, poolConfig, sqlitePath, dbType, testDbConnection } from "./connection.js";
import { initPostgresSchema, initSqliteSchema } from "./schema/init.js";

let defaultAdapter;

if (dbType === "sqlite") {
  const adapter = new SqliteAdapter(sqlitePath, {
    dialect: sqliteDialect,
    jsonColumns: ["audit_trail", "additional_fields"],
    booleanColumns: ["is_active"],
  });
  registerGracefulShutdown(adapter);
  defaultAdapter = adapter;
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
  initPostgresSchema,
  initSqliteSchema,
  testDbConnection,
  PostgresAdapter,
  postgresDialect,
  SqliteAdapter,
  sqliteDialect,
  BaseRepository,
};

export default defaultAdapter;
