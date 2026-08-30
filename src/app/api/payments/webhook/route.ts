import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";

const FLUTTERWAVE_SECRET = process.env.FLUTTERWAVE_SECRET_KEY;
const FLUTTERWAVE_ENCRYPTION_KEY = process.env.FLUTTERWAVE_ENCRYPTION_KEY;

function verifyFlutterwaveSignature(body: string, signature: string): boolean {
  if (!FLUTTERWAVE_ENCRYPTION_KEY) {
    console.error("FLUTTERWAVE_ENCRYPTION_KEY not set");
    return false;
  }
  const hash = crypto
    .createHmac("sha256", FLUTTERWAVE_ENCRYPTION_KEY)
    .update(body)
    .digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(signature));
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get("verif-hash") || "";

    if (!verifyFlutterwaveSignature(body, signature)) {
      console.error("Invalid Flutterwave webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(body);

    if (event.event === "charge.completed" && event.data?.status === "successful") {
      const transaction = event.data;
      const tx_ref = transaction.tx_ref;
      const courseId = transaction.meta?.courseId;
      const userId = transaction.meta?.userId;

      if (!courseId || !userId || !tx_ref) {
        console.error("Webhook missing required meta fields:", { courseId, userId, tx_ref });
        return NextResponse.json({ received: true });
      }

      const course = await prisma.course.findUnique({ where: { id: courseId } });
      if (!course) {
        console.error(`Webhook: Course not found for courseId ${courseId}`);
        return NextResponse.json({ received: true });
      }

      const chargedAmount = Number(transaction.amount);
      if (course.price > 0 && chargedAmount < course.price) {
        console.error(`Webhook: Charged amount ${chargedAmount} is less than course price ${course.price}`);
        return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
      }

      const existingPurchase = await prisma.purchase.findFirst({
        where: { flutterwavePaymentId: tx_ref },
      });

      if (existingPurchase) {
        return NextResponse.json({ received: true });
      }

      const existingEnrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: { userId, courseId },
        },
      });

      if (!existingEnrollment) {
        try {
          await prisma.$transaction(async (tx) => {
            await tx.purchase.create({
              data: {
                userId,
                courseId,
                amount: transaction.amount,
                currency: transaction.currency,
                status: "COMPLETED",
                paymentMethod: "flutterwave",
                flutterwavePaymentId: tx_ref,
              },
            });

            await tx.enrollment.create({
              data: {
                userId,
                courseId,
                status: "ACTIVE",
              },
            });

            await tx.course.update({
              where: { id: courseId },
              data: {
                totalStudents: { increment: 1 },
                revenue: { increment: transaction.amount },
              },
            });
          });
        } catch (e: any) {
          if (e?.code !== "P2002") throw e;
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
