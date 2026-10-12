import { cache } from "react";
import { getDb } from "../index";
import { students, courses, Student } from "../schema";
import { eq, and, desc } from "drizzle-orm";
import { getCached, setCached } from "../cache";

export interface PublicStudentShowcaseItem {
  id: string;
  name: string;
  batch: string;
  courseName: string | null;
  description: string | null;
  photoUrl: string | null;
}

export const getPublicStudentShowcase = cache(async function getPublicStudentShowcase(): Promise<PublicStudentShowcaseItem[]> {
  const cacheKey = "students:public-showcase";
  const cached = getCached<PublicStudentShowcaseItem[]>(cacheKey);
  if (cached) return cached;

  const db = getDb();
  if (!db) {
    return [];
  }

  try {
    // Only return strictly approved records where status is 'published' and consentStatus is true
    const rows = await db
      .select({
        id: students.id,
        name: students.name,
        batch: students.batch,
        description: students.description,
        photoUrl: students.photoUrl,
        courseName: courses.title,
      })
      .from(students)
      .leftJoin(courses, eq(students.courseId, courses.id))
      .where(
        and(eq(students.status, "published"), eq(students.consentStatus, true))
      )
      .orderBy(desc(students.createdAt));

    const result = rows.map((r) => ({
      id: r.id,
      name: r.name,
      batch: r.batch,
      courseName: r.courseName || null,
      description: r.description || null,
      photoUrl: r.photoUrl || null,
    }));

    setCached(cacheKey, result);
    return result;
  } catch (error) {
    console.error("Neon PostgreSQL error fetching public student showcase:", error);
    return [];
  }
});

export async function getAllStudentsAdmin(): Promise<
  (Student & { courseTitle?: string | null })[]
> {
  const db = getDb();
  if (!db) {
    return [];
  }

  try {
    const rows = await db
      .select({
        student: students,
        courseTitle: courses.title,
      })
      .from(students)
      .leftJoin(courses, eq(students.courseId, courses.id))
      .orderBy(desc(students.createdAt));

    return rows.map((r) => ({
      ...r.student,
      courseTitle: r.courseTitle || null,
    }));
  } catch (error) {
    console.error("Neon PostgreSQL error fetching all students for admin:", error);
    return [];
  }
}

export async function getStudentById(id: string): Promise<Student | null> {
  const db = getDb();
  if (!db) {
    return null;
  }

  try {
    const [row] = await db
      .select()
      .from(students)
      .where(eq(students.id, id))
      .limit(1);

    return row || null;
  } catch (error) {
    console.error("Neon PostgreSQL error fetching student by id:", error);
    return null;
  }
}
