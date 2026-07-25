import path from "path";
import { fileURLToPath } from "url";
import { engine } from "express-handlebars";
import Handlebars from "handlebars";
import { icon } from "../utils/icon.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "../../");

// Register Handlebars helpers
Handlebars.registerHelper("eq", function (a, b) {
    return a === b;
});

Handlebars.registerHelper("encodeURIComponent", function (str) {
    return encodeURIComponent(str);
});

Handlebars.registerHelper("conditionalEnv", function (trueResult, falseResult) {
    console.log(`Checking conditionalEnv: ${process.env.localenv}`);
    return process.env.localenv ? trueResult : falseResult;
});

/**
 * Configures Handlebars engine on the Express app.
 */
export function configureHandlebars(app) {
    app.engine(
        "handlebars",
        engine({
            defaultLayout: false,
            partialsDir: [
                path.join(projectRoot, "views/templates"),
                path.join(projectRoot, "views/notice"),
                path.join(projectRoot, "views"),
            ],
            cache: process.env.localenv === "production",
            helpers: {
                icon_base64() {
                    return icon;
                },
            },
        })
    );

    app.set("view engine", "handlebars");
    app.set("views", [
        path.join(projectRoot, "views"),
    ]);
}
