import { mbkautheContentService } from "../services/mbkauthe-content.service.js";

/**
 * MBKAuthe Product Homepage controller
 */
export function mbkautheHome(req, res) {
    const product = mbkautheContentService.getProduct();
    const isSubdomain = req.site === "mbkauthe";

    res.render("mainPages/mbkautheDomain/index.handlebars", {
        layout: "main",
        title: "MBKAuthe — Modern Node.js & Express Authentication Engine",
        isAutheSite: true,
        isSubdomain,
        product,
    });
}

/**
 * MBKAuthe Documentation reader controller (handles /docs and /docs/:slug)
 */
export function mbkautheDocs(req, res) {
    const slug = req.params.slug || "getting-started";
    const doc = mbkautheContentService.getDocBySlug(slug);
    const isSubdomain = req.site === "mbkauthe";
    const nav = mbkautheContentService.getNavigation();
    const product = mbkautheContentService.getProduct();

    if (!doc) {
        return res.status(404).render("mainPages/404.handlebars", {
            layout: "main",
            title: "Document Not Found — MBKAuthe Docs",
            isAutheSite: true,
            isSubdomain,
        });
    }

    res.render("mainPages/mbkautheDomain/doc.handlebars", {
        layout: "main",
        title: `${doc.title} — MBKAuthe Documentation`,
        isAutheSite: true,
        isSubdomain,
        currentSlug: doc.slug,
        doc,
        nav,
        product,
    });
}

/**
 * MBKAuthe Security & Features deep-dive
 */
export function mbkautheFeatures(req, res) {
    const product = mbkautheContentService.getProduct();
    const isSubdomain = req.site === "mbkauthe";

    res.render("mainPages/mbkautheDomain/features.handlebars", {
        layout: "main",
        title: "Security & Features Architecture — MBKAuthe",
        isAutheSite: true,
        isSubdomain,
        product,
    });
}

/**
 * MBKAuthe API Reference catalog
 */
export function mbkautheApiReference(req, res) {
    const product = mbkautheContentService.getProduct();
    const isSubdomain = req.site === "mbkauthe";

    res.render("mainPages/mbkautheDomain/apiReference.handlebars", {
        layout: "main",
        title: "API Reference & Endpoints — MBKAuthe",
        isAutheSite: true,
        isSubdomain,
        product,
    });
}

/**
 * MBKAuthe Code Examples and Recipes
 */
export function mbkautheExamples(req, res) {
    const product = mbkautheContentService.getProduct();
    const isSubdomain = req.site === "mbkauthe";

    res.render("mainPages/mbkautheDomain/examples.handlebars", {
        layout: "main",
        title: "Code Examples & Recipes — MBKAuthe",
        isAutheSite: true,
        isSubdomain,
        product,
    });
}

/**
 * MBKAuthe Changelog & Release notes
 */
export function mbkautheChangelog(req, res) {
    const product = mbkautheContentService.getProduct();
    const isSubdomain = req.site === "mbkauthe";

    res.render("mainPages/mbkautheDomain/changelog.handlebars", {
        layout: "main",
        title: "Changelog & Version History — MBKAuthe",
        isAutheSite: true,
        isSubdomain,
        product,
    });
}
