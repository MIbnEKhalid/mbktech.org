import { Router } from "express";
import {
    homePage,
    faqsPage,
    supportPage,
    termsPage,
    trackTicketPage,
    servicesPage,
    basicPackagePage,
    advancedPackagePage,
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
router.get(["/Support&Contact", "/Support", "/Contact", "/Contact&Support"], supportPage);
router.get(["/Terms&Conditions", "/PrivacyPolicy", "/privacypolicy", "/terms&conditions"], termsPage);
router.get(["/TrackTicket"], trackTicketPage);
router.get(["/Services", "/services"], servicesPage);
router.get(["/Services/WebDevBasicPackage", "/Services/webdevbasicpackage", "/Services/webdevbasic-package"], basicPackagePage);
router.get(["/Services/WebDevFullStackPackage", "/Services/webdevfullstackpackage", "/Services/webdevfullstack-package"], advancedPackagePage);

// Redirects
router.get(["/Ticket", "/Track", "/trackticket"], trackTicketRedirect);

// Sitemap & robots
router.get("/sitemap.xml", domainRedirect, sitemapXML);
router.get("/sitemap/:type", domainRedirect, sitemapByType);
router.get("/robots.txt", domainRedirect, robotsTxt);

export default router;
