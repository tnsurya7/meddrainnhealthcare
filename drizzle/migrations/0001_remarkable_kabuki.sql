CREATE TABLE "feedback" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"message" text NOT NULL,
	"rating" integer DEFAULT 5 NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "gallery_images" ALTER COLUMN "status" SET DEFAULT 'published';--> statement-breakpoint
ALTER TABLE "services" ALTER COLUMN "status" SET DEFAULT 'published';--> statement-breakpoint
ALTER TABLE "site_settings" ALTER COLUMN "institute_name" SET DEFAULT 'Meddrainn Healthcare';--> statement-breakpoint
ALTER TABLE "site_settings" ALTER COLUMN "hero_title" SET DEFAULT 'WELCOME TO MEDDRAINN HEALTHCARE';--> statement-breakpoint
ALTER TABLE "site_settings" ALTER COLUMN "hero_description" SET DEFAULT 'Established in 2021, Meddrainn Healthcare is focused on equipping future healthcare professionals with practical expertise and industry-ready skills. We connect academic knowledge with real-world healthcare needs through hands-on training in medical equipment, specialized healthcare sales and marketing programs, and professional hospital support services.

At Meddrainn Healthcare, we are committed to excellence, innovation, and collaboration, preparing professionals for successful and rewarding careers in the healthcare and biomedical sector.';--> statement-breakpoint
ALTER TABLE "site_settings" ALTER COLUMN "about_content" SET DEFAULT 'Established in 2021, Meddrainn Healthcare is focused on equipping future healthcare professionals with practical expertise and industry-ready skills. We connect academic knowledge with real-world healthcare needs through hands-on training in medical equipment, specialized healthcare sales and marketing programs, and professional hospital support services.

At Meddrainn Healthcare, we are committed to excellence, innovation, and collaboration, preparing professionals for successful and rewarding careers in the healthcare and biomedical sector.';--> statement-breakpoint
ALTER TABLE "site_settings" ALTER COLUMN "mission" SET DEFAULT '• To provide high quality hands-on training in medical equipment and biomedical technology.
• To conduct industry oriented workshops, seminars and webinars.
• To offer internship programs that build real world technical skills.
• To support students with placement assistance and career guidance.
• To bridge the gap between academic learning and healthcare industry requirements.';--> statement-breakpoint
ALTER TABLE "site_settings" ALTER COLUMN "vision" SET DEFAULT 'To become a leading institution in medical equipment training and biomedical skill development, empowering students and professionals with practical knowledge, industry exposure and career opportunities in the healthcare technology sector.';--> statement-breakpoint
ALTER TABLE "site_settings" ALTER COLUMN "footer_text" SET DEFAULT '© Meddrainn Healthcare. All rights reserved.';--> statement-breakpoint
ALTER TABLE "site_settings" ALTER COLUMN "seo_title" SET DEFAULT 'Meddrainn Healthcare | Professional Biomedical Training Institute';--> statement-breakpoint
ALTER TABLE "site_settings" ALTER COLUMN "seo_description" SET DEFAULT 'Medical equipment training, healthcare workshops, clinical internships, and professional biomedical skills in Erode, Tamil Nadu.';--> statement-breakpoint
ALTER TABLE "site_settings" ALTER COLUMN "privacy_policy_content" SET DEFAULT 'At Meddrainn Healthcare, we value and respect your privacy. Any personal information gathered through admission or training enquiries (including student name, phone number, and email address) is used strictly to communicate academic details and admission guidance. We do not sell, rent, or share personal data with any third parties.';--> statement-breakpoint
ALTER TABLE "site_settings" ADD COLUMN "gallery_heading" text DEFAULT 'Our Gallery' NOT NULL;--> statement-breakpoint
ALTER TABLE "site_settings" ADD COLUMN "gallery_description" text DEFAULT 'A glimpse into our practical biomedical training environment. Explore real moments from our hands-on biomedical training sessions, equipment demonstrations and hospital exposure programs at Meddrainn Healthcare.' NOT NULL;--> statement-breakpoint
ALTER TABLE "site_settings" ADD COLUMN "feedback_enabled" boolean DEFAULT true NOT NULL;--> statement-breakpoint
CREATE INDEX "feedback_status_idx" ON "feedback" USING btree ("status");--> statement-breakpoint
CREATE INDEX "feedback_created_at_idx" ON "feedback" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "feedback_rating_idx" ON "feedback" USING btree ("rating");