import path from "path";
import { fileURLToPath } from "url";
import { setupViewEngine } from "mbkutils";
import { icon } from "../utils/icon.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "../../");

/**
 * Configures Handlebars engine on the Express app using mbkutils setupViewEngine.
 */
export function configureHandlebars(app) {
    setupViewEngine(app, {
        rootDir: projectRoot,
        viewsDir: path.join(projectRoot, "views"),
        defaultLayout: false,
        helpers: {
            icon_base64: () => icon,
        },
    });
}
