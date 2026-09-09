import { Router } from "express";
import {
    homePage,
    faqsPage,
    supportPage,
    termsPage,
    privacyPage,
    trackTicketPage,
    servicesPage,
    basicPackagePage,
    advancedPackagePage,
    statusPage,
    trackTicketRedirect,
} from "../controllers/page.controller.js";
import {
    mbkautheHome,
    mbkautheDocs,
    mbkautheFeatures,
    mbkautheApiReference,
    mbkautheExamples,
    mbkautheChangelog,
} from "../controllers/mbkauthe.controller.js";
import {
    sitemapXML,
    sitemapByType,
    robotsTxt,
} from "../controllers/sitemap.controller.js";
import { domainRedirect } from "../middleware/domain-redirect.js";

const router = Router();

// Apply domain redirect middleware to establish req.site
router.use(domainRedirect);

// Home (domain-aware)
router.get("/", homePage);

// Disallow /mbkauthe and /mbkauthe/* on mbktech.org (redirect to https://mbkauthe.mbktech.org)
router.all(["/mbkauthe", "/mbkauthe/*splat"], (req, res) => {
    const rawPath = req.path.replace(/^\/mbkauthe/i, "") || "";
    const cleanPath = rawPath.startsWith("/") ? rawPath : `/${rawPath}`;
    if (req.site === "mbkauthe") {
        return res.redirect(301, cleanPath === "/" ? "/" : cleanPath);
    }
    return res.redirect(301, `https://mbkauthe.mbktech.org${cleanPath === "/" ? "" : cleanPath}`);
});

// MBKAuthe dedicated product & doc routes
router.get(["/docs", "/Docs"], (req, res, next) => {
    if (req.site === "mbkauthe") return mbkautheDocs(req, res);
    return res.redirect(301, "https://mbkauthe.mbktech.org/docs");
});
router.get(["/docs/:slug", "/Docs/:slug"], (req, res, next) => {
    if (req.site === "mbkauthe") return mbkautheDocs(req, res);
    return res.redirect(301, `https://mbkauthe.mbktech.org/docs/${req.params.slug}`);
});
router.get(["/features", "/Features", "/security", "/Security"], (req, res, next) => {
    if (req.site === "mbkauthe") return mbkautheFeatures(req, res);
    return res.redirect(301, "https://mbkauthe.mbktech.org/features");
});
router.get(["/api-reference", "/apiReference", "/api"], (req, res, next) => {
    if (req.site === "mbkauthe") return mbkautheApiReference(req, res);
    return res.redirect(301, "https://mbkauthe.mbktech.org/api-reference");
});
router.get(["/examples", "/Examples"], (req, res, next) => {
    if (req.site === "mbkauthe") return mbkautheExamples(req, res);
    return res.redirect(301, "https://mbkauthe.mbktech.org/examples");
});
router.get(["/changelog", "/Changelog"], (req, res, next) => {
    if (req.site === "mbkauthe") return mbkautheChangelog(req, res);
    return res.redirect(301, "https://mbkauthe.mbktech.org/changelog");
});

// Static pages
router.get(["/FAQS", "/FAQs", "/faqs", "/FrequentlyAskedQuestions"], faqsPage);
router.get("/FAQs/:slug", faqsPage);
router.get(["/Support&Contact", "/Support%26Contact", "/Support", "/Contact", "/Contact&Support", "/Contact%26Support"], supportPage);
router.get(["/Terms&Conditions", "/Terms%26Conditions", "/terms&conditions", "/terms%26conditions"], termsPage);
router.get(["/PrivacyPolicy", "/privacypolicy"], privacyPage);
router.get(["/TrackTicket"], trackTicketPage);
router.get(["/Services", "/services"], servicesPage);
router.get(["/Services/WebDevBasicPackage", "/Services/webdevbasicpackage", "/Services/webdevbasic-package"], basicPackagePage);
router.get(["/Services/WebDevFullStackPackage", "/Services/webdevfullstackpackage", "/Services/webdevfullstack-package"], advancedPackagePage);
router.get(["/Status", "/status"], statusPage);

// Redirects
router.get(["/Ticket", "/Track", "/trackticket"], trackTicketRedirect);

// Sitemap & robots
router.get("/sitemap.xml", sitemapXML);
router.get("/sitemap/:type", sitemapByType);
router.get("/robots.txt", robotsTxt);

export default router;
