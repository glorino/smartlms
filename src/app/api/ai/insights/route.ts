import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

interface StudentPerformanceData {
  userId: string;
  quizScores: { quizId: string; score: number; totalPoints: number; subject: string }[];
  courseCompletions: { courseId: string; title: string; progress: number; lastAccessed: string }[];
  learningTime: { date: string; hours: number }[];
  engagementMetrics: { loginFrequency: number; averageSessionMinutes: number; completedLessons: number; totalLessons: number };
}

function analyzeWeakAreas(quizScores: StudentPerformanceData["quizScores"]) {
  const subjectScores: Record<string, { total: number; count: number }> = {};
  quizScores.forEach((q) => {
    const pct = (q.score / q.totalPoints) * 100;
    if (!subjectScores[q.subject]) subjectScores[q.subject] = { total: 0, count: 0 };
    subjectScores[q.subject].total += pct;
    subjectScores[q.subject].count += 1;
  });

  const weakAreas: { subject: string; averageScore: number; recommendation: string }[] = [];
  const strongAreas: { subject: string; averageScore: number }[] = [];

  Object.entries(subjectScores).forEach(([subject, data]) => {
    const avg = data.total / data.count;
    if (avg < 70) {
      weakAreas.push({
        subject,
        averageScore: Math.round(avg),
        recommendation: `Focus on reviewing ${subject} fundamentals. Consider revisiting earlier lessons and taking practice quizzes.`,
      });
    } else if (avg >= 85) {
      strongAreas.push({ subject, averageScore: Math.round(avg) });
    }
  });

  return { weakAreas, strongAreas };
}

function analyzeAtRiskStudents(courseCompletions: StudentPerformanceData["courseCompletions"]) {
  const atRisk: { courseId: string; title: string; progress: number; daysInactive: number; recommendation: string }[] = [];
  const now = new Date();

  courseCompletions.forEach((c) => {
    const lastAccessed = new Date(c.lastAccessed);
    const daysInactive = Math.floor((now.getTime() - lastAccessed.getTime()) / (1000 * 60 * 60 * 24));

    if (c.progress < 50 && daysInactive > 3) {
      atRisk.push({
        courseId: c.courseId,
        title: c.title,
        progress: c.progress,
        daysInactive,
        recommendation: daysInactive > 7
          ? `Urgent: You haven't accessed "${c.title}" in ${daysInactive} days. Try starting with a short review session.`
          : `Consider spending 20 minutes today on "${c.title}" to maintain your momentum.`,
      });
    }
  });

  return atRisk;
}

function analyzeLearningSchedule(learningTime: StudentPerformanceData["learningTime"]) {
  if (learningTime.length === 0) return { pattern: "No data", recommendation: "Start logging your learning sessions to get schedule optimization tips." };

  const totalHours = learningTime.reduce((sum, d) => sum + d.hours, 0);
  const avgDaily = totalHours / learningTime.length;

  const weekdayHours = learningTime.filter((d) => {
    const day = new Date(d.date).getDay();
    return day >= 1 && day <= 5;
  });
  const weekendHours = learningTime.filter((d) => {
    const day = new Date(d.date).getDay();
    return day === 0 || day === 6;
  });

  const weekdayAvg = weekdayHours.length > 0 ? weekdayHours.reduce((s, d) => s + d.hours, 0) / weekdayHours.length : 0;
  const weekendAvg = weekendHours.length > 0 ? weekendHours.reduce((s, d) => s + d.hours, 0) / weekendHours.length : 0;

  let pattern = "Balanced";
  let recommendation = "";

  if (avgDaily < 0.5) {
    pattern = "Low";
    recommendation = "Try to increase daily learning time to at least 30 minutes for better retention.";
  } else if (avgDaily > 4) {
    pattern = "Intensive";
    recommendation = "Great dedication! Consider taking short breaks every 25 minutes (Pomodoro technique) to avoid burnout.";
  } else if (weekendAvg > weekdayAvg * 2) {
    pattern = "Weekend-focused";
    recommendation = "Consider spreading your learning more evenly throughout the week for better retention.";
  } else {
    recommendation = "Your learning schedule looks healthy. Keep maintaining consistent daily sessions.";
  }

  return { pattern, avgDailyHours: Math.round(avgDaily * 10) / 10, weekdayAvg: Math.round(weekdayAvg * 10) / 10, weekendAvg: Math.round(weekendAvg * 10) / 10, recommendation };
}

