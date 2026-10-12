import { NextRequest, NextResponse } from "next/server";
import { adminLoginSchema } from "@/lib/validation";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { decryptAuthPayload } from "@/lib/security/payload-encryption";
import {
  verifyPassword,
  signAdminToken,
  setSessionCookie,
  setDevSessionCookie,
} from "@/lib/auth";
import { getDb } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "anonymous-client";

    // Rate Limiting: 5 attempts per 15 minutes
    const rateLimit = checkRateLimit(`login_${ip}`, {
      windowMs: 15 * 60 * 1000,
      maxRequests: 5,
    });

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error:
            "Too many failed login attempts. Please wait 15 minutes before trying again.",
        },
        { status: 429 }
      );
    }

    const body = await req.json();

    let email = body.email;
    let password = body.password;

    // Decrypt client-side encrypted credentials to prevent plaintext passwords in DevTools Network tab
    if (body.encryptedPayload && typeof body.encryptedPayload === "string") {
      try {
        const decrypted = await decryptAuthPayload(body.encryptedPayload);
        if (decrypted) {
          if (decrypted.password) password = decrypted.password;
          if (decrypted.email) email = decrypted.email;
        }
      } catch (err) {
        console.error("Payload decryption error:", err);
        return NextResponse.json(
          { error: "Invalid encrypted credentials." },
          { status: 400 }
        );
      }
    }

    const validationResult = adminLoginSchema.safeParse({ email, password });

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid email or password format." },
        { status: 400 }
      );
    }

    const { email, password } = validationResult.data;
    const cleanEmail = email.toLowerCase().trim();

    const db = getDb();
    if (db) {
      // 1. Look up user in Neon PostgreSQL
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, cleanEmail))
        .limit(1);

      if (!user) {
        return NextResponse.json(
          { error: "Invalid email or password." },
          { status: 401 }
        );
      }

      // 2. Verify password with Argon2id
      const isValidPassword = await verifyPassword(password, user.passwordHash);
      if (!isValidPassword) {
        return NextResponse.json(
          { error: "Invalid email or password." },
          { status: 401 }
        );
      }

      // 3. Verify Admin Role
      if (user.role !== "admin") {
        return NextResponse.json(
          { error: "Access denied. Administrator privileges required." },
          { status: 403 }
        );
      }

      // 4. Sign JWT and set secure HttpOnly cookie
      const token = await signAdminToken({
        userId: user.id,
        email: user.email,
        name: user.name,
        role: "admin",
      });

      await setSessionCookie(token);

      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      });
    }

    // Offline / Local Development preview mode (when DATABASE_URL is not set)
    const devEmail = process.env.ADMIN_EMAIL?.toLowerCase();
    const devPass = process.env.ADMIN_PASSWORD;

    if (devEmail && devPass && cleanEmail === devEmail && password === devPass) {
      const devSession = {
        userId: "dev-admin-id",
        email: devEmail,
        name: process.env.ADMIN_NAME || "Administrator",
        role: "admin" as const,
      };
      await setDevSessionCookie(devSession);
      return NextResponse.json({
        success: true,
        user: devSession,
      });
    }

    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 }
    );
  } catch (error) {
    console.error("Neon PostgreSQL Auth login error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during authentication." },
      { status: 500 }
    );
  }
}
