import { Router } from "express";
import { homePage, faqsPage, supportPage, termsPage, privacyPage, trackTicketPage, servicesPage, basicPackagePage, advancedPackagePage, statusPage } from "../controllers/page.controller.js";
import { mbkautheSplatRedirect, mbkautheDocsRoute, mbkautheFeaturesRoute, mbkautheApiReferenceRoute, mbkautheExamplesRoute, mbkautheChangelogRoute } from "../controllers/mbkauthe.controller.js";
import { sitemapXML, sitemapByType, robotsTxt } from "../controllers/sitemap.controller.js";
import { domainRedirect } from "../middleware/domain-redirect.js";

const router = Router();

// Apply domain redirect middleware to establish req.site
router.use(domainRedirect);

// =========================== PAGES (HTML) ===========================
// Home (domain-aware)
router.get("/", homePage);

// Disallow /mbkauthe and /mbkauthe/* on mbktech.org (redirect to mbkauthe subdomain)
router.all(["/mbkauthe", "/mbkauthe/*splat"], mbkautheSplatRedirect);

// MBKAuthe dedicated product & doc routes (domain-aware)
router.get("/docs", mbkautheDocsRoute);
router.get("/docs/:slug", mbkautheDocsRoute);
router.get("/features", mbkautheFeaturesRoute);
router.get("/security", mbkautheFeaturesRoute);
router.get("/api-reference", mbkautheApiReferenceRoute);
router.get("/examples", mbkautheExamplesRoute);
router.get("/changelog", mbkautheChangelogRoute);

// Static pages
router.get(["/faqs", "/FAQs"], faqsPage);
router.get("/faqs/:slug", faqsPage);
router.get(["/support", "/Support", "/contact", "/Contact"], supportPage);
router.get(["/terms", "/Terms", "/Terms&Conditions", "/terms-and-conditions"], termsPage);
router.get(["/privacy", "/Privacy", "/PrivacyPolicy", "/privacy-policy"], privacyPage);
router.get(["/tickets/track", "/TrackTicket", "/track-ticket"], trackTicketPage);
router.get(["/services", "/Services"], servicesPage);
router.get(["/services/web-dev-basic", "/Services/WebDevBasicPackage"], basicPackagePage);
router.get(["/services/web-dev-full-stack", "/Services/WebDevFullStackPackage"], advancedPackagePage);
router.get(["/status", "/Status"], statusPage);

// ============================ SITEMAP / ROBOTS ============================
router.get("/sitemap.xml", sitemapXML);
router.get("/sitemap/:type", sitemapByType);
router.get("/robots.txt", robotsTxt);

export default router;