function analyzeEngagement(metrics: StudentPerformanceData["engagementMetrics"]) {
  const completionRate = metrics.totalLessons > 0 ? Math.round((metrics.completedLessons / metrics.totalLessons) * 100) : 0;

  let level = "Low";
  let recommendation = "";
  const score = metrics.loginFrequency * 2 + completionRate * 0.5 + (metrics.averageSessionMinutes / 60) * 10;

  if (score > 80) {
    level = "High";
    recommendation = "Excellent engagement! You're on track to complete your courses ahead of schedule.";
  } else if (score > 50) {
    level = "Moderate";
    recommendation = "Good progress! Try setting daily learning goals to boost your engagement further.";
  } else {
    level = "Low";
    recommendation = "Consider setting a regular learning schedule. Even 15 minutes daily can make a big difference.";
  }

  return { level, completionRate, score: Math.round(score), recommendation };
}

function generateInsights(data: StudentPerformanceData) {
  const { weakAreas, strongAreas } = analyzeWeakAreas(data.quizScores);
  const atRiskCourses = analyzeAtRiskStudents(data.courseCompletions);
  const scheduleAnalysis = analyzeLearningSchedule(data.learningTime);
  const engagementAnalysis = analyzeEngagement(data.engagementMetrics);

  const recommendations: { priority: "high" | "medium" | "low"; category: string; message: string; action?: string }[] = [];

  weakAreas.forEach((w) => {
    recommendations.push({
      priority: "high",
      category: "Academic",
      message: `Your ${w.subject} scores average ${w.averageScore}%. This needs attention.`,
      action: w.recommendation,
    });
  });

  atRiskCourses.forEach((c) => {
    recommendations.push({
      priority: c.daysInactive > 7 ? "high" : "medium",
      category: "Course Progress",
      message: `"${c.title}" is at ${c.progress}% completion with ${c.daysInactive} days of inactivity.`,
      action: c.recommendation,
    });
  });

  if (engagementAnalysis.level === "Low") {
    recommendations.push({
      priority: "high",
      category: "Engagement",
      message: "Your engagement level is low. Regular interaction improves learning outcomes.",
      action: engagementAnalysis.recommendation,
    });
  }

  if (scheduleAnalysis.pattern === "Low") {
    recommendations.push({
      priority: "medium",
      category: "Schedule",
      message: "Your daily learning time is below recommended levels.",
      action: scheduleAnalysis.recommendation,
    });
  }

  strongAreas.forEach((s) => {
    recommendations.push({
      priority: "low",
      category: "Strength",
      message: `Excellent performance in ${s.subject} (${s.averageScore}%). Consider advanced topics.`,
    });
  });

  return {
    userId: data.userId,
    analyzedAt: new Date().toISOString(),
    summary: {
      weakAreasCount: weakAreas.length,
      atRiskCoursesCount: atRiskCourses.length,
      overallEngagement: engagementAnalysis.level,
      learningPattern: scheduleAnalysis.pattern,
    },
    weakAreas,
    strongAreas,
    atRiskCourses,
    scheduleAnalysis,
    engagementAnalysis,
    recommendations: recommendations.sort((a, b) => {
      const order = { high: 0, medium: 1, low: 2 };
      return order[a.priority] - order[b.priority];
    }),
  };
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { userId, quizScores = [], courseCompletions = [], learningTime = [], engagementMetrics } = body;

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const defaultEngagement = {
      loginFrequency: 5,
      averageSessionMinutes: 30,
      completedLessons: 0,
      totalLessons: 0,
    };

    const performanceData: StudentPerformanceData = {
      userId,
      quizScores,
      courseCompletions,
      learningTime,
      engagementMetrics: engagementMetrics || defaultEngagement,
    };

    const insights = generateInsights(performanceData);

    await prisma.aIGeneratedContent.create({
      data: {
        type: "PERFORMANCE_INSIGHTS",
        prompt: JSON.stringify({ userId, metricsCount: quizScores.length + courseCompletions.length }),
        content: insights as any,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ insights });
  } catch (error) {
    console.error("AI Insights error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
