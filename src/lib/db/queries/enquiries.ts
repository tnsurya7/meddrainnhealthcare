import { getDb } from "../index";
import { enquiries, Enquiry } from "../schema";
import { eq, and, or, ilike, desc, sql } from "drizzle-orm";

export async function getAllEnquiriesAdmin(options?: {
  status?: string;
  course?: string;
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<{ enquiries: Enquiry[]; total: number }> {
  const db = getDb();
  if (!db) {
    return { enquiries: [], total: 0 };
  }

  try {
    const conditions = [];

    if (options?.status && options.status !== "All") {
      conditions.push(eq(enquiries.status, options.status));
    }

    if (options?.course && options.course !== "All") {
      conditions.push(eq(enquiries.courseOfInterest, options.course));
    }

    if (options?.search) {
      const q = `%${options.search}%`;
      conditions.push(
        or(
          ilike(enquiries.name, q),
          ilike(enquiries.email, q),
          ilike(enquiries.phone, q),
          ilike(enquiries.subject, q)
        )!
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const limit = options?.limit || 50;
    const offset = options?.offset || 0;

    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(enquiries)
      .where(whereClause);

    const total = Number(countResult?.count || 0);

    const data = await db
      .select()
      .from(enquiries)
      .where(whereClause)
      .orderBy(desc(enquiries.createdAt))
      .limit(limit)
      .offset(offset);

    return {
      enquiries: data,
      total,
    };
  } catch (error) {
    console.error("Neon PostgreSQL error fetching enquiries for admin:", error);
    return { enquiries: [], total: 0 };
  }
}

export async function getEnquiryById(id: string): Promise<Enquiry | null> {
  const db = getDb();
  if (!db) {
    return null;
  }

  try {
    const [row] = await db
      .select()
      .from(enquiries)
      .where(eq(enquiries.id, id))
      .limit(1);

    return row || null;
  } catch (error) {
    console.error("Neon PostgreSQL error fetching enquiry by id:", error);
    return null;
  }
}
