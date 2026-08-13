import { domainRedirect } from "../middleware/domainRedirect.js";
import { legalContent } from "../services/legalContentService.js";

const siteViews = {
    main: {
        view: "mainPages/mainDomain/index.handlebars",
        layout: "tailwind",
    },
    download: {
        view: "mainPages/otherDomain/download.handlebars",
        layout: "tailwind",
        mainAppLink: process.env.PortalVersionControlJson
            ? JSON.parse(process.env.PortalVersionControlJson)
            : null,
    },
};

// Home page (domain-aware)
export function homePage(req, res) {
    domainRedirect(req, res, () => {
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
        layout: "tailwind",
        title: "Frequently Asked Questions - MBK Tech",
    });
}

// Support & Contact page
export function supportPage(req, res) {
    res.render("mainPages/mainDomain/Support&Contact.handlebars", {
        layout: "tailwind",
        title: "Support Ticket System - MBK Tech Support & Contact",
    });
}

// Terms & Conditions page
export function termsPage(req, res) {
    res.render("mainPages/mainDomain/Terms&Conditions.handlebars", {
        layout: "tailwind",
        title: "Terms & Conditions - MBK Tech",
        termsContent: legalContent.terms,
    });
}

// Privacy Policy page
export function privacyPage(req, res) {
    res.render("mainPages/mainDomain/PrivacyPolicy.handlebars", {
        layout: "tailwind",
        title: "Privacy Policy - MBK Tech",
        privacyContent: legalContent.privacy,
    });
}

// Track Ticket page
export function trackTicketPage(req, res) {
    res.render("mainPages/mainDomain/TrackTicket.handlebars", {
        layout: "tailwind",
        title: "Support Ticket System - MBK Tech",
    });
}

// Services page
export function servicesPage(req, res) {
    res.render("mainPages/mainDomain/services.handlebars", {
        layout: "tailwind",
        title: "Services - MBK Tech",
    });
}

// Basic Package page
export function basicPackagePage(req, res) {
    res.render("mainPages/mainDomain/BasicPackage.handlebars", {
        layout: "tailwind",
        title: "Basic Package - MBK Tech",
    });
}

// Advanced Package page
export function advancedPackagePage(req, res) {
    res.render("mainPages/mainDomain/AdvancedPackage.handlebars", {
        layout: "tailwind",
        title: "Advanced Package - MBK Tech",
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
        layout: "tailwind",
    });
}
