import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";

dotenv.config();

// PostgreSQL connection pool (primary)
export const pool = new Pool({
    connectionString: process.env.NEON_POSTGRES,
    ssl: {
        rejectUnauthorized: false,
    },
});


// Test connections
(async () => {
    try {
        const client = await pool.connect();
        console.log("Connected to primary Neon PostgreSQL database!");
        client.release();
    } catch (err) {
        console.error("Primary database connection error:", err);
    }
})();

const pool1 = pool;
export {pool1};