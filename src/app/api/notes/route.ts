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
    const lessonId = searchParams.get("lessonId");

    const where: any = { userId };

    if (lessonId) {
      where.lessonId = lessonId;
    } else if (courseId) {
      where.lesson = { courseId };
    }

    const notes = await prisma.note.findMany({
      where,
      include: {
        lesson: {
          select: { id: true, title: true, courseId: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ notes });
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
    const { lessonId, courseId, content, noteId, timestamp } = body;

    if (!lessonId || !content) {
      return NextResponse.json(
        { error: "lessonId and content are required" },
        { status: 400 }
      );
    }

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!lesson) {
      return NextResponse.json(
        { error: "Lesson not found" },
        { status: 404 }
      );
    }

    if (courseId) {
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
    }

    let note;

    if (noteId) {
      const existingNote = await prisma.note.findUnique({
        where: { id: noteId },
      });

      if (!existingNote || existingNote.userId !== userId) {
        return NextResponse.json(
          { error: "Note not found or not authorized" },
          { status: 404 }
        );
      }

      note = await prisma.note.update({
        where: { id: noteId },
        data: { content, timestamp: timestamp ?? undefined },
        include: {
          lesson: {
            select: { id: true, title: true, courseId: true },
          },
        },
      });
    } else {
      const resolvedCourseId = courseId || lesson.courseId;
      note = await prisma.note.create({
        data: {
          userId,
          lessonId,
          courseId: resolvedCourseId,
          content,
          timestamp: timestamp ?? undefined,
        },
        include: {
          lesson: {
            select: { id: true, title: true, courseId: true },
          },
        },
      });
    }

    return NextResponse.json({ note }, { status: noteId ? 200 : 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
