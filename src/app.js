import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import compression from "compression";
import cors from "cors";

// --- Config & utils ---
import { configureHandlebars } from "./config/handlebars.js";

// --- Middleware ---
import { apiRateLimit, requestLogger } from "./middleware/security.js";

// --- Routes ---
import { mountRoutes } from "./routes/index.js";

// --- Controllers ---
import { notFound } from "./controllers/pageController.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "../");

// ---------------------
// Global middleware
// ---------------------
app.set("trust proxy", 1);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Only log requests when not running tests
if (process.env.NODE_ENV !== "test") {
    app.use(requestLogger);
}

// Rate limiting (skipped in test environment to avoid test throttling)
if (process.env.NODE_ENV !== "test") {
    app.use(apiRateLimit);
}

app.use(cors());
app.use(compression());

// Static files
app.use("/", express.static(path.join(projectRoot, "public")));

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

export { app };
export default app;
