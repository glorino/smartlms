import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { generateJSON } from "@/lib/ai";

interface GeneratedQuestion {
  content: string;
  type: string;
  points: number;
  explanation: string;
  answers: { content: string; isCorrect: boolean; explanation: string }[];
}

interface QuizGenerationResponse {
  questions: GeneratedQuestion[];
  title: string;
  description: string;
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if ((session.user as any).role !== "INSTRUCTOR" && (session.user as any).role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only instructors can generate quizzes" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { courseId, topic, difficulty, questionCount, questionTypes } = body;

    if (!courseId || !topic) {
      return NextResponse.json(
        { error: "courseId and topic are required" },
        { status: 400 }
      );
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        lessons: {
          select: { title: true, description: true, content: true },
          take: 10,
        },
        quizzes: {
          select: { title: true, description: true },
          take: 5,
        },
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    if (course.instructorId !== session.user.id && (session.user as any).role !== "ADMIN") {
      return NextResponse.json(
        { error: "You can only generate quizzes for your own courses" },
        { status: 403 }
      );
    }

    const lessonContext = course.lessons
      .map((l) => `- ${l.title}: ${l.description || l.content?.substring(0, 200) || ""}`)
      .join("\n");

    const existingQuizContext = course.quizzes
      .map((q) => `- ${q.title}: ${q.description || ""}`)
      .join("\n");

    const types = questionTypes && questionTypes.length > 0
      ? questionTypes.join(", ")
      : "MULTIPLE_CHOICE, TRUE_FALSE, SHORT_ANSWER";

    const count = Math.min(Math.max(Number(questionCount) || 5, 1), 20);
    const diff = ["EASY", "MEDIUM", "HARD"].includes(difficulty) ? difficulty : "MEDIUM";

    const systemPrompt = `You are an expert quiz question generator for an online learning platform. Generate high-quality, educational quiz questions based on the provided course content and topic. Ensure questions are clear, unambiguous, and pedagogically sound. Each question must have correct answers marked.`;

    const userPrompt = `Generate a quiz for the course "${course.title}" on the topic: "${topic}"

Course lessons for context:
${lessonContext || "No lesson content available."}

Existing quizzes in this course:
${existingQuizContext || "No existing quizzes."}

Requirements:
- Difficulty level: ${diff}
- Number of questions: ${count}
- Question types allowed: ${types}
- For MULTIPLE_CHOICE: provide exactly 4 answer options with 1 correct
- For TRUE_FALSE: provide exactly 2 answers (True and False), mark correct one
- For SHORT_ANSWER: provide 1 correct answer string, isCorrect: true, and leave answers array with just that one entry
- Each question should have a clear explanation
- Points per question: 1

Return JSON in this exact format:
{
  "title": "Quiz title based on topic",
  "description": "Brief description of what this quiz covers",
  "questions": [
    {
      "content": "Question text",
      "type": "MULTIPLE_CHOICE",
      "points": 1,
      "explanation": "Why this answer is correct",
      "answers": [
        { "content": "Option text", "isCorrect": true, "explanation": "Why this is correct" },
        { "content": "Option text", "isCorrect": false, "explanation": "" }
      ]
    }
  ]
}`;

    const result = await generateJSON<QuizGenerationResponse>(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      { maxTokens: 4096 }
    );

    const questions = (result.questions || []).map((q, i) => ({
      content: q.content,
      type: q.type || "MULTIPLE_CHOICE",
      points: q.points || 1,
      explanation: q.explanation || "",
      order: i,
      answers: (q.answers || []).map((a, ai) => ({
        content: a.content,
        isCorrect: a.isCorrect,
        points: a.isCorrect ? (q.points || 1) : 0,
        explanation: a.explanation || "",
        order: ai,
      })),
    }));

    const savedQuiz = await prisma.aIGeneratedQuiz.create({
      data: {
        instructorId: session.user.id,
        courseId,
        title: result.title || `AI Quiz: ${topic}`,
        topic,
        difficulty: diff,
        questionCount: count,
        questions: questions as any,
      },
    });

    return NextResponse.json({
      quizId: savedQuiz.id,
      title: result.title || `AI Quiz: ${topic}`,
      description: result.description || "",
      questions,
    });
  } catch (error) {
    console.error("Quiz generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate quiz. Please try again." },
      { status: 500 }
    );
  }
}
