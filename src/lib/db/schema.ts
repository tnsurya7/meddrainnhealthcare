import {
  pgTable,
  text,
  boolean,
  integer,
  timestamp,
  uuid,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { sql, relations } from "drizzle-orm";

// ==============================================================================
// 1. Users (Administrator Accounts)
// ==============================================================================
export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    role: text("role").notNull().default("admin"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("users_email_idx").on(table.email),
    index("users_role_idx").on(table.role),
  ]
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

// ==============================================================================
// 2. Site Settings
// ==============================================================================
export const siteSettings = pgTable("site_settings", {
  id: text("id").primaryKey().default("default"),
  instituteName: text("institute_name")
    .default("Meddrainn Healthcare")
    .notNull(),
  address: text("address")
    .default(
      "H-42, 80 Feet Road, Periyar Nagar, Erode - 638001, Tamil Nadu, India."
    )
    .notNull(),
  phone: text("phone").default("+91 6380918863").notNull(),
  email: text("email").default("meddrainnhealthcare2019@gmail.com").notNull(),
  instagramUrl: text("instagram_url")
    .default("https://www.instagram.com/meddrainnhealthcare/")
    .notNull(),
  logoUrl: text("logo_url"),
  heroTitle: text("hero_title")
    .default("WELCOME TO MEDDRAINN HEALTHCARE")
    .notNull(),
  heroDescription: text("hero_description")
    .default(
      "Established in 2021, Meddrainn Healthcare is focused on equipping future healthcare professionals with practical expertise and industry-ready skills. We connect academic knowledge with real-world healthcare needs through hands-on training in medical equipment, specialized healthcare sales and marketing programs, and professional hospital support services.\n\nAt Meddrainn Healthcare, we are committed to excellence, innovation, and collaboration, preparing professionals for successful and rewarding careers in the healthcare and biomedical sector."
    )
    .notNull(),
  heroImageUrl: text("hero_image_url"),
  aboutContent: text("about_content")
    .default(
      "Established in 2021, Meddrainn Healthcare is focused on equipping future healthcare professionals with practical expertise and industry-ready skills. We connect academic knowledge with real-world healthcare needs through hands-on training in medical equipment, specialized healthcare sales and marketing programs, and professional hospital support services.\n\nAt Meddrainn Healthcare, we are committed to excellence, innovation, and collaboration, preparing professionals for successful and rewarding careers in the healthcare and biomedical sector."
    )
    .notNull(),
  mission: text("mission")
    .default(
      "• To provide high quality hands-on training in medical equipment and biomedical technology.\n• To conduct industry oriented workshops, seminars and webinars.\n• To offer internship programs that build real world technical skills.\n• To support students with placement assistance and career guidance.\n• To bridge the gap between academic learning and healthcare industry requirements."
    )
    .notNull(),
  vision: text("vision")
    .default(
      "To become a leading institution in medical equipment training and biomedical skill development, empowering students and professionals with practical knowledge, industry exposure and career opportunities in the healthcare technology sector."
    )
    .notNull(),
  footerText: text("footer_text")
    .default("© Meddrainn Healthcare. All rights reserved.")
    .notNull(),
  seoTitle: text("seo_title")
    .default(
      "Meddrainn Healthcare | Professional Biomedical Training Institute"
    )
    .notNull(),
  seoDescription: text("seo_description")
    .default(
      "Medical equipment training, healthcare workshops, clinical internships, and professional biomedical skills in Erode, Tamil Nadu."
    )
    .notNull(),
  galleryHeading: text("gallery_heading")
    .default("Our Gallery")
    .notNull(),
  galleryDescription: text("gallery_description")
    .default(
      "A glimpse into our practical biomedical training environment. Explore real moments from our hands-on biomedical training sessions, equipment demonstrations and hospital exposure programs at Meddrainn Healthcare."
    )
    .notNull(),
  publicGalleryVisibility: boolean("public_gallery_visibility")
    .default(true)
    .notNull(),
  studentShowcaseVisibility: boolean("student_showcase_visibility")
    .default(true)
    .notNull(),
  feedbackEnabled: boolean("feedback_enabled")
    .default(true)
    .notNull(),
  privacyPolicyContent: text("privacy_policy_content")
    .default(
      "At Meddrainn Healthcare, we value and respect your privacy. Any personal information gathered through admission or training enquiries (including student name, phone number, and email address) is used strictly to communicate academic details and admission guidance. We do not sell, rent, or share personal data with any third parties."
    )
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type SiteSettings = typeof siteSettings.$inferSelect;
export type NewSiteSettings = typeof siteSettings.$inferInsert;

// ==============================================================================
// 3. Courses
// ==============================================================================
export const courses = pgTable(
  "courses",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    shortDescription: text("short_description").notNull(),
    description: text("description").notNull(),
    category: text("category").notNull(),
    duration: text("duration"),
    eligibility: text("eligibility"),
    prerequisites: text("prerequisites"),
    curriculum: jsonb("curriculum").default(sql`'[]'::jsonb`),
    thumbnailUrl: text("thumbnail_url"),
    imageAlt: text("image_alt"),
    featured: boolean("featured").default(false).notNull(),
    status: text("status").default("draft").notNull(), // 'published' | 'draft' | 'hidden'
    displayOrder: integer("display_order").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("courses_slug_idx").on(table.slug),
    index("courses_status_idx").on(table.status),
    index("courses_category_idx").on(table.category),
    index("courses_display_order_idx").on(table.displayOrder),
    index("courses_featured_idx").on(table.featured),
  ]
);

export type Course = typeof courses.$inferSelect;
export type NewCourse = typeof courses.$inferInsert;

// ==============================================================================
// 4. Services
// ==============================================================================
export const services = pgTable(
  "services",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description").notNull(),
    icon: text("icon").default("Activity").notNull(),
    imageUrl: text("image_url"),
    displayOrder: integer("display_order").default(0).notNull(),
    status: text("status").default("published").notNull(), // 'published' | 'draft' | 'hidden'
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("services_slug_idx").on(table.slug),
    index("services_status_idx").on(table.status),
    index("services_display_order_idx").on(table.displayOrder),
  ]
);

export type Service = typeof services.$inferSelect;
export type NewService = typeof services.$inferInsert;

// ==============================================================================
// 5. Gallery Images
// ==============================================================================
export const galleryImages = pgTable(
  "gallery_images",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    title: text("title").notNull(),
    caption: text("caption"),
    category: text("category").notNull(),
    imageUrl: text("image_url").notNull(),
    storageKey: text("storage_key"),
    altText: text("alt_text"),
    eventDate: text("event_date"),
    displayOrder: integer("display_order").default(0).notNull(),
    status: text("status").default("published").notNull(), // 'published' | 'draft' | 'hidden'
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("gallery_category_idx").on(table.category),
    index("gallery_status_idx").on(table.status),
    index("gallery_display_order_idx").on(table.displayOrder),
  ]
);

