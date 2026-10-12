import { getDb } from "../index";
import { students, Student, NewStudent } from "../schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { storage } from "../../storage";
import { clearCache } from "../cache";

export async function createStudent(
  data: Omit<NewStudent, "id" | "createdAt" | "updatedAt">
): Promise<Student> {
  const db = getDb();
  if (!db) {
    throw new Error("Neon PostgreSQL not configured. Please set DATABASE_URL.");
  }

  const [inserted] = await db
    .insert(students)
    .values({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  if (!inserted) {
    throw new Error("Failed to create student in Neon PostgreSQL");
  }

  clearCache("students");
  revalidatePath("/");
  return inserted;
}

export async function updateStudent(
  id: string,
  data: Partial<Omit<NewStudent, "id" | "createdAt">>
): Promise<Student> {
  const db = getDb();
  if (!db) {
    throw new Error("Neon PostgreSQL not configured. Please set DATABASE_URL.");
  }

  const [updated] = await db
    .update(students)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(students.id, id))
    .returning();

  if (!updated) {
    throw new Error("Failed to update student in Neon PostgreSQL");
  }

  clearCache("students");
  revalidatePath("/");
  return updated;
}

export async function deleteStudent(id: string): Promise<boolean> {
  const db = getDb();
  if (!db) {
    throw new Error("Neon PostgreSQL not configured. Please set DATABASE_URL.");
  }

  const [existing] = await db
    .select()
    .from(students)
    .where(eq(students.id, id))
    .limit(1);

  if (existing?.photoUrl) {
    try {
      await storage.deleteFile(existing.photoUrl, "student-photos");
    } catch (err) {
      console.warn("Storage deletion warning for student photo:", err);
    }
  }

  await db.delete(students).where(eq(students.id, id));

  clearCache("students");
  revalidatePath("/");
  return true;
}
