import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");

    if (!courseId) {
      return NextResponse.json(
        { error: "courseId is required" },
        { status: 400 }
      );
    }

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: { userId, courseId },
      },
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: "Not enrolled in this course" },
        { status: 403 }
      );
    }

    const progress = await prisma.lessonProgress.findMany({
      where: {
        userId,
        lesson: { courseId },
      },
      include: {
        lesson: {
          select: { id: true, title: true, type: true, duration: true, order: true },
        },
      },
      orderBy: { lesson: { order: "asc" } },
    });

    const totalLessons = await prisma.lesson.count({
      where: { courseId },
    });

    const completedCount = progress.filter((p) => p.completed).length;

    return NextResponse.json({
      progress,
      enrollmentProgress: enrollment.progress,
      totalLessons,
      completedLessons: completedCount,
      percentage: totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0,
    });
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
    const { lessonId, courseId, completed, timeSpent } = body;

    if (!lessonId || !courseId) {
      return NextResponse.json(
        { error: "lessonId and courseId are required" },
        { status: 400 }
      );
    }

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: { userId, courseId },
      },
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: "Not enrolled in this course" },
        { status: 403 }
      );
    }

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!lesson || lesson.courseId !== courseId) {
      return NextResponse.json(
        { error: "Lesson not found in this course" },
        { status: 404 }
      );
    }

    const progress = await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: { userId, lessonId },
      },
      update: {
        completed: completed ?? true,
        watchTime: timeSpent ? { increment: timeSpent } : undefined,
        completedAt: completed ? new Date() : undefined,
      },
      create: {
        userId,
        lessonId,
        completed: completed ?? true,
        watchTime: timeSpent || 0,
        completedAt: completed ? new Date() : undefined,
      },
    });

    const totalLessons = await prisma.lesson.count({
      where: { courseId },
    });

    const completedCount = await prisma.lessonProgress.count({
      where: {
        userId,
        lesson: { courseId },
        completed: true,
      },
    });

    const courseProgress = totalLessons > 0
      ? (completedCount / totalLessons) * 100
      : 0;

    await prisma.enrollment.update({
      where: {
        userId_courseId: { userId, courseId },
      },
      data: {
        progress: courseProgress,
        status: courseProgress >= 100 ? "COMPLETED" : "ACTIVE",
        completedAt: courseProgress >= 100 ? new Date() : null,
      },
    });

    return NextResponse.json({ progress, courseProgress });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
