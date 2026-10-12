import { getDb } from "../index";
import { siteSettings, SiteSettings, NewSiteSettings } from "../schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { clearCache } from "../cache";

export async function updateSiteSettings(
  data: Partial<NewSiteSettings>
): Promise<SiteSettings> {
  const db = getDb();
  if (!db) {
    throw new Error(
      "Neon PostgreSQL database not configured. Please check DATABASE_URL."
    );
  }

  const [updated] = await db
    .update(siteSettings)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(siteSettings.id, "default"))
    .returning();

  if (!updated) {
    throw new Error("Failed to update site settings in Neon PostgreSQL");
  }

  clearCache("site-settings");
  // Revalidate public routes to reflect new settings immediately
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/courses");
  revalidatePath("/services");
  revalidatePath("/gallery");
  revalidatePath("/contact");
  revalidatePath("/privacy");

  return updated;
}
