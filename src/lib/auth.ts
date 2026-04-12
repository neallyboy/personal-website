/**
 * Auth utilities using Web Crypto API.
 * Compatible with both Node.js (18+) and Next.js Edge Runtime.
 */

export const COOKIE_NAME = "authToken";
export const COOKIE_MAX_AGE = 60 * 60; // 1 hour

// Stable payload that is HMAC-signed with the password as the key.
// Changing this string invalidates all existing sessions.
const AUTH_PAYLOAD = "portfolio-auth-v1";

function getSecret(): string {
  const secret = process.env.PAGE_ACCESS_PASSWORD;
  if (!secret) throw new Error("PAGE_ACCESS_PASSWORD environment variable is not set");
  return secret;
}

async function hmacHex(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function generateAuthToken(): Promise<string> {
  return hmacHex(getSecret(), AUTH_PAYLOAD);
}

/**
 * Constant-time comparison to prevent timing attacks.
 */
export async function verifyAuthToken(token: string): Promise<boolean> {
  try {
    const expected = await generateAuthToken();
    if (expected.length !== token.length) return false;
    let diff = 0;
    for (let i = 0; i < expected.length; i++) {
      diff |= expected.charCodeAt(i) ^ token.charCodeAt(i);
    }
    return diff === 0;
  } catch {
    return false;
  }
}
