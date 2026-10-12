import { getDb } from "../index";
import { courses, Course, NewCourse } from "../schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { clearCache } from "../cache";

export async function createCourse(
  data: Omit<NewCourse, "id" | "createdAt" | "updatedAt">
): Promise<Course> {
  const db = getDb();
  if (!db) {
    throw new Error("Neon PostgreSQL not configured. Please set DATABASE_URL.");
  }

  const [inserted] = await db
    .insert(courses)
    .values({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  if (!inserted) {
    throw new Error("Failed to create course in Neon PostgreSQL");
  }

  clearCache("courses");
  revalidatePath("/courses");
  revalidatePath("/");
  return inserted;
}

export async function updateCourse(
  id: string,
  data: Partial<Omit<NewCourse, "id" | "createdAt">>
): Promise<Course> {
  const db = getDb();
  if (!db) {
    throw new Error("Neon PostgreSQL not configured. Please set DATABASE_URL.");
  }

  const [updated] = await db
    .update(courses)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(courses.id, id))
    .returning();

  if (!updated) {
    throw new Error("Failed to update course in Neon PostgreSQL");
  }

  clearCache("courses");
  revalidatePath("/courses");
  if (updated.slug) {
    revalidatePath(`/courses/${updated.slug}`);
  }
  revalidatePath("/");
  return updated;
}

export async function deleteCourse(id: string): Promise<boolean> {
  const db = getDb();
  if (!db) {
    throw new Error("Neon PostgreSQL not configured. Please set DATABASE_URL.");
  }

  await db.delete(courses).where(eq(courses.id, id));

  clearCache("courses");
  revalidatePath("/courses");
  revalidatePath("/");
  return true;
}
