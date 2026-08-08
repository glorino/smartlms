"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  quickReplies?: string[];
}

interface ConversationContext {
  lastTopic: string | null;
  messageCount: number;
  askedAbout: Set<string>;
}

const getTimeOfDay = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
};

const getTimeGreeting = (): string => {
  const time = getTimeOfDay();
  const greetings: Record<string, string[]> = {
    morning: ["Good morning", "Rise and shine", "Hello there"],
    afternoon: ["Good afternoon", "Hello", "Hi there"],
    evening: ["Good evening", "Hello", "Hi there"],
  };
  const options = greetings[time];
  return options[Math.floor(Math.random() * options.length)];
};

const getTypingDelay = (response: string): number => {
  const baseDelay = 400;
  const perCharDelay = Math.min(response.length * 0.5, 600);
  return baseDelay + perCharDelay + Math.random() * 200;
};

const isGreeting = (input: string): boolean => {
  const patterns = [
    /^hi+$/i, /^hello+$/i, /^hey+$/i, /^howdy$/i, /^greetings$/i,
    /^good\s+(morning|afternoon|evening|day)$/i, /^sup$/i, /^yo$/i,
    /^what'?s\s+up$/i, /^hiya$/i, /^heya$/i, /^how'?s\s+it\s+going$/i,
    /^how\s+are\s+you$/i, /^how\s+are\s+ya$/i, /^how'?re\s+you$/i,
  ];
  return patterns.some((p) => p.test(input.trim()));
};

const isThanks = (input: string): boolean => {
  const patterns = [
    /thank(s| you)/i, /^thx$/i, /^appreciate/i, /^thanks\s+a\s+lot$/i,
    /^thank\s+you\s+so\s+much$/i, /^tysm$/i, /^ty$/i, /^cheers$/i,
    /^you'?re\s+the\s+best$/i, /^awesome\s+thanks$/i,
  ];
  return patterns.some((p) => p.test(input.trim()));
};

const isGoodbye = (input: string): boolean => {
  const patterns = [
    /^bye$/i, /^goodbye$/i, /^see\s+you/i, /^later$/i, /^catch\s+you\s+later$/i,
    /^take\s+care$/i, /^gotta\s+go$/i, /^i'?m\s+leaving$/i, /^farewell$/i,
    /^peace$/i, /^adios$/i, /^ciao$/i,
  ];
  return patterns.some((p) => p.test(input.trim()));
};

const isQuestion = (input: string): boolean => {
  return /\?$/i.test(input.trim()) || /^(what|how|why|when|where|who|can|do|does|is|are|should|could|would|will)/i.test(input.trim());
};

interface SmartResponse {
  patterns: RegExp[];
  responses: string[];
  quickReplies?: string[];
  topic: string;
}

