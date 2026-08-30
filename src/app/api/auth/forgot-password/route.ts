import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import prisma from "@/lib/prisma";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    if (!await checkRateLimit("forgot-password", 3, 3600000, request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown")) {
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
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });
    await prisma.passwordResetToken.create({
      data: { token, userId: user.id, expiresAt },
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL || "http://localhost:3000"}/reset-password?token=${token}`;

    try {
      const { sendEmail, passwordResetEmail } = await import("@/lib/email");
      await sendEmail({
        to: user.email,
        subject: "Reset Your SmartLMS Password",
        html: passwordResetEmail(resetUrl),
      });
    } catch {
      console.error("Failed to send password reset email");
    }

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
