import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { awardAchievement } from "@/lib/achievements";
import { sendEmail, quizResult } from "@/lib/email";

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
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
                isCorrect: true,
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

    const safeQuiz = {
      ...quiz,
      questions: quiz.questions.map((q) => ({
        ...q,
        answers: shuffleArray(q.answers),
      })),
    };

    const session = await auth();

    const attemptCount = session?.user?.id
      ? await prisma.quizAttempt.count({
          where: {
            userId: session.user.id,
            quizId: id,
          },
        })
      : 0;

    const previousAttempts = session?.user?.id
      ? await prisma.quizAttempt.findMany({
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
        })
      : [];

    return NextResponse.json({
      quiz: safeQuiz,
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

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await request.json();
    const {
      title,
      description,
      courseId,
      timeLimit,
      passingScore,
      maxAttempts,
      difficulty,
      points,
      questions,
    } = body;

    const existing = await prisma.quiz.findUnique({
      where: { id },
      select: { id: true, difficulty: true, course: { select: { instructorId: true } } },
    });
    if (!existing) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    if ((session.user as any).role !== "ADMIN" && existing.course?.instructorId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updated = await prisma.$transaction(async (tx) => {
      if (questions && Array.isArray(questions)) {
        await tx.answer.deleteMany({
          where: { question: { quizId: id } },
        });
        await tx.question.deleteMany({
          where: { quizId: id },
        });
      }

      const quiz = await tx.quiz.update({
        where: { id },
        data: {
          ...(title !== undefined && { title }),
          ...(description !== undefined && { description }),
          ...(courseId !== undefined && { courseId }),
          ...(timeLimit !== undefined && { timeLimit }),
          ...(passingScore !== undefined && { passingScore }),
          ...(maxAttempts !== undefined && { maxAttempts }),
          ...(difficulty !== undefined && { difficulty }),
          ...(points !== undefined && { points }),
          ...(questions &&
            Array.isArray(questions) && {
              questions: {
                create: questions.map((q: any, i: number) => ({
                  content: q.content,
                  type: q.type || "SINGLE_CHOICE",
                  points: q.points || 1,
                  explanation: q.explanation || "",
                  imageUrl: q.imageUrl || "",
                  order: q.order ?? i,
                  difficulty: q.difficulty || existing.difficulty,
                  answers: {
                    create: (q.answers || [])
                      .filter((a: any) => a.content?.trim())
                      .map((a: any, j: number) => ({
                        content: a.content,
                        isCorrect: a.isCorrect || false,
                        imageUrl: a.imageUrl || "",
                        order: a.order ?? j,
                      })),
                  },
                })),
              },
            }),
        },
        include: {
          questions: {
            include: { answers: true },
            orderBy: { order: "asc" },
          },
        },
      });

      return quiz;
    });

    return NextResponse.json({ quiz: updated });
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
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const existing = await prisma.quiz.findUnique({
      where: { id },
      select: { id: true, course: { select: { instructorId: true } } },
    });
    if (!existing) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    if ((session.user as any).role !== "ADMIN" && existing.course?.instructorId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.quiz.delete({ where: { id } });

    return NextResponse.json({ success: true });
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
      const userAnswer = answers[question.id];

      if (userAnswer) {
        const correctAnswer = question.answers.find((a: any) => a.isCorrect);
        let isCorrect = false;

        if (correctAnswer) {
          if (question.type === "TRUE_FALSE") {
            const userText = String(userAnswer || "").toLowerCase();
            isCorrect = userText === correctAnswer.content.toLowerCase();
          } else if (question.type === "FILL_IN_BLANK") {
            const userText = String(userAnswer || "").trim().toLowerCase();
            isCorrect = userText === correctAnswer.content.trim().toLowerCase();
          } else {
            isCorrect = correctAnswer.id === userAnswer;
          }
        }

        if (isCorrect) {
          totalScore += question.points;
        }

        results[question.id] = {
          selectedAnswerId: userAnswer,
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

    if (quiz.courseId) {
      const percentage = scorePercentage;
      const letterGrade =
        percentage >= 90 ? "A" : percentage >= 80 ? "B" : percentage >= 70 ? "C" : percentage >= 60 ? "D" : "F";

      await prisma.grade.create({
        data: {
          userId,
          courseId: quiz.courseId,
          quizId: quiz.id,
          score: totalScore,
          totalPoints,
          percentage,
          letterGrade,
          type: "QUIZ",
        },
      });
    }

    if (scorePercentage === 100) {
      await awardAchievement(userId, "quiz_master", prisma);
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true },
    });

    if (user?.email) {
      sendEmail({
        to: user.email,
        subject: `Quiz Results: ${quiz.title}`,
        html: quizResult(user, quiz, scorePercentage, passed),
      }).catch(() => {});
    }

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
