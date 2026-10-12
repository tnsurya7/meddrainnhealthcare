import { SignJWT, jwtVerify } from "jose";

export interface AdminJWTPayload {
  userId: string;
  email: string;
  name: string;
  role: "admin" | "editor";
}

const TOKEN_EXPIRY = "7d";

function getJwtSecretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("AUTH_SECRET environment variable is required in production.");
    }
    return new TextEncoder().encode("dev-only-secret-key-at-least-32-chars-long");
  }
  return new TextEncoder().encode(secret);
}

/**
 * Sign administrator JWT
 */
export async function signAdminToken(payload: AdminJWTPayload): Promise<string> {
  const secretKey = getJwtSecretKey();
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .setSubject(payload.userId)
    .sign(secretKey);
}

/**
 * Verify and decode administrator JWT
 */
export async function verifyAdminToken(token: string): Promise<AdminJWTPayload | null> {
  try {
    const secretKey = getJwtSecretKey();
    const { payload } = await jwtVerify(token, secretKey);
    return {
      userId: (payload.userId as string) || (payload.sub as string),
      email: payload.email as string,
      name: payload.name as string,
      role: (payload.role as "admin" | "editor") || "admin",
    };
  } catch {
    return null;
  }
}
