import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Verification ID is required" },
        { status: 400 }
      );
    }

    const certificate = await prisma.certificate.findUnique({
      where: { certificateId: id },
      include: {
        user: {
          select: { name: true },
        },
        course: {
          select: {
            title: true,
            instructor: {
              select: { name: true },
            },
          },
        },
      },
    });

    if (!certificate) {
      return NextResponse.json(
        { error: "Certificate not found" },
        { status: 404 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    return NextResponse.json({
      certificate: {
        certificateId: certificate.certificateId,
        studentName: certificate.user?.name || "Student",
        courseName: certificate.course?.title || certificate.title,
        issuedAt: certificate.issuedAt,
        status: certificate.status,
        instructorName: certificate.course?.instructor?.name || "SmartLMS Team",
        verificationUrl: `${appUrl}/certificate/${certificate.certificateId}`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
