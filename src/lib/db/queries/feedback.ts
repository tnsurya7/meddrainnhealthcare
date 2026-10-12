import { cache } from "react";
import { getDb } from "../index";
import { feedback, Feedback } from "../schema";
import { eq, and, or, ilike, desc, sql } from "drizzle-orm";
import { initialFeedback } from "../seed-data";
import { getCached, setCached } from "../cache";

export const getApprovedFeedback = cache(async function getApprovedFeedback(limit = 20): Promise<Feedback[]> {
  const cacheKey = `feedback:approved:${limit}`;
  const cached = getCached<Feedback[]>(cacheKey);
  if (cached) return cached;

  const fallback = initialFeedback.map((f, i) => ({
    id: `fallback-feedback-${i + 1}`,
    name: f.name,
    message: f.message,
    rating: f.rating ?? 5,
    status: "approved" as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  const db = getDb();
  if (!db) {
    return fallback;
  }

  try {
    const rows = await db
      .select()
      .from(feedback)
      .where(eq(feedback.status, "approved"))
      .orderBy(desc(feedback.createdAt))
      .limit(limit);

    if (rows.length === 0) {
      setCached(cacheKey, fallback);
      return fallback;
    }

    setCached(cacheKey, rows);
    return rows;
  } catch (error) {
    console.error("Neon PostgreSQL error fetching approved feedback:", error);
    return fallback;
  }
});

export async function getAllFeedbackAdmin(options?: {
  status?: string;
  rating?: number;
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<{ feedback: Feedback[]; total: number }> {
  const db = getDb();
  if (!db) {
    const list: Feedback[] = initialFeedback.map((f, i) => ({
      id: `fallback-feedback-${i + 1}`,
      name: f.name,
      message: f.message,
      rating: f.rating ?? 5,
      status: f.status ?? "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    return { feedback: list, total: list.length };
  }

  try {
    const conditions = [];

    if (options?.status && options.status !== "All") {
      conditions.push(eq(feedback.status, options.status));
    }

    if (options?.rating && options.rating > 0) {
      conditions.push(eq(feedback.rating, options.rating));
    }

    if (options?.search) {
      const q = `%${options.search}%`;
      conditions.push(
        or(
          ilike(feedback.name, q),
          ilike(feedback.message, q)
        )!
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const limit = options?.limit || 50;
    const offset = options?.offset || 0;

    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(feedback)
      .where(whereClause);

    const total = Number(countResult?.count || 0);

    const data = await db
      .select()
      .from(feedback)
      .where(whereClause)
      .orderBy(desc(feedback.createdAt))
      .limit(limit)
      .offset(offset);

    return {
      feedback: data,
      total,
    };
  } catch (error) {
    console.error("Neon PostgreSQL error fetching feedback for admin:", error);
    return { feedback: [], total: 0 };
  }
}

export async function getFeedbackById(id: string): Promise<Feedback | null> {
  const db = getDb();
  if (!db) {
    return null;
  }

  try {
    const [row] = await db
      .select()
      .from(feedback)
      .where(eq(feedback.id, id))
      .limit(1);

    return row || null;
  } catch (error) {
    console.error("Neon PostgreSQL error fetching feedback by id:", error);
    return null;
  }
}
