import pageRoutes from "./pageRoutes.js";
import apiRoutes from "./apiRoutes.js";
import ticketRoutes from "./ticketRoutes.js";
import postRoutes from "./postRoutes.js";

/**
 * Mount all sub-routers onto the provided Express app.
 */
export function mountRoutes(app) {
    // Page routes (/, /FAQs, /Services, etc.) — mounted at root
    app.use(pageRoutes);

    // Ticket routes — /api/tickets/*
    app.use("/api", ticketRoutes);

    // API routes — /api/*
    app.use("/api", apiRoutes);

    // POST routes — /post/*
    app.use("/post", postRoutes);
}
