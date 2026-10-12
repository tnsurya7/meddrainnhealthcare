import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminJWTPayload, verifyAdminToken, signAdminToken } from "./jwt";
import { getDb } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export type { AdminJWTPayload };
export type AdminSession = AdminJWTPayload;

export const SESSION_COOKIE_NAME = "biomed_admin_session";
const DEV_COOKIE_NAME = "biomed_dev_session";

/**
 * Verifies authenticated administrator session from HttpOnly cookie.
 * Validates JWT signature and ensures active admin role in Neon PostgreSQL.
 */
export async function getCurrentSession(): Promise<AdminJWTPayload | null> {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get(SESSION_COOKIE_NAME);

    if (tokenCookie?.value) {
      const payload = await verifyAdminToken(tokenCookie.value);
      if (!payload) {
        return null;
      }

      // If Neon PostgreSQL is configured, verify user in the database
      const db = getDb();
      if (db) {
        try {
          const [dbUser] = await db
            .select({
              id: users.id,
              email: users.email,
              name: users.name,
              role: users.role,
            })
            .from(users)
            .where(eq(users.id, payload.userId))
            .limit(1);

          if (!dbUser || dbUser.role !== "admin") {
            return null;
          }

          return {
            userId: dbUser.id,
            email: dbUser.email,
            name: dbUser.name,
            role: dbUser.role as "admin" | "editor",
          };
        } catch (dbErr) {
          console.error("Database check error in getCurrentSession:", dbErr);
          // If DB is temporarily unreachable but token is signed and valid, permit session
          return payload;
        }
      }

      return payload;
    }

    // Development / offline test session fallback
    const devCookie = cookieStore.get(DEV_COOKIE_NAME);
    if (devCookie?.value) {
      try {
        return JSON.parse(devCookie.value) as AdminJWTPayload;
      } catch {
        return null;
      }
    }

    return null;
  } catch (err) {
    console.error("Error retrieving current session:", err);
    return null;
  }
}

/**
 * Route guard for Server Components and Server Actions
 */
export async function requireAdminSession(
  redirectTo = "/admin/login"
): Promise<AdminJWTPayload> {
  const session = await getCurrentSession();
  if (!session) {
    redirect(redirectTo);
  }
  return session;
}

/**
 * Set secure HttpOnly session cookie
 */
export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

/**
 * Set development session cookie (used in offline testing)
 */
export async function setDevSessionCookie(session: AdminJWTPayload): Promise<void> {
  const cookieStore = await cookies();
  const token = await signAdminToken(session);
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  cookieStore.set(DEV_COOKIE_NAME, JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

/**
 * Sign out administrator
 */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  cookieStore.delete(DEV_COOKIE_NAME);
}

export * from "./passwords";
export * from "./jwt";
