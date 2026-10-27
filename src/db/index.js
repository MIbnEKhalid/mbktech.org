import { dblogin, defaultAdapter, PostgresAdapter, SqliteAdapter, postgresDialect, sqliteDialect, BaseRepository, registerGracefulShutdown } from "mbkauthe";
import { pool, poolConfig, sqlitePath, dbType, testDbConnection } from "./connection.js";
import { initPostgresSchema, initSqliteSchema } from "./schema/init.js";

const adapter = defaultAdapter;

export { defaultAdapter, adapter, pool, poolConfig, sqlitePath, dbType, initPostgresSchema, initSqliteSchema, testDbConnection, PostgresAdapter, postgresDialect, SqliteAdapter, sqliteDialect, BaseRepository, dblogin, registerGracefulShutdown };

export default defaultAdapter;