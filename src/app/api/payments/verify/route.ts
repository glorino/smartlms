import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

const FLUTTERWAVE_SECRET = process.env.FLUTTERWAVE_SECRET_KEY;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tx_ref = searchParams.get("tx_ref");
    const status = searchParams.get("status");

    if (!tx_ref) {
      return NextResponse.redirect(
        new URL("/payment/failed?reason=missing_reference", request.url)
      );
    }

    if (status === "cancelled" || status === "declined") {
      return NextResponse.redirect(
        new URL(`/payment/failed?tx_ref=${tx_ref}&reason=${status}`, request.url)
      );
    }

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.redirect(
        new URL("/login", request.url)
      );
    }

    const verifyResponse = await fetch(
      `https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${tx_ref}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${FLUTTERWAVE_SECRET}`,
          "Content-Type": "application/json",
        },
      }
    );

    const verifyData = await verifyResponse.json();

    if (verifyData.status === "success" && verifyData.data?.status === "successful") {
      const transaction = verifyData.data;
      const courseId = transaction.meta?.courseId;
      const userId = session.user.id;

      if (!courseId) {
        return NextResponse.redirect(
          new URL(`/payment/failed?tx_ref=${tx_ref}&reason=no_course`, request.url)
        );
      }

      const existingEnrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId,
          },
        },
      });

      if (!existingEnrollment) {
        await prisma.$transaction(async (tx) => {
          await tx.purchase.create({
            data: {
              userId,
              courseId,
              amount: transaction.amount,
              currency: transaction.currency,
              status: "COMPLETED",
              paymentMethod: "flutterwave",
              stripePaymentId: transaction.id?.toString(),
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
            data: { totalStudents: { increment: 1 } },
          });
        });
      }

      return NextResponse.redirect(
        new URL(`/payment/success?tx_ref=${tx_ref}&course_id=${courseId}`, request.url)
      );
    }

    return NextResponse.redirect(
      new URL(`/payment/failed?tx_ref=${tx_ref}&reason=verification_failed`, request.url)
    );
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.redirect(
      new URL("/payment/failed?reason=server_error", request.url)
    );
  }
}
