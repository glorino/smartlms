import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { generateJSON } from "@/lib/ai";

interface PredictionStudent {
  userId: string;
  name: string;
  email: string;
  riskLevel: "low" | "medium" | "high" | "critical";
  engagementScore: number;
  reasons: string[];
  recommendations: string[];
}

interface AIPredictions {
  students: PredictionStudent[];
}

function computeEngagementScore(data: {
  daysSinceLastActivity: number;
  completionRate: number;
  avgQuizScore: number;
  totalQuizzes: number;
}): number {
  let score = 100;

  if (data.daysSinceLastActivity <= 1) score -= 0;
  else if (data.daysSinceLastActivity <= 3) score -= 10;
  else if (data.daysSinceLastActivity <= 7) score -= 30;
  else if (data.daysSinceLastActivity <= 14) score -= 50;
  else score -= 70;

  score -= (1 - data.completionRate) * 20;

  if (data.totalQuizzes > 0) {
    if (data.avgQuizScore < 40) score -= 25;
    else if (data.avgQuizScore < 60) score -= 15;
    else if (data.avgQuizScore < 80) score -= 5;
  }

  return Math.max(0, Math.min(100, Math.round(score)));
}

function determineRiskLevel(
  engagementScore: number,
  daysSinceLastActivity: number,
  completionRate: number,
  recentScoreDecline: boolean
): "low" | "medium" | "high" | "critical" {
  if (engagementScore < 20 || (daysSinceLastActivity > 14 && completionRate < 0.3)) {
    return "critical";
  }
  if (engagementScore < 40 || daysSinceLastActivity > 7 || (recentScoreDecline && completionRate < 0.5)) {
    return "high";
  }
  if (engagementScore < 60 || daysSinceLastActivity > 3 || completionRate < 0.4) {
    return "medium";
  }
  return "low";
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const role = (session.user as any).role;

    if (role !== "INSTRUCTOR" && role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const courses = await prisma.course.findMany({
      where: role === "ADMIN" ? {} : { instructorId: userId },
      select: { id: true },
    });

    const courseIds = courses.map((c) => c.id);

    if (courseIds.length === 0) {
      return NextResponse.json({ students: [] });
    }

    const enrollments = await prisma.enrollment.findMany({
      where: { courseId: { in: courseIds }, status: { not: "CANCELLED" } },
      include: {
        user: { select: { id: true, name: true, email: true } },
        course: { select: { id: true, title: true } },
      },
    });

    const studentCourseMap = new Map<string, typeof enrollments>();
    for (const enrollment of enrollments) {
      const key = enrollment.userId;
      if (!studentCourseMap.has(key)) studentCourseMap.set(key, []);
      studentCourseMap.get(key)!.push(enrollment);
    }

    const predictionStudents: {
      userId: string;
      name: string;
      email: string;
      engagementScore: number;
      daysSinceLastActivity: number;
      completionRate: number;
      avgQuizScore: number;
      totalQuizzes: number;
      recentScoreDecline: boolean;
      courseCount: number;
      riskLevel: "low" | "medium" | "high" | "critical";
      reasons: string[];
    }[] = [];

    for (const [studentId, studentEnrollments] of studentCourseMap) {
      const first = studentEnrollments[0];
      const studentCourses = studentEnrollments.map((e) => e.courseId);

      const lessonProgress = await prisma.lessonProgress.findMany({
        where: { userId: studentId, lesson: { courseId: { in: studentCourses } } },
        select: { completed: true, watchTime: true, completedAt: true },
      });

      const totalLessons = await prisma.lesson.count({
        where: { courseId: { in: studentCourses } },
      });

      const completedCount = lessonProgress.filter((lp) => lp.completed).length;
      const completionRate = totalLessons > 0 ? completedCount / totalLessons : 0;

      const quizAttempts = await prisma.quizAttempt.findMany({
        where: {
          userId: studentId,
          quiz: { courseId: { in: studentCourses } },
        },
        select: { score: true, totalPoints: true, completedAt: true },
        orderBy: { completedAt: "desc" },
      });

      const avgQuizScore =
        quizAttempts.length > 0
          ? quizAttempts.reduce((s, a) => s + (a.score / a.totalPoints) * 100, 0) / quizAttempts.length
          : 0;

      let lastActivityDate = studentEnrollments.reduce(
        (latest, e) => (e.enrolledAt > latest ? e.enrolledAt : latest),
        studentEnrollments[0].enrolledAt
      );

      for (const lp of lessonProgress) {
        if (lp.completedAt && lp.completedAt > lastActivityDate) {
          lastActivityDate = lp.completedAt;
        }
      }
      for (const qa of quizAttempts) {
        if (qa.completedAt && qa.completedAt > lastActivityDate) {
          lastActivityDate = qa.completedAt;
        }
      }

      const daysSinceLastActivity = Math.floor(
        (Date.now() - lastActivityDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      let recentScoreDecline = false;
      if (quizAttempts.length >= 4) {
        const recentHalf = quizAttempts.slice(0, Math.floor(quizAttempts.length / 2));
        const olderHalf = quizAttempts.slice(Math.floor(quizAttempts.length / 2));
        const recentAvg = recentHalf.reduce((s, a) => s + a.score / a.totalPoints, 0) / recentHalf.length;
        const olderAvg = olderHalf.reduce((s, a) => s + a.score / a.totalPoints, 0) / olderHalf.length;
        recentScoreDecline = recentAvg < olderAvg - 0.1;
      }

      const engagementScore = computeEngagementScore({
        daysSinceLastActivity,
        completionRate,
        avgQuizScore,
        totalQuizzes: quizAttempts.length,
      });

      const reasons: string[] = [];
      if (daysSinceLastActivity > 7) reasons.push(`Inactive for ${daysSinceLastActivity} days`);
      if (completionRate < 0.3) reasons.push(`Only ${Math.round(completionRate * 100)}% of lessons completed`);
      if (avgQuizScore < 50 && quizAttempts.length > 0) reasons.push(`Low quiz average: ${Math.round(avgQuizScore)}%`);
      if (recentScoreDecline) reasons.push("Declining quiz scores over time");
      if (lessonProgress.length === 0 && quizAttempts.length === 0) reasons.push("No learning activity recorded");
      if (enrollments.length === 0) reasons.push("No active enrollments");

      const riskLevel = determineRiskLevel(engagementScore, daysSinceLastActivity, completionRate, recentScoreDecline);

      predictionStudents.push({
        userId: studentId,
        name: first.user.name || "Unknown",
        email: first.user.email,
        engagementScore,
        daysSinceLastActivity,
        completionRate,
        avgQuizScore,
        totalQuizzes: quizAttempts.length,
        recentScoreDecline,
        courseCount: studentEnrollments.length,
        riskLevel,
        reasons,
      });
    }

    const atRiskStudents = predictionStudents.filter((s) => s.riskLevel !== "low");

    if (atRiskStudents.length === 0) {
      return NextResponse.json({
        students: predictionStudents.map((s) => ({
          userId: s.userId,
          name: s.name,
          email: s.email,
          riskLevel: s.riskLevel,
          engagementScore: s.engagementScore,
          reasons: s.reasons,
          recommendations: [],
        })),
      });
    }

    let aiResult: AIPredictions;
    try {
      aiResult = await generateJSON<AIPredictions>(
        [
          {
            role: "system",
            content: `You are an educational analytics AI. For each at-risk student, provide 1-3 specific, actionable intervention recommendations.

Consider these factors:
- Days since last activity
- Completion rate
- Quiz performance
- Score trends

Recommendations should be specific (e.g., "Send a personalized email highlighting their strong performance in Module 2 to re-engage them") not generic.`,
          },
          {
            role: "user",
            content: `Analyze these students and provide intervention recommendations. For each student, return their userId and an array of recommendation strings.

Students data:
${JSON.stringify(
  atRiskStudents.map((s) => ({
    userId: s.userId,
    name: s.name,
    daysSinceLastActivity: s.daysSinceLastActivity,
    completionRate: Math.round(s.completionRate * 100),
    avgQuizScore: Math.round(s.avgQuizScore),
    totalQuizzes: s.totalQuizzes,
    recentScoreDecline: s.recentScoreDecline,
    riskLevel: s.riskLevel,
    reasons: s.reasons,
  })),
  null,
  2
)}

Return JSON with shape: { students: [{ userId: string, recommendations: string[] }] }`,
          },
        ],
        { maxTokens: 2048 }
      );
    } catch {
      aiResult = { students: [] };
    }

    const recommendationsMap = new Map<string, string[]>();
    for (const s of aiResult.students || []) {
      recommendationsMap.set(s.userId, s.recommendations || []);
    }

    const result = predictionStudents.map((s) => ({
      userId: s.userId,
      name: s.name,
      email: s.email,
      riskLevel: s.riskLevel,
      engagementScore: s.engagementScore,
      reasons: s.reasons,
      recommendations: recommendationsMap.get(s.userId) || [],
    }));

    return NextResponse.json({ students: result });
  } catch (error) {
    console.error("Predictions error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
