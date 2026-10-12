import { hash, verify } from "@node-rs/argon2";

/**
 * Hash plain password using Argon2id with OWASP recommended parameters
 */
export async function hashPassword(plainText: string): Promise<string> {
  return await hash(plainText, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
}

/**
 * Verify plaintext password against Argon2id hash
 */
export async function verifyPassword(
  plainText: string,
  hashedPassword: string
): Promise<boolean> {
  try {
    return await verify(hashedPassword, plainText);
  } catch (err) {
    console.error("Argon2id password verification error:", err);
    return false;
  }
}
