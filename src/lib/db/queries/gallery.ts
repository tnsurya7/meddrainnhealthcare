import { cache } from "react";
import { getDb } from "../index";
import { galleryImages, GalleryImage } from "../schema";
import { initialGalleryImages } from "../seed-data";
import { eq, and, asc, desc } from "drizzle-orm";
import { getCached, setCached } from "../cache";

const fallbackGallery: GalleryImage[] = initialGalleryImages.map((g, i) => ({
  ...g,
  id: `fallback-gallery-${i + 1}`,
  status: g.status ?? "published",
  displayOrder: g.displayOrder ?? 0,
  caption: g.caption || null,
  storageKey: g.storageKey || null,
  altText: g.altText || null,
  eventDate: g.eventDate || null,
  createdAt: new Date(),
  updatedAt: new Date(),
}));

export const getPublishedGalleryImages = cache(async function getPublishedGalleryImages(
  category?: string
): Promise<GalleryImage[]> {
  const cacheKey = `gallery:published:${category || "all"}`;
  const cached = getCached<GalleryImage[]>(cacheKey);
  if (cached) return cached;

  const db = getDb();
  if (!db) {
    let list = fallbackGallery.filter((g) => g.status === "published");
    if (category && category !== "All") {
      list = list.filter((g) => g.category === category);
    }
    return list.sort((a, b) => a.displayOrder - b.displayOrder);
  }

  try {
    const conditions = [eq(galleryImages.status, "published")];
    if (category && category !== "All") {
      conditions.push(eq(galleryImages.category, category));
    }

    const data = await db
      .select()
      .from(galleryImages)
      .where(and(...conditions))
      .orderBy(asc(galleryImages.displayOrder), desc(galleryImages.createdAt));

    setCached(cacheKey, data);
    return data;
  } catch (error) {
    console.error("Neon PostgreSQL error fetching published gallery images:", error);
    let list = fallbackGallery.filter((g) => g.status === "published");
    if (category && category !== "All") {
      list = list.filter((g) => g.category === category);
    }
    return list;
  }
});

export async function getAllGalleryImagesAdmin(): Promise<GalleryImage[]> {
  const db = getDb();
  if (!db) {
    return fallbackGallery;
  }

  try {
    const data = await db
      .select()
      .from(galleryImages)
      .orderBy(asc(galleryImages.displayOrder), desc(galleryImages.createdAt));

    return data;
  } catch (error) {
    console.error("Neon PostgreSQL error fetching all gallery images for admin:", error);
    return fallbackGallery;
  }
}

export async function getGalleryImageById(
  id: string
): Promise<GalleryImage | null> {
  const db = getDb();
  if (!db) {
    return fallbackGallery.find((g) => g.id === id) || null;
  }

  try {
    const [data] = await db
      .select()
      .from(galleryImages)
      .where(eq(galleryImages.id, id))
      .limit(1);

    return data || null;
  } catch (error) {
    console.error("Neon PostgreSQL error fetching gallery image by id:", error);
    return fallbackGallery.find((g) => g.id === id) || null;
  }
}
