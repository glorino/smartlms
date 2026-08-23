import { NextResponse } from "next/server";
import { chatCompletion } from "@/lib/ai";

const SYSTEM_PROMPT = `You are SmartLMS Assistant, an intelligent AI helper for the SmartLMS online learning platform. You can help users with:

COURSES:
- Browse, search, and recommend courses across categories (Web Development, Data Science, Mobile Development, Design, Business)
- Course details: duration, difficulty level, prerequisites, content
- Enrollment process and course navigation
- Course completion and progress tracking

PRICING & PLANS:
- Free Plan: ₦0/month (50+ courses, basic features)
- Pro Plan: ₦28,000/month or ₦264,000/year (all courses, certificates, priority support)
- Enterprise: Custom pricing (team management, SSO, dedicated support)
- Payment methods: Flutterwave (cards, bank transfer, USSD, mobile money)
- 30-day money-back guarantee

ACCOUNT & PLATFORM:
- Registration, login, password reset
- Dashboard navigation and features
- Mobile app availability (responsive web, offline mode)
- Browser requirements (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)

LEARNING FEATURES:
- AI-powered course recommendations
- Adaptive quizzes that adjust difficulty
- Blockchain-verified certificates
- Voice commands for navigation
- Live classes and study groups
- Progress tracking and analytics

SUPPORT:
- Contact: support@smartlms.com
- Live chat, help center, community forum
- Response time: within 2 hours during business hours

GUIDELINES:
- Be friendly, helpful, and concise
- Use Nigerian Naira (₦) for prices
- Provide specific, actionable information
- Escalate to human support when you cannot help
- For technical issues, suggest checking browser/console or contacting support
- Keep responses under 200 words unless detail is requested
- Use bullet points for lists
- End with a follow-up question when appropriate`;

interface ChatRequest {
  message: string;
  context?: {
    courseId?: string;
    courseName?: string;
    currentPage?: string;
  };
}

function generateSuggestions(response: string, context?: ChatRequest["context"]): string[] {
  const suggestions: string[] = [];
  const lowerResponse = response.toLowerCase();

  if (lowerResponse.includes("course") || lowerResponse.includes("learn")) {
    suggestions.push("Browse Courses");
  }
  if (lowerResponse.includes("price") || lowerResponse.includes("plan")) {
    suggestions.push("View Pricing");
  }
  if (lowerResponse.includes("account") || lowerResponse.includes("login")) {
    suggestions.push("Account Help");
  }
  if (lowerResponse.includes("certificate")) {
    suggestions.push("My Certificates");
  }
  if (lowerResponse.includes("quiz") || lowerResponse.includes("assessment")) {
    suggestions.push("Take a Quiz");
  }
  if (lowerResponse.includes("instructor") || lowerResponse.includes("teach")) {
    suggestions.push("Become Instructor");
  }
  if (lowerResponse.includes("support") || lowerResponse.includes("help")) {
    suggestions.push("Contact Support");
  }

  if (suggestions.length === 0) {
    suggestions.push("Browse Courses", "View Pricing", "Account Help");
  }

  return suggestions.slice(0, 3);
}

export async function POST(request: Request) {
  try {
    const body: ChatRequest = await request.json();
    const { message, context } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required and must be a string" },
        { status: 400 }
      );
    }

    if (message.length > 1000) {
      return NextResponse.json(
        { error: "Message too long. Please keep it under 1000 characters." },
        { status: 400 }
      );
    }

    let systemMessage = SYSTEM_PROMPT;

    if (context?.courseName) {
      systemMessage += `\n\nThe user is currently viewing the course: "${context.courseName}". Tailor your response accordingly.`;
    }

    if (context?.currentPage) {
      systemMessage += `\n\nThe user is on the ${context.currentPage} page.`;
    }

    const response = await chatCompletion(
      [
        { role: "system", content: systemMessage },
        { role: "user", content: message },
      ],
      { temperature: 0.7, maxTokens: 512 }
    );

    const suggestions = generateSuggestions(response, context);

    return NextResponse.json({
      response,
      suggestions,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("AI Chat error:", error);
    return NextResponse.json(
      {
        response: "I'm having trouble connecting to my AI brain right now. Please try again in a moment, or contact support@smartlms.com if the issue persists.",
        suggestions: ["Contact Support", "Browse Courses"],
      },
      { status: 200 }
    );
  }
}
