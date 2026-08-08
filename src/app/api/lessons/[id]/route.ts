import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: {
        section: {
          select: { id: true, title: true, courseId: true },
        },
        course: {
          select: { id: true, title: true, instructorId: true },
        },
        notes: {
          include: {
            user: { select: { id: true, name: true, avatar: true } },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    return NextResponse.json({ lesson });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: { course: { select: { instructorId: true } } },
    });

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    if (
      lesson.course?.instructorId !== session.user.id &&
      (session.user as any).role !== "ADMIN"
    ) {
      return NextResponse.json(
        { error: "Only instructors can update lessons" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, description, content, type, videoUrl, videoType, audioUrl, pdfUrl, duration, isPreview } = body;

    const updatedLesson = await prisma.lesson.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(content !== undefined && { content }),
        ...(type && { type }),
        ...(videoUrl !== undefined && { videoUrl }),
        ...(videoType !== undefined && { videoType }),
        ...(audioUrl !== undefined && { audioUrl }),
        ...(pdfUrl !== undefined && { pdfUrl }),
        ...(duration !== undefined && { duration }),
        ...(isPreview !== undefined && { isPreview }),
      },
    });

    return NextResponse.json({ lesson: updatedLesson });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: { course: { select: { instructorId: true } } },
    });

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    if (
      lesson.course?.instructorId !== session.user.id &&
      (session.user as any).role !== "ADMIN"
    ) {
      return NextResponse.json(
        { error: "Only instructors can delete lessons" },
        { status: 403 }
      );
    }

    await prisma.lesson.delete({ where: { id } });

    return NextResponse.json({ message: "Lesson deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
