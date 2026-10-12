import { getDb } from "../index";
import { services, Service, NewService } from "../schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { clearCache } from "../cache";

export async function createService(
  data: Omit<NewService, "id" | "createdAt" | "updatedAt">
): Promise<Service> {
  const db = getDb();
  if (!db) {
    throw new Error("Neon PostgreSQL not configured. Please set DATABASE_URL.");
  }

  const [inserted] = await db
    .insert(services)
    .values({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  if (!inserted) {
    throw new Error("Failed to create service in Neon PostgreSQL");
  }

  clearCache("services");
  revalidatePath("/services");
  revalidatePath("/");
  return inserted;
}

export async function updateService(
  id: string,
  data: Partial<Omit<NewService, "id" | "createdAt">>
): Promise<Service> {
  const db = getDb();
  if (!db) {
    throw new Error("Neon PostgreSQL not configured. Please set DATABASE_URL.");
  }

  const [updated] = await db
    .update(services)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(services.id, id))
    .returning();

  if (!updated) {
    throw new Error("Failed to update service in Neon PostgreSQL");
  }

  clearCache("services");
  revalidatePath("/services");
  revalidatePath("/");
  return updated;
}

export async function deleteService(id: string): Promise<boolean> {
  const db = getDb();
  if (!db) {
    throw new Error("Neon PostgreSQL not configured. Please set DATABASE_URL.");
  }

  await db.delete(services).where(eq(services.id, id));

  clearCache("services");
  revalidatePath("/services");
  revalidatePath("/");
  return true;
}
