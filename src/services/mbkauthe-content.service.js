import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { marked } from "marked";
import hljs from "highlight.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "../..");

// Candidate paths to search for live mbkauthe package/repo
const candidateMbkauthePaths = [
    process.env.MBKAUTHE_DIR,
    path.resolve(rootDir, "../mbkauthe"),
    path.resolve(rootDir, "node_modules/mbkauthe"),
].filter(Boolean);

let cachedMbkautheRoot = null;
function getMbkautheRoot() {
    if (cachedMbkautheRoot !== null) return cachedMbkautheRoot;
    for (const cand of candidateMbkauthePaths) {
        if (fs.existsSync(cand) && (fs.existsSync(path.join(cand, "package.json")) || fs.existsSync(path.join(cand, "docs")))) {
            cachedMbkautheRoot = cand;
            return cachedMbkautheRoot;
        }
    }
    // Fallback if running inside mbkauthe directly
    cachedMbkautheRoot = path.resolve(rootDir, "../mbkauthe");
    return cachedMbkautheRoot;
}

const cache = new Map();

/**
 * Configure marked renderer with anchor ids, highlight.js syntax highlighting,
 * callouts, and responsive tables.
 */
const renderer = new marked.Renderer();

renderer.heading = function ({ tokens, depth }) {
    const text = this.parser.parseInline(tokens);
    const escapedText = text
        .toLowerCase()
        .replace(/<[^>]*>/g, "")
        .replace(/[^\w\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
    const id = `sec-${depth}-${escapedText}`;
    return `<h${depth} id="${id}" class="group relative scroll-mt-24">
        <span>${text}</span>
        <a href="#${id}" class="heading-anchor opacity-0 group-hover:opacity-100 ml-2 text-primary-500 hover:text-primary-600 transition-opacity text-sm font-normal" aria-label="Link to this section">#</a>
    </h${depth}>`;
};

renderer.code = function ({ text, lang }) {
    const rawLang = (lang || "").trim();
    const displayLang = rawLang || "code";
    let highlighted = "";

    if (rawLang && hljs.getLanguage(rawLang)) {
        try {
            highlighted = hljs.highlight(text, { language: rawLang, ignoreIllegals: true }).value;
        } catch (e) {
            highlighted = hljs.highlightAuto(text).value;
        }
    } else {
        try {
            highlighted = hljs.highlightAuto(text).value;
        } catch (e) {
            highlighted = text
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;");
        }
    }

    return `<div class="code-block-wrapper not-prose my-6 rounded-xl border border-primary-600/20 dark:border-primary-500/25 bg-slate-950 shadow-lg overflow-hidden">
        <div class="code-block-header flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 text-xs font-mono text-slate-400 select-none">
            <div class="flex items-center gap-2">
                <div class="flex items-center gap-1.5">
                    <span class="inline-block w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
                    <span class="inline-block w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
                    <span class="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
                </div>
                <span class="code-block-lang ml-2 px-2 py-0.5 rounded bg-slate-800/80 text-[11px] font-semibold text-primary-400 border border-slate-700/50 uppercase tracking-wider">${displayLang}</span>
            </div>
            <button type="button" class="code-copy-btn inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-700/90 text-slate-300 hover:text-white text-[11px] font-sans font-medium transition-all border border-slate-700" title="Copy code snippet" aria-label="Copy code">
                <i class="lni lni-clipboard text-xs"></i>
                <span>Copy</span>
            </button>
        </div>
        <pre class="code-block-pre p-4 sm:p-5 text-xs sm:text-[13px] font-mono leading-relaxed text-slate-200 overflow-x-auto m-0"><code class="hljs language-${displayLang}">${highlighted}</code></pre>
    </div>`;
};

renderer.blockquote = function ({ tokens }) {
    const body = this.parser.parse(tokens);
    const alertMatch = body.match(/^<p>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*(?:<br>)?\s*([\s\S]*?)<\/p>/i);
    if (alertMatch) {
        const type = alertMatch[1].toUpperCase();
        const content = alertMatch[2];
        const alertConfig = {
            NOTE: { icon: "lni-information", title: "Note", border: "border-sky-500", bg: "bg-sky-500/10 dark:bg-sky-950/30", text: "text-sky-600 dark:text-sky-400" },
            TIP: { icon: "lni-bulb", title: "Tip", border: "border-emerald-500", bg: "bg-emerald-500/10 dark:bg-emerald-950/30", text: "text-emerald-600 dark:text-emerald-400" },
            IMPORTANT: { icon: "lni-flag", title: "Important", border: "border-primary-500", bg: "bg-primary-500/10 dark:bg-primary-950/30", text: "text-primary-600 dark:text-primary-400" },
            WARNING: { icon: "lni-warning", title: "Warning", border: "border-amber-500", bg: "bg-amber-500/10 dark:bg-amber-950/30", text: "text-amber-600 dark:text-amber-400" },
            CAUTION: { icon: "lni-shield", title: "Caution", border: "border-rose-500", bg: "bg-rose-500/10 dark:bg-rose-950/30", text: "text-rose-600 dark:text-rose-400" },
        }[type] || { icon: "lni-information", title: type, border: "border-primary-500", bg: "bg-primary-500/10 dark:bg-primary-950/30", text: "text-primary-600 dark:text-primary-400" };

        return `<div class="my-5 rounded-xl border-l-4 ${alertConfig.border} ${alertConfig.bg} p-4 text-xs sm:text-sm text-slate-700 dark:text-slate-200 shadow-sm">
            <div class="flex items-center gap-2 font-bold mb-1.5 ${alertConfig.text} uppercase tracking-wider text-xs font-heading">
                <i class="lni ${alertConfig.icon} text-sm"></i>
                <span>${alertConfig.title}</span>
            </div>
            <div class="leading-relaxed">${content ? `<p class="my-1">${content}</p>` : ''}</div>
        </div>`;
    }
    return `<blockquote class="my-4 rounded-r-xl border-l-4 border-primary-600 bg-primary-50/60 dark:bg-primary-950/40 p-4 text-xs sm:text-sm italic text-slate-600 dark:text-slate-300">${body}</blockquote>`;
};

renderer.table = function ({ header, rows }) {
    let headerHtml = "";
    if (Array.isArray(header)) {
        for (const cell of header) {
            headerHtml += `<th align="${cell.align || 'left'}">${this.parser.parseInline(cell.tokens)}</th>`;
        }
    }
    let bodyHtml = "";
    if (Array.isArray(rows)) {
        for (const row of rows) {
            let rowHtml = "";
            for (const cell of row) {
                rowHtml += `<td align="${cell.align || 'left'}">${this.parser.parseInline(cell.tokens)}</td>`;
            }
            bodyHtml += `<tr>${rowHtml}</tr>`;
        }
    }
    return `<div class="table-wrapper my-6 w-full overflow-x-auto rounded-xl border border-primary-600/15 dark:border-primary-500/20 shadow-sm max-w-full">
        <table class="w-full text-left text-xs sm:text-sm border-collapse min-w-full">
            <thead><tr>${headerHtml}</tr></thead>
            <tbody>${bodyHtml}</tbody>
        </table>
    </div>`;
};

marked.setOptions({
    renderer,
    gfm: true,
    breaks: false,
});

/**
 * Normalizes internal markdown links to web documentation links
 */
function normalizeMarkdownLinks(markdown) {
    if (!markdown) return "";
    return markdown
        .replace(/\[([^\]]+)\]\((?:\.\.\/)+README\.md\)/gi, "[$1](/docs)")
        .replace(/\[([^\]]+)\]\((?:\.\/)?README\.md\)/gi, "[$1](/docs)")
        .replace(/\[([^\]]+)\]\((?:\.\.\/)+guides\/([^)]+)\.md\)/gi, "[$1](/docs/$2)")
        .replace(/\[([^\]]+)\]\(guides\/([^)]+)\.md\)/gi, "[$1](/docs/$2)")
        .replace(/\[([^\]]+)\]\((?:\.\.\/)+reference\/api\/([^)]+)\.md\)/gi, "[$1](/docs/$2)")
        .replace(/\[([^\]]+)\]\((?:\.\.\/)+reference\/([^)]+)\.md\)/gi, "[$1](/docs/$2)")
        .replace(/\[([^\]]+)\]\(reference\/api\/([^)]+)\.md\)/gi, "[$1](/docs/$2)")
        .replace(/\[([^\]]+)\]\(reference\/([^)]+)\.md\)/gi, "[$1](/docs/$2)")
        .replace(/\[([^\]]+)\]\((?:docs\/)?STYLE\.md\)/gi, "[$1](/docs/style-guide)")
        .replace(/\[([^\]]+)\]\((?:docs\/)?api\.md\)/gi, "[$1](/docs/api-reference)");
}

