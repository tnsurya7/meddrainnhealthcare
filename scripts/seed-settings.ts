import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import {
  initialSiteSettings,
  initialCourses,
  initialServices,
  initialGalleryImages,
} from "../src/lib/db/seed-data";
import {
  siteSettings,
  courses,
  services,
  galleryImages,
} from "../src/lib/db/schema";
import { eq } from "drizzle-orm";

async function main() {
  console.log("=== Biomed Institute: Neon PostgreSQL Initial Content Seeder ===");

  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl || databaseUrl.includes("placeholder")) {
    console.error("Error: DATABASE_URL is required in .env.local to seed content into Neon.");
    console.error("Example: DATABASE_URL=\"postgresql://neondb_owner:***@ep-***.us-east-2.aws.neon.tech/neondb?sslmode=require\"");
    process.exit(1);
  }

  const sql = neon(databaseUrl);
  const db = drizzle(sql);

  // 1. Seed Site Settings
  console.log("Seeding site settings into Neon PostgreSQL...");
  const [existingSettings] = await db
    .select({ id: siteSettings.id })
    .from(siteSettings)
    .where(eq(siteSettings.id, "default"))
    .limit(1);

  if (existingSettings) {
    await db
      .update(siteSettings)
      .set({
        ...initialSiteSettings,
        updatedAt: new Date(),
      })
      .where(eq(siteSettings.id, "default"));
    console.log("✓ Site settings updated.");
  } else {
    await db.insert(siteSettings).values({
      ...initialSiteSettings,
      id: "default",
      updatedAt: new Date(),
    });
    console.log("✓ Site settings seeded.");
  }

  // 2. Seed Courses
  console.log("Seeding courses into Neon PostgreSQL...");
  for (const c of initialCourses) {
    const [existingCourse] = await db
      .select({ id: courses.id })
      .from(courses)
      .where(eq(courses.slug, c.slug))
      .limit(1);

    if (!existingCourse) {
      await db.insert(courses).values({
        ...c,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log(`  + Seeded course: ${c.title}`);
    } else {
      await db
        .update(courses)
        .set({
          ...c,
          updatedAt: new Date(),
        })
        .where(eq(courses.id, existingCourse.id));
      console.log(`  ✓ Updated course: ${c.title}`);
    }
  }

  // 3. Seed Services
  console.log("Seeding services into Neon PostgreSQL...");
  for (const s of initialServices) {
    const [existingService] = await db
      .select({ id: services.id })
      .from(services)
      .where(eq(services.slug, s.slug))
      .limit(1);

    if (!existingService) {
      await db.insert(services).values({
        ...s,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log(`  + Seeded service: ${s.title}`);
    } else {
      await db
        .update(services)
        .set({
          ...s,
          updatedAt: new Date(),
        })
        .where(eq(services.id, existingService.id));
      console.log(`  ✓ Updated service: ${s.title}`);
    }
  }

  // 4. Seed Gallery Images
  console.log("Seeding gallery images into Neon PostgreSQL...");
  for (const g of initialGalleryImages) {
    const [existingGallery] = await db
      .select({ id: galleryImages.id })
      .from(galleryImages)
      .where(eq(galleryImages.title, g.title))
      .limit(1);

    if (!existingGallery) {
      await db.insert(galleryImages).values({
        ...g,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log(`  + Seeded gallery image: ${g.title}`);
    }
  }

  console.log("\n=======================================================");
  console.log("✓ SUCCESS: All Biomed Institute data successfully seeded into Neon!");
  console.log("=======================================================\n");
}

main().catch((err) => {
  console.error("Fatal error during seeding:", err);
  process.exit(1);
});
