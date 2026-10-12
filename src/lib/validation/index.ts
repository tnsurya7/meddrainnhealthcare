import { z } from "zod";

// 1. Contact / Enquiry Form
export const enquiryFormSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  email: z.string().trim().email("Please provide a valid email address"),
  phone: z
    .string()
    .trim()
    .min(10, "Phone number must be at least 10 digits")
    .max(16, "Phone number is too long")
    .regex(/^[+0-9\s\-()]+$/, "Phone number contains invalid characters"),
  courseOfInterest: z.string().optional().default(""),
  subject: z.string().trim().max(150, "Subject is too long").optional().default(""),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(2000, "Message is too long"),
  consent: z.literal(true, {
    message: "You must consent to the processing of your details",
  }),
  honeypot: z.string().optional(),
});

export type EnquiryFormInput = z.infer<typeof enquiryFormSchema>;

// 2. Admin Login
export const adminLoginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(3, "Please enter your administrator ID or email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;

// 3. Course Form
export const courseFormSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(200),
  slug: z
    .string()
    .trim()
    .min(3, "Slug must be at least 3 characters")
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must only contain lowercase letters, numbers, and hyphens"),
  shortDescription: z.string().trim().min(10, "Short description must be at least 10 characters").max(350),
  description: z.string().trim().min(20, "Detailed description must be at least 20 characters"),
  category: z.string().trim().min(2, "Category is required"),
  duration: z.string().trim().optional().default(""),
  eligibility: z.string().trim().optional().default(""),
  prerequisites: z.string().trim().optional().default(""),
  curriculum: z.any().optional().default([]),
  thumbnailUrl: z.string().trim().optional().default(""),
  imageAlt: z.string().trim().optional().default(""),
  featured: z.boolean().default(false),
  status: z.enum(["published", "draft"]).default("draft"),
  displayOrder: z.coerce.number().int().default(0),
});

export type CourseFormInput = z.infer<typeof courseFormSchema>;

// 4. Service Form
export const serviceFormSchema = z.object({
  title: z.string().trim().min(2, "Title must be at least 2 characters").max(150),
  slug: z
    .string()
    .trim()
    .min(2, "Slug must be at least 2 characters")
    .max(150)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must only contain lowercase letters, numbers, and hyphens"),
  description: z.string().trim().min(10, "Description must be at least 10 characters"),
  icon: z.string().trim().min(1, "Icon name is required").default("Activity"),
  imageUrl: z.string().trim().optional().default(""),
  displayOrder: z.coerce.number().int().default(0),
  status: z.enum(["published", "draft"]).default("draft"),
});

export type ServiceFormInput = z.infer<typeof serviceFormSchema>;

// 5. Gallery Form
export const galleryFormSchema = z.object({
  title: z.string().trim().min(2, "Title must be at least 2 characters").max(150),
  caption: z.string().trim().max(300).optional().default(""),
  category: z.string().trim().min(2, "Category is required"),
  imageUrl: z.string().trim().min(1, "Image URL is required"),
  storageKey: z.string().trim().optional().default(""),
  altText: z.string().trim().optional().default(""),
  eventDate: z.string().trim().optional().default(""),
  displayOrder: z.coerce.number().int().default(0),
  status: z.enum(["published", "draft"]).default("draft"),
});

export type GalleryFormInput = z.infer<typeof galleryFormSchema>;

// 6. Student Form
export const studentFormSchema = z.object({
  name: z.string().trim().min(2, "Student name must be at least 2 characters").max(100),
  courseId: z.string().uuid("Invalid course selection").optional().or(z.literal("")),
  batch: z.string().trim().min(2, "Batch is required (e.g., 2025-2026)"),
  description: z.string().trim().max(500).optional().default(""),
  photoUrl: z.string().trim().optional().default(""),
  consentStatus: z.boolean().default(false),
  status: z.enum(["published", "private"]).default("private"),
});

export type StudentFormInput = z.infer<typeof studentFormSchema>;

// 7. Site Settings Form
export const siteSettingsFormSchema = z.object({
  instituteName: z.string().trim().min(2, "Institute name is required"),
  address: z.string().trim().min(5, "Address is required"),
  phone: z.string().trim().min(8, "Phone number is required"),
  email: z.string().trim().email("Valid email required"),
  instagramUrl: z.string().trim().url("Valid Instagram URL required"),
  logoUrl: z.string().trim().optional().default(""),
  heroTitle: z.string().trim().min(5, "Hero title is required"),
  heroDescription: z.string().trim().min(10, "Hero description is required"),
  heroImageUrl: z.string().trim().optional().default(""),
  aboutContent: z.string().trim().min(20, "About content is required"),
  mission: z.string().trim().min(10, "Mission is required"),
  vision: z.string().trim().min(10, "Vision is required"),
  footerText: z.string().trim().min(5, "Footer text is required"),
  seoTitle: z.string().trim().min(5, "SEO title is required"),
  seoDescription: z.string().trim().min(10, "SEO description is required"),
  publicGalleryVisibility: z.boolean().default(true),
  studentShowcaseVisibility: z.boolean().default(true),
  privacyPolicyContent: z.string().trim().min(20, "Privacy policy content is required"),
});

export type SiteSettingsFormInput = z.infer<typeof siteSettingsFormSchema>;

// 8. Enquiry Update Form
export const enquiryUpdateSchema = z.object({
  status: z.enum(["new", "contacted", "resolved"]),
  adminNotes: z.string().trim().max(2000).optional().default(""),
});

export type EnquiryUpdateInput = z.infer<typeof enquiryUpdateSchema>;

// 9. Feedback Submission Form (Public)
export const feedbackFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  message: z
    .string()
    .trim()
    .min(5, "Feedback message must be at least 5 characters")
    .max(1000, "Feedback message must not exceed 1000 characters"),
  rating: z
    .number()
    .int("Rating must be a whole number")
    .min(1, "Rating must be at least 1 star")
    .max(5, "Rating cannot exceed 5 stars"),
  honeypot: z.string().optional(),
});

export type FeedbackFormInput = z.infer<typeof feedbackFormSchema>;

// 10. Feedback Moderation Form (Admin)
export const feedbackModerationSchema = z.object({
  status: z.enum(["pending", "approved", "rejected"]),
});

export type FeedbackModerationInput = z.infer<typeof feedbackModerationSchema>;
