import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { generateJSON } from "@/lib/ai";

interface AdaptivePathResult {
  strengths: string[];
  weaknesses: string[];
  recommendedNext: { lessonId: string; title: string; reason: string; priority: number }[];
  adjustedDifficulty: "easy" | "medium" | "hard";
  estimatedTimeToComplete: number;
}

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");

    if (!courseId) {
      return NextResponse.json({ error: "courseId is required" }, { status: 400 });
    }

    const path = await prisma.adaptivePath.findUnique({
      where: { userId_courseId: { userId: session.user.id, courseId } },
      include: { course: { select: { id: true, title: true } } },
    });

    if (!path) {
      return NextResponse.json({ path: null });
    }

    return NextResponse.json({ path });
  } catch (error) {
    console.error("Adaptive path GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
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
    const { courseId } = body;

    if (!courseId) {
      return NextResponse.json({ error: "courseId is required" }, { status: 400 });
    }

    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
    if (!enrollment) {
      return NextResponse.json({ error: "Not enrolled in this course" }, { status: 404 });
    }

    const lessons = await prisma.lesson.findMany({
      where: { courseId },
      include: {
        section: { select: { title: true } },
        progress: { where: { userId }, select: { completed: true, progress: true, watchTime: true, completedAt: true } },
        quizzes: {
          include: {
            attempts: { where: { userId }, select: { score: true, totalPoints: true, passed: true, completedAt: true } },
          },
        },
      },
      orderBy: { order: "asc" },
    });

    const completedLessons = lessons.filter((l) => l.progress[0]?.completed);
    const incompleteLessons = lessons.filter((l) => !l.progress[0]?.completed);

    const totalWatchTime = lessons.reduce((sum, l) => sum + (l.progress[0]?.watchTime || 0), 0);

    const quizScores = lessons
      .flatMap((l) => l.quizzes)
      .flatMap((q) => q.attempts)
      .map((a) => ({ score: a.score, totalPoints: a.totalPoints, passed: a.passed }));

    const avgScore =
      quizScores.length > 0
        ? quizScores.reduce((s, a) => s + (a.score / a.totalPoints) * 100, 0) / quizScores.length
        : 0;

    const passRate =
      quizScores.length > 0
        ? (quizScores.filter((a) => a.passed).length / quizScores.length) * 100
        : 0;

    const allLessonsBrief = lessons.map((l) => ({
      id: l.id,
      title: l.title,
      section: l.section.title,
      completed: l.progress[0]?.completed || false,
      progress: l.progress[0]?.progress || 0,
      watchTime: l.progress[0]?.watchTime || 0,
      hasQuiz: l.quizzes.length > 0,
      quizScores: l.quizzes.flatMap((q) => q.attempts.map((a) => Math.round((a.score / a.totalPoints) * 100))),
    }));

    const systemPrompt = `You are an adaptive learning AI for a Learning Management System. Analyze the student's progress through a course and generate a personalized adaptive learning path.

Given data about the student's lesson completions, quiz performance, and time spent, produce:
- strengths: topics/areas the student excels at
- weaknesses: topics/areas needing improvement
- recommendedNext: array of next lessons to take with reason and priority (1=highest)
- adjustedDifficulty: "easy" if student is struggling (avg score < 50), "medium" if average, "hard" if excelling (avg score > 80)
- estimatedTimeToComplete: estimated minutes to finish remaining lessons based on pace

Be specific and reference actual lesson titles and topics.`;

    const userPrompt = `Course enrollment progress: ${Math.round(enrollment.progress)}%
Total lessons: ${lessons.length}
Completed lessons: ${completedLessons.length}
Total watch time: ${totalWatchTime} seconds
Average quiz score: ${Math.round(avgScore)}%
Quiz pass rate: ${Math.round(passRate)}%
Number of quizzes taken: ${quizScores.length}

All lessons:
${JSON.stringify(allLessonsBrief, null, 2)}`;

    const result = await generateJSON<AdaptivePathResult>(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      { maxTokens: 2048 }
    );

    const pathData = {
      strengths: result.strengths || [],
      weaknesses: result.weaknesses || [],
      recommendedNext: result.recommendedNext || [],
      adjustedDifficulty: result.adjustedDifficulty || "medium",
      estimatedTimeToComplete: result.estimatedTimeToComplete || 0,
      generatedAt: new Date().toISOString(),
    };

    const existingPath = await prisma.adaptivePath.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });

    let adaptivePath;
    if (existingPath) {
      adaptivePath = await prisma.adaptivePath.update({
        where: { id: existingPath.id },
        data: { pathData, currentNodeId: result.recommendedNext?.[0]?.lessonId || null },
      });
    } else {
      adaptivePath = await prisma.adaptivePath.create({
        data: {
          userId,
          courseId,
          pathData,
          currentNodeId: result.recommendedNext?.[0]?.lessonId || null,
        },
      });
    }

    const existingProfile = await prisma.learningProfile.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });

    const profileData = {
      strengths: result.strengths || [],
      weaknesses: result.weaknesses || [],
      engagementScore: Math.min(100, Math.round(avgScore * 0.5 + (completedLessons.length / lessons.length) * 100 * 0.5)),
      totalStudyTime: totalWatchTime,
      lessonsCompleted: completedLessons.length,
      averageScore: Math.round(avgScore),
      lastActivityAt: new Date(),
    };

    if (existingProfile) {
      await prisma.learningProfile.update({
        where: { id: existingProfile.id },
        data: profileData,
      });
    } else {
      await prisma.learningProfile.create({
        data: { userId, courseId, ...profileData },
      });
    }

    return NextResponse.json({ path: adaptivePath, analysis: pathData });
  } catch (error) {
    console.error("Adaptive path POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
