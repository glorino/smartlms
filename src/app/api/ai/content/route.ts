import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { generateJSON } from "@/lib/ai";

interface SummaryContent {
  title: string;
  summary: string;
  keyPoints: string[];
}

interface Flashcard {
  front: string;
  back: string;
}

interface StudyGuideSection {
  title: string;
  content: string;
  tips: string[];
}

interface StudyGuideContent {
  sections: StudyGuideSection[];
}

interface KeyConcept {
  concept: string;
  definition: string;
  example: string;
  relatedTo: string[];
}

type ContentMap = {
  summary: SummaryContent;
  flashcards: Flashcard[];
  study_guide: StudyGuideContent;
  key_concepts: KeyConcept[];
};

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const { type, lessonId, courseId } = body;

    if (!type || !lessonId) {
      return NextResponse.json(
        { error: "type and lessonId are required" },
        { status: 400 }
      );
    }

    if (!["summary", "flashcards", "study_guide", "key_concepts"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid type. Must be: summary, flashcards, study_guide, or key_concepts" },
        { status: 400 }
      );
    }

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: { id: true, title: true, content: true, description: true, courseId: true },
    });

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    const sourceContent = lesson.content || lesson.description || lesson.title;

    const prompts: Record<string, string> = {
      summary: `Generate a lesson summary with key points from the following content. Return JSON with: { "title": "string", "summary": "string (2-3 paragraphs)", "keyPoints": ["string"] }.\n\nLesson: "${lesson.title}"\nContent:\n${sourceContent}`,
      flashcards: `Generate flashcards for studying the following lesson. Return JSON with: { "flashcards": [{ "front": "question or term", "back": "answer or definition" }] }. Generate 8-12 flashcards.\n\nLesson: "${lesson.title}"\nContent:\n${sourceContent}`,
      study_guide: `Generate a study guide for the following lesson. Return JSON with: { "sections": [{ "title": "string", "content": "string", "tips": ["string"] }] }. Create 3-4 sections.\n\nLesson: "${lesson.title}"\nContent:\n${sourceContent}`,
      key_concepts: `Extract key concepts from the following lesson. Return JSON with: { "concepts": [{ "concept": "string", "definition": "string", "example": "string", "relatedTo": ["string"] }] }. Identify 5-8 concepts.\n\nLesson: "${lesson.title}"\nContent:\n${sourceContent}`,
    };

    let generatedContent;
    if (type === "summary") {
      generatedContent = await generateJSON<SummaryContent>(
        [
          { role: "system", content: "You are an educational content assistant. Generate concise, helpful study materials." },
          { role: "user", content: prompts[type] },
        ],
        { maxTokens: 1500 }
      );
    } else if (type === "flashcards") {
      const raw = await generateJSON<{ flashcards: Flashcard[] }>(
        [
          { role: "system", content: "You are an educational content assistant. Generate effective study flashcards." },
          { role: "user", content: prompts[type] },
        ],
        { maxTokens: 2000 }
      );
      generatedContent = raw.flashcards || raw;
    } else if (type === "study_guide") {
      generatedContent = await generateJSON<StudyGuideContent>(
        [
          { role: "system", content: "You are an educational content assistant. Generate comprehensive study guides." },
          { role: "user", content: prompts[type] },
        ],
        { maxTokens: 2000 }
      );
    } else {
      const raw = await generateJSON<{ concepts: KeyConcept[] }>(
        [
          { role: "system", content: "You are an educational content assistant. Extract and explain key concepts clearly." },
          { role: "user", content: prompts[type] },
        ],
        { maxTokens: 2000 }
      );
      generatedContent = raw.concepts || raw;
    }

    const saved = await prisma.aIContentGeneration.create({
      data: {
        userId,
        type,
        sourceContent: sourceContent.slice(0, 5000),
        generatedContent: generatedContent as any,
        courseId: courseId || lesson.courseId || null,
        lessonId,
      },
    });

    return NextResponse.json({ content: generatedContent, id: saved.id });
  } catch (error) {
    console.error("AI content generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 }
    );
  }
}
