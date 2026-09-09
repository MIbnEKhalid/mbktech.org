import { isJsonRequest, sendError } from "mbkauthe";

export function notFoundHandler(req, res) {
    if (req.path?.startsWith("/Assets/") || req.path?.startsWith("/assets/")) {
        return res.status(404).end();
    }

    if (isJsonRequest(req)) {
        return sendError(res, "The requested API route was not found.", {
            statusCode: 404,
            code: "ROUTE_NOT_FOUND",
            req,
        });
    }

    console.log(`Path not found: ${req.url}`);
    return res.status(404).render("mainPages/404.handlebars", {
        layout: "main",
    });
}

export function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }

    const statusCode = Number(err.status || err.statusCode || 500);
    const isClientError = statusCode >= 400 && statusCode < 500;

    if (!isClientError) {
        console.error("[mbktech.org] Unhandled error:", err?.stack || err);
    }

    if (isJsonRequest(req)) {
        return sendError(res, err, {
            statusCode,
            req,
            details: process.env.NODE_ENV !== "production" ? err.stack : undefined,
        });
    }

    return res.status(statusCode).render("mainPages/404.handlebars", {
        layout: "main",
        error: isClientError ? (err.name || "Client Error") : "Internal Server Error",
        message: err.message || "An unexpected error occurred.",
    });
}
