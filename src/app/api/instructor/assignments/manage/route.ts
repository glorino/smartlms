import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as any).role;
    if (userRole !== "INSTRUCTOR" && userRole !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const instructorCourses = await prisma.course.findMany({
      where: { instructorId: session.user.id },
      select: { id: true, title: true },
    });

    const courseIds = instructorCourses.map((c) => c.id);

    const { searchParams } = new URL(request.url);
    const assignmentId = searchParams.get("id");

    if (assignmentId) {
      const assignment = await prisma.assignment.findFirst({
        where: { id: assignmentId, courseId: { in: courseIds } },
        include: {
          course: { select: { id: true, title: true } },
          lesson: { select: { id: true, title: true } },
        },
      });
      if (!assignment) {
        return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
      }
      return NextResponse.json({ assignment });
    }

    const assignments = await prisma.assignment.findMany({
      where: {
        courseId: { in: courseIds },
        status: { notIn: ["SUBMITTED", "GRADED"] },
      },
      include: {
        course: { select: { id: true, title: true } },
        lesson: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ assignments, courses: instructorCourses });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as any).role;
    if (userRole !== "INSTRUCTOR" && userRole !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { title, description, courseId, lessonId, maxScore, dueDate, status } = body;

    if (!title || !courseId) {
      return NextResponse.json({ error: "Title and course are required" }, { status: 400 });
    }

    const course = await prisma.course.findFirst({
      where: { id: courseId, instructorId: session.user.id },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found or not owned by you" }, { status: 404 });
    }

    if (lessonId) {
      const lesson = await prisma.lesson.findFirst({
        where: { id: lessonId, section: { courseId } },
      });
      if (!lesson) {
        return NextResponse.json({ error: "Lesson not found in this course" }, { status: 404 });
      }
    }

    const assignment = await prisma.assignment.create({
      data: {
        title,
        description: description || null,
        courseId,
        lessonId: lessonId || null,
        maxScore: maxScore ? Number(maxScore) : 100,
        dueDate: dueDate ? new Date(dueDate) : null,
        status: status || "ACTIVE",
        userId: session.user.id,
      },
      include: {
        course: { select: { id: true, title: true } },
        lesson: { select: { id: true, title: true } },
      },
    });

    return NextResponse.json({ assignment }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as any).role;
    if (userRole !== "INSTRUCTOR" && userRole !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { id, title, description, courseId, lessonId, maxScore, dueDate, status } = body;

    if (!id) {
      return NextResponse.json({ error: "Assignment ID is required" }, { status: 400 });
    }

    const instructorCourses = await prisma.course.findMany({
      where: { instructorId: session.user.id },
      select: { id: true },
    });

    const courseIds = instructorCourses.map((c) => c.id);

    const existing = await prisma.assignment.findFirst({
      where: { id, courseId: { in: courseIds } },
    });

    if (!existing) {
      return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
    }

    if (lessonId) {
      const lesson = await prisma.lesson.findFirst({
        where: { id: lessonId, section: { courseId: courseId || existing.courseId } },
      });
      if (!lesson) {
        return NextResponse.json({ error: "Lesson not found in this course" }, { status: 404 });
      }
    }

    const assignment = await prisma.assignment.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description: description || null }),
        ...(courseId && { courseId }),
        ...(lessonId !== undefined && { lessonId: lessonId || null }),
        ...(maxScore !== undefined && { maxScore: Number(maxScore) }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
        ...(status && { status }),
      },
      include: {
        course: { select: { id: true, title: true } },
        lesson: { select: { id: true, title: true } },
      },
    });

    return NextResponse.json({ assignment });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as any).role;
    if (userRole !== "INSTRUCTOR" && userRole !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Assignment ID is required" }, { status: 400 });
    }

    const instructorCourses = await prisma.course.findMany({
      where: { instructorId: session.user.id },
      select: { id: true },
    });

    const courseIds = instructorCourses.map((c) => c.id);

    const existing = await prisma.assignment.findFirst({
      where: { id, courseId: { in: courseIds } },
    });

    if (!existing) {
      return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
    }

    await prisma.assignment.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
