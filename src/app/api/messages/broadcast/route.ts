import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const senderId = session.user.id;
    const body = await request.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json({ error: "content is required" }, { status: 400 });
    }

    const enrollments = await prisma.enrollment.findMany({
      where: {
        course: { instructorId: senderId },
      },
      select: { userId: true },
    });

    const studentIds = [...new Set(enrollments.map((e) => e.userId))];

    if (studentIds.length === 0) {
      return NextResponse.json({ error: "No students found" }, { status: 404 });
    }

    const messages = await prisma.message.createMany({
      data: studentIds.map((studentId) => ({
        senderId,
        receiverId: studentId,
        content,
      })),
    });

    return NextResponse.json({ sent: messages.count, total: studentIds.length }, { status: 201 });
  } catch (error) {
    console.error("Broadcast message error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
