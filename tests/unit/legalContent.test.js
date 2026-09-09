import { describe, it, expect } from "vitest";
import { legalContent } from "../../src/services/legal-content.service.js";

describe("LegalContentService", () => {
  it("should render Terms of Service markdown into HTML", () => {
    const termsHtml = legalContent.terms;
    expect(typeof termsHtml).toBe("string");
    expect(termsHtml.length).toBeGreaterThan(100);
    expect(termsHtml).toContain("<");
  });

  it("should render Privacy Policy markdown into HTML", () => {
    const privacyHtml = legalContent.privacy;
    expect(typeof privacyHtml).toBe("string");
    expect(privacyHtml.length).toBeGreaterThan(100);
    expect(privacyHtml).toContain("<");
  });
});