const smartResponses: SmartResponse[] = [
  {
    patterns: [/what\s+courses|which\s+courses|course\s+catalog|courses\s+do\s+you\s+have|list\s+of\s+courses/i],
    responses: [
      "We have a wide range of courses across several categories:\n\n• **Web Development** - HTML, CSS, JavaScript, React, Node.js\n• **Data Science** - Python, Machine Learning, Statistics\n• **Mobile Development** - React Native, Flutter, iOS, Android\n• **Design** - UI/UX, Graphic Design, Figma\n• **Business** - Marketing, Finance, Leadership\n\nWould you like me to help you find something specific?",
      "Great question! Our catalog includes courses in:\n\n• Programming & Development\n• Data Science & AI\n• Design & Creative\n• Business & Marketing\n• Personal Development\n\nEach category has courses for all skill levels. What area interests you most?",
    ],
    quickReplies: ["View All Courses", "Free Courses", "Popular Courses"],
    topic: "courses",
  },
  {
    patterns: [/best\s+course|beginner|newbie|starting|first\s+course|recommend.*course|which.*start/i],
    responses: [
      "For beginners, I'd recommend starting with:\n\n• **Introduction to Web Development** - Perfect first step into coding\n• **Python Fundamentals** - Great for data science or general programming\n• **UI/UX Design Basics** - No coding required, pure creativity\n• **Digital Marketing 101** - Business-focused and practical\n\nThese courses assume no prior knowledge and build a solid foundation. Would you like details on any of these?",
      "If you're just starting out, our beginner-friendly courses are designed to ease you in:\n\n• **Web Development Bootcamp** - Start building websites from scratch\n• **Python for Everyone** - Learn programming logic step by step\n• **Design Thinking** - Understand user-centered design\n\nAll include hands-on projects so you learn by doing. What sounds most interesting to you?",
    ],
    quickReplies: ["Web Dev Courses", "Python Courses", "Design Courses"],
    topic: "beginner-courses",
  },
  {
    patterns: [/how\s+long|duration|time.*commit|hours|weeks|month/i],
    responses: [
      "Course durations vary based on depth:\n\n• **Short courses**: 2-4 hours (quick skills)\n• **Standard courses**: 10-20 hours (1-2 weeks at steady pace)\n• **Bootcamps**: 40-80 hours (1-2 months intensive)\n\nMost courses are self-paced, so you can take as long as you need. The average completion time is about 3 weeks with 30 minutes daily.",
      "It depends on the course level:\n\n• **Beginner courses**: Typically 8-15 hours\n• **Intermediate courses**: 15-30 hours\n• **Advanced courses**: 30-50 hours\n• **Specializations**: 50-100+ hours\n\nAll courses are self-paced — learn in a weekend or take your time over months!",
    ],
    topic: "course-duration",
  },
  {
    patterns: [/certif|credential|accredit|recogni|completion.*proof/i],
    responses: [
      "Yes! Here's what you get:\n\n• **Completion Certificate** - Automatically generated when you finish a course with 80%+ score\n• **Shareable Credentials** - Add to LinkedIn, resume, or portfolio\n• **Blockchain Verified** - Tamper-proof digital credentials\n• **Industry Recognized** - Many employers accept our certificates\n\nYour certificates are stored in your profile and can be downloaded as PDF anytime.",
      "Absolutely! When you complete a course:\n\n• You receive a **digital certificate** automatically\n• Certificates are **blockchain-verified** for authenticity\n• You can **share directly** to LinkedIn or Twitter\n• **Download as PDF** for offline use\n\nAll certificates include a unique verification URL employers can check.",
    ],
    topic: "certificates",
  },
  {
    patterns: [/register|sign\s*up|create.*account|join|how.*start/i],
    responses: [
      "Registering is quick and easy:\n\n1. Click **\"Sign Up\"** in the top right corner\n2. Enter your email and create a password\n3. Choose your interests (optional but helps personalize)\n4. Verify your email (we'll send a confirmation link)\n5. Start browsing courses immediately!\n\nYou can also sign up with Google or GitHub for one-click registration.",
      "Here's how to create your account:\n\n1. Visit our homepage and click **\"Get Started\"**\n2. Fill in your name, email, and password\n3. Or use **social login** (Google, GitHub, Facebook)\n4. Confirm your email address\n5. You're in! Start exploring courses right away\n\nTakes less than a minute!",
    ],
    quickReplies: ["View Courses", "Free Plan", "Contact Support"],
    topic: "registration",
  },
  {
    patterns: [/forgot.*password|reset.*password|can'?t.*log.*in|lost.*password|password.*reset/i],
    responses: [
      "No worries, resetting your password is simple:\n\n1. Go to the **login page**\n2. Click **\"Forgot Password?\"**\n3. Enter your email address\n4. Check your inbox for the reset link (check spam too!)\n5. Click the link and create a new password\n\nIf you don't receive the email within 5 minutes, contact support at support@smartlms.com.",
      "Here's how to reset your password:\n\n1. Click **\"Log In\"** → **\"Forgot Password\"**\n2. Enter your registered email\n3. We'll send a reset link within seconds\n4. Click the link and set a new password\n\n**Tip**: Make sure to check your spam/junk folder if you don't see it!",
    ],
    quickReplies: ["Contact Support", "Login Page"],
    topic: "password-reset",
  },
  {
    patterns: [/log\s*in|sign\s*in|login|how.*access.*account/i],
    responses: [
      "Logging in is straightforward:\n\n1. Click **\"Log In\"** in the top navigation\n2. Enter your email and password\n3. Or use **social login** (Google, GitHub)\n4. You'll be taken to your dashboard\n\n**Tip**: Enable \"Remember Me\" to stay logged in. If you're having trouble, use \"Forgot Password\" to reset.",
      "To access your account:\n\n1. Click **\"Log In\"** at the top right\n2. Enter your credentials\n3. Or click the **Google/GitHub** icon for quick login\n4. You'll land on your personalized dashboard\n\nFor security, we recommend logging out on shared devices.",
    ],
    topic: "login",
  },
  {
    patterns: [/credit\s*card|debit|payment|pay\s+with|visa|mastercard|paypal|stripe/i],
    responses: [
      "We accept a wide range of payment methods:\n\n• **Credit/Debit Cards** - Visa, Mastercard, American Express\n• **Digital Wallets** - PayPal, Apple Pay, Google Pay\n• **Bank Transfer** - For annual plans\n• **Crypto** - Bitcoin and Ethereum (via Coinbase)\n\nAll payments are processed securely through Stripe. We never store your card details on our servers.",
      "Yes, we accept all major payment methods:\n\n• **Cards**: Visa, Mastercard, Amex, Discover\n• **Wallets**: PayPal, Apple Pay, Google Pay\n• **Other**: Bank transfer, cryptocurrency\n\nPayments are PCI-DSS compliant and encrypted end-to-end. Your financial data is safe with us!",
    ],
    topic: "payments",
  },
  {
    patterns: [/refund|money\s*back|cancel.*subscription|get\s+my\s+money/i],
    responses: [
      "We offer a **30-day money-back guarantee** on all purchases:\n\n• Full refund within 30 days of purchase\n• No questions asked\n• Refund processed within 3-5 business days\n• Access continues until refund date\n\nTo request a refund, go to **Settings → Billing → Request Refund** or contact support@smartlms.com.",
      "Your satisfaction matters! Here's our refund policy:\n\n• **30-day money-back guarantee** on all courses\n• **Monthly subscriptions**: Cancel anytime, prorated refund\n• **Annual plans**: Full refund within 30 days, prorated after\n\nRequest via **Settings → Billing** or email us directly. We process refunds within 3-5 business days.",
    ],
    topic: "refunds",
  },
  {
    patterns: [/free\s*trial|try\s+before|demo|test\s+drive|free\s+plan/i],
    responses: [
      "Yes! We have great free options:\n\n• **Free Plan** - Access to 50+ courses at no cost forever\n• **7-Day Pro Trial** - Full access to all courses, cancel anytime\n• **Course Previews** - Watch first lesson of any course for free\n\nThe Free Plan includes quizzes, certificates for completed courses, and community access. No credit card needed!",
      "Absolutely! Here's what's free:\n\n• **Free Tier**: 50+ courses, quizzes, and certificates\n• **7-Day Pro Trial**: Full library access, no commitment\n• **Sample Lessons**: Preview any course before enrolling\n\nStart with the Free Plan — upgrade only if you want premium courses. No credit card required!",
    ],
    quickReplies: ["View Pricing", "Free Plan", "Pro Plan"],
    topic: "free-trial",
  },
  {
    patterns: [/mobile\s*app|phone|tablet|android|ios|app\s*store/i],
    responses: [
      "Our platform is fully responsive and works great on mobile devices!\n\n• **No app needed** - Works perfectly in your mobile browser\n• **Offline mode** - Download lessons for offline viewing\n• **Push notifications** - Get reminders for deadlines\n• **Touch-friendly** - Optimized for touchscreen learning\n\nWe're developing native apps for iOS and Android, launching soon!",
      "Great news — SmartLMS works beautifully on mobile!\n\n• **Responsive web app** - Access from any phone or tablet browser\n• **Offline downloads** - Save lessons for when you're offline\n• **Mobile-optimized** - Videos and quizzes work on touch screens\n\nA dedicated mobile app is coming soon. For now, bookmark our site on your phone's home screen!",
    ],
    topic: "mobile",
  },
  {
    patterns: [/browser|chrome|firefox|safari|edge|requirement|compatible/i],
    responses: [
      "SmartLMS works great on all modern browsers:\n\n• **Chrome** 90+ (recommended)\n• **Firefox** 88+\n• **Safari** 14+\n• **Edge** 90+\n\nWe recommend keeping your browser updated for the best experience. We don't support Internet Explorer.",
      "We support all major modern browsers:\n\n• **Chrome**, **Firefox**, **Safari**, **Edge**\n• **Opera** and **Brave** also work well\n• Mobile browsers on iOS and Android\n\nFor the best experience, use the latest version of Chrome or Firefox. Avoid Internet Explorer.",
    ],
    topic: "browser",
  },
  {
    patterns: [/internet\s*speed|bandwidth|connection|slow|lag|data\s+usage/i],
    responses: [
      "Minimum requirements for smooth learning:\n\n• **Broadband**: 5 Mbps for HD video\n• **Mobile**: 3 Mbps for standard quality\n• **Offline mode**: Download on Wi-Fi, learn anywhere\n• **Data usage**: ~500MB per hour of video\n\nSmartLMS automatically adjusts video quality based on your connection speed.",
      "Here's what you need:\n\n• **Minimum**: 3 Mbps (SD video)\n• **Recommended**: 5+ Mbps (HD video)\n• **Mobile**: 3G or better works\n• **Data**: ~300-500MB per hour\n\nOur adaptive streaming adjusts quality to match your connection. You can also download content on Wi-Fi for offline viewing.",
    ],
    topic: "internet",
  },
  {
    patterns: [/ai\s*course\s*builder|ai.*feature|artificial\s*intelligence|machine\s*learning.*platform/i],
    responses: [
      "Our AI Course Builder is a game-changer!\n\n• **Auto-generate course outlines** from a topic description\n• **Smart content suggestions** based on learning objectives\n• **AI-powered quizzes** that adapt to difficulty levels\n• **Intelligent pacing** that adjusts to learner progress\n• **Auto-grading** with detailed feedback\n\nIt's like having a course creation assistant that does 80% of the work for you!",
      "AI is at the core of SmartLMS:\n\n• **Course Builder AI** - Generates outlines and content structure\n• **Adaptive Quizzes** - Questions adjust to your skill level\n• **Smart Recommendations** - Personalized course suggestions\n• **Auto-grading** - Instant feedback on assignments\n• **Learning Analytics** - AI insights on your progress\n\nIt makes learning more efficient and course creation much faster.",
    ],
    topic: "ai-features",
  },
  {
    patterns: [/ai\s*quiz|quiz.*generat|auto.*quiz|smart.*quiz/i],
    responses: [
      "Our AI Quiz Generator is powerful:\n\n• **Auto-generate questions** from any course material\n• **Multiple question types** - MCQ, true/false, fill-in-the-blank\n• **Adaptive difficulty** - Gets harder as you improve\n• **Instant feedback** with explanations\n• **Performance tracking** - See where you need improvement\n\nInstructors can create entire quiz banks in minutes instead of hours!",
      "AI-powered quizzes take learning to the next level:\n\n• **Generate from content** - Quizzes created from your lessons\n• **Smart adaptation** - Difficulty adjusts to your level\n• **Spaced repetition** - Reviews concepts at optimal intervals\n• **Detailed analytics** - Track knowledge gaps\n• **Exportable** - Download quizzes as PDF\n\nIt's like having a personal tutor creating practice tests just for you.",
    ],
    topic: "ai-quizzes",
  },
  {
    patterns: [/ai\s*certificate|certificate.*generat|auto.*certificate|smart.*certificate/i],
    responses: [
      "AI Certificates offer smart credentialing:\n\n• **Auto-generated** when you complete requirements\n• **Blockchain verified** for tamper-proof authenticity\n• **Skills-based** - Shows specific competencies mastered\n• **Shareable** - One-click sharing to LinkedIn\n• **Verifiable** - Unique URL for employers to verify\n• **Beautifully designed** - Professional templates\n\nThey're more than just a PDF — they're proof of real skills!",
      "Our AI Certificate system is next-level:\n\n• **Automatic generation** upon course completion\n• **Skills taxonomy** - Lists exactly what you learned\n• **Blockchain verification** - Unhackable proof of achievement\n• **LinkedIn integration** - Share with one click\n• **Employer verification** - Unique URL for validation\n• **Digital wallet** - Store all certificates in one place",
    ],
    topic: "ai-certificates",
  },
  {
    patterns: [/screen\s*reader|accessib|wcag|ada\s+compliant|blind|visually\s+impaired/i],
    responses: [
      "Accessibility is a priority for us:\n\n• **Screen reader compatible** - Full ARIA labels throughout\n• **Keyboard navigation** - Tab through all elements\n• **High contrast mode** - For low vision users\n• **Text resizing** - Up to 200% zoom support\n• **Alt text** - All images have descriptive text\n• **Captions** - Video content includes subtitles\n\nWe follow WCAG 2.1 AA standards. Contact us for specific accommodation needs.",
      "We're committed to accessibility:\n\n• **WCAG 2.1 AA compliant** - Industry standard\n• **Screen reader support** - Works with NVDA, JAWS, VoiceOver\n• **Full keyboard navigation** - No mouse required\n• **Adjustable text** - Resize without breaking layout\n• **Video captions** - All video content subtitled\n• **Alternative text** - Descriptive text for all images\n\nIf you need additional accommodations, we're here to help!",
    ],
    topic: "accessibility",
  },
  {
    patterns: [/keyboard\s*nav|keyboard.*shortcuts|tab.*through|hotkey/i],
    responses: [
      "Keyboard navigation is fully supported:\n\n• **Tab** - Move between interactive elements\n• **Enter/Space** - Activate buttons and links\n• **Arrow keys** - Navigate menus and lists\n• **Escape** - Close modals and dropdowns\n• **Ctrl+/** - Open keyboard shortcuts panel\n\nAll features are accessible without a mouse. We test regularly with keyboard-only users.",
      "Yes! Full keyboard support:\n\n• **Tab / Shift+Tab** - Navigate forward/backward\n• **Enter** - Activate buttons\n• **Arrow keys** - Navigate within components\n• **Escape** - Close dialogs\n• **Ctrl+K** - Quick search\n• **?** - Show all shortcuts\n\nEvery feature works with keyboard alone. No mouse needed!",
    ],
    topic: "keyboard",
  },
  {
    patterns: [/live\s*class|live\s*session|webinar|zoom|real.?time|interactive.*session/i],
    responses: [
      "We offer live interactive sessions:\n\n• **Weekly workshops** - Hands-on learning with instructors\n• **Q&A sessions** - Get your questions answered live\n• **Study groups** - Collaborate with peers\n• **Expert AMAs** - Learn from industry professionals\n\nSessions are recorded if you can't attend live. Check the Live Classes schedule on your dashboard!",
      "Our Live Classes feature is fantastic:\n\n• **Real-time interaction** with instructors\n• **Screen sharing** for live coding demos\n• **Breakout rooms** for group work\n• **Chat and Q&A** during sessions\n• **Recordings available** if you miss it\n\nAll sessions are included free with Pro membership!",
    ],
    topic: "live-classes",
  },
  {
    patterns: [/instructor|teach|create.*course|build.*course|sell.*course|earn.*money/i],
    responses: [
      "Becoming an instructor is easy:\n\n1. **Apply** - Submit your expertise and course idea\n2. **Create** - Use our AI Course Builder to structure content\n3. **Upload** - Add videos, quizzes, and resources\n4. **Publish** - We review within 48 hours\n5. **Earn** - Get paid monthly via PayPal or bank transfer\n\nInstructors earn 70% revenue share. Top creators earn ₦5,000,000+/month!",
      "Want to teach on SmartLMS? Here's how:\n\n1. **Sign up as instructor** - Quick application process\n2. **Build your course** - AI-assisted course builder\n3. **Upload content** - Videos, docs, quizzes\n4. **Get approved** - Quality check in 24-48 hours\n5. **Start earning** - 70% revenue share\n\nWe provide marketing, hosting, and student support. You focus on creating great content!",
    ],
    quickReplies: ["Apply Now", "Instructor FAQ", "Revenue Calculator"],
    topic: "instructors",
  },
  {
    patterns: [/progress|track|analytics|dashboard|how.*doing|statistic/i],
    responses: [
      "Your Dashboard gives you a complete learning overview:\n\n• **Completion rates** - See % done for each course\n• **Quiz scores** - Track your assessment results\n• **Learning streak** - Stay motivated with daily goals\n• **Time spent** - Know exactly how much you've learned\n• **Skill map** - Visualize your growing expertise\n\nAll data updates in real-time. You can also export your progress report!",
      "Track your progress easily:\n\n• **Dashboard** - Overview of all learning activity\n• **Course progress** - Percentage complete per course\n• **Quiz analytics** - Scores and improvement over time\n• **Learning streak** - Daily/weekly consistency tracker\n• **Goals** - Set and monitor personal targets\n• **Export** - Download progress reports as PDF",
    ],
    topic: "progress",
  },
  {
    patterns: [/support|contact|help\s*desk|email|phone\s*number|reach\s*you/i],
    responses: [
      "We're here to help! Reach us through:\n\n• **Email**: support@smartlms.com (24/7 response)\n• **Live Chat**: Click the chat icon (bottom right)\n• **Help Center**: help.smartlms.com\n• **Community Forum**: community.smartlms.com\n\nOur support team typically responds within 2 hours during business hours.",
      "Our support channels:\n\n• **Email**: support@smartlms.com\n• **In-app chat**: Available 24/7\n• **Help Center**: Self-service articles and FAQs\n• **Community**: Peer support from other learners\n\nFor urgent issues, email is fastest. We usually reply within 1-2 hours!",
    ],
    quickReplies: ["Email Support", "Help Center", "Community Forum"],
    topic: "support",
  },
];

function getSmartResponse(
  message: string,
  context: ConversationContext
): { response: string; quickReplies?: string[]; topic: string } {
  const lowerMessage = message.toLowerCase().trim();

  if (!lowerMessage) {
    return {
      response: "Please type a message and I'll do my best to help!",
      topic: "empty",
    };
  }

  if (lowerMessage.length > 500) {
    return {
      response:
        "That's quite a detailed message! Let me help you with that.\n\nCould you break it down into a shorter question? That way I can give you the most accurate and helpful response. What's the main thing you'd like to know?",
      topic: "long-message",
    };
  }

  if (isGreeting(lowerMessage)) {
    const greeting = getTimeGreeting();
    const time = getTimeOfDay();
    const personalizedGreeting =
      time === "morning"
        ? `${greeting}! I hope you're having a great start to your day.`
        : time === "afternoon"
          ? `${greeting}! Hope your day is going well.`
          : `${greeting}! Hope you're having a relaxing evening.`;

    return {
      response: `${personalizedGreeting} I'm the SmartLMS Assistant, and I'm here to help you with courses, quizzes, certificates, account questions, and more. What can I help you with today?`,
      quickReplies: ["Browse Courses", "View Pricing", "Contact Support"],
      topic: "greeting",
    };
  }

  if (isThanks(lowerMessage)) {
    const thankResponses = [
      "You're welcome! I'm happy to help. Is there anything else you'd like to know?",
      "Glad I could help! Feel free to ask if you have any other questions.",
      "No problem at all! Is there anything else I can assist you with?",
      "My pleasure! Let me know if you need help with anything else.",
      "Happy to help! Don't hesitate to ask if more questions come up.",
    ];
    return {
      response: thankResponses[Math.floor(Math.random() * thankResponses.length)],
      topic: "thanks",
    };
  }

  if (isGoodbye(lowerMessage)) {
    const byeResponses = [
      "Goodbye! Thanks for chatting. Have a wonderful day and happy learning!",
      "See you later! Feel free to come back anytime you need help. Take care!",
      "Bye! Wishing you all the best on your learning journey. Come back soon!",
      "Farewell! Remember, I'm always here if you need help. Happy learning!",
    ];
    return {
      response: byeResponses[Math.floor(Math.random() * byeResponses.length)],
      topic: "goodbye",
    };
  }

  // Context-aware: if we have a last topic and the message is short/ambiguous
  if (context.lastTopic && lowerMessage.split(" ").length <= 5) {
    const contextResponses: Record<string, { response: string; topic: string } | null> = {
      courses: {
        response:
          "Would you like me to tell you more about a specific course or category? I can recommend courses based on your interests or experience level.",
        topic: "courses-followup",
      },
      "beginner-courses": {
        response:
          "All our beginner courses include step-by-step tutorials, hands-on projects, and support from the community. Would you like a specific recommendation?",
        topic: "beginner-followup",
      },
      certificates: {
        response:
          "Certificates are automatic! Complete any course with 80%+ and you'll get yours instantly. Want to know about a specific course's certificate?",
        topic: "certificate-followup",
      },
      payments: {
        response:
          "Our pricing is simple: Free tier (limited courses), Pro (₦28,000/month for everything), and Enterprise (custom). Want details on any of these?",
        topic: "payment-followup",
      },
      refunds: {
        response:
          "Our 30-day guarantee covers everything. Need help with a specific refund request?",
        topic: "refund-followup",
      },
      "ai-features": {
        response:
          "Our AI features include smart course recommendations, auto-generated quizzes, and learning analytics. Which one interests you?",
        topic: "ai-followup",
      },
    };

    const contextResponse = contextResponses[context.lastTopic];
    if (contextResponse) {
      return { ...contextResponse, quickReplies: undefined };
    }
  }

  // Check against all smart response patterns
  for (const entry of smartResponses) {
    for (const pattern of entry.patterns) {
      if (pattern.test(lowerMessage)) {
        const response =
          entry.responses[Math.floor(Math.random() * entry.responses.length)];
        return {
          response,
          quickReplies: entry.quickReplies,
          topic: entry.topic,
        };
      }
    }
  }

  // Gibberish detection: very short, no vowels, mostly special chars
  const gibberishPatterns = [
    /^[a-z]{1,2}$/i, // single/double letters only
    /^[^a-zA-Z0-9]+$/, // all special characters
    /(.)\1{4,}/, // same char repeated 5+ times
    /^[qwertyuiop]+$/i, // keyboard mashing
  ];

  const isGibberish =
    gibberishPatterns.some((p) => p.test(lowerMessage)) ||
    (lowerMessage.length < 4 && !/[aeiou]/i.test(lowerMessage));

  if (isGibberish) {
    return {
      response:
        "I'm not quite sure I understand that. Could you rephrase your question? I'm here to help with courses, quizzes, certificates, account issues, and more.",
      quickReplies: ["Browse Courses", "Account Help", "Contact Support"],
      topic: "gibberish",
    };
  }

  // Default: offer help with available topics
  return {
    response:
      "I'm focused on helping you with SmartLMS! Here's what I can assist with:\n\n• **Courses** - Browse, enroll, and recommendations\n• **Quizzes** - Take quizzes and track performance\n• **Certificates** - View and download your credentials\n• **Account** - Registration, login, password help\n• **Pricing** - Plans, payments, and refunds\n• **AI Features** - Smart tools for learning\n• **Technical** - Mobile, browser, and connectivity\n\nWhat would you like to know about?",
    quickReplies: ["Browse Courses", "View Pricing", "Account Help"],
    topic: "default",
  };
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      <div className="flex gap-1">
        <span
          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: "0ms" }}
        />
        <span
          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: "150ms" }}
        />
        <span
          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: "300ms" }}
        />
      </div>
    </div>
  );
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm the SmartLMS Assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
      quickReplies: ["Browse Courses", "View Pricing", "Account Help"],
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [context, setContext] = useState<ConversationContext>({
    lastTopic: null,
    messageCount: 0,
    askedAbout: new Set(),
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleQuickReply = useCallback(
    async (reply: string) => {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: reply,
        sender: "user",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsTyping(true);

      const result = getSmartResponse(reply, context);
      const delay = getTypingDelay(result.response);
      await new Promise((resolve) => setTimeout(resolve, delay));

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: result.response,
        sender: "bot",
        timestamp: new Date(),
        quickReplies: result.quickReplies,
      };

      setContext((prev) => ({
        ...prev,
        lastTopic: result.topic,
        messageCount: prev.messageCount + 1,
        askedAbout: new Set([...prev.askedAbout, result.topic]),
      }));

      setIsTyping(false);
      setMessages((prev) => [...prev, botResponse]);
    },
    [context]
  );

  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    const result = getSmartResponse(userMessage.text, context);
    const delay = getTypingDelay(result.response);
    await new Promise((resolve) => setTimeout(resolve, delay));

    const botResponse: Message = {
      id: (Date.now() + 1).toString(),
      text: result.response,
      sender: "bot",
      timestamp: new Date(),
      quickReplies: result.quickReplies,
    };

    setContext((prev) => ({
      ...prev,
      lastTopic: result.topic,
      messageCount: prev.messageCount + 1,
      askedAbout: new Set([...prev.askedAbout, result.topic]),
    }));

    setIsTyping(false);
    setMessages((prev) => [...prev, botResponse]);
  }, [inputValue, isTyping, context]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg",
          "bg-gradient-to-r from-indigo-500 to-purple-600",
          "flex items-center justify-center text-white",
          "hover:shadow-xl hover:scale-110 transition-all duration-300",
          "focus:outline-none focus:ring-4 focus:ring-indigo-300",
          isOpen && "rotate-90"
        )}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      <div
        className={cn(
          "fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)]",
          "bg-white rounded-2xl shadow-2xl border border-gray-100",
          "flex flex-col overflow-hidden",
          "transition-all duration-300 origin-bottom-right",
          isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4 pointer-events-none"
        )}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white"
              >
                <path d="M12 8V4H8" />
                <rect width="16" height="12" x="4" y="8" rx="2" />
                <path d="M2 14h2" />
                <path d="M20 14h2" />
                <path d="M15 13v2" />
                <path d="M9 13v2" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-semibold">SmartLMS Assistant</h3>
              <p className="text-white/80 text-xs">
                {isTyping ? "Typing..." : "Online • Ready to help"}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white/80 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
            aria-label="Close chat"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[350px] bg-gray-50/50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex flex-col gap-2",
                message.sender === "user" ? "items-end" : "items-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line",
                  message.sender === "user"
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-br-md"
                    : "bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-md"
                )}
              >
                {message.text}
              </div>
              {message.sender === "bot" &&
                message.quickReplies &&
                message.quickReplies.length > 0 &&
                !isTyping && (
                  <div className="flex flex-wrap gap-2 px-1">
                    {message.quickReplies.map((reply) => (
                      <button
                        key={reply}
                        onClick={() => handleQuickReply(reply)}
                        className="px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-full hover:bg-indigo-100 transition-colors border border-indigo-200"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                )}
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white shadow-sm border border-gray-100 rounded-2xl rounded-bl-md">
                <TypingIndicator />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-gray-100">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              disabled={isTyping}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200",
                inputValue.trim() && !isTyping
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg hover:scale-105"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              )}
              aria-label="Send message"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m22 2-7 20-4-9-9-4Z" />
                <path d="M22 2 11 13" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}