import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");

    if (!courseId) {
      return NextResponse.json({ error: "courseId required" }, { status: 400 });
    }

    const announcements = await prisma.announcement.findMany({
      where: { courseId, isPublished: true },
      include: {
        author: { select: { id: true, name: true, avatar: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(announcements);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as any).role;
    if (role !== "ADMIN" && role !== "INSTRUCTOR") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { courseId, title, content } = body;

    if (!courseId || !title || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    if (role === "INSTRUCTOR" && course.instructorId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const announcement = await prisma.announcement.create({
      data: {
        title,
        content,
        courseId,
        authorId: session.user.id!,
      },
      include: {
        author: { select: { id: true, name: true, avatar: true } },
      },
    });

    return NextResponse.json(announcement, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
