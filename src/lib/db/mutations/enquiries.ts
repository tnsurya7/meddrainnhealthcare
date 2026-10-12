import { getDb } from "../index";
import { enquiries, Enquiry, NewEnquiry } from "../schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function submitEnquiry(
  data: Omit<NewEnquiry, "id" | "status" | "adminNotes" | "createdAt" | "updatedAt">
): Promise<Enquiry> {
  const db = getDb();
  if (!db) {
    // If running in preview mode without Neon DB, return mock success object so visitor form displays properly
    return {
      id: "preview-enquiry-id",
      ...data,
      status: "new",
      adminNotes: null,
      courseOfInterest: data.courseOfInterest || null,
      subject: data.subject || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  const [inserted] = await db
    .insert(enquiries)
    .values({
      ...data,
      status: "new",
      adminNotes: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  if (!inserted) {
    throw new Error("Failed to submit enquiry to Neon PostgreSQL");
  }

  revalidatePath("/admin/enquiries");
  revalidatePath("/admin/dashboard");
  return inserted;
}

export async function updateEnquiryStatus(
  id: string,
  status: "new" | "contacted" | "resolved",
  adminNotes?: string
): Promise<Enquiry> {
  const db = getDb();
  if (!db) {
    throw new Error("Neon PostgreSQL not configured. Please set DATABASE_URL.");
  }

  const valuesToSet: any = {
    status,
    updatedAt: new Date(),
  };
  if (adminNotes !== undefined) {
    valuesToSet.adminNotes = adminNotes;
  }

  const [updated] = await db
    .update(enquiries)
    .set(valuesToSet)
    .where(eq(enquiries.id, id))
    .returning();

  if (!updated) {
    throw new Error("Failed to update enquiry in Neon PostgreSQL");
  }

  revalidatePath("/admin/enquiries");
  revalidatePath("/admin/dashboard");
  return updated;
}

export async function deleteEnquiry(id: string): Promise<boolean> {
  const db = getDb();
  if (!db) {
    throw new Error("Neon PostgreSQL not configured. Please set DATABASE_URL.");
  }

  await db.delete(enquiries).where(eq(enquiries.id, id));

  revalidatePath("/admin/enquiries");
  revalidatePath("/admin/dashboard");
  return true;
}
