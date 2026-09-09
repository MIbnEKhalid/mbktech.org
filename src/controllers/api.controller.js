import { getPortalAppVersion } from "../services/portal-version.service.js";

export function portalAppVersion(req, res) {
    const response = getPortalAppVersion();
    console.log("PortalVersionControlJson Api Request processed successfully");
    res.status(200).json(response);
}

export function testEndpoint(req, res) {
    console.log("API 'Test' Request processed successfully");
    res.send("API 'Test' Request processed successfully");
}
