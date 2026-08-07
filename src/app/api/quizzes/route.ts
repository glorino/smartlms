import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    const quizzes = await prisma.quiz.findMany({
      where: {
        courseId,
        isPublished: true,
      },
      select: {
        id: true,
        title: true,
        description: true,
        timeLimit: true,
        passingScore: true,
        maxAttempts: true,
        difficulty: true,
        points: true,
        _count: { select: { questions: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ quizzes });
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

    if ((session.user as any).role !== "INSTRUCTOR" && (session.user as any).role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only instructors can create quizzes" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      courseId,
      type,
      timeLimit,
      passingScore,
      maxAttempts,
      shuffleQuestions,
      shuffleAnswers,
      showCorrectAnswers,
      difficulty,
      points,
      questions,
    } = body;

    if (!title || !courseId) {
      return NextResponse.json(
        { error: "Title and course ID are required" },
        { status: 400 }
      );
    }

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    if (course.instructorId !== userId && (session.user as any).role !== "ADMIN") {
      return NextResponse.json(
        { error: "You can only create quizzes for your own courses" },
        { status: 403 }
      );
    }

    const quiz = await prisma.quiz.create({
      data: {
        title,
        description,
        courseId,
        timeLimit,
        passingScore: passingScore || 60,
        maxAttempts,
        shuffleQuestions: shuffleQuestions !== false,
        shuffleAnswers: shuffleAnswers !== false,
        showCorrectAnswers: showCorrectAnswers !== false,
        difficulty: difficulty || "MEDIUM",
        points: points || 1,
        isPublished: true,
        questions: questions
          ? {
              create: questions.map((q: any, index: number) => ({
                content: q.content,
                type: q.type || "MULTIPLE_CHOICE",
                points: q.points || 1,
                explanation: q.explanation,
                hint: q.hint,
                imageUrl: q.imageUrl,
                order: q.order || index,
                difficulty: q.difficulty || "MEDIUM",
                correctOrder: q.correctOrder || [],
                rangeMin: q.rangeMin,
                rangeMax: q.rangeMax,
                rangeCorrect: q.rangeCorrect,
                answers: q.answers
                  ? {
                      create: q.answers.map((a: any, aIndex: number) => ({
                        content: a.content,
                        isCorrect: a.isCorrect || false,
                        points: a.points || 0,
                        imageUrl: a.imageUrl,
                        order: a.order || aIndex,
                      })),
                    }
                  : undefined,
              })),
            }
          : undefined,
      },
      include: {
        questions: {
          include: { answers: true },
          orderBy: { order: "asc" },
        },
      },
    });

    return NextResponse.json({ quiz }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}