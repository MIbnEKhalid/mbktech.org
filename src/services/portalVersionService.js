import { pool } from "../config/database.js";

const PORTAL_VERSION_CACHE = { data: null, fetchedAt: 0, ttl: 3600_000 };

export function getPortalAppVersion() {
    const now = Date.now();
    if (PORTAL_VERSION_CACHE.data && now - PORTAL_VERSION_CACHE.fetchedAt < PORTAL_VERSION_CACHE.ttl) {
        return PORTAL_VERSION_CACHE.data;
    }
    const parsed = JSON.parse(process.env.PortalVersionControlJson || "{}");
    PORTAL_VERSION_CACHE.data = parsed;
    PORTAL_VERSION_CACHE.fetchedAt = now;
    return parsed;
}
