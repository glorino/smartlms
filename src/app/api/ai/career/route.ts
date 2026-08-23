import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { generateJSON } from "@/lib/ai";

interface CareerRecommendation {
  title: string;
  description: string;
  matchScore: number;
  requiredSkills: string[];
  gapSkills: string[];
  roadmap: {
    step: number;
    title: string;
    description: string;
    estimatedTime: string;
  }[];
}

interface CareerResponse {
  careers: CareerRecommendation[];
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const careerPaths = await prisma.careerPath.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    return NextResponse.json({ careerPaths });
  } catch (error) {
    console.error("Career path fetch error:", error);
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

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        bio: true,
        enrollments: {
          select: {
            status: true,
            progress: true,
            course: {
              select: {
                title: true,
                category: true,
                level: true,
                tags: true,
              },
            },
          },
        },
        quizAttempts: {
          select: {
            score: true,
            totalPoints: true,
            quiz: {
              select: { title: true, difficulty: true },
            },
          },
          orderBy: { completedAt: "desc" },
          take: 20,
        },
        certificates: {
          select: {
            title: true,
            course: {
              select: { title: true, category: true },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const completedCourses = user.enrollments
      .filter((e) => e.status === "COMPLETED")
      .map((e) => ({
        title: e.course.title,
        category: e.course.category,
        level: e.course.level,
        tags: e.course.tags,
      }));

    const inProgressCourses = user.enrollments
      .filter((e) => e.status === "ACTIVE")
      .map((e) => ({
        title: e.course.title,
        category: e.course.category,
        progress: e.progress,
      }));

    const quizResults = user.quizAttempts.map((q) => ({
      quiz: q.quiz.title,
      difficulty: q.quiz.difficulty,
      score: q.totalPoints > 0 ? (q.score / q.totalPoints) * 100 : 0,
    }));

    const averageScore =
      quizResults.length > 0
        ? quizResults.reduce((sum, q) => sum + q.score, 0) / quizResults.length
        : 0;

    const skills = Array.from(
      new Set(
        completedCourses
          .flatMap((c) => [...(c.tags || []), c.category].filter(Boolean))
      )
    );

    const prompt = `Based on this student's learning profile, suggest 3-5 career paths.

Student Profile:
- Name: ${user.name || "Student"}
- Bio: ${user.bio || "Not provided"}
- Completed Courses (${completedCourses.length}): ${completedCourses.map((c) => c.title).join(", ") || "None yet"}
- In-Progress Courses: ${inProgressCourses.map((c) => `${c.title} (${Math.round(c.progress)}%)`).join(", ") || "None"}
- Skills/Topics: ${skills.join(", ") || "Building foundation"}
- Average Quiz Score: ${Math.round(averageScore)}%
- Certificates: ${user.certificates.length}

For each career, provide:
- title: job/role title
- description: what this role does (2-3 sentences)
- matchScore: 0-100 score based on current skills alignment
- requiredSkills: list of skills needed
- gapSkills: skills the student needs to develop
- roadmap: array of { step: number, title: string, description: string, estimatedTime: string }

Return JSON: { "careers": [{ ... }] }`;

    const result = await generateJSON<CareerResponse>(
      [
        { role: "system", content: "You are a career guidance AI for an online learning platform. Analyze student learning data and provide personalized career recommendations with actionable roadmaps." },
        { role: "user", content: prompt },
      ],
      { maxTokens: 3000 }
    );

    const savedPaths = await Promise.all(
      (result.careers || []).map((career) =>
        prisma.careerPath.create({
          data: {
            userId,
            title: career.title,
            description: career.description,
            skills: skills as any,
            recommendations: {
              matchScore: career.matchScore,
              requiredSkills: career.requiredSkills,
              gapSkills: career.gapSkills,
            } as any,
            roadmap: career.roadmap as any,
            matchScore: career.matchScore,
          },
        })
      )
    );

    return NextResponse.json({ careerPaths: savedPaths });
  } catch (error) {
    console.error("Career path generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate career paths" },
      { status: 500 }
    );
  }
}
