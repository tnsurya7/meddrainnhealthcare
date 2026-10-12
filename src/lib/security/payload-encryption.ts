/**
 * Client-Side Payload Encryption for Authentication
 * Encrypts sensitive credentials before transmission so that raw passwords
 * do not appear in browser DevTools Network tab payloads.
 */

const PAYLOAD_SECRET =
  process.env.NEXT_PUBLIC_PAYLOAD_CIPHER_SECRET ||
  "meddrainn-auth-shield-vault-key-2026";

async function getCryptoKey(subtle: SubtleCrypto): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const rawKey = enc.encode(PAYLOAD_SECRET);
  const keyHash = await subtle.digest("SHA-256", rawKey);
  return await subtle.importKey(
    "raw",
    keyHash,
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"]
  );
}

function uint8ArrayToBase64(bytes: Uint8Array): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(bytes).toString("base64");
  }
  let binary = "";
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToUint8Array(base64: string): Uint8Array {
  if (typeof Buffer !== "undefined") {
    return new Uint8Array(Buffer.from(base64, "base64"));
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export interface AuthPayloadData {
  email?: string;
  password?: string;
  timestamp?: number;
  [key: string]: unknown;
}

/**
 * Encrypt client authentication payload using AES-GCM 256-bit
 * Prevents raw plaintext passwords from being visible in browser DevTools Network payloads.
 */
export async function encryptAuthPayload(data: AuthPayloadData): Promise<string> {
  const subtle =
    typeof window !== "undefined"
      ? window.crypto?.subtle
      : globalThis.crypto?.subtle;

  if (!subtle) {
    throw new Error("Web Crypto API (subtle) is unavailable in this runtime.");
  }

  const cryptoKey = await getCryptoKey(subtle);
  const cryptoObj =
    typeof window !== "undefined" ? window.crypto : globalThis.crypto;
  const iv = cryptoObj.getRandomValues(new Uint8Array(12));

  const enc = new TextEncoder();
  const plaintext = JSON.stringify(data);
  const ciphertext = await subtle.encrypt(
    { name: "AES-GCM", iv },
    cryptoKey,
    enc.encode(plaintext)
  );

  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ciphertext), iv.length);

  return uint8ArrayToBase64(combined);
}

/**
 * Decrypt authentication payload on the server
 */
export async function decryptAuthPayload(
  encryptedString: string
): Promise<AuthPayloadData | null> {
  const subtle =
    typeof window !== "undefined"
      ? window.crypto?.subtle
      : globalThis.crypto?.subtle;

  if (!subtle) {
    throw new Error("Web Crypto API (subtle) is unavailable in this runtime.");
  }

  const cryptoKey = await getCryptoKey(subtle);
  const combined = base64ToUint8Array(encryptedString);

  if (combined.length < 13) {
    throw new Error("Encrypted payload data too short.");
  }

  const iv = combined.slice(0, 12);
  const ciphertext = combined.slice(12);

  const decryptedBuffer = await subtle.decrypt(
    { name: "AES-GCM", iv: iv as unknown as BufferSource },
    cryptoKey,
    ciphertext as unknown as BufferSource
  );

  const dec = new TextDecoder();
  const jsonStr = dec.decode(decryptedBuffer);
  return JSON.parse(jsonStr) as AuthPayloadData;
}
