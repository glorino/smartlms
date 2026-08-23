import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateJSON } from "@/lib/ai";

interface CourseLesson {
  title: string;
  type: string;
  description: string;
  estimatedDuration: string;
}

interface CourseSection {
  title: string;
  description: string;
  lessons: CourseLesson[];
}

interface CourseOutline {
  title: string;
  description: string;
  level: string;
  sections: CourseSection[];
  learningOutcomes: string[];
  prerequisites: string[];
  estimatedHours: number;
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { topic, level, duration, learningOutcomes } = body;

    if (!topic) {
      return NextResponse.json(
        { error: "topic is required" },
        { status: 400 }
      );
    }

    const prompt = `Generate a comprehensive course outline for an online learning platform.

Topic: "${topic}"
Level: ${level || "Beginner"}
Duration: ${duration || "Self-paced"}
${learningOutcomes?.length ? `Learning Outcomes: ${learningOutcomes.join(", ")}` : ""}

Create a detailed course structure with:
- A compelling title and description
- 4-6 sections, each with 3-5 lessons
- Each lesson should have: title, type (TEXT, VIDEO, or QUIZ), description, estimatedDuration
- Clear learning outcomes
- Prerequisites
- Total estimated hours

Return JSON: {
  "title": "string",
  "description": "string (2-3 sentences)",
  "level": "string",
  "sections": [
    {
      "title": "string",
      "description": "string",
      "lessons": [
        {
          "title": "string",
          "type": "TEXT|VIDEO|QUIZ",
          "description": "string",
          "estimatedDuration": "string like '15 min'"
        }
      ]
    }
  ],
  "learningOutcomes": ["string"],
  "prerequisites": ["string"],
  "estimatedHours": number
}`;

    const outline = await generateJSON<CourseOutline>(
      [
        { role: "system", content: "You are an expert course designer for online education platforms. Create engaging, well-structured course outlines that follow instructional design best practices." },
        { role: "user", content: prompt },
      ],
      { maxTokens: 3000 }
    );

    return NextResponse.json({ outline });
  } catch (error) {
    console.error("Course outline generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate course outline" },
      { status: 500 }
    );
  }
}
