import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { SITE_CONFIG } from "@/lib/constants";
import { auth } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
    const allowed = await checkRateLimit("contact", 3, 60 * 60 * 1000, ip);
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (typeof name !== "string" || name.length > 100) {
      return NextResponse.json(
        { error: "Name must be a string of 100 characters or less" },
        { status: 400 }
      );
    }

    if (typeof subject !== "string" || subject.length > 200) {
      return NextResponse.json(
        { error: "Subject must be a string of 200 characters or less" },
        { status: 400 }
      );
    }

    if (typeof message !== "string" || message.length > 5000) {
      return NextResponse.json(
        { error: "Message must be a string of 5000 characters or less" },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    await sendEmail({
      to: process.env.CONTACT_EMAIL || SITE_CONFIG.contact.email,
      subject: `Contact Form: ${escapeHtml(subject)}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4f46e5;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
          <hr style="border: 1px solid #e5e7eb;" />
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "Your message has been sent. We'll get back to you within 24 hours.",
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
