import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const { completed, timeSpent, lastPosition, progress } = body;

    const existing = await prisma.lessonProgress.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Progress record not found" },
        { status: 404 }
      );
    }

    if (existing.userId !== userId) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const updated = await prisma.lessonProgress.update({
      where: { id },
      data: {
        ...(completed !== undefined && {
          completed,
          completedAt: completed ? new Date() : null,
        }),
        ...(timeSpent !== undefined && { watchTime: { increment: timeSpent } }),
        ...(lastPosition !== undefined && { lastPosition }),
        ...(progress !== undefined && { progress }),
      },
    });

    return NextResponse.json({ progress: updated });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
