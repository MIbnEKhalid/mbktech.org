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
} from "../controllers/pageController.js";
import {
    sitemapXML,
    sitemapByType,
    robotsTxt,
} from "../controllers/sitemapController.js";
import { domainRedirect } from "../middleware/domainRedirect.js";

const router = Router();

// Home
router.get("/", homePage);

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
router.get("/sitemap.xml", domainRedirect, sitemapXML);
router.get("/sitemap/:type", domainRedirect, sitemapByType);
router.get("/robots.txt", domainRedirect, robotsTxt);

export default router;
