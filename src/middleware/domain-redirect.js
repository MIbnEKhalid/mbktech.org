/**
 * Domain redirect middleware.
 * Determines which "site" the request is for based on hostname,
 * and sets req.site accordingly.
 */
export function domainRedirect(req, res, next) {
    let hostname = req.headers["x-forwarded-host"] || req.headers.host;
    hostname = hostname.replace(/:\d+$/, "");

    console.log(`Incoming request to hostname: http://${hostname}`);

    if (
        hostname === "mbkauthe.mbktech.org" ||
        hostname === "auth.mbktech.org" ||
        hostname.startsWith("mbkauthe.")
    ) {
        req.site = "mbkauthe";
    } else if (
        hostname === "download.mbktech.org" ||
        hostname.startsWith("download.")
    ) {
        req.site = "download";
    } else if (process.env.localenv === "true" && process.env.site) {
        req.site = process.env.site;
    } else {
        req.site =
            {
                "mbktech.org": "main",
                "www.mbktech.org": "main",
                "download.mbktech.org": "download",
                "mbkauthe.mbktech.org": "mbkauthe",
                "auth.mbktech.org": "mbkauthe",
            }[hostname] || "main";
    }

    console.log(`Request site set to: ${req.site}`);
    next();
}
