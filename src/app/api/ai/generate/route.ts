import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { generateJSON } from "@/lib/ai";

const systemPrompts: Record<string, string> = {
  COURSE_OUTLINE: `You are an expert curriculum designer. Generate a detailed course outline in JSON format with:
{ "title": "Course Title", "modules": [{ "title": "Module Title", "description": "Module description", "lessons": ["Lesson 1", "Lesson 2"] }] }
Return ONLY valid JSON, no markdown.`,
  LESSON: `You are an expert educator. Generate lesson content in JSON format with:
{ "title": "Lesson Title", "content": "<h2>Title</h2><p>Full HTML lesson content with multiple sections, examples, and key takeaways</p>", "objectives": ["Objective 1", "Objective 2", "Objective 3"], "duration": 30 }
Return ONLY valid JSON, no markdown.`,
  QUIZ: `You are an expert assessment designer. Generate quiz questions in JSON format with:
{ "title": "Quiz Title", "questions": [{ "content": "Question text", "type": "MULTIPLE_CHOICE", "answers": [{ "content": "Answer option", "isCorrect": true }], "explanation": "Why this is correct" }] }
Include 5-10 questions with varied difficulty. Return ONLY valid JSON, no markdown.`,
  DESCRIPTION: `You are a marketing copywriter. Generate course descriptions in JSON format with:
{ "shortDescription": "One compelling sentence (max 160 chars)", "description": "Detailed 2-3 paragraph course description highlighting benefits, target audience, and learning outcomes" }
Return ONLY valid JSON, no markdown.`,
};

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const body = await request.json();
    const { type, prompt, model } = body;

    if (!type || !prompt) {
      return NextResponse.json(
        { error: "Type and prompt are required" },
        { status: 400 }
      );
    }

    const systemPrompt = systemPrompts[type];
    if (!systemPrompt) {
      return NextResponse.json(
        { error: `AI generation for type "${type}" is not yet supported` },
        { status: 400 }
      );
    }

    const generatedContent = await generateJSON<any>([
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt },
    ]);

    await prisma.aIGeneratedContent.create({
      data: {
        type,
        prompt,
        content: generatedContent,
        model: model || "gpt-4o-mini",
        userId,
      },
    });

    return NextResponse.json({
      content: generatedContent,
      type,
      model: model || "gpt-4o-mini",
    });
  } catch (error) {
    console.error("AI generate error:", error);
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 }
    );
  }
}