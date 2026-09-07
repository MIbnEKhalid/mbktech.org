import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../src/app.js";

describe("MBKAuthe Product & Docs Integration Tests", () => {
  it("GET /mbkauthe on mbktech.org returns 301 redirect to https://mbkauthe.mbktech.org", async () => {
    const res = await request(app).get("/mbkauthe");
    expect(res.status).toBe(301);
    expect(res.headers.location).toBe("https://mbkauthe.mbktech.org");
  });

  it("GET /mbkauthe/docs/database on mbktech.org returns 301 redirect to https://mbkauthe.mbktech.org/docs/database", async () => {
    const res = await request(app).get("/mbkauthe/docs/database");
    expect(res.status).toBe(301);
    expect(res.headers.location).toBe("https://mbkauthe.mbktech.org/docs/database");
  });

  it("GET / with mbkauthe.mbktech.org host header renders MBKAuthe product home", async () => {
    const res = await request(app)
      .get("/")
      .set("Host", "mbkauthe.mbktech.org");
    expect(res.status).toBe(200);
    expect(res.text).toContain("BK");
    expect(res.text).toContain("Authe");
    expect(res.text).toContain("npm install mbkauthe");
  });

  it("GET /docs with mbkauthe.mbktech.org host header returns 200 and renders getting-started guide", async () => {
    const res = await request(app)
      .get("/docs")
      .set("Host", "mbkauthe.mbktech.org");
    expect(res.status).toBe(200);
    expect(res.text).toContain("Getting Started with MBKAuthe");
    expect(res.text).toContain("Table of Contents");
  });

  it("GET /docs/:slug with mbkauthe.mbktech.org host header renders specific documentation topics", async () => {
    const slugs = [
      "getting-started",
      "configuration",
      "database",
      "dual-database-guide",
      "authentication",
      "rbac",
      "oauth",
      "2fa",
      "api-tokens",
      "cli-auth",
      "deployment",
      "api-reference",
      "endpoints",
      "middleware",
      "operations",
      "error-codes",
      "examples",
      "database-schema",
      "style-guide",
      "changelog",
    ];

    for (const slug of slugs) {
      const res = await request(app)
        .get(`/docs/${slug}`)
        .set("Host", "mbkauthe.mbktech.org");
      expect(res.status).toBe(200);
      expect(res.text).toContain("Documentation");
      expect(res.text).toContain("MBKAuthe");
    }
  });

  it("GET /features with mbkauthe.mbktech.org host header returns 200 and renders security architecture", async () => {
    const res = await request(app)
      .get("/features")
      .set("Host", "mbkauthe.mbktech.org");
    expect(res.status).toBe(200);
    expect(res.text).toContain("Security &amp; Architecture");
    expect(res.text).toContain("PBKDF2");
    expect(res.text).toContain("Defense in Depth");
  });

  it("GET /api-reference with mbkauthe.mbktech.org host header returns 200 and renders REST endpoints catalog", async () => {
    const res = await request(app)
      .get("/api-reference")
      .set("Host", "mbkauthe.mbktech.org");
    expect(res.status).toBe(200);
    expect(res.text).toContain("REST API Reference");
    expect(res.text).toContain("/mbkauthe/api/login");
    expect(res.text).toContain("/api/token");
  });

  it("GET /examples with mbkauthe.mbktech.org host header returns 200 and renders code recipes", async () => {
    const res = await request(app)
      .get("/examples")
      .set("Host", "mbkauthe.mbktech.org");
    expect(res.status).toBe(200);
    expect(res.text).toContain("Code Examples &amp; Recipes");
    expect(res.text).toContain("BaseRepository");
  });

  it("GET /changelog with mbkauthe.mbktech.org host header returns 200 and renders version timeline", async () => {
    const res = await request(app)
      .get("/changelog")
      .set("Host", "mbkauthe.mbktech.org");
    expect(res.status).toBe(200);
    expect(res.text).toContain("Changelog &amp; Version History");
    expect(res.text).toContain("v5.6.0");
  });

  it("GET /docs/non-existent-slug with mbkauthe.mbktech.org host header returns 404", async () => {
    const res = await request(app)
      .get("/docs/non-existent-slug-xyz")
      .set("Host", "mbkauthe.mbktech.org");
    expect(res.status).toBe(404);
  });
});
