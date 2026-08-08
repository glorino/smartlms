import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");

    if (!courseId) {
      return NextResponse.json(
        { error: "courseId is required" },
        { status: 400 }
      );
    }

    const dripContent = await prisma.dripContent.findMany({
      where: { courseId },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ dripContent });
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

    const userRole = (session.user as any).role;
    if (userRole !== "INSTRUCTOR" && userRole !== "ADMIN") {
      return NextResponse.json(
        { error: "Only instructors can create drip content" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { courseId, type, unlockDate, daysAfterEnroll, lessonId, order } =
      body;

    if (!courseId) {
      return NextResponse.json(
        { error: "courseId is required" },
        { status: 400 }
      );
    }

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    if (userRole === "INSTRUCTOR" && course.instructorId !== session.user.id) {
      return NextResponse.json(
        { error: "You can only add drip content to your own courses" },
        { status: 403 }
      );
    }

    const dripContent = await prisma.dripContent.create({
      data: {
        courseId,
        type: type || "DATE",
        unlockDate: unlockDate ? new Date(unlockDate) : null,
        daysAfterEnroll: daysAfterEnroll || null,
        lessonId: lessonId || null,
        order: order || 0,
      },
    });

    return NextResponse.json({ dripContent }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
