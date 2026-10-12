CREATE TABLE "courses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"short_description" text NOT NULL,
	"description" text NOT NULL,
	"category" text NOT NULL,
	"duration" text,
	"eligibility" text,
	"prerequisites" text,
	"curriculum" jsonb DEFAULT '[]'::jsonb,
	"thumbnail_url" text,
	"image_alt" text,
	"featured" boolean DEFAULT false NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "courses_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "enquiries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"course_of_interest" text,
	"subject" text,
	"message" text NOT NULL,
	"status" text DEFAULT 'new' NOT NULL,
	"admin_notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gallery_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"caption" text,
	"category" text NOT NULL,
	"image_url" text NOT NULL,
	"storage_key" text,
	"alt_text" text,
	"event_date" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"description" text NOT NULL,
	"icon" text DEFAULT 'Activity' NOT NULL,
	"image_url" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "services_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"id" text PRIMARY KEY DEFAULT 'default' NOT NULL,
	"institute_name" text DEFAULT 'Biomed Institute' NOT NULL,
	"address" text DEFAULT 'H-42, 80 Feet Road, Periyar Nagar, Erode - 638001, Tamil Nadu, India.' NOT NULL,
	"phone" text DEFAULT '+91 6380918863' NOT NULL,
	"email" text DEFAULT 'meddrainnhealthcare2019@gmail.com' NOT NULL,
	"instagram_url" text DEFAULT 'https://www.instagram.com/meddrainnhealthcare/' NOT NULL,
	"logo_url" text,
	"hero_title" text DEFAULT 'Building Skills for the Future of Biomedical Technology' NOT NULL,
	"hero_description" text DEFAULT 'Empowering students and healthcare professionals with cutting-edge hands-on medical equipment training, practical laboratory experience, and industry-oriented clinical technology education.' NOT NULL,
	"hero_image_url" text,
	"about_content" text DEFAULT 'Biomed Institute is a premier training center dedicated to advancing practical competence in biomedical technology and clinical instrumentation. We bridge the gap between academic theory and real-world hospital engineering through comprehensive hands-on equipment training.' NOT NULL,
	"mission" text DEFAULT 'To impart rigorous, ethical, and industry-aligned biomedical engineering skills through modern medical instrumentation and laboratory-first education.' NOT NULL,
	"vision" text DEFAULT 'To be recognized as a center of excellence in biomedical technology training, nurturing technically sound professionals capable of supporting healthcare delivery with competence and precision.' NOT NULL,
	"footer_text" text DEFAULT '© Biomed Institute. All rights reserved.' NOT NULL,
	"seo_title" text DEFAULT 'Biomed Institute | Professional Biomedical Technology Training' NOT NULL,
	"seo_description" text DEFAULT 'Biomedical equipment training, laboratory workshops, internships, and skill development for aspiring healthcare technologists in Erode, Tamil Nadu.' NOT NULL,
	"public_gallery_visibility" boolean DEFAULT true NOT NULL,
	"student_showcase_visibility" boolean DEFAULT true NOT NULL,
	"privacy_policy_content" text DEFAULT 'At Biomed Institute, we respect your privacy. Any personal information submitted through our enquiry forms, including your name, phone number, and email address, is used solely to respond to your educational queries and program requests. We never sell or share your data with third parties.' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "students" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"course_id" uuid,
	"batch" text NOT NULL,
	"description" text,
	"photo_url" text,
	"consent_status" boolean DEFAULT false NOT NULL,
	"status" text DEFAULT 'private' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"role" text DEFAULT 'admin' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "courses_slug_idx" ON "courses" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "courses_status_idx" ON "courses" USING btree ("status");--> statement-breakpoint
CREATE INDEX "courses_category_idx" ON "courses" USING btree ("category");--> statement-breakpoint
CREATE INDEX "courses_display_order_idx" ON "courses" USING btree ("display_order");--> statement-breakpoint
CREATE INDEX "courses_featured_idx" ON "courses" USING btree ("featured");--> statement-breakpoint
CREATE INDEX "enquiries_status_idx" ON "enquiries" USING btree ("status");--> statement-breakpoint
CREATE INDEX "enquiries_created_at_idx" ON "enquiries" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "gallery_category_idx" ON "gallery_images" USING btree ("category");--> statement-breakpoint
CREATE INDEX "gallery_status_idx" ON "gallery_images" USING btree ("status");--> statement-breakpoint
CREATE INDEX "gallery_display_order_idx" ON "gallery_images" USING btree ("display_order");--> statement-breakpoint
CREATE INDEX "services_slug_idx" ON "services" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "services_status_idx" ON "services" USING btree ("status");--> statement-breakpoint
CREATE INDEX "services_display_order_idx" ON "services" USING btree ("display_order");--> statement-breakpoint
CREATE INDEX "students_status_idx" ON "students" USING btree ("status");--> statement-breakpoint
CREATE INDEX "students_course_id_idx" ON "students" USING btree ("course_id");--> statement-breakpoint
CREATE INDEX "users_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "users_role_idx" ON "users" USING btree ("role");