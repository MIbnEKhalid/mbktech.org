import { domainRedirect } from "../middleware/domainRedirect.js";

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
        layout: "main",
        title: "Frequently Asked Questions - MBK Tech",
    });
}

// Support & Contact page
export function supportPage(req, res) {
    res.render("mainPages/mainDomain/Support&Contact.handlebars", {
        layout: "main",
        title: "Support Ticket System - MBK Tech Support & Contact",
    });
}

// Terms & Conditions page
export function termsPage(req, res) {
    res.render("mainPages/mainDomain/Terms&Conditions.handlebars", {
        layout: "main",
        title: "Terms & Conditions - MBK Tech",
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
