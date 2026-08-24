import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import prisma from "@/lib/prisma";

const FLUTTERWAVE_SECRET = process.env.FLUTTERWAVE_SECRET_KEY;

export async function POST(request: Request) {
  try {
    if (!checkRateLimit("payments-initiate", 10, 3600000)) {
      return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });
    }
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { courseId, amount, currency, email, name } = body;

    if (!courseId || !amount || !email || !name) {
      return NextResponse.json(
        { error: "Missing required fields: courseId, amount, email, name" },
        { status: 400 }
      );
    }

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }
    if (course.price > 0 && Number(amount) < course.price) {
      return NextResponse.json({ error: "Invalid amount: amount is less than course price" }, { status: 400 });
    }

    const tx_ref = `smartlms-${courseId.slice(0, 8)}-${session.user.id.slice(0, 8)}-${Date.now()}`;

    const flutterwavePayload = {
      tx_ref,
      amount: String(amount),
      currency: currency || "NGN",
      redirect_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/payments/verify`,
      customer: {
        email,
        name,
        user_id: session.user.id,
      },
      customizations: {
        title: "SmartLMS Course Enrollment",
        description: `Payment for course`,
        logo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/logo.png`,
      },
      meta: {
        courseId,
        userId: session.user.id,
      },
    };

    const response = await fetch("https://api.flutterwave.com/v3/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${FLUTTERWAVE_SECRET}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(flutterwavePayload),
    });

    const data = await response.json();

    if (data.status === "success" && data.data?.link) {
      return NextResponse.json({
        paymentLink: data.data.link,
        tx_ref,
        status: data.status,
      });
    }

    return NextResponse.json(
      { error: data.message || "Failed to initiate payment", details: data },
      { status: 400 }
    );
  } catch (error) {
    console.error("Payment initiation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
