import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const progress = await prisma.lessonProgress.findMany({
      where: { userId },
      select: {
        id: true,
        completedAt: true,
        completed: true,
      },
      orderBy: { completedAt: "desc" },
    });

    return NextResponse.json({ progress });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
