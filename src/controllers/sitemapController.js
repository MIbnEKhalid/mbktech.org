import { generateSitemap as generate } from "../utils/sitemapGenerator.js";

export async function sitemapXML(req, res) {
    try {
        const domain = req.hostname;
        const sitemap = await generate(
            domain,
            domain.includes("localhost") ? req.site : null
        );
        res.header("Content-Type", "application/xml");
        res.send(sitemap);
    } catch (error) {
        console.error("Error generating sitemap:", error);
        res.status(500).send("Error generating sitemap");
    }
}

export async function sitemapByType(req, res) {
    try {
        const domain = req.hostname;
        const sitemap = await generate(domain, req.params.type);
        res.header("Content-Type", "application/xml");
        res.send(sitemap);
    } catch (error) {
        console.error("Error generating sitemap:", error);
        res.status(500).send("Error generating sitemap");
    }
}

export function robotsTxt(req, res) {
    const hostname = req.headers["x-forwarded-host"] || req.headers.host;
    const domain = hostname.replace(/:\d+$/, "");

    const content = `User-agent: *
Allow: /

Sitemap: https://${domain}/sitemap.xml`;
    res.type("text/plain");
    res.send(content);
}
