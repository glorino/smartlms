import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const KEY = crypto
  .createHash("sha256")
  .update(
    process.env.ENCRYPTION_SECRET ||
      process.env.NEXTAUTH_SECRET ||
      "smartlms-default-key"
  )
  .digest();

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv, {
    authTagLength: 16,
  });
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex");
  return `${iv.toString("hex")}:${authTag}:${encrypted}`;
}

export function decrypt(encryptedText: string): string {
  try {
    const parts = encryptedText.split(":");
    if (parts.length !== 3) return encryptedText; // Not encrypted, return as-is
    const iv = Buffer.from(parts[0], "hex");
    const authTag = Buffer.from(parts[1], "hex");
    const encrypted = parts[2];
    const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv, {
      authTagLength: 16,
    });
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch {
    return encryptedText; // Fallback: return as-is if decryption fails
  }
}

export function isEncrypted(text: string): boolean {
  return text.includes(":") && text.split(":").length === 3;
}
