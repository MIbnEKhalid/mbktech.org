import pageRoutes from "./page.routes.js";
import apiRoutes from "./api.routes.js";
import ticketRoutes from "./ticket.routes.js";
import postRoutes from "./post.routes.js";

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

    // Form submission routes — /api/forms/submit and legacy /post/SubmitForm
    app.use("/api/forms", postRoutes);
    app.use("/post", postRoutes);
}