/**
 * Reads JSON file directly from mbkauthe/docs/ or mbkauthe/
 */
function readMbkautheJsonFile(filename) {
    const cacheKey = `json:${filename}`;
    if (process.env.NODE_ENV === "production" && cache.has(cacheKey)) {
        return cache.get(cacheKey);
    }

    const mbkautheRoot = getMbkautheRoot();
    const candidatePaths = [
        path.join(mbkautheRoot, "docs", filename),
        path.join(mbkautheRoot, filename),
        path.join(mbkautheRoot, "data", filename),
    ];

    for (const filePath of candidatePaths) {
        if (fs.existsSync(filePath)) {
            try {
                const content = JSON.parse(fs.readFileSync(filePath, "utf8"));
                if (process.env.NODE_ENV === "production") {
                    cache.set(cacheKey, content);
                }
                return content;
            } catch (e) {
                // Ignore parse errors and try next
            }
        }
    }

    return null;
}

/**
 * Extracts headings from markdown for Table of Contents
 */
function extractToc(markdown) {
    const headingRegex = /^(#{1,3})\s+(.+)$/gm;
    const toc = [];
    let match;
    while ((match = headingRegex.exec(markdown)) !== null) {
        const level = match[1].length;
        const text = match[2].trim();
        const escapedText = text
            .toLowerCase()
            .replace(/<[^>]*>/g, "")
            .replace(/[^\w\s-]/g, "")
            .trim()
            .replace(/\s+/g, "-");
        const id = `sec-${level}-${escapedText}`;
        toc.push({ level, text, id });
    }
    return toc;
}

/**
 * Estimates reading time in minutes
 */
function calculateReadingTime(text) {
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `~${minutes} min read`;
}

/**
 * Resolves markdown file content dynamically from mbkauthe directory
 */
function resolveMarkdownContent(slug) {
    const upstreamRoot = getMbkautheRoot();
    const candidateRelativePaths = [];

    // Map specific slugs to upstream repository locations
    if (slug === "style-guide") {
        candidateRelativePaths.push("docs/STYLE.md", "STYLE.md");
    } else if (slug === "api-reference") {
        candidateRelativePaths.push("docs/reference/api.md", "docs/reference/api/endpoints.md");
    } else if (slug === "getting-started") {
        candidateRelativePaths.push("docs/guides/getting-started.md", "docs/guides/getting_started.md", "docs/README.md", "README.md");
    }

    // Standard relative search paths inside mbkauthe repo
    candidateRelativePaths.push(
        `docs/guides/${slug}.md`,
        `docs/reference/api/${slug}.md`,
        `docs/reference/${slug}.md`,
        `docs/schema/${slug}.md`,
        `docs/${slug}.md`,
        `${slug}.md`
    );

    for (const rel of candidateRelativePaths) {
        const targetPath = path.join(upstreamRoot, rel);
        if (fs.existsSync(targetPath)) {
            return fs.readFileSync(targetPath, "utf8");
        }
    }

    return null;
}

export const mbkautheContentService = {
    /**
     * Get product overview data, read directly from mbkauthe/docs/product.json and enriched with mbkauthe/package.json
     */
    getProduct() {
        const product = readMbkautheJsonFile("product.json") || {
            name: "MBKAuthe",
            tagline: "Modern, developer-first authentication & session engine for Node.js and Express",
            description: "MBKAuthe is an open-source authentication package for Node.js and Express, backed by PostgreSQL or SQLite.",
            version: "5.6.0",
        };

        const upstreamRoot = getMbkautheRoot();
        const pkgPath = path.join(upstreamRoot, "package.json");
        if (fs.existsSync(pkgPath)) {
            try {
                const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
                if (pkg.version) product.version = pkg.version;
                if (pkg.description) product.description = pkg.description;
                if (product.stats && pkg.version) product.stats.version = `v${pkg.version}`;
            } catch (e) {
                // silently ignore json parse issues
            }
        }
        return product;
    },

    /**
     * Get navigation structure directly from mbkauthe/docs/navigation.json
     */
    getNavigation() {
        return readMbkautheJsonFile("navigation.json") || { sections: [] };
    },

    /**
     * Flattened list of all doc items in sequence
     */
    getAllDocItems() {
        const nav = this.getNavigation();
        const items = [];
        for (const sec of nav.sections || []) {
            for (const item of sec.items || []) {
                items.push({ ...item, section: sec.title });
            }
        }
        return items;
    },

    /**
     * Fetch document by slug directly from mbkauthe/docs
     */
    getDocBySlug(slug) {
        const cleanSlug = (slug || "getting-started").toLowerCase().replace(/[^a-z0-9-_]/g, "");
        const cacheKey = `doc:${cleanSlug}`;

        if (process.env.NODE_ENV === "production" && cache.has(cacheKey)) {
            return cache.get(cacheKey);
        }

        const rawMarkdown = resolveMarkdownContent(cleanSlug);
        if (!rawMarkdown) {
            return null;
        }

        const normalizedMarkdown = normalizeMarkdownLinks(rawMarkdown);
        const html = marked.parse(normalizedMarkdown);
        const toc = extractToc(normalizedMarkdown);
        const readingTime = calculateReadingTime(normalizedMarkdown);

        // Find metadata and next/prev docs
        const allItems = this.getAllDocItems();
        const currentIndex = allItems.findIndex((it) => it.slug === cleanSlug);
        const currentItem = currentIndex >= 0 ? allItems[currentIndex] : null;
        const prevDoc = currentIndex > 0 ? allItems[currentIndex - 1] : null;
        const nextDoc = currentIndex >= 0 && currentIndex < allItems.length - 1 ? allItems[currentIndex + 1] : null;

        const docData = {
            slug: cleanSlug,
            title: currentItem ? currentItem.title : cleanSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
            description: currentItem ? currentItem.description : "",
            section: currentItem ? currentItem.section : "Documentation",
            readingTime,
            html,
            toc,
            prevDoc,
            nextDoc,
        };

        if (process.env.NODE_ENV === "production") {
            cache.set(cacheKey, docData);
        }

        return docData;
    },
};

export default mbkautheContentService;
