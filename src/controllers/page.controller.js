import { domainRedirect } from "../middleware/domain-redirect.js";
import { legalContent } from "../services/legal-content.service.js";
import { mbkautheContentService } from "../services/mbkauthe-content.service.js";
import { mbkautheHome } from "./mbkauthe.controller.js";

const siteViews = {
    main: {
        view: "mainPages/mainDomain/index.handlebars",
        layout: "main",
    },
    download: {
        view: "mainPages/otherDomain/download.handlebars",
        layout: "main",
        mainAppLink: process.env.PortalVersionControlJson
            ? JSON.parse(process.env.PortalVersionControlJson)
            : null,
    },
    mbkauthe: {
        view: "mainPages/mbkautheDomain/index.handlebars",
        layout: "main",
        title: "MBKAuthe — Modern Node.js & Express Authentication Engine",
        isAutheSite: true,
        isSubdomain: true,
    },
};

// Home page (domain-aware)
export function homePage(req, res) {
    domainRedirect(req, res, () => {
        if (req.site === "mbkauthe") {
            return mbkautheHome(req, res);
        }

        const viewEntry = siteViews[req.site] || siteViews.main;
        console.log(`Rendering view: ${JSON.stringify(viewEntry)}`);

        if (typeof viewEntry === "object") {
            const { view, ...locals } = viewEntry;
            res.render(view, locals);
        } else {
            res.render(viewEntry);
        }
    });
}

// FAQs page
export function faqsPage(req, res) {
    res.render("mainPages/mainDomain/FAQs.handlebars", {
        layout: "main",
        title: "Frequently Asked Questions - MBK Tech",
    });
}

// Support & Contact page
export function supportPage(req, res) {
    res.render("mainPages/mainDomain/Support&Contact.handlebars", {
        layout: "main",
        title: "Support Ticket System - MBK Tech Support & Contact",
        turnstileSiteKey: process.env.TURNSTILE_SITE_KEY || null,
    });
}

// Terms & Conditions page
export function termsPage(req, res) {
    res.render("mainPages/mainDomain/LegalDocument.handlebars", {
        layout: "main",
        title: "Terms & Conditions - MBK Tech",
        docCategory: "Terms of Service & Governance",
        docIcon: "lni-file",
        docTitle: "Terms & Conditions",
        docDescription: "The contractual rules, licensing terms, and obligations governing access to and usage of MBKTech software, services, and web portals.",
        effectiveDate: "August 6, 2026",
        version: "v1.0.0 (Active)",
        entity: "MBKTech.org",
        readingTime: "~7 mins read",
        docContent: legalContent.terms,
    });
}

// Privacy Policy page
export function privacyPage(req, res) {
    res.render("mainPages/mainDomain/LegalDocument.handlebars", {
        layout: "main",
        title: "Privacy Policy - MBK Tech",
        docCategory: "Legal & Compliance",
        docIcon: "lni-shield",
        docTitle: "Privacy Policy",
        docDescription: "How MBKTech.org collects, uses, processes, stores, and safeguards your personal information across all platforms.",
        effectiveDate: "August 6, 2026",
        version: "v1.0.0 (Active)",
        entity: "MBKTech.org",
        readingTime: "~6 mins read",
        docContent: legalContent.privacy,
    });
}

// Track Ticket page
export function trackTicketPage(req, res) {
    res.render("mainPages/mainDomain/TrackTicket.handlebars", {
        layout: "main",
        title: "Support Ticket System - MBK Tech",
    });
}

// Services page
export function servicesPage(req, res) {
    res.render("mainPages/mainDomain/services.handlebars", {
        layout: "main",
        title: "Services - MBK Tech",
    });
}

// Basic Package page
export function basicPackagePage(req, res) {
    res.render("mainPages/mainDomain/BasicPackage.handlebars", {
        layout: "main",
        title: "Basic Package - MBK Tech",
    });
}

// Advanced Package page
export function advancedPackagePage(req, res) {
    res.render("mainPages/mainDomain/AdvancedPackage.handlebars", {
        layout: "main",
        title: "Advanced Package - MBK Tech",
    });
}

// Service Status page
export function statusPage(req, res) {
    res.render("mainPages/mainDomain/Status.handlebars", {
        layout: "main",
        title: "Service Status - MBK Tech",
    });
}

// TrackTicket redirect
export function trackTicketRedirect(req, res) {
    res.redirect("/TrackTicket");
}

// 404 handler
export function notFound(req, res) {
    console.log(`Path not found: ${req.url}`);
    res.status(404).render("mainPages/404.handlebars", {
        layout: "main",
    });
}
