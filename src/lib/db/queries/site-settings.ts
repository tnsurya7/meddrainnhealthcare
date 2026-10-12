import { cache } from "react";
import { getDb } from "../index";
import { siteSettings, SiteSettings } from "../schema";
import { initialSiteSettings } from "../seed-data";
import { eq } from "drizzle-orm";
import { getCached, setCached } from "../cache";

export const getSiteSettings = cache(async function getSiteSettings(): Promise<SiteSettings> {
  const cached = getCached<SiteSettings>("site-settings");
  if (cached) return cached;

  const fallbackSettings: SiteSettings = {
    ...initialSiteSettings,
    updatedAt: new Date(),
  } as SiteSettings;

  const db = getDb();
  if (!db) {
    return fallbackSettings;
  }

  try {
    const [settings] = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.id, "default"))
      .limit(1);

    if (settings) {
      setCached("site-settings", settings);
      return settings;
    }

    // Auto-seed default settings row if table is empty
    await db
      .insert(siteSettings)
      .values({
        ...initialSiteSettings,
        id: "default",
      })
      .onConflictDoNothing();

    setCached("site-settings", fallbackSettings);
    return fallbackSettings;
  } catch (error) {
    console.error("Error fetching site settings from Neon PostgreSQL:", error);
    return fallbackSettings;
  }
});
