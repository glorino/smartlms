import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { generateJSON } from "@/lib/ai";

interface RubricCriterion {
  criterion: string;
  maxScore: number;
  description?: string;
}

interface RubricScore {
  criterion: string;
  score: number;
  feedback: string;
}

interface GradingResponse {
  grade: string;
  score: number;
  feedback: string;
  rubricScores: RubricScore[];
  suggestions: string[];
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if ((session.user as any).role !== "INSTRUCTOR" && (session.user as any).role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only instructors can grade submissions" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { assignmentId, submissionId, submissionContent, rubric, studentId, courseId } = body;

    if (!submissionContent) {
      return NextResponse.json(
        { error: "submissionContent is required" },
        { status: 400 }
      );
    }

    let assignmentContext = "";
    if (assignmentId) {
      const assignment = await prisma.assignment.findUnique({
        where: { id: assignmentId },
        select: { title: true, description: true, maxScore: true, content: true },
      });
      if (assignment) {
        assignmentContext = `Assignment: "${assignment.title}"\nDescription: ${assignment.description || "No description"}\nInstructions: ${assignment.content || "No instructions"}\nMax Score: ${assignment.maxScore}`;
      }
    }

    const rubricContext = rubric && rubric.length > 0
      ? `Rubric criteria:\n${(rubric as RubricCriterion[])
          .map((r) => `- ${r.criterion} (max ${r.maxScore} points): ${r.description || "No description"}`)
          .join("\n")}`
      : "No rubric provided. Grade holistically based on content quality, completeness, accuracy, and clarity.";

    const systemPrompt = `You are an expert educational grader. Evaluate student submissions fairly and thoroughly. Provide constructive, specific feedback that helps the student improve. Be consistent and objective in your grading.`;

    const userPrompt = `${assignmentContext ? assignmentContext + "\n\n" : ""}${rubricContext}

Student submission:
---
${submissionContent}
---

Grade this submission. Return JSON in this exact format:
{
  "grade": "letter grade (A/B/C/D/F)",
  "score": numeric score as percentage (0-100),
  "feedback": "overall detailed feedback on the submission",
  "rubricScores": [
    {
      "criterion": "criterion name",
      "score": points earned,
      "feedback": "specific feedback for this criterion"
    }
  ],
  "suggestions": [
    "Specific actionable suggestion for improvement"
  ]
}

Be thorough but fair. Provide at least 3 improvement suggestions.`;

    const result = await generateJSON<GradingResponse>(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      { maxTokens: 2048 }
    );

    const score = Math.min(Math.max(Number(result.score) || 0, 0), 100);
    const totalPoints = 100;
    let letterGrade = result.grade || "F";
    if (score >= 90) letterGrade = "A";
    else if (score >= 80) letterGrade = "B";
    else if (score >= 70) letterGrade = "C";
    else if (score >= 60) letterGrade = "D";
    else letterGrade = "F";

    if (studentId && courseId) {
      await prisma.grade.create({
        data: {
          userId: studentId,
          score,
          totalPoints,
          percentage: score,
          letterGrade,
          type: "ASSIGNMENT",
          courseId,
        },
      });
    }

    if (assignmentId) {
      await prisma.assignment.update({
        where: { id: assignmentId },
        data: {
          score,
          feedback: result.feedback || "",
          status: "GRADED",
          gradedAt: new Date(),
        },
      });
    }

    return NextResponse.json({
      grade: letterGrade,
      score,
      feedback: result.feedback || "",
      rubricScores: result.rubricScores || [],
      suggestions: result.suggestions || [],
    });
  } catch (error) {
    console.error("AI grading error:", error);
    return NextResponse.json(
      { error: "Failed to grade submission. Please try again." },
      { status: 500 }
    );
  }
}
