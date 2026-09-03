import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl = process.env.NEXTAUTH_URL || "https://smartlms-bay.vercel.app";
  const response = NextResponse.redirect(new URL("/", baseUrl), { status: 302 });

  const cookieNames = [
    "authjs.session-token",
    "__Secure-authjs.session-token",
    "authjs.csrf-token",
    "__Secure-authjs.callback-url",
    "authjs.callback-url",
    "authjs.nonce",
    "Secure-authjs.session-token",
  ];

  for (const name of cookieNames) {
    response.headers.append(
      "Set-Cookie",
      `${name}=; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax; Secure`
    );
  }

  return response;
}
