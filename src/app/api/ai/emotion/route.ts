import { NextResponse } from "next/server";
import { generateJSON } from "@/lib/ai";

interface EmotionAnalysisRequest {
  messages: string[];
}

interface EmotionAnalysis {
  engagement: "high" | "medium" | "low";
  emotion: "confused" | "frustrated" | "engaged" | "bored" | "excited";
  sentiment: number;
  recommendations: string[];
}

export async function POST(request: Request) {
  try {
    const body: EmotionAnalysisRequest = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages array is required and must not be empty" },
        { status: 400 }
      );
    }

    const recentMessages = messages.slice(-10).join("\n");

    const analysis = await generateJSON<EmotionAnalysis>(
      [
        {
          role: "system",
          content: `Analyze the student's engagement and emotion based on their recent messages in a learning platform context.

Respond with JSON only:
{
  "engagement": "high" | "medium" | "low",
  "emotion": "confused" | "frustrated" | "engaged" | "bored" | "excited",
  "sentiment": number between -1 (very negative) and 1 (very positive),
  "recommendations": array of 1-3 specific suggestions to help the student
}

Analysis guidelines:
- HIGH engagement: Active questions, specific topic inquiries, enthusiasm indicators
- MEDIUM engagement: Short responses, some questions, moderate interest
- LOW engagement: Very short/one-word answers, no questions, repetitive or off-topic

Emotion detection:
- Confused: Questions like "I don't understand", multiple clarification requests
- Frustrated: Negative language, complaints, "this isn't working"
- Engaged: Active participation, thoughtful questions, expressions of interest
- Bored: Short answers, "whatever", lack of interest indicators
- Excited: Enthusiasm, exclamation marks, positive exclamations

Provide practical, actionable recommendations for the AI tutor to improve the student's experience.`,
        },
        {
          role: "user",
          content: `Analyze these recent student messages:\n\n${recentMessages}`,
        },
      ]
    );

    return NextResponse.json({
      analysis: {
        engagement: analysis.engagement || "medium",
        emotion: analysis.emotion || "engaged",
        sentiment: typeof analysis.sentiment === "number" ? analysis.sentiment : 0,
        recommendations: Array.isArray(analysis.recommendations) ? analysis.recommendations : [],
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Emotion analysis error:", error);
    return NextResponse.json({
      analysis: {
        engagement: "medium",
        emotion: "engaged",
        sentiment: 0,
        recommendations: [],
      },
      timestamp: new Date().toISOString(),
    });
  }
}
