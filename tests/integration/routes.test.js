import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../src/app.js";

describe("HTTP Route Integration Tests", () => {
  it("GET / returns 200 and renders home page", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
  });

  it("GET /FAQs returns 200", async () => {
    const res = await request(app).get("/FAQs");
    expect(res.status).toBe(200);
  });

  it("GET /Support returns 200", async () => {
    const res = await request(app).get("/Support");
    expect(res.status).toBe(200);
  });

  it("GET /Terms&Conditions returns 200 with rendered legal doc", async () => {
    const res = await request(app).get("/Terms&Conditions");
    expect(res.status).toBe(200);
    expect(res.text).toContain("Terms &amp; Conditions");
  });

  it("GET /PrivacyPolicy returns 200 with rendered privacy doc", async () => {
    const res = await request(app).get("/PrivacyPolicy");
    expect(res.status).toBe(200);
    expect(res.text).toContain("Privacy Policy");
  });

  it("GET /TrackTicket returns 200", async () => {
    const res = await request(app).get("/TrackTicket");
    expect(res.status).toBe(200);
  });

  it("GET /Services returns 200", async () => {
    const res = await request(app).get("/Services");
    expect(res.status).toBe(200);
  });

  it("GET /Services/WebDevBasicPackage returns 200", async () => {
    const res = await request(app).get("/Services/WebDevBasicPackage");
    expect(res.status).toBe(200);
  });

  it("GET /Services/WebDevFullStackPackage returns 200", async () => {
    const res = await request(app).get("/Services/WebDevFullStackPackage");
    expect(res.status).toBe(200);
  });

  it("GET /Status returns 200", async () => {
    const res = await request(app).get("/Status");
    expect(res.status).toBe(200);
  });

  it("GET /sitemap.xml returns valid XML sitemap", async () => {
    const res = await request(app).get("/sitemap.xml");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toContain("xml");
  });

  it("GET /robots.txt returns valid robots file", async () => {
    const res = await request(app).get("/robots.txt");
    expect(res.status).toBe(200);
    expect(res.text).toContain("User-agent: *");
  });

  it("GET /api/portalAppVersion returns release JSON", async () => {
    const res = await request(app).get("/api/portalAppVersion");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("latestVersion");
  });

  it("GET /api/bot-challenge generates cryptographic challenge", async () => {
    const res = await request(app).get("/api/bot-challenge");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty("token");
  });

  it("GET /unknown-random-404-route returns 404", async () => {
    const res = await request(app).get("/unknown-random-404-route");
    expect(res.status).toBe(404);
  });
});
