import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");
    const upcoming = searchParams.get("upcoming");

    const where: any = {};

    if (courseId) {
      where.courseId = courseId;
    }

    if (upcoming === "true") {
      where.scheduledAt = { gte: new Date() };
    }

    const classes = await prisma.liveClass.findMany({
      where,
      include: {
        instructor: {
          select: { id: true, name: true, avatar: true },
        },
        course: {
          select: { id: true, title: true, slug: true },
        },
        _count: { select: { attendees: true } },
      },
      orderBy: { scheduledAt: "asc" },
    });

    return NextResponse.json({ classes });
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
    const userRole = (session.user as any).role;

    if (userRole !== "INSTRUCTOR" && userRole !== "ADMIN") {
      return NextResponse.json(
        { error: "Only instructors can create live classes" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      courseId,
      platform,
      meetingUrl,
      scheduledAt,
      duration,
    } = body;

    if (!title || !courseId || !scheduledAt || !duration) {
      return NextResponse.json(
        { error: "title, courseId, scheduledAt, and duration are required" },
        { status: 400 }
      );
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    if (course.instructorId !== userId && userRole !== "ADMIN") {
      return NextResponse.json(
        { error: "You can only create live classes for your own courses" },
        { status: 403 }
      );
    }

    const liveClass = await prisma.liveClass.create({
      data: {
        title,
        description,
        courseId,
        instructorId: userId,
        platform: platform || "ZOOM",
        meetingUrl,
        scheduledAt: new Date(scheduledAt),
        duration,
      },
      include: {
        instructor: {
          select: { id: true, name: true, avatar: true },
        },
        course: {
          select: { id: true, title: true, slug: true },
        },
      },
    });

    return NextResponse.json({ liveClass }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
