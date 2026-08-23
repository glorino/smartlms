import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { generateJSON } from "@/lib/ai";

interface AIUpdatedProfile {
  learningStyle: string;
  pacePreference: string;
  strengths: string[];
  weaknesses: string[];
  summary: string;
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

    const profile = await prisma.learningProfile.findUnique({
      where: { userId_courseId: { userId: session.user.id, courseId } },
      include: { course: { select: { id: true, title: true } } },
    });

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("Learning profile GET error:", error);
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
    const { courseId, learningStyle, pacePreference } = body;

    if (!courseId) {
      return NextResponse.json({ error: "courseId is required" }, { status: 400 });
    }

    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
    if (!enrollment) {
      return NextResponse.json({ error: "Not enrolled in this course" }, { status: 404 });
    }

    const existing = await prisma.learningProfile.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });

    const updateData: Record<string, any> = {};
    if (learningStyle) updateData.learningStyle = learningStyle;
    if (pacePreference) updateData.pacePreference = pacePreference;

    let profile;
    if (existing) {
      profile = await prisma.learningProfile.update({
        where: { id: existing.id },
        data: updateData,
      });
    } else {
      profile = await prisma.learningProfile.create({
        data: {
          userId,
          courseId,
          learningStyle: learningStyle || "visual",
          pacePreference: pacePreference || "moderate",
        },
      });
    }

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("Learning profile POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
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

    const existing = await prisma.learningProfile.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });

    if (!existing) {
      return NextResponse.json({ error: "No learning profile found" }, { status: 404 });
    }

    const lessons = await prisma.lesson.findMany({
      where: { courseId },
      include: {
        progress: { where: { userId }, select: { completed: true, watchTime: true, progress: true } },
        quizzes: {
          include: {
            attempts: { where: { userId }, select: { score: true, totalPoints: true, passed: true } },
          },
        },
      },
      orderBy: { order: "asc" },
    });

    const completedCount = lessons.filter((l) => l.progress[0]?.completed).length;
    const totalWatchTime = lessons.reduce((sum, l) => sum + (l.progress[0]?.watchTime || 0), 0);
    const quizAttempts = lessons.flatMap((l) => l.quizzes.flatMap((q) => q.attempts));
    const avgScore =
      quizAttempts.length > 0
        ? quizAttempts.reduce((s, a) => s + (a.score / a.totalPoints) * 100, 0) / quizAttempts.length
        : 0;

    const lessonDetails = lessons.map((l) => ({
      title: l.title,
      completed: l.progress[0]?.completed || false,
      watchTime: l.progress[0]?.watchTime || 0,
      quizScores: l.quizzes.flatMap((q) => q.attempts.map((a) => Math.round((a.score / a.totalPoints) * 100))),
    }));

    let aiResult: AIUpdatedProfile;
    try {
      aiResult = await generateJSON<AIUpdatedProfile>(
        [
          {
            role: "system",
            content: `You are a learning analytics AI. Based on the student's activity data, update their learning profile.

Current profile:
- Learning style: ${existing.learningStyle}
- Pace preference: ${existing.pacePreference}
- Current strengths: ${JSON.stringify(existing.strengths)}
- Current weaknesses: ${JSON.stringify(existing.weaknesses)}

Analyze the lesson data to determine:
- learningStyle: infer from watch time patterns (visual if short sessions, reading if long sessions on text, kinesthetic if high completion with practice)
- pacePreference: "fast" if completing quickly, "moderate" if average, "slow" if taking more time
- strengths: topics/areas performing well
- weaknesses: areas needing improvement
- summary: brief AI analysis paragraph`,
          },
          {
            role: "user",
            content: `Lesson activity data:
${JSON.stringify(lessonDetails, null, 2)}

Total completed: ${completedCount}/${lessons.length}
Total watch time: ${totalWatchTime} seconds
Average quiz score: ${Math.round(avgScore)}%
Total quizzes: ${quizAttempts.length}`,
          },
        ],
        { maxTokens: 1024 }
      );
    } catch {
      aiResult = {
        learningStyle: existing.learningStyle,
        pacePreference: existing.pacePreference,
        strengths: existing.strengths as string[],
        weaknesses: existing.weaknesses as string[],
        summary: "AI analysis unavailable at this time.",
      };
    }

    const profile = await prisma.learningProfile.update({
      where: { id: existing.id },
      data: {
        learningStyle: aiResult.learningStyle,
        pacePreference: aiResult.pacePreference,
        strengths: aiResult.strengths,
        weaknesses: aiResult.weaknesses,
        engagementScore: Math.min(100, Math.round(avgScore * 0.5 + (completedCount / lessons.length) * 100 * 0.5)),
        totalStudyTime: totalWatchTime,
        lessonsCompleted: completedCount,
        averageScore: Math.round(avgScore),
        lastActivityAt: new Date(),
      },
    });

    return NextResponse.json({ profile, analysis: aiResult.summary });
  } catch (error) {
    console.error("Learning profile PUT error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
