/**
 * Domain redirect middleware.
 * Determines which "site" the request is for based on hostname,
 * and sets req.site accordingly.
 */
export function domainRedirect(req, res, next) {
    let hostname = req.headers["x-forwarded-host"] || req.headers.host;
    hostname = hostname.replace(/:\d+$/, "");

    console.log(`Incoming request to hostname: http://${hostname}`);

    if (process.env.localenv === "true") {
        req.site = process.env.site;
    } else {
        req.site =
            {
                "mbktech.org": "main",
                "www.mbktech.org": "main",
                "download.mbktech.org": "download",
            }[hostname] || "main";
    }

    console.log(`Request site set to: ${req.site}`);
    next();
}
