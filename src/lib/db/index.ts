import { neon } from "@neondatabase/serverless";
import { drizzle, NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

let dbInstance: NeonHttpDatabase<typeof schema> | null = null;

export function isDatabaseConfigured(): boolean {
  const url = process.env.DATABASE_URL;
  return Boolean(
    url &&
    !url.includes("placeholder") &&
    (url.startsWith("postgres://") || url.startsWith("postgresql://"))
  );
}

export function getDb(): NeonHttpDatabase<typeof schema> | null {
  if (!isDatabaseConfigured()) {
    return null;
  }

  if (!dbInstance) {
    const databaseUrl = process.env.DATABASE_URL!;
    const sql = neon(databaseUrl);
    dbInstance = drizzle(sql, { schema });
  }

  return dbInstance;
}

export { schema };
export * from "./schema";
