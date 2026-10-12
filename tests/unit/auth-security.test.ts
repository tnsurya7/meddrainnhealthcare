import { describe, it, expect } from "vitest";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { hashPassword, verifyPassword } from "@/lib/auth/passwords";
import { signAdminToken, verifyAdminToken } from "@/lib/auth/jwt";

describe("Administrator Authentication & Security (Argon2id + Jose JWT)", () => {
  it("hashes passwords securely with Argon2id and verifies correctly", async () => {
    const rawPassword = "SecureBiomedPassword2026!";
    const hashed = await hashPassword(rawPassword);

    expect(hashed).toBeDefined();
    expect(hashed.startsWith("$argon2id$")).toBe(true);

    const isMatch = await verifyPassword(rawPassword, hashed);
    expect(isMatch).toBe(true);

    const isBadMatch = await verifyPassword("WrongPassword123!", hashed);
    expect(isBadMatch).toBe(false);
  });

  it("signs and verifies JWT tokens with Jose", async () => {
    const payload = {
      userId: "test-admin-uuid-1",
      email: "admin@biomed.institute",
      name: "Biomed Admin",
      role: "admin" as const,
    };

    const token = await signAdminToken(payload);
    expect(typeof token).toBe("string");
    expect(token.length).toBeGreaterThan(20);

    const verified = await verifyAdminToken(token);
    expect(verified).not.toBeNull();
    expect(verified?.userId).toBe(payload.userId);
    expect(verified?.email).toBe(payload.email);
    expect(verified?.role).toBe("admin");

    const invalid = await verifyAdminToken("invalid.jwt.token");
    expect(invalid).toBeNull();
  });

  it("enforces rate limits after maximum attempts are reached", () => {
    const testIdentifier = `test_ip_${Date.now()}`;
    const options = { windowMs: 60 * 1000, maxRequests: 3 };

    // Requests 1, 2, 3 should succeed
    const req1 = checkRateLimit(testIdentifier, options);
    expect(req1.success).toBe(true);
    expect(req1.remaining).toBe(2);

    const req2 = checkRateLimit(testIdentifier, options);
    expect(req2.success).toBe(true);
    expect(req2.remaining).toBe(1);

    const req3 = checkRateLimit(testIdentifier, options);
    expect(req3.success).toBe(true);
    expect(req3.remaining).toBe(0);

    // Request 4 should be rejected
    const req4 = checkRateLimit(testIdentifier, options);
    expect(req4.success).toBe(false);
    expect(req4.remaining).toBe(0);
  });
});
