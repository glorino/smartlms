import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const CSRF_SECRET = process.env.CSRF_SECRET || crypto.randomBytes(32).toString("hex");
const TOKEN_EXPIRY = 60 * 60 * 1000; // 1 hour

export function generateCsrfToken(): string {
  const token = crypto.randomBytes(32).toString("hex");
  const expires = Date.now() + TOKEN_EXPIRY;
  const signature = crypto
    .createHmac("sha256", CSRF_SECRET)
    .update(`${token}:${expires}`)
    .digest("hex");
  return `${token}:${expires}:${signature}`;
}

export function validateCsrfToken(token: string): boolean {
  try {
    const parts = token.split(":");
    if (parts.length !== 3) return false;

    const [tokenValue, expiresStr, signature] = parts;
    const expires = parseInt(expiresStr, 10);

    if (Date.now() > expires) return false;

    const expectedSignature = crypto
      .createHmac("sha256", CSRF_SECRET)
      .update(`${tokenValue}:${expires}`)
      .digest("hex");

    return crypto.timingSafeEqual(
      Buffer.from(signature, "hex"),
      Buffer.from(expectedSignature, "hex")
    );
  } catch {
    return false;
  }
}

export async function csrfProtection(req: NextRequest): Promise<NextResponse | null> {
  if (["POST", "PUT", "DELETE", "PATCH"].includes(req.method)) {
    const token =
      req.headers.get("x-csrf-token") ||
      req.headers.get("csrf-token") ||
      (await req.formData()).get("_csrf")?.toString();

    if (!token || !validateCsrfToken(token)) {
      return NextResponse.json(
        { error: "Invalid or missing CSRF token" },
        { status: 403 }
      );
    }
  }
  return null;
}
