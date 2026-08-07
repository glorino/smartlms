import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

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

    let generatedContent: any;

    switch (type) {
      case "COURSE_OUTLINE":
        generatedContent = {
          title: "AI Generated Course Outline",
          modules: [
            {
              title: "Introduction",
              description: "Overview of the course",
              lessons: ["Welcome", "Course Goals", "Prerequisites"],
            },
            {
              title: "Core Concepts",
              description: "Fundamental principles",
              lessons: ["Key Concepts", "Examples", "Best Practices"],
            },
            {
              title: "Advanced Topics",
              description: "Deep dive into advanced material",
              lessons: ["Advanced Techniques", "Case Studies", "Real-world Applications"],
            },
            {
              title: "Conclusion",
              description: "Wrap up and next steps",
              lessons: ["Summary", "Resources", "Next Steps"],
            },
          ],
        };
        break;

      case "LESSON":
        generatedContent = {
          title: "AI Generated Lesson",
          content: `
            <h2>${prompt}</h2>
            <p>This lesson covers the fundamentals of the topic.</p>
            <h3>Key Points</h3>
            <ul>
              <li>Point 1: Understanding the basics</li>
              <li>Point 2: Applying the concepts</li>
              <li>Point 3: Best practices</li>
            </ul>
            <h3>Summary</h3>
            <p>In this lesson, we explored the essential aspects of the topic.</p>
          `,
          objectives: [
            "Understand the basic concepts",
            "Apply the knowledge practically",
            "Identify best practices",
          ],
          duration: 30,
        };
        break;

      case "QUIZ":
        generatedContent = {
          title: "AI Generated Quiz",
          questions: [
            {
              content: "What is the primary purpose of this topic?",
              type: "MULTIPLE_CHOICE",
              answers: [
                { content: "To learn fundamentals", isCorrect: true },
                { content: "To advanced concepts", isCorrect: false },
                { content: "To review basics", isCorrect: false },
                { content: "To test knowledge", isCorrect: false },
              ],
              explanation: "The primary purpose is to learn fundamentals.",
            },
            {
              content: "Which of the following is a best practice?",
              type: "SINGLE_CHOICE",
              answers: [
                { content: "Follow guidelines", isCorrect: true },
                { content: "Skip steps", isCorrect: false },
                { content: "Ignore errors", isCorrect: false },
                { content: "Rush through", isCorrect: false },
              ],
              explanation: "Following guidelines is always recommended.",
            },
          ],
        };
        break;

      case "DESCRIPTION":
        generatedContent = {
          shortDescription: "A comprehensive course covering essential concepts and practical applications.",
          description: `This course provides a thorough exploration of ${prompt}. Through a combination of theoretical knowledge and hands-on practice, students will gain a deep understanding of the subject matter. The course is designed for both beginners and intermediate learners looking to enhance their skills.`,
        };
        break;

      default:
        generatedContent = {
          message: `AI generation for type "${type}" is not yet supported`,
          prompt,
          model: model || "openai",
        };
    }

    await prisma.aIGeneratedContent.create({
      data: {
        type,
        prompt,
        content: generatedContent,
        model: model || "openai",
        userId,
      },
    });

    return NextResponse.json({
      content: generatedContent,
      type,
      model: model || "openai",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}