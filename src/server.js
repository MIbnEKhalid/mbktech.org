import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { testDbConnection, dbType } from "./db/connection.js";

const PORT = process.env.PORT || 4133;

if (!process.env.VERCEL) {
    app.listen(PORT, async () => {
        console.log(`Server running on http://localhost:${PORT}`);
        console.log(`Database engine: ${dbType}`);

        if (process.env.NODE_ENV !== "production") {
            const dbConnected = await testDbConnection();
            if (dbConnected) {
                console.log(`[db] Connection verified successfully (${dbType}).`);
            } else {
                console.warn(`[db] Warning: Database connection check did not succeed.`);
            }
        }
    });
}

export default app;
