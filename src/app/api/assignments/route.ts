import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as any).role;

    const where: any = {};
    if (role === "STUDENT") {
      where.userId = session.user.id;
    } else if (role === "INSTRUCTOR") {
      where.lesson = { course: { instructorId: session.user.id } };
    }

    const assignments = await prisma.assignment.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
        lesson: { select: { id: true, title: true } },
        course: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ assignments });
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

    const body = await request.json();
    const { assignmentId, lessonId, courseId, content, fileUrl } = body;

    if (!content && !fileUrl) {
      return NextResponse.json(
        { error: "Content or file is required" },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    if (assignmentId) {
      const existing = await prisma.assignment.findUnique({
        where: { id: assignmentId },
      });

      if (!existing) {
        return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
      }

      if (existing.userId !== userId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      if (existing.status === "GRADED") {
        return NextResponse.json(
          { error: "This assignment has already been graded" },
          { status: 400 }
        );
      }

      const updated = await prisma.assignment.update({
        where: { id: assignmentId },
        data: {
          content: content || existing.content,
          fileUrl: fileUrl || existing.fileUrl,
          status: "SUBMITTED",
          submittedAt: new Date(),
        },
      });

      return NextResponse.json({ assignment: updated });
    }

    if (lessonId) {
      const template = await prisma.assignment.findFirst({
        where: { lessonId },
        orderBy: { createdAt: "asc" },
      });

      const assignmentData: any = {
        content,
        fileUrl: fileUrl || null,
        status: "SUBMITTED",
        userId,
        lessonId,
        courseId: courseId || template?.courseId || null,
        title: template?.title || "Assignment",
        description: template?.description || null,
        maxScore: template?.maxScore || 100,
        dueDate: template?.dueDate || null,
      };

      const existingSubmission = await prisma.assignment.findFirst({
        where: { userId, lessonId },
      });

      let assignment;
      if (existingSubmission) {
        if (existingSubmission.status === "GRADED") {
          return NextResponse.json(
            { error: "This assignment has already been graded" },
            { status: 400 }
          );
        }
        assignment = await prisma.assignment.update({
          where: { id: existingSubmission.id },
          data: {
            content,
            fileUrl: fileUrl || null,
            status: "SUBMITTED",
            submittedAt: new Date(),
          },
        });
      } else {
        assignment = await prisma.assignment.create({ data: assignmentData });
      }

      return NextResponse.json({ assignment }, { status: 201 });
    }

    return NextResponse.json(
      { error: "assignmentId or lessonId is required" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Assignment submission error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
