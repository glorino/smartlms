import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: {
          include: {
            answers: {
              select: {
                id: true,
                content: true,
                imageUrl: true,
                order: true,
              },
            },
          },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    const attemptCount = await prisma.quizAttempt.count({
      where: {
        userId: session.user.id,
        quizId: id,
      },
    });

    const previousAttempts = await prisma.quizAttempt.findMany({
      where: {
        userId: session.user.id,
        quizId: id,
      },
      select: {
        score: true,
        passed: true,
        completedAt: true,
      },
      orderBy: { completedAt: "asc" },
    });

    return NextResponse.json({
      quiz,
      attemptCount,
      previousAttempts,
      maxAttempts: quiz.maxAttempts,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { id } = await context.params;
    const body = await request.json();
    const { answers, timeTaken, attemptNumber } = body;

    if (!answers || typeof answers !== "object") {
      return NextResponse.json(
        { error: "Answers object is required" },
        { status: 400 }
      );
    }

    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: {
          include: {
            answers: true,
          },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    const attemptCount = await prisma.quizAttempt.count({
      where: {
        userId,
        quizId: id,
      },
    });

    if (quiz.maxAttempts && attemptCount >= quiz.maxAttempts) {
      return NextResponse.json(
        { error: "Maximum attempts reached" },
        { status: 400 }
      );
    }

    let totalScore = 0;
    let totalPoints = 0;
    const results: Record<string, any> = {};

    for (const question of quiz.questions) {
      totalPoints += question.points;
      const userAnswerId = answers[question.id];

      if (userAnswerId) {
        const correctAnswer = question.answers.find((a: any) => a.isCorrect);
        const isCorrect = correctAnswer?.id === userAnswerId;

        if (isCorrect) {
          totalScore += question.points;
        }

        results[question.id] = {
          selectedAnswerId: userAnswerId,
          isCorrect,
          correctAnswerId: correctAnswer?.id,
          explanation: question.explanation,
        };
      } else {
        results[question.id] = {
          selectedAnswerId: null,
          isCorrect: false,
          correctAnswerId: question.answers.find((a: any) => a.isCorrect)?.id,
          explanation: question.explanation,
        };
      }
    }

    const scorePercentage = totalPoints > 0 ? (totalScore / totalPoints) * 100 : 0;
    const passed = scorePercentage >= quiz.passingScore;

    const attempt = await prisma.quizAttempt.create({
      data: {
        userId,
        quizId: id,
        score: scorePercentage,
        totalPoints,
        passed,
        answers,
        timeTaken,
        completedAt: new Date(),
      },
    });

    return NextResponse.json({
      attempt,
      results,
      score: scorePercentage,
      totalScore,
      totalPoints,
      passed,
      passingScore: quiz.passingScore,
      attemptNumber: (attemptCount || 0) + 1,
      totalAttempts: (attemptCount || 0) + 1,
      maxAttempts: quiz.maxAttempts,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
