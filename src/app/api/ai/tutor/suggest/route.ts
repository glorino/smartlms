import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { generateJSON } from "@/lib/ai";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { courseId, lessonId } = body;

    if (!courseId || !lessonId) {
      return NextResponse.json(
        { error: "courseId and lessonId are required" },
        { status: 400 }
      );
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { title: true, description: true },
    });

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: { title: true, description: true, content: true },
    });

    if (!course || !lesson) {
      return NextResponse.json(
        { error: "Course or lesson not found" },
        { status: 404 }
      );
    }

    const contentPreview = lesson.content
      ? lesson.content.replace(/<[^>]*>/g, "").slice(0, 1500)
      : "No content available";

    const result = await generateJSON<{ suggestions: string[] }>(
      [
        {
          role: "system",
          content: `You are an AI tutor generating suggested questions a student might ask about a lesson. Generate 3-5 clear, concise, and educational questions based on the lesson content. Return them as a JSON object with a "suggestions" array of strings.`,
        },
        {
          role: "user",
          content: `Course: "${course.title}" — ${course.description || "No description"}

Lesson: "${lesson.title}" — ${lesson.description || "No description"}

Lesson Content Preview:
${contentPreview}

Generate 3-5 suggested questions a student might ask about this lesson.`,
        },
      ],
      { maxTokens: 512 }
    );

    const suggestions = Array.isArray(result.suggestions)
      ? result.suggestions.slice(0, 5)
      : [];

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("AI Tutor suggest error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
