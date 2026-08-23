import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { chatCompletion } from "@/lib/ai";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const { message, courseId, conversationId } = body;

    if (!message || !courseId) {
      return NextResponse.json(
        { error: "Message and courseId are required" },
        { status: 400 }
      );
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        lessons: { select: { id: true, title: true, description: true } },
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const learningProfile = await prisma.learningProfile.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });

    let conversation;
    if (conversationId) {
      conversation = await prisma.aICONversation.findUnique({
        where: { id: conversationId },
      });
      if (!conversation || conversation.userId !== userId) {
        return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
      }
    } else {
      conversation = await prisma.aICONversation.create({
        data: {
          userId,
          courseId,
          title: message.slice(0, 100),
          messages: [],
          context: {},
        },
      });
    }

    const existingMessages = (conversation.messages as any[]) || [];
    const recentMessages = existingMessages.slice(-20);

    const lessonsSummary = course.lessons
      .map((l) => `- ${l.title}: ${l.description || "No description"}`)
      .join("\n");

    const strengths = learningProfile
      ? JSON.stringify(learningProfile.strengths)
      : "Not yet assessed";
    const weaknesses = learningProfile
      ? JSON.stringify(learningProfile.weaknesses)
      : "Not yet assessed";

    const systemPrompt = `You are an AI tutor for the course "${course.title}". Be helpful, encouraging, and educational. Explain concepts clearly. Give hints instead of direct answers on quizzes. Adapt to the student's level.

Course Description: ${course.description || "No description available."}

Course Lessons:
${lessonsSummary || "No lessons available."}

Student's Learning Profile:
- Strengths: ${strengths}
- Weaknesses: ${weaknesses}
- Learning Style: ${learningProfile?.learningStyle || "Unknown"}
- Average Score: ${learningProfile?.averageScore ?? "N/A"}%`;

    const messagesForAI: { role: "system" | "user" | "assistant"; content: string }[] = [
      { role: "system", content: systemPrompt },
    ];

    for (const msg of recentMessages) {
      messagesForAI.push({
        role: msg.role,
        content: msg.content,
      });
    }

    messagesForAI.push({ role: "user", content: message });

    const assistantResponse = await chatCompletion(messagesForAI);

    const updatedMessages = [
      ...existingMessages,
      { role: "user", content: message, timestamp: new Date().toISOString() },
      { role: "assistant", content: assistantResponse, timestamp: new Date().toISOString() },
    ];

    await prisma.aICONversation.update({
      where: { id: conversation.id },
      data: { messages: updatedMessages },
    });

    return NextResponse.json({
      response: assistantResponse,
      conversationId: conversation.id,
    });
  } catch (error) {
    console.error("AI Tutor error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get("conversationId");
    const courseId = searchParams.get("courseId");

    if (conversationId) {
      const conversation = await prisma.aICONversation.findUnique({
        where: { id: conversationId },
        include: { course: { select: { id: true, title: true } } },
      });

      if (!conversation || conversation.userId !== userId) {
        return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
      }

      return NextResponse.json({ conversation });
    }

    if (courseId) {
      const conversations = await prisma.aICONversation.findMany({
        where: { userId, courseId },
        include: { course: { select: { id: true, title: true } } },
        orderBy: { updatedAt: "desc" },
        take: 20,
      });

      return NextResponse.json({ conversations });
    }

    const conversations = await prisma.aICONversation.findMany({
      where: { userId },
      include: { course: { select: { id: true, title: true } } },
      orderBy: { updatedAt: "desc" },
      take: 20,
    });

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error("AI Tutor fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
