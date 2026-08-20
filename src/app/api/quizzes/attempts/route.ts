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
    const quizId = searchParams.get("quizId");

    const where: any = { userId };
    if (quizId) {
      where.quizId = quizId;
    }

    const attempts = await prisma.quizAttempt.findMany({
      where,
      select: {
        id: true,
        score: true,
        totalPoints: true,
        passed: true,
        timeTaken: true,
        startedAt: true,
        completedAt: true,
        quiz: {
          select: {
            id: true,
            title: true,
            course: { select: { title: true } },
          },
        },
      },
      orderBy: { completedAt: "desc" },
    });

    const mapped = attempts.map((a) => ({
      id: a.id,
      quizId: a.quiz.id,
      quizTitle: a.quiz.title,
      courseName: a.quiz.course?.title || "Unknown Course",
      score: a.score,
      totalPoints: a.totalPoints,
      passed: a.passed,
      completedAt: a.completedAt?.toISOString() || a.startedAt.toISOString(),
      timeTaken: a.timeTaken,
    }));

    return NextResponse.json({ attempts: mapped });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
