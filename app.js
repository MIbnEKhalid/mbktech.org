import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import compression from "compression";
import cors from "cors";

// --- Config & utils ---
import { configureHandlebars } from "./src/config/handlebars.js";

// --- Middleware ---
import { apiRateLimit, requestLogger } from "./src/middleware/security.js";

// --- Routes ---
import { mountRoutes } from "./src/routes/index.js";

// --- Controllers ---
import { notFound } from "./src/controllers/pageController.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------------------
// Global middleware
// ---------------------
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.set("trust proxy", 1);

app.use(requestLogger);
app.use(apiRateLimit);
app.use(cors());
app.use(compression());

// Static files
app.use("/", express.static(path.join(__dirname, "public")));

// ---------------------
// Handlebars setup
// ---------------------
configureHandlebars(app);

// ---------------------
// Routes
// ---------------------
mountRoutes(app);

// ---------------------
// 404 catch-all
// ---------------------
app.use(notFound);

// ---------------------
// Start server
// ---------------------
const PORT = process.env.PORT || 4133;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
