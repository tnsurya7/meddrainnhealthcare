import { describe, it, expect } from "vitest";
import {
  enquiryFormSchema,
  adminLoginSchema,
  courseFormSchema,
  serviceFormSchema,
  galleryFormSchema,
  studentFormSchema,
  siteSettingsFormSchema,
  enquiryUpdateSchema,
  feedbackFormSchema,
} from "@/lib/validation";

describe("Validation Schemas & Security Rules", () => {
  describe("Contact / Enquiry Schema", () => {
    it("accepts valid enquiry form inputs", () => {
      const validData = {
        name: "Aravind Kumar",
        email: "aravind@example.com",
        phone: "+91 9876543210",
        courseOfInterest: "Biomedical Equipment Calibration",
        subject: "Batch Timings Query",
        message: "Hello, I am interested in joining the upcoming weekend calibration batch.",
        consent: true,
      };

      const result = enquiryFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("rejects invalid email formats", () => {
      const invalidData = {
        name: "Aravind Kumar",
        email: "not-an-email",
        phone: "9876543210",
        message: "This is a detailed enquiry message for the course.",
        consent: true,
      };

      const result = enquiryFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.email).toBeDefined();
      }
    });

    it("rejects phone numbers with too few digits", () => {
      const invalidData = {
        name: "Aravind Kumar",
        email: "aravind@example.com",
        phone: "123",
        message: "This is a detailed enquiry message for the course.",
        consent: true,
      };

      const result = enquiryFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.phone).toBeDefined();
      }
    });

    it("requires explicit user consent", () => {
      const noConsent = {
        name: "Aravind Kumar",
        email: "aravind@example.com",
        phone: "+91 9876543210",
        message: "This is a detailed enquiry message for the course.",
        consent: false,
      };

      const result = enquiryFormSchema.safeParse(noConsent);
      expect(result.success).toBe(false);
    });
  });

  describe("Admin Login Schema", () => {
    it("validates well-formed admin login credentials", () => {
      const result = adminLoginSchema.safeParse({
        email: "admin@biomed.institute",
        password: "SuperSecretPassword123!",
      });
      expect(result.success).toBe(true);
    });

    it("rejects short passwords", () => {
      const result = adminLoginSchema.safeParse({
        email: "admin@biomed.institute",
        password: "123",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("Course Form Schema", () => {
    it("enforces safe URL slug syntax", () => {
      const valid = courseFormSchema.safeParse({
        title: "Clinical Equipment Testing",
        slug: "clinical-equipment-testing",
        shortDescription: "Master electrical safety standards and calibration protocols.",
        description: "Comprehensive hands-on laboratory experience covering patient monitors and ventilators.",
        category: "Equipment Calibration",
        duration: "4 Weeks",
        status: "published",
        displayOrder: 1,
      });
      expect(valid.success).toBe(true);

      const invalidSlug = courseFormSchema.safeParse({
        title: "Clinical Equipment Testing",
        slug: "Clinical Equipment Testing!!", // contains spaces and uppercase
        shortDescription: "Master electrical safety standards and calibration protocols.",
        description: "Comprehensive hands-on laboratory experience covering patient monitors and ventilators.",
        category: "Equipment Calibration",
      });
      expect(invalidSlug.success).toBe(false);
    });
  });

  describe("Student Record Privacy Schema", () => {
    it("defaults to private status", () => {
      const student = studentFormSchema.safeParse({
        name: "Karthik Raja",
        batch: "2025-2026",
      });
      expect(student.success).toBe(true);
      if (student.success) {
        expect(student.data.status).toBe("private");
        expect(student.data.consentStatus).toBe(false);
      }
    });
  });

  describe("Feedback Form & Star Rating Schema", () => {
    it("accepts valid feedback with 5-star rating", () => {
      const valid = {
        name: "Vignesh Kumar",
        message: "Practical ventilator calibration training was exceptional.",
        rating: 5,
      };
      const res = feedbackFormSchema.safeParse(valid);
      expect(res.success).toBe(true);
      if (res.success) {
        expect(res.data.rating).toBe(5);
      }
    });

    it("accepts 1-star rating as valid lower bound", () => {
      const valid = {
        name: "Anand R.",
        message: "Course pace was faster than expected.",
        rating: 1,
      };
      const res = feedbackFormSchema.safeParse(valid);
      expect(res.success).toBe(true);
    });

    it("rejects 0-star rating or negative rating", () => {
      const invalid = {
        name: "Test User",
        message: "Zero star test review.",
        rating: 0,
      };
      const res = feedbackFormSchema.safeParse(invalid);
      expect(res.success).toBe(false);
    });

    it("rejects ratings greater than 5 stars", () => {
      const invalid = {
        name: "Test User",
        message: "Over the top star test review.",
        rating: 6,
      };
      const res = feedbackFormSchema.safeParse(invalid);
      expect(res.success).toBe(false);
    });

    it("rejects message shorter than 5 characters", () => {
      const invalid = {
        name: "Test User",
        message: "Bad",
        rating: 4,
      };
      const res = feedbackFormSchema.safeParse(invalid);
      expect(res.success).toBe(false);
    });
  });
});