export type GalleryImage = typeof galleryImages.$inferSelect;
export type NewGalleryImage = typeof galleryImages.$inferInsert;

// ==============================================================================
// 6. Students (Showcase & Verification)
// ==============================================================================
export const students = pgTable(
  "students",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    name: text("name").notNull(),
    courseId: uuid("course_id").references(() => courses.id, {
      onDelete: "set null",
    }),
    batch: text("batch").notNull(),
    description: text("description"),
    photoUrl: text("photo_url"),
    consentStatus: boolean("consent_status").default(false).notNull(),
    status: text("status").default("private").notNull(), // 'published' | 'private' | 'hidden'
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("students_status_idx").on(table.status),
    index("students_course_id_idx").on(table.courseId),
  ]
);

export type Student = typeof students.$inferSelect;
export type NewStudent = typeof students.$inferInsert;

// ==============================================================================
// 7. Enquiries (Contact & Admission Requests)
// ==============================================================================
export const enquiries = pgTable(
  "enquiries",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone").notNull(),
    courseOfInterest: text("course_of_interest"),
    subject: text("subject"),
    message: text("message").notNull(),
    status: text("status").default("new").notNull(), // 'new' | 'contacted' | 'resolved'
    adminNotes: text("admin_notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("enquiries_status_idx").on(table.status),
    index("enquiries_created_at_idx").on(table.createdAt),
  ]
);

export type Enquiry = typeof enquiries.$inferSelect;
export type NewEnquiry = typeof enquiries.$inferInsert;

// ==============================================================================
// 8. Student & Customer Feedback
// ==============================================================================
export const feedback = pgTable(
  "feedback",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    name: text("name").notNull(),
    message: text("message").notNull(),
    rating: integer("rating").default(5).notNull(), // 1 to 5 stars
    status: text("status").default("pending").notNull(), // 'pending' | 'approved' | 'rejected'
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("feedback_status_idx").on(table.status),
    index("feedback_created_at_idx").on(table.createdAt),
    index("feedback_rating_idx").on(table.rating),
  ]
);

export type Feedback = typeof feedback.$inferSelect;
export type NewFeedback = typeof feedback.$inferInsert;

// ==============================================================================
// Relations
// ==============================================================================
export const coursesRelations = relations(courses, ({ many }) => ({
  students: many(students),
}));

export const studentsRelations = relations(students, ({ one }) => ({
  course: one(courses, {
    fields: [students.courseId],
    references: [courses.id],
  }),
}));
