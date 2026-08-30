import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const subscriptions = await prisma.subscription.findMany({
      where: { userId: session.user.id },
      orderBy: { startDate: "desc" },
    });

    return NextResponse.json({ subscriptions });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { planName, amount, interval, tx_ref } = body;

    if (!planName || !amount) {
      return NextResponse.json(
        { error: "planName and amount are required" },
        { status: 400 }
      );
    }

    if (!tx_ref) {
      return NextResponse.json(
        { error: "Payment verification required (tx_ref)" },
        { status: 400 }
      );
    }

    const flutterwaveSecret = process.env.FLUTTERWAVE_SECRET_KEY;
    if (flutterwaveSecret) {
      try {
        const verifyRes = await fetch(
          `https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${tx_ref}`,
          { headers: { Authorization: `Bearer ${flutterwaveSecret}` } }
        );
        const verifyData = await verifyRes.json();
        if (verifyData.status !== "success") {
          return NextResponse.json(
            { error: "Payment not verified" },
            { status: 400 }
          );
        }
      } catch {
        return NextResponse.json(
          { error: "Payment verification failed" },
          { status: 500 }
        );
      }
    }

    const subscription = await prisma.subscription.create({
      data: {
        userId: session.user.id,
        planName,
        amount,
        interval: interval || "MONTHLY",
        status: "ACTIVE",
        startDate: new Date(),
      },
    });

    return NextResponse.json({ subscription }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
