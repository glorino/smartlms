import { NextResponse } from "next/server";
import { SITE_CONFIG } from "@/lib/constants";

interface ChatRequest {
  message: string;
}

const smartResponses: { keywords: string[]; response: string }[] = [
  {
    keywords: ["enroll", "enrollment", "sign up", "register"],
    response:
      "To enroll in a course, browse our Courses page, select a course you're interested in, and click the 'Enroll Now' button. You can choose from free courses or premium options with flexible pricing plans.",
  },
  {
    keywords: ["quiz", "test", "exam", "assessment"],
    response:
      "Taking a quiz is easy! Navigate to the Quiz section from the sidebar or course page. Select a quiz, and you'll be guided through multiple-choice questions. Results are available immediately after submission.",
  },
  {
    keywords: ["certificate", "certification", "credential"],
    response:
      "Certificates are automatically generated when you complete a course with a passing score. Visit the Certificates section to view, download, or share your earned certificates.",
  },
  {
    keywords: ["price", "pricing", "cost", "plan", "subscription"],
    response:
      "We offer flexible pricing plans: Free (limited courses), Pro (₦28,000/month for all courses), and Enterprise (custom pricing for teams). Check our Pricing page for full details.",
  },
  {
    keywords: ["contact", "support", "help", "assist"],
    response:
      `You can reach our support team at ${SITE_CONFIG.contact.email}. We're available 24/7 to help with any questions about courses, account issues, or technical problems.`,
  },
  {
    keywords: ["live", "class", "stream", "real-time", "session"],
    response:
      "Our Live Classes feature offers real-time interactive sessions with instructors. Check the Live Classes section for upcoming sessions and join with just one click.",
  },
  {
    keywords: ["course", "catalog", "browse", "find"],
    response:
      "Explore our course catalog on the Courses page. Filter by category, difficulty level, or popularity. Each course includes video lessons, quizzes, and downloadable resources.",
  },
  {
    keywords: ["progress", "track", "analytics", "dashboard"],
    response:
      "Track your learning progress on the Dashboard. View completion rates, quiz scores, and learning streaks. Detailed analytics help you stay on top of your goals.",
  },
  {
    keywords: ["instructor", "teach", "create", "build"],
    response:
      "Instructors can create courses using our intuitive Course Builder. Upload videos, add quizzes, and publish to reach thousands of learners worldwide.",
  },
  {
    keywords: ["hello", "hi", "hey", "greetings"],
    response:
      "Hello! Welcome to SmartLMS. I'm here to help you navigate our platform. What would you like to know about?",
  },
];

function getSmartResponse(message: string): string {
  const lowerMessage = message.toLowerCase();

  for (const entry of smartResponses) {
    if (entry.keywords.some((keyword) => lowerMessage.includes(keyword))) {
      return entry.response;
    }
  }

  return "I can help you with courses, quizzes, certificates, pricing, and more. What would you like to know?";
}

async function getAIResponse(message: string): Promise<string | null> {
  const openaiKey = process.env.OPENAI_API_KEY;
  if (!openaiKey || openaiKey === "sk_placeholder") {
    return null;
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openaiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are SmartLMS Assistant, a helpful AI for an online learning platform. Help users with courses, quizzes, certificates, payments, and platform features. Be friendly and concise. Use Nigerian Naira (\u20a6) for prices.",
          },
          { role: "user", content: message },
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    if (data.choices?.[0]?.message?.content) {
      return data.choices[0].message.content;
    }
    return null;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const body: ChatRequest = await request.json();

    if (!body.message || typeof body.message !== "string") {
      return NextResponse.json(
        { error: "Message is required and must be a string" },
        { status: 400 }
      );
    }

    const aiResponse = await getAIResponse(body.message);
    const response = aiResponse || getSmartResponse(body.message);

    return NextResponse.json({
      response,
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
