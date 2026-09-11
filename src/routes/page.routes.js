import { Router } from "express";
import { homePage, faqsPage, supportPage, termsPage, privacyPage, trackTicketPage, servicesPage, basicPackagePage, advancedPackagePage, statusPage, trackTicketRedirect } from "../controllers/page.controller.js";
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
router.get(["/docs", "/Docs"], mbkautheDocsRoute);
router.get(["/docs/:slug", "/Docs/:slug"], mbkautheDocsRoute);
router.get(["/features", "/Features", "/security", "/Security"], mbkautheFeaturesRoute);
router.get(["/api-reference", "/apiReference", "/api"], mbkautheApiReferenceRoute);
router.get(["/examples", "/Examples"], mbkautheExamplesRoute);
router.get(["/changelog", "/Changelog"], mbkautheChangelogRoute);

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

// ============================ SITEMAP / ROBOTS ============================
router.get("/sitemap.xml", sitemapXML);
router.get("/sitemap/:type", sitemapByType);
router.get("/robots.txt", robotsTxt);

export default router;
