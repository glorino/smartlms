import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as any).role;
    if (userRole !== "ADMIN") {
      return NextResponse.json(
        { error: "Only admins can seed live classes" },
        { status: 403 }
      );
    }

    const course = await prisma.course.findFirst();
    if (!course) {
      return NextResponse.json(
        { error: "No courses found. Create a course first." },
        { status: 400 }
      );
    }

    const instructor = await prisma.user.findFirst({
      where: { role: "INSTRUCTOR" },
    });
    if (!instructor) {
      return NextResponse.json(
        { error: "No instructors found. Create an instructor first." },
        { status: 400 }
      );
    }

    const now = new Date();

    const threeDaysFromNow = new Date(now);
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
    threeDaysFromNow.setUTCHours(14, 0, 0, 0);

    const sevenDaysFromNow = new Date(now);
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    sevenDaysFromNow.setUTCHours(10, 0, 0, 0);

    const classData = [
      {
        title: "Advanced JavaScript Patterns - Live Session",
        description:
          "Deep dive into design patterns, closures, and advanced async patterns with hands-on coding exercises.",
        platform: "GOOGLE_MEET" as const,
        meetingUrl: "https://meet.google.com/abc-defg-hij",
        scheduledAt: threeDaysFromNow,
        duration: 90,
        isRecorded: true,
        instructorId: instructor.id,
        courseId: course.id,
      },
      {
        title: "React Server Components Workshop",
        description:
          "Interactive workshop covering React Server Components, streaming SSR, and performance optimization techniques.",
        platform: "GOOGLE_MEET" as const,
        meetingUrl: "https://meet.google.com/xyz-uvwx-rst",
        scheduledAt: sevenDaysFromNow,
        duration: 120,
        isRecorded: true,
        instructorId: instructor.id,
        courseId: course.id,
      },
    ];

    const results = [];

    for (const data of classData) {
      const existing = await prisma.liveClass.findFirst({
        where: { title: data.title, courseId: data.courseId },
      });

      if (existing) {
        const updated = await prisma.liveClass.update({
          where: { id: existing.id },
          data: {
            description: data.description,
            platform: data.platform,
            meetingUrl: data.meetingUrl,
            scheduledAt: data.scheduledAt,
            duration: data.duration,
            isRecorded: data.isRecorded,
          },
          include: { instructor: { select: { id: true, name: true, email: true } }, course: { select: { id: true, title: true } } },
        });
        results.push({ action: "updated", liveClass: updated });
      } else {
        const created = await prisma.liveClass.create({
          data,
          include: { instructor: { select: { id: true, name: true, email: true } }, course: { select: { id: true, title: true } } },
        });
        results.push({ action: "created", liveClass: created });
      }
    }

    return NextResponse.json({
      message: "Live classes seeded successfully",
      course: { id: course.id, title: course.title },
      instructor: { id: instructor.id, name: instructor.name, email: instructor.email },
      liveClasses: results,
    });
  } catch (error) {
    console.error("Seed live classes error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
