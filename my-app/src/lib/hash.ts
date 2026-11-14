// Tiny SHA-256 helper built on Web Crypto (crypto.subtle).
// Works in browsers and in Node 19+ where global `crypto` is available.

export function normalizeCode(value: string): string {
  return (value ?? "").trim().toLowerCase();
}

export async function sha256Hex(value: string): Promise<string> {
  const data = new TextEncoder().encode(value);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const sha256 = sha256Hex;

export async function hash(value: string): Promise<string> {
  return sha256Hex(value);
}

export async function hashCode(value: string): Promise<string> {
  return sha256Hex(normalizeCode(value));
}

export async function hashPassword(value: string): Promise<string> {
  return sha256Hex(normalizeCode(value));
}

// Verify a (possibly un-normalised) entered code against a stored SHA-256 hex hash.
export async function verifyCode(entered: string, expectedHash: string): Promise<boolean> {
  if (!expectedHash) return false;
  const computed = await sha256Hex(normalizeCode(entered));
  return computed === String(expectedHash).trim().toLowerCase();
}

export const verifyPassword = verifyCode;
export const verifyHash = verifyCode;
export const checkCode = verifyCode;
export const checkPassword = verifyCode;
export const compareHash = verifyCode;