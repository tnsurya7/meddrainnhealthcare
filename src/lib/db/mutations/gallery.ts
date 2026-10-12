import { getDb } from "../index";
import { galleryImages, GalleryImage, NewGalleryImage } from "../schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { storage } from "../../storage";
import { clearCache } from "../cache";

export async function createGalleryImage(
  data: Omit<NewGalleryImage, "id" | "createdAt" | "updatedAt">
): Promise<GalleryImage> {
  const db = getDb();
  if (!db) {
    throw new Error("Neon PostgreSQL not configured. Please set DATABASE_URL.");
  }

  const [inserted] = await db
    .insert(galleryImages)
    .values({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  if (!inserted) {
    throw new Error("Failed to create gallery image in Neon PostgreSQL");
  }

  clearCache("gallery");
  revalidatePath("/gallery");
  revalidatePath("/");
  return inserted;
}

export async function updateGalleryImage(
  id: string,
  data: Partial<Omit<NewGalleryImage, "id" | "createdAt">>
): Promise<GalleryImage> {
  const db = getDb();
  if (!db) {
    throw new Error("Neon PostgreSQL not configured. Please set DATABASE_URL.");
  }

  const [updated] = await db
    .update(galleryImages)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(galleryImages.id, id))
    .returning();

  if (!updated) {
    throw new Error("Failed to update gallery image in Neon PostgreSQL");
  }

  clearCache("gallery");
  revalidatePath("/gallery");
  revalidatePath("/");
  return updated;
}

export async function deleteGalleryImage(id: string): Promise<boolean> {
  const db = getDb();
  if (!db) {
    throw new Error("Neon PostgreSQL not configured. Please set DATABASE_URL.");
  }

  // Retrieve item first to delete object safely from Neon Object Storage
  const [existing] = await db
    .select()
    .from(galleryImages)
    .where(eq(galleryImages.id, id))
    .limit(1);

  if (existing) {
    if (existing.storageKey || existing.imageUrl) {
      try {
        await storage.deleteFile(
          existing.storageKey || existing.imageUrl,
          "gallery-images"
        );
      } catch (err) {
        console.warn("Neon Object Storage deletion warning:", err);
      }
    }

    await db.delete(galleryImages).where(eq(galleryImages.id, id));
  }

  clearCache("gallery");
  revalidatePath("/gallery");
  revalidatePath("/");
  return true;
}
