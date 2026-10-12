import { cache } from "react";
import { getDb } from "../index";
import { services, Service } from "../schema";
import { initialServices } from "../seed-data";
import { eq, asc, desc } from "drizzle-orm";
import { getCached, setCached } from "../cache";

const fallbackServices: Service[] = initialServices.map((s, i) => ({
  ...s,
  id: `fallback-service-${i + 1}`,
  status: s.status ?? "published",
  displayOrder: s.displayOrder ?? 0,
  icon: s.icon ?? "Activity",
  imageUrl: s.imageUrl || null,
  createdAt: new Date(),
  updatedAt: new Date(),
}));

export const getPublishedServices = cache(async function getPublishedServices(): Promise<Service[]> {
  const cacheKey = "services:published";
  const cached = getCached<Service[]>(cacheKey);
  if (cached) return cached;

  const db = getDb();
  if (!db) {
    return fallbackServices.filter((s) => s.status === "published");
  }

  try {
    const data = await db
      .select()
      .from(services)
      .where(eq(services.status, "published"))
      .orderBy(asc(services.displayOrder), desc(coursesFallbackOrder()));

    setCached(cacheKey, data);
    return data;
  } catch (error) {
    console.error("Neon PostgreSQL error fetching published services:", error);
    return fallbackServices.filter((s) => s.status === "published");
  }
});

function coursesFallbackOrder() {
  return services.createdAt;
}

export async function getAllServicesAdmin(): Promise<Service[]> {
  const db = getDb();
  if (!db) {
    return fallbackServices;
  }

  try {
    const data = await db
      .select()
      .from(services)
      .orderBy(asc(services.displayOrder), desc(services.createdAt));

    return data;
  } catch (error) {
    console.error("Neon PostgreSQL error fetching all services for admin:", error);
    return fallbackServices;
  }
}

export async function getServiceById(id: string): Promise<Service | null> {
  const db = getDb();
  if (!db) {
    return fallbackServices.find((s) => s.id === id) || null;
  }

  try {
    const [data] = await db
      .select()
      .from(services)
      .where(eq(services.id, id))
      .limit(1);

    return data || null;
  } catch (error) {
    console.error("Neon PostgreSQL error fetching service by id:", error);
    return fallbackServices.find((s) => s.id === id) || null;
  }
}
