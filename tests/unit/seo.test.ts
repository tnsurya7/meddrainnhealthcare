import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { getSiteUrl, getAbsoluteUrl } from "@/lib/seo/site-url";
import {
  generateEducationalOrganizationSchema,
  generateWebSiteSchema,
  generateBreadcrumbSchema,
  generateCourseSchema,
} from "@/lib/seo/structured-data";
import robots from "@/app/robots";

describe("SEO, Custom Domain & AI Discoverability", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("Configurable Site URL Helper", () => {
    it("uses NEXT_PUBLIC_SITE_URL when set in production environment", () => {
      process.env.NEXT_PUBLIC_SITE_URL = "https://www.meddrainnhealthcare.in";
      expect(getSiteUrl()).toBe("https://www.meddrainnhealthcare.in");
    });

    it("strips trailing slashes from configured URL", () => {
      process.env.NEXT_PUBLIC_SITE_URL = "https://www.meddrainnhealthcare.in///";
      expect(getSiteUrl()).toBe("https://www.meddrainnhealthcare.in");
    });

    it("generates correct absolute URLs without duplicate slashes", () => {
      process.env.NEXT_PUBLIC_SITE_URL = "https://www.meddrainnhealthcare.in";
      expect(getAbsoluteUrl("/courses/ventilator-training")).toBe(
        "https://www.meddrainnhealthcare.in/courses/ventilator-training"
      );
      expect(getAbsoluteUrl("about")).toBe(
        "https://www.meddrainnhealthcare.in/about"
      );
    });
  });

  describe("Structured Data (JSON-LD)", () => {
    it("generates accurate EducationalOrganization schema matching official Meddrainn details", () => {
      process.env.NEXT_PUBLIC_SITE_URL = "https://www.meddrainnhealthcare.in";
      const schema = generateEducationalOrganizationSchema();

      expect(schema["@context"]).toBe("https://schema.org");
      expect(schema["@type"]).toBe("EducationalOrganization");
      expect(schema.name).toBe("Meddrainn Healthcare");
      expect(schema.telephone).toBe("+91 6380918863");
      expect(schema.email).toBe("meddrainnhealthcare2019@gmail.com");
      expect(schema.address.addressLocality).toBe("Erode");
      expect(schema.address.postalCode).toBe("638001");
      expect(schema.address.addressRegion).toBe("Tamil Nadu");
      expect(schema.sameAs).toContain(
        "https://www.instagram.com/meddrainnhealthcare/"
      );
    });

    it("generates valid Course schema without fabricated reviews or ratings", () => {
      process.env.NEXT_PUBLIC_SITE_URL = "https://www.meddrainnhealthcare.in";
      const courseSchema = generateCourseSchema({
        title: "Medical Equipment Calibration",
        description: "Hands-on calibration of physiological patient monitors.",
        slug: "medical-equipment-calibration",
        duration: "4 Weeks",
      });

      expect(courseSchema["@type"]).toBe("Course");
      expect(courseSchema.name).toBe("Medical Equipment Calibration");
      expect(courseSchema.url).toBe(
        "https://www.meddrainnhealthcare.in/courses/medical-equipment-calibration"
      );
      expect(courseSchema.provider.name).toBe("Meddrainn Healthcare");
      expect(courseSchema.timeRequired).toBe("4 Weeks");
      expect(courseSchema.aggregateRating).toBeUndefined(); // strictly no fabricated ratings
    });

    it("generates valid BreadcrumbList schema with sequential positions", () => {
      process.env.NEXT_PUBLIC_SITE_URL = "https://www.meddrainnhealthcare.in";
      const breadcrumbs = generateBreadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Courses", url: "/courses" },
        { name: "Ventilators", url: "/courses/ventilators" },
      ]);

      expect(breadcrumbs["@type"]).toBe("BreadcrumbList");
      expect(breadcrumbs.itemListElement).toHaveLength(3);
      expect(breadcrumbs.itemListElement[0].position).toBe(1);
      expect(breadcrumbs.itemListElement[0].item).toBe(
        "https://www.meddrainnhealthcare.in/"
      );
      expect(breadcrumbs.itemListElement[2].position).toBe(3);
    });
  });

  describe("Robots Directives & AI Search Discovery", () => {
    it("includes OAI-SearchBot and Googlebot with public access while blocking admin", () => {
      process.env.NEXT_PUBLIC_SITE_URL = "https://www.meddrainnhealthcare.in";
      const robotsConfig = robots();

      const rules = Array.isArray(robotsConfig.rules)
        ? robotsConfig.rules
        : [robotsConfig.rules];

      const oaiRule = rules.find((r) => r.userAgent === "OAI-SearchBot");
      expect(oaiRule).toBeDefined();
      expect(oaiRule?.allow).toBe("/");
      expect(oaiRule?.disallow).toContain("/admin/");

      const googleRule = rules.find((r) => r.userAgent === "Googlebot");
      expect(googleRule).toBeDefined();
      expect(googleRule?.allow).toBe("/");

      expect(robotsConfig.sitemap).toBe(
        "https://www.meddrainnhealthcare.in/sitemap.xml"
      );
    });
  });
});
