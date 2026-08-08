import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import prisma from "@/lib/prisma";
import crypto from "crypto";

const passwordResetTokens = new Map<string, { userId: string; expiresAt: number }>();

export async function POST(request: Request) {
  try {
    if (!checkRateLimit("forgot-password", 3, 3600000)) {
      return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });
    }
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({
        success: true,
        message: "If an account exists with that email, a password reset link has been sent.",
      });
    }

    const token = crypto.randomBytes(24).toString("hex");
    const expiresAt = Date.now() + 60 * 60 * 1000;

    passwordResetTokens.set(token, { userId: user.id, expiresAt });

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password?token=${token}`;
    console.log(`\n========== PASSWORD RESET ==========`);
    console.log(`User: ${user.email}`);
    console.log(`Reset URL: ${resetUrl}`);
    console.log(`Token expires in 1 hour`);
    console.log(`=====================================\n`);

    return NextResponse.json({
      success: true,
      message: "If an account exists with that email, a password reset link has been sent.",
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}

export function getResetToken(token: string) {
  const data = passwordResetTokens.get(token);
  if (!data) return null;
  if (Date.now() > data.expiresAt) {
    passwordResetTokens.delete(token);
    return null;
  }
  return data;
}

export function deleteResetToken(token: string) {
  passwordResetTokens.delete(token);
}
