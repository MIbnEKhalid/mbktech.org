import crypto from "crypto";
import NodeCache from "node-cache";

// Cache for replay prevention (tokens expire after 15 minutes)
const usedTokensCache = new NodeCache({ stdTTL: 900, checkperiod: 120 });

// Secret key for HMAC signing (uses env variable or stable fallback)
const getSecretKey = () => process.env.BOT_PROTECTION_SECRET || "mbktech-shield-security-salt-2026";
const MIN_FILL_TIME_MS = 1500; // Humans need at least 1.5s to read & submit
const MAX_TOKEN_AGE_MS = 15 * 60 * 1000; // 15 minutes validity

/**
 * Generates a signed cryptographic challenge token for the client.
 */
export function generateChallenge(clientIp = "") {
    const timestamp = Date.now();
    const nonce = crypto.randomBytes(16).toString("hex");
    const payloadObj = {
        ts: timestamp,
        nonce,
        ip: clientIp || "",
    };
    const payload = Buffer.from(JSON.stringify(payloadObj)).toString("base64url");
    const signature = crypto
        .createHmac("sha256", getSecretKey())
        .update(payload)
        .digest("base64url");

    return {
        token: `${payload}.${signature}`,
        timestamp,
        nonce,
    };
}

/**
 * Express route handler for GET /api/bot-challenge
 */
export function botChallengeHandler(req, res) {
    const clientIp = req.ip || req.headers["x-forwarded-for"] || "";
    const challenge = generateChallenge(clientIp);
    return res.json({
        success: true,
        token: challenge.token,
        ts: challenge.timestamp,
    });
}

/**
 * Validates the bot token and honeypot.
 */
export async function verifyBotProtection(req) {
    const body = req.body || {};

    // 1. Honeypot check: If the hidden bot field is filled, it's an automated bot
    const honeypot = body._bot_hp || body.website_url || body._hp_check;
    if (honeypot && String(honeypot).trim().length > 0) {
        return {
            valid: false,
            error: "Automated submission detected. Request blocked.",
            code: "HONEYPOT_TRIGGERED",
        };
    }

    // 2. Cloudflare Turnstile verification (if token is provided or secret is configured)
    const turnstileResponse = body["cf-turnstile-response"] || body.turnstileToken;
    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY || process.env.CLOUDFLARE_TURNSTILE_SECRET;

    if (turnstileSecret && turnstileResponse) {
        try {
            const clientIp = req.ip || req.headers["x-forwarded-for"] || "";
            const formBody = new URLSearchParams({
                secret: turnstileSecret,
                response: turnstileResponse,
                remoteip: clientIp,
            });

            const cfRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: formBody.toString(),
            });

            const cfData = await cfRes.json();
            if (!cfData.success) {
                return {
                    valid: false,
                    error: "Cloudflare Turnstile verification failed. Please try again.",
                    code: "TURNSTILE_FAILED",
                };
            }
            // Turnstile succeeded
            return { valid: true };
        } catch (err) {
            console.error("Turnstile verification error:", err);
            // If Turnstile server fails, continue with HMAC token check
        }
    }

    // 3. Built-in "I am not a robot" Shield token check
    const token = body._mbk_shield_token || body._bot_token || body.botToken || body.shieldToken;
    if (!token || typeof token !== "string") {
        return {
            valid: false,
            error: "Please complete the 'I am not a robot' verification before submitting.",
            code: "MISSING_BOT_TOKEN",
        };
    }

    const parts = token.split(".");
    if (parts.length !== 2) {
        return {
            valid: false,
            error: "Invalid security verification token.",
            code: "MALFORMED_TOKEN",
        };
    }

    const [payloadBase64, signature] = parts;

    // Verify HMAC signature
    const expectedSig = crypto
        .createHmac("sha256", getSecretKey())
        .update(payloadBase64)
        .digest("base64url");

    if (signature !== expectedSig) {
        return {
            valid: false,
            error: "Security verification signature mismatch. Please retry.",
            code: "SIGNATURE_MISMATCH",
        };
    }

    let payloadObj;
    try {
        payloadObj = JSON.parse(Buffer.from(payloadBase64, "base64url").toString("utf-8"));
    } catch (_) {
        return {
            valid: false,
            error: "Invalid security verification token payload.",
            code: "MALFORMED_TOKEN",
        };
    }

    const { ts, nonce } = payloadObj;
    const timestamp = parseInt(ts, 10);

    if (isNaN(timestamp) || !nonce) {
        return {
            valid: false,
            error: "Invalid security timestamp.",
            code: "INVALID_TIMESTAMP",
        };
    }

    // Check token age (minimum fill time & maximum expiration)
    const now = Date.now();
    const elapsed = now - timestamp;

    if (elapsed < MIN_FILL_TIME_MS) {
        return {
            valid: false,
            error: "Submission too rapid. Please take your time.",
            code: "SUBMITTED_TOO_FAST",
        };
    }

    if (elapsed > MAX_TOKEN_AGE_MS) {
        return {
            valid: false,
            error: "Verification expired. Please re-verify the 'I am not a robot' checkbox.",
            code: "TOKEN_EXPIRED",
        };
    }

    // Prevent token reuse / replay attacks
    if (usedTokensCache.get(nonce)) {
        return {
            valid: false,
            error: "This verification token has already been used. Please verify again.",
            code: "TOKEN_ALREADY_USED",
        };
    }

    // Mark nonce as used for the remainder of its lifetime
    const remainingTtlSeconds = Math.max(1, Math.floor((MAX_TOKEN_AGE_MS - elapsed) / 1000));
    usedTokensCache.set(nonce, true, remainingTtlSeconds);

    return { valid: true };
}

/**
 * Express middleware for bot and DDoS verification on form endpoints.
 */
export async function botProtectionGuard(req, res, next) {
    try {
        const result = await verifyBotProtection(req);
        if (!result.valid) {
            return res.status(403).json({
                success: false,
                error: result.error,
                code: result.code,
            });
        }
        next();
    } catch (err) {
        console.error("Bot protection middleware error:", err);
        return res.status(500).json({
            success: false,
            error: "Security verification check failed. Please try again.",
        });
    }
}
