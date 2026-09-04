import { Router } from "express";
import { portalAppVersion, testEndpoint } from "../controllers/apiController.js";
import { cacheMiddleware } from "../middleware/security.js";
import { botChallengeHandler } from "../middleware/botProtection.js";

const router = Router();

router.get("/portalAppVersion", cacheMiddleware(3600), portalAppVersion);
router.get("/Test", testEndpoint);
router.get("/bot-challenge", botChallengeHandler);

export default router;
