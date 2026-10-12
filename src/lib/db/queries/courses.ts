import { cache } from "react";
import { getDb } from "../index";
import { courses, Course } from "../schema";
import { initialCourses } from "../seed-data";
import { eq, and, or, ilike, asc, desc } from "drizzle-orm";
import { getCached, setCached } from "../cache";

// Fallback in-memory courses list when DB is not configured
const fallbackCourses: Course[] = initialCourses.map((c, i) => ({
  ...c,
  id: `fallback-course-${i + 1}`,
  featured: c.featured ?? false,
  status: c.status ?? "published",
  displayOrder: c.displayOrder ?? 0,
  curriculum: c.curriculum || [],
  thumbnailUrl: c.thumbnailUrl || null,
  imageAlt: c.imageAlt || null,
  duration: c.duration || null,
  eligibility: c.eligibility || null,
  prerequisites: c.prerequisites || null,
  createdAt: new Date(),
  updatedAt: new Date(),
}));

export const getPublishedCourses = cache(async function getPublishedCourses(options?: {
  category?: string;
  search?: string;
  sort?: "order" | "newest" | "title";
}): Promise<Course[]> {
  const cacheKey = `courses:published:${options?.category || "all"}:${options?.search || ""}:${options?.sort || "order"}`;
  const cached = getCached<Course[]>(cacheKey);
  if (cached) return cached;

  const db = getDb();
  if (!db) {
    let result = fallbackCourses.filter((c) => c.status === "published");
    if (options?.category && options.category !== "All") {
      result = result.filter((c) => c.category === options.category);
    }
    if (options?.search) {
      const q = options.search.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.shortDescription.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q)
      );
    }
    if (options?.sort === "title") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (options?.sort === "newest") {
      result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } else {
      result.sort((a, b) => a.displayOrder - b.displayOrder);
    }
    return result;
  }

  try {
    const conditions = [eq(courses.status, "published")];

    if (options?.category && options.category !== "All") {
      conditions.push(eq(courses.category, options.category));
    }

    if (options?.search) {
      const pattern = `%${options.search}%`;
      conditions.push(
        or(
          ilike(courses.title, pattern),
          ilike(courses.shortDescription, pattern),
          ilike(courses.category, pattern)
        )!
      );
    }

    let orderByClause;
    if (options?.sort === "title") {
      orderByClause = [asc(courses.title)];
    } else if (options?.sort === "newest") {
      orderByClause = [desc(courses.createdAt)];
    } else {
      orderByClause = [asc(courses.displayOrder), desc(courses.createdAt)];
    }

    const data = await db
      .select()
      .from(courses)
      .where(and(...conditions))
      .orderBy(...orderByClause);

    setCached(cacheKey, data);
    return data;
  } catch (error) {
    console.error("Neon PostgreSQL error fetching published courses:", error);
    return fallbackCourses.filter((c) => c.status === "published");
  }
});

export const getFeaturedCourses = cache(async function getFeaturedCourses(): Promise<Course[]> {
  const cacheKey = "courses:featured";
  const cached = getCached<Course[]>(cacheKey);
  if (cached) return cached;

  const db = getDb();
  if (!db) {
    return fallbackCourses.filter((c) => c.status === "published" && c.featured);
  }

  try {
    const data = await db
      .select()
      .from(courses)
      .where(and(eq(courses.status, "published"), eq(courses.featured, true)))
      .orderBy(asc(courses.displayOrder), desc(courses.createdAt));

    setCached(cacheKey, data);
    return data;
  } catch (error) {
    console.error("Neon PostgreSQL error fetching featured courses:", error);
    return fallbackCourses.filter((c) => c.status === "published" && c.featured);
  }
});

export const getCourseBySlug = cache(async function getCourseBySlug(slug: string): Promise<Course | null> {
  const cacheKey = `courses:slug:${slug}`;
  const cached = getCached<Course | null>(cacheKey);
  if (cached !== null && cached !== undefined) return cached;

  const db = getDb();
  if (!db) {
    return (
      fallbackCourses.find(
        (c) => c.slug === slug && c.status === "published"
      ) || null
    );
  }

  try {
    const [data] = await db
      .select()
      .from(courses)
      .where(and(eq(courses.slug, slug), eq(courses.status, "published")))
      .limit(1);

    const result = data || null;
    setCached(cacheKey, result);
    return result;
  } catch (error) {
    console.error("Neon PostgreSQL error fetching course by slug:", error);
    return (
      fallbackCourses.find(
        (c) => c.slug === slug && c.status === "published"
      ) || null
    );
  }
});

export async function getAllCoursesAdmin(): Promise<Course[]> {
  const db = getDb();
  if (!db) {
    return fallbackCourses;
  }

  try {
    const data = await db
      .select()
      .from(courses)
      .orderBy(asc(courses.displayOrder), desc(courses.createdAt));

    return data;
  } catch (error) {
    console.error("Neon PostgreSQL error fetching all courses for admin:", error);
    return fallbackCourses;
  }
}

export async function getCourseById(id: string): Promise<Course | null> {
  const db = getDb();
  if (!db) {
    return fallbackCourses.find((c) => c.id === id) || null;
  }

  try {
    const [data] = await db
      .select()
      .from(courses)
      .where(eq(courses.id, id))
      .limit(1);

    return data || null;
  } catch (error) {
    console.error("Neon PostgreSQL error fetching course by id:", error);
    return fallbackCourses.find((c) => c.id === id) || null;
  }
}
