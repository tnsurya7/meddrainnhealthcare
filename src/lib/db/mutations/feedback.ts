import { getDb } from "../index";
import { feedback, Feedback, NewFeedback } from "../schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { clearCache } from "../cache";

export async function submitFeedback(
  data: { name: string; message: string; rating: number }
): Promise<Feedback> {
  const db = getDb();
  if (!db) {
    return {
      id: "preview-feedback-id",
      name: data.name,
      message: data.message,
      rating: data.rating ?? 5,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  const [inserted] = await db
    .insert(feedback)
    .values({
      name: data.name,
      message: data.message,
      rating: data.rating ?? 5,
      status: "pending", // Always pending until moderated
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  if (!inserted) {
    throw new Error("Failed to submit feedback to Neon PostgreSQL");
  }

  revalidatePath("/admin/feedback");
  revalidatePath("/admin/dashboard");
  return inserted;
}

export async function updateFeedbackStatus(
  id: string,
  status: "pending" | "approved" | "rejected"
): Promise<Feedback> {
  const db = getDb();
  if (!db) {
    throw new Error("Neon PostgreSQL not configured. Please set DATABASE_URL.");
  }

  const [updated] = await db
    .update(feedback)
    .set({
      status,
      updatedAt: new Date(),
    })
    .where(eq(feedback.id, id))
    .returning();

  if (!updated) {
    throw new Error("Failed to update feedback in Neon PostgreSQL");
  }

  clearCache("feedback");
  revalidatePath("/feedback");
  revalidatePath("/");
  revalidatePath("/admin/feedback");
  revalidatePath("/admin/dashboard");
  return updated;
}

export async function deleteFeedback(id: string): Promise<boolean> {
  const db = getDb();
  if (!db) {
    throw new Error("Neon PostgreSQL not configured. Please set DATABASE_URL.");
  }

  await db.delete(feedback).where(eq(feedback.id, id));

  clearCache("feedback");
  revalidatePath("/feedback");
  revalidatePath("/");
  revalidatePath("/admin/feedback");
  revalidatePath("/admin/dashboard");
  return true;
}
