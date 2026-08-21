import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { sendEmail, certificateIssued } from "@/lib/email";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const certificates = await prisma.certificate.findMany({
      where: { userId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            thumbnail: true,
          },
        },
      },
      orderBy: { issuedAt: "desc" },
    });

    return NextResponse.json({ certificates });
  } catch (error) {
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

    const userId = session.user.id;
    const body = await request.json();
    const { courseId } = body;

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: "Not enrolled in this course" },
        { status: 400 }
      );
    }

    if (enrollment.status !== "COMPLETED") {
      return NextResponse.json(
        { error: "Course not yet completed" },
        { status: 400 }
      );
    }

    const existingCertificate = await prisma.certificate.findFirst({
      where: {
        userId,
        courseId,
      },
    });

    if (existingCertificate) {
      return NextResponse.json(
        { error: "Certificate already issued" },
        { status: 409 }
      );
    }

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const certificateId = `CERT-${courseId.slice(0, 8)}-${Date.now().toString(36).toUpperCase()}`;

    const certificate = await prisma.certificate.create({
      data: {
        title: `Certificate of Completion - ${course.title}`,
        certificateId,
        userId,
        courseId,
        status: "ACTIVE",
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            thumbnail: true,
          },
        },
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (certificate.user?.email) {
      sendEmail({
        to: certificate.user.email,
        subject: `Certificate Issued: ${course.title}`,
        html: certificateIssued(certificate.user, certificate.course),
      }).catch(() => {});
    }

    return NextResponse.json({ certificate }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}