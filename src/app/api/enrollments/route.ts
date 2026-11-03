import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { sendEmail, enrollmentConfirmation } from "@/lib/email";

export async function GET(request: Request) {
  try {
    if (!await checkRateLimit("enrollments", 100, 3600000, request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown")) {
      return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });
    }
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const userRole = (session.user as any).role;
    const { searchParams } = new URL(request.url);
    const instructorId = searchParams.get("instructorId") || "";
    const includeAll = searchParams.get("all") === "true" && userRole === "ADMIN";

    const where: any = {};

    if (userRole === "INSTRUCTOR") {
      // Instructors see enrollments for the courses they teach (their students)
      where.course = { instructorId: userId };
    } else if (instructorId) {
      where.course = { instructorId };
    } else if (!includeAll) {
      // Students and admins only see the current user's own enrollments.
      // (Admins can opt into the full list with ?all=true for platform stats.)
      where.userId = userId;
    }

    const enrollments = await prisma.enrollment.findMany({
      where,
      include: {
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            thumbnail: true,
            price: true,
            salePrice: true,
            currency: true,
            level: true,
            category: true,
            instructor: {
              select: { id: true, name: true, avatar: true },
            },
          },
        },
        user: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
      orderBy: { enrolledAt: "desc" },
    });

    return NextResponse.json({ enrollments });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    if (!await checkRateLimit("enrollments-post", 20, 3600000, request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown")) {
      return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });
    }
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

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    if (course.status !== "PUBLISHED") {
      return NextResponse.json(
        { error: "Course is not available for enrollment" },
        { status: 400 }
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

    if (existingEnrollment) {
      return NextResponse.json(
        { error: "Already enrolled in this course" },
        { status: 409 }
      );
    }

    const effectivePrice = course.salePrice ?? course.price;
    if (effectivePrice > 0) {
      return NextResponse.json(
        { error: "This is a paid course. Please use the payment flow to enroll." },
        { status: 403 }
      );
    }

    const enrollment = await prisma.$transaction(async (tx) => {
      const newEnrollment = await tx.enrollment.create({
        data: {
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
              price: true,
            },
          },
        },
      });

      await tx.course.update({
        where: { id: courseId },
        data: { totalStudents: { increment: 1 } },
      });

      return newEnrollment;
    });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true },
    });

    if (user?.email) {
      const courseForEmail = await prisma.course.findUnique({
        where: { id: courseId },
        select: { title: true, slug: true, category: true, level: true },
      });

      if (courseForEmail) {
        sendEmail({
          to: user.email,
          subject: `Enrolled in ${courseForEmail.title}`,
          html: enrollmentConfirmation(user, courseForEmail),
        }).catch(() => {});
      }
    }

    return NextResponse.json({ enrollment }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
