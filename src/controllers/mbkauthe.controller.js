import { mbkautheContentService } from "../services/mbkauthe-content.service.js";

/**
 * Domain-aware page route helpers. Each renders the MBKAuthe page when the
 * request is on the mbkauthe subdomain, otherwise 301-redirects to it.
 */

// /mbkauthe and /mbkauthe/* — redirect to the mbkauthe subdomain (or stay local on it)
export function mbkautheSplatRedirect(req, res) {
    const rawPath = req.path.replace(/^\/mbkauthe/i, "") || "";
    const cleanPath = rawPath.startsWith("/") ? rawPath : `/${rawPath}`;
    if (req.site === "mbkauthe") {
        return res.redirect(301, cleanPath === "/" ? "/" : cleanPath);
    }
    return res.redirect(301, `https://mbkauthe.mbktech.org${cleanPath === "/" ? "" : cleanPath}`);
}

// /docs and /docs/:slug
export function mbkautheDocsRoute(req, res) {
    if (req.site === "mbkauthe") return mbkautheDocs(req, res);
    const slug = req.params.slug ? `/${req.params.slug}` : "";
    return res.redirect(301, `https://mbkauthe.mbktech.org/docs${slug}`);
}

// /features (/security)
export function mbkautheFeaturesRoute(req, res) {
    if (req.site === "mbkauthe") return mbkautheFeatures(req, res);
    return res.redirect(301, "https://mbkauthe.mbktech.org/features");
}

// /api-reference
export function mbkautheApiReferenceRoute(req, res) {
    if (req.site === "mbkauthe") return mbkautheApiReference(req, res);
    return res.redirect(301, "https://mbkauthe.mbktech.org/api-reference");
}

// /examples
export function mbkautheExamplesRoute(req, res) {
    if (req.site === "mbkauthe") return mbkautheExamples(req, res);
    return res.redirect(301, "https://mbkauthe.mbktech.org/examples");
}

// /changelog
export function mbkautheChangelogRoute(req, res) {
    if (req.site === "mbkauthe") return mbkautheChangelog(req, res);
    return res.redirect(301, "https://mbkauthe.mbktech.org/changelog");
}

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
