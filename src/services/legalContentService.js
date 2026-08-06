import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { marked } from "marked";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.resolve(__dirname, "../../data");

const files = {
    privacy: "PrivacyPolicy.md",
    terms: "TermsofService.md",
};

const cache = new Map();

/**
 * Reads a legal markdown file and converts it to HTML (cached).
 * @param {"privacy" | "terms"} key
 * @returns {string} rendered HTML
 */
function getMarkdownHtml(key) {
    if (cache.has(key)) return cache.get(key);

    const filePath = path.join(dataDir, files[key]);
    const markdown = fs.readFileSync(filePath, "utf8");
    const html = marked.parse(markdown);

    cache.set(key, html);
    return html;
}

/**
 * Rendered legal document content.
 * - privacy: data/PrivacyPolicy.md
 * - terms:   data/TermsofService.md
 */
export const legalContent = {
    get privacy() {
        return getMarkdownHtml("privacy");
    },
    get terms() {
        return getMarkdownHtml("terms");
    },
};
