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
  const baseDelay = 300;
  const perCharDelay = Math.min(response.length * 0.3, 500);
  return baseDelay + perCharDelay + Math.random() * 150;
};

const isGreeting = (input: string): boolean => {
  const patterns = [
    /^hi+$/i, /^hello+$/i, /^hey+$/i, /^howdy$/i, /^greetings$/i,
    /^good\s+(morning|afternoon|evening|day)$/i, /^sup$/i, /^yo$/i,
    /^what'?s\s+up$/i, /^hiya$/i, /^heya$/i, /^how'?s\s+it\s+going$/i,
    /^how\s+are\s+you$/i, /^how\s+are\s+ya$/i, /^how'?re\s+you$/i,
    /^you\s+there/i, /^is\s+anyone/i, /^anyone\s+there/i,
  ];
  return patterns.some((p) => p.test(input.trim()));
};

const isThanks = (input: string): boolean => {
  const patterns = [
    /thank(s| you)/i, /^thx$/i, /^appreciate/i, /^thanks\s+a\s+lot$/i,
    /^thank\s+you\s+so\s+much$/i, /^tysm$/i, /^ty$/i, /^cheers$/i,
    /^you'?re\s+the\s+best$/i, /^awesome\s+thanks$/i, /^nice/i,
    /^great/i, /^perfect/i, /^excellent/i, /^cool/i,
  ];
  return patterns.some((p) => p.test(input.trim()));
};

const isGoodbye = (input: string): boolean => {
  const patterns = [
    /^bye$/i, /^goodbye$/i, /^see\s+you/i, /^later$/i, /^catch\s+you\s+later$/i,
    /^take\s+care$/i, /^gotta\s+go$/i, /^i'?m\s+leaving$/i, /^farewell$/i,
    /^peace$/i, /^adios$/i, /^ciao$/i, /^gotta\s+run/i, /^talk\s+later/i,
  ];
  return patterns.some((p) => p.test(input.trim()));
};

const isHelpRequest = (input: string): boolean => {
  const patterns = [
    /^help$/i, /^what\s+can\s+you\s+do/i, /^what\s+do\s+you\s+know/i,
    /^what\s+are\s+you/i, /^who\s+are\s+you/i, /^tell\s+me\s+about\s+yourself/i,
    /^capabilities/i, /^features/i, /^what\s+topics/i, /^how\s+can\s+you\s+help/i,
    /^what\s+can\s+i\s+ask/i, /^options/i, /^menu/i,
  ];
  return patterns.some((p) => p.test(input.trim()));
};

interface SmartResponse {
  patterns: RegExp[];
  responses: string[];
  quickReplies?: string[];
  topic: string;
}

const smartResponses: SmartResponse[] = [
  // ===== COURSE-RELATED =====
  {
    patterns: [/what\s+courses|which\s+courses|course\s+catalog|courses?\s+do\s+you\s+have|list\s+of\s+courses|all\s+courses/i],
    responses: [
      "We have a wide range of courses across several categories:\n\n• **Web Development** - HTML, CSS, JavaScript, React, Node.js\n• **Data Science** - Python, Machine Learning, Statistics\n• **Mobile Development** - React Native, Flutter, iOS, Android\n• **Design** - UI/UX, Graphic Design, Figma\n• **Business** - Marketing, Finance, Leadership\n\nWould you like me to help you find something specific?",
      "Great question! Our catalog includes courses in:\n\n• Programming & Development\n• Data Science & AI\n• Design & Creative\n• Business & Marketing\n• Personal Development\n\nEach category has courses for all skill levels. What area interests you most?",
    ],
    quickReplies: ["View All Courses", "Free Courses", "Popular Courses"],
    topic: "courses",
  },
  {
    patterns: [/best\s+course|beginner|newbie|starting|first\s+course|recommend.*course|which.*start|what\s+should\s+i\s+learn/i],
    responses: [
      "For beginners, I'd recommend starting with:\n\n• **Introduction to Web Development** - Perfect first step into coding\n• **Python Fundamentals** - Great for data science or general programming\n• **UI/UX Design Basics** - No coding required, pure creativity\n• **Digital Marketing 101** - Business-focused and practical\n\nThese courses assume no prior knowledge and build a solid foundation. Would you like details on any of these?",
      "If you're just starting out, our beginner-friendly courses are designed to ease you in:\n\n• **Web Development Bootcamp** - Start building websites from scratch\n• **Python for Everyone** - Learn programming logic step by step\n• **Design Thinking** - Understand user-centered design\n\nAll include hands-on projects so you learn by doing. What sounds most interesting to you?",
    ],
    quickReplies: ["Web Dev Courses", "Python Courses", "Design Courses"],
    topic: "beginner-courses",
  },
  {
    patterns: [/how\s+long|duration|time.*commit|hours|weeks|month|when\s+does.*start|schedule/i],
    responses: [
      "Course durations vary based on depth:\n\n• **Short courses**: 2-4 hours (quick skills)\n• **Standard courses**: 10-20 hours (1-2 weeks at steady pace)\n• **Bootcamps**: 40-80 hours (1-2 months intensive)\n\nMost courses are self-paced, so you can take as long as you need. The average completion time is about 3 weeks with 30 minutes daily.",
      "It depends on the course level:\n\n• **Beginner courses**: Typically 8-15 hours\n• **Intermediate courses**: 15-30 hours\n• **Advanced courses**: 30-50 hours\n• **Specializations**: 50-100+ hours\n\nAll courses are self-paced — learn in a weekend or take your time over months!",
    ],
    topic: "course-duration",
  },
  {
    patterns: [/price|cost|how\s+much|fee|plan|subscription|pricing|afford|expensive|cheap|free|pay/i],
    responses: [
      "Our pricing is simple and flexible:\n\n• **Free Plan** - ₦0/month (50+ courses, basic features)\n• **Pro Plan** - ₦28,000/month or ₦264,000/year (all courses, certificates, priority support)\n• **Enterprise** - Custom pricing (team management, SSO, dedicated support)\n\nAll paid plans come with a 30-day money-back guarantee. Would you like to compare plans in detail?",
      "Here's what you get at each level:\n\n**Free (₦0):**\n• 50+ courses\n• Basic quizzes\n• Community access\n\n**Pro (₦28,000/month):**\n• All 500+ courses\n• AI-powered tools\n• Certificates\n• Priority support\n• Offline downloads\n\n**Enterprise:** Everything in Pro + team features, SSO, custom branding\n\nWould you like to start with the free plan or try Pro?",
    ],
    quickReplies: ["View Pricing Page", "Free Plan", "Pro Plan Details"],
    topic: "pricing",
  },
  {
    patterns: [/certif|credential|accredit|recogni|completion.*proof|diploma/i],
    responses: [
      "Yes! Here's what you get:\n\n• **Completion Certificate** - Automatically generated when you finish a course with 80%+ score\n• **Shareable Credentials** - Add to LinkedIn, resume, or portfolio\n• **Blockchain Verified** - Tamper-proof digital credentials\n• **Industry Recognized** - Many employers accept our certificates\n\nYour certificates are stored in your profile and can be downloaded as PDF anytime.",
      "Absolutely! When you complete a course:\n\n• You receive a **digital certificate** automatically\n• Certificates are **blockchain-verified** for authenticity\n• You can **share directly** to LinkedIn or Twitter\n• **Download as PDF** for offline use\n\nAll certificates include a unique verification URL employers can check.",
    ],
    topic: "certificates",
  },
  {
    patterns: [/register|sign\s*up|create.*account|join|how.*start|new\s+account/i],
    responses: [
      "Registering is quick and easy:\n\n1. Click **\"Sign Up\"** in the top right corner\n2. Enter your email and create a password\n3. Choose your interests (optional but helps personalize)\n4. Verify your email (we'll send a confirmation link)\n5. Start browsing courses immediately!\n\nYou can also sign up with Google or GitHub for one-click registration.",
      "Here's how to create your account:\n\n1. Visit our homepage and click **\"Get Started\"**\n2. Fill in your name, email, and password\n3. Or use **social login** (Google, GitHub)\n4. Confirm your email address\n5. You're in! Start exploring courses right away\n\nTakes less than a minute!",
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
    patterns: [/log\s*in|sign\s*in|login|how.*access.*account|can'?t\s+log\s+in/i],
    responses: [
      "Logging in is straightforward:\n\n1. Click **\"Log In\"** in the top navigation\n2. Enter your email and password\n3. Or use **social login** (Google, GitHub)\n4. You'll be taken to your dashboard\n\n**Tip**: Enable \"Remember Me\" to stay logged in. If you're having trouble, use \"Forgot Password\" to reset.",
      "To access your account:\n\n1. Click **\"Log In\"** at the top right\n2. Enter your credentials\n3. Or click the **Google/GitHub** icon for quick login\n4. You'll land on your personalized dashboard\n\nFor security, we recommend logging out on shared devices.",
    ],
    topic: "login",
  },
  {
    patterns: [/credit\s*card|debit|payment|pay\s+with|visa|mastercard|paypal|flutterwave|bank\s+transfer/i],
    responses: [
      "We accept payments through Flutterwave, which supports:\n\n• **Credit/Debit Cards** - Visa, Mastercard, Verve\n• **Bank Transfer** - Direct bank payments\n• **USSD** - Mobile banking\n• **Mobile Money** - Various providers\n\nAll payments are processed securely. We never store your card details on our servers.",
      "Yes, we accept all major payment methods:\n\n• **Cards**: Visa, Mastercard, Verve\n• **Bank Transfer**: Pay directly from your bank\n• **USSD**: Quick mobile payments\n• **Wallet**: Mobile money options\n\nPayments are encrypted end-to-end. Your financial data is safe with us!",
    ],
    topic: "payments",
  },
  {
    patterns: [/refund|money\s*back|cancel.*subscription|get\s+my\s+money|return/i],
    responses: [
      "We offer a **30-day money-back guarantee** on all purchases:\n\n• Full refund within 30 days of purchase\n• No questions asked\n• Refund processed within 3-5 business days\n• Access continues until refund date\n\nTo request a refund, go to **Settings → Billing → Request Refund** or contact support@smartlms.com.",
      "Your satisfaction matters! Here's our refund policy:\n\n• **30-day money-back guarantee** on all courses\n• **Monthly subscriptions**: Cancel anytime, prorated refund\n• **Annual plans**: Full refund within 30 days, prorated after\n\nRequest via **Settings → Billing** or email us directly. We process refunds within 3-5 business days.",
    ],
    topic: "refunds",
  },
  {
    patterns: [/free\s*trial|try\s+before|demo|test\s+drive|free\s+plan|try\s+free/i],
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
    patterns: [/browser|chrome|firefox|safari|edge|requirement|compatible|technical\s+requirement/i],
    responses: [
      "SmartLMS works great on all modern browsers:\n\n• **Chrome** 90+ (recommended)\n• **Firefox** 88+\n• **Safari** 14+\n• **Edge** 90+\n\nWe recommend keeping your browser updated for the best experience. We don't support Internet Explorer.",
    ],
    topic: "browser",
  },
  {
    patterns: [/internet\s*speed|bandwidth|connection|slow|lag|data\s+usage|wifi/i],
    responses: [
      "Minimum requirements for smooth learning:\n\n• **Broadband**: 5 Mbps for HD video\n• **Mobile**: 3 Mbps for standard quality\n• **Offline mode**: Download on Wi-Fi, learn anywhere\n• **Data usage**: ~500MB per hour of video\n\nSmartLMS automatically adjusts video quality based on your connection speed.",
    ],
    topic: "internet",
  },
  {
    patterns: [/live\s*class|live\s*session|webinar|zoom|real.?time|interactive.*session/i],
    responses: [
      "We offer live interactive sessions:\n\n• **Weekly workshops** - Hands-on learning with instructors\n• **Q&A sessions** - Get your questions answered live\n• **Study groups** - Collaborate with peers\n• **Expert AMAs** - Learn from industry professionals\n\nSessions are recorded if you can't attend live. Check the Live Classes schedule on your dashboard!",
    ],
    topic: "live-classes",
  },
  {
    patterns: [/instructor|teach|create.*course|build.*course|sell.*course|earn.*money|make.*money/i],
    responses: [
      "Becoming an instructor is easy:\n\n1. **Apply** - Submit your expertise and course idea\n2. **Create** - Use our AI Course Builder to structure content\n3. **Upload** - Add videos, quizzes, and resources\n4. **Publish** - We review within 48 hours\n5. **Earn** - Get paid monthly via bank transfer\n\nInstructors earn 70% revenue share. Top creators earn ₦5,000,000+/month!",
      "Want to teach on SmartLMS? Here's how:\n\n1. **Sign up as instructor** - Quick application process\n2. **Build your course** - AI-assisted course builder\n3. **Upload content** - Videos, docs, quizzes\n4. **Get approved** - Quality check in 24-48 hours\n5. **Start earning** - 70% revenue share\n\nWe provide marketing, hosting, and student support. You focus on creating great content!",
    ],
    quickReplies: ["Apply Now", "Instructor FAQ", "Revenue Calculator"],
    topic: "instructors",
  },
  {
    patterns: [/progress|track|analytics|dashboard|how.*doing|statistic|my\s+learning/i],
    responses: [
      "Your Dashboard gives you a complete learning overview:\n\n• **Completion rates** - See % done for each course\n• **Quiz scores** - Track your assessment results\n• **Learning streak** - Stay motivated with daily goals\n• **Time spent** - Know exactly how much you've learned\n• **Skill map** - Visualize your growing expertise\n\nAll data updates in real-time. You can also export your progress report!",
    ],
    topic: "progress",
  },
  {
    patterns: [/support|contact|help\s*desk|email|phone\s*number|reach\s*you|customer\s+service/i],
    responses: [
      "We're here to help! Reach us through:\n\n• **Email**: support@smartlms.com (24/7 response)\n• **Live Chat**: Click the chat icon (bottom right)\n• **Help Center**: help.smartlms.com\n• **Community Forum**: community.smartlms.com\n\nOur support team typically responds within 2 hours during business hours.",
    ],
    quickReplies: ["Email Support", "Help Center", "Community Forum"],
    topic: "support",
  },
  {
    patterns: [/ai\s*course\s*builder|ai.*feature|artificial\s*intelligence|machine\s*learning.*platform/i],
    responses: [
      "Our AI Course Builder is a game-changer!\n\n• **Auto-generate course outlines** from a topic description\n• **Smart content suggestions** based on learning objectives\n• **AI-powered quizzes** that adapt to difficulty levels\n• **Intelligent pacing** that adjusts to learner progress\n• **Auto-grading** with detailed feedback\n\nIt's like having a course creation assistant that does 80% of the work for you!",
    ],
    topic: "ai-features",
  },
  {
    patterns: [/privacy|data\s+protection|gdpr|security|my\s+data|information/i],
    responses: [
      "Your privacy and security are our top priority:\n\n• **End-to-end encryption** - All data is encrypted in transit and at rest\n• **GDPR compliant** - Full compliance with data protection regulations\n• **No data selling** - We never sell or share your personal data\n• **Regular audits** - Third-party security audits\n• **Two-factor authentication** - Available for all accounts\n\nYou can export or delete your data anytime from Settings → Privacy.",
    ],
    topic: "privacy",
  },
  {
    patterns: [/discount|coupon|promo|offer|deal|sale|reduce|save/i],
    responses: [
      "Great question! Here are ways to save:\n\n• **Annual Plan** - Save 21% compared to monthly (₦264,000/year vs ₦336,000/year)\n• **Student Discount** - 50% off Pro plan with valid student ID\n• **Group Discounts** - 20%+ off for teams of 5+\n• **Referral Program** - Earn credits for each friend you refer\n• **Seasonal Sales** - Watch for Black Friday and New Year deals\n\nFollow us on social media to stay updated on special promotions!",
    ],
    topic: "discounts",
  },
  {
    patterns: [/community|forum|group|discussion|connect|peers|other\s+students/i],
    responses: [
      "Our community is vibrant and supportive!\n\n• **Discussion Forums** - Ask questions, share insights\n• **Study Groups** - Form or join groups by topic\n• **Discord Server** - Real-time chat with 10,000+ members\n• **Weekly Challenges** - Compete and learn\n• **Mentorship Program** - Connect with experienced developers\n\nJoin our community at community.smartlms.com or our Discord server!",
    ],
    topic: "community",
  },
  {
    patterns: [/dark\s*mode|theme|appearance|light\s*mode|color/i],
    responses: [
      "We're working on dark mode! Currently, our interface uses a clean light theme that's easy on the eyes. Dark mode is one of our most requested features and is planned for a future update.\n\nIn the meantime, you can adjust your device's display settings or use your browser's built-in dark mode extension.",
    ],
    topic: "dark-mode",
  },
  {
    patterns: [/update|new\s+feature|changelog|what'?s\s+new|latest/i],
    responses: [
      "We're constantly improving SmartLMS! Here are some recent updates:\n\n• **AI Chatbot** - Smart assistant for instant help\n• **Voice Commands** - Navigate with your voice\n• **AI Quiz Generator** - Auto-generate quizzes from content\n• **Enhanced Dashboard** - Better progress tracking\n• **Live Classes** - Interactive video sessions\n\nWe release updates every 2 weeks. Follow our blog for the latest news!",
    ],
    topic: "updates",
  },
  {
    patterns: [/how\s+does\s+it\s+work|how\s+does\s+this\s+work|explain|tell\s+me\s+more|overview/i],
    responses: [
      "SmartLMS is an AI-powered learning platform that makes education interactive and personalized:\n\n1. **Browse** - Explore 500+ courses across various topics\n2. **Enroll** - Join courses for free or with Pro plan\n3. **Learn** - Watch video lessons, read materials, complete projects\n4. **Practice** - Take quizzes and assignments\n5. **Earn** - Get certified and track your progress\n\nOur AI personalizes your learning path based on your goals and pace. Want to know more about any specific feature?",
    ],
    topic: "how-it-works",
  },
  {
    patterns: [/what\s+is\s+smart\s*lms|about\s+smart\s*lms|about\s+this\s+platform|what\s+is\s+this/i],
    responses: [
      "SmartLMS is an AI-powered Learning Management System — a modern platform for online education. Think of it as a better alternative to traditional LMS platforms like Tutor LMS, LearnDash, or MasterStudy.\n\n**What makes us different:**\n• AI-powered personalized learning paths\n• Interactive quizzes with adaptive difficulty\n• Blockchain-verified certificates\n• Voice commands and AI chatbot support\n• Nigerian Naira pricing for local affordability\n\nWe're building the future of online education in Africa and beyond!",
    ],
    topic: "about-smartlms",
  },
  {
    patterns: [/who\s+is\s+this\s+for|is\s+this\s+for\s+me|who\s+should|target\s+audience/i],
    responses: [
      "SmartLMS is designed for everyone:\n\n• **Students** - Learn new skills at your own pace\n• **Professionals** - Upskill for career advancement\n• **Career Switchers** - Transition into tech with structured paths\n• **Entrepreneurs** - Learn business and marketing skills\n• **Instructors** - Create and sell courses\n• **Organizations** - Train your team with enterprise features\n\nWhether you're a complete beginner or an experienced professional, we have something for you!",
    ],
    topic: "target-audience",
  },
  {
    patterns: [/certificate\s+verify|verify\s+certificate|check\s+certificate|is.*certificate\s+valid/i],
    responses: [
      "You can verify any SmartLMS certificate:\n\n1. Visit our **Verify Certificate** page\n2. Enter the certificate ID (found on the certificate)\n3. Or scan the **QR code** on the certificate\n4. You'll see the verification result instantly\n\nAll certificates are blockchain-verified, making them tamper-proof and trustworthy for employers.",
    ],
    topic: "verify-certificate",
  },
  {
    patterns: [/enterprise|team|company|organization|business\s+plan|corporate/i],
    responses: [
      "Our Enterprise plan is perfect for teams and organizations:\n\n• **Team Management** - Enroll and track multiple users\n• **Custom Branding** - White-label the platform\n• **SSO Integration** - Single sign-on with your existing systems\n• **Dedicated Support** - Priority customer success manager\n• **Custom Courses** - Create internal training content\n• **Advanced Analytics** - Team-wide progress dashboards\n\nPricing is based on team size. Contact sales@smartlms.com for a custom quote!",
    ],
    topic: "enterprise",
  },
  {
    patterns: [/become\s+instructor|apply.*instructor|teach.*on|instructor.*apply/i],
    responses: [
      "Ready to share your knowledge? Here's how to become an instructor:\n\n1. Visit the **Become an Instructor** page\n2. Fill in your profile (expertise, experience, bio)\n3. Submit a course proposal\n4. Our team reviews within 48 hours\n5. Once approved, start creating your course\n\n**Instructor Benefits:**\n• 70% revenue share\n• Free marketing and promotion\n• Course creation tools with AI assistance\n• Analytics dashboard\n• Community of fellow instructors\n\nApply now at /become-instructor!",
    ],
    quickReplies: ["Apply Now", "Instructor FAQ"],
    topic: "become-instructor",
  },
  {
    patterns: [/nigeria|naira|ngn|local|african/i],
    responses: [
      "Yes! SmartLMS is built with African learners in mind:\n\n• **Nigerian Naira (₦)** - All prices in local currency\n• **Flutterwave payments** - Pay with local cards and bank transfers\n• **Relevant content** - Courses designed for the African market\n• **Local support** - Support team in your timezone\n• **Affordable pricing** - Plans starting from free\n\nWe're proudly African and building the best learning platform for our community!",
    ],
    topic: "nigeria",
  },
  {
    patterns: [/quiz\s+types|type\s+of\s+quiz|what.*quiz|quiz\s+format|question\s+types/i],
    responses: [
      "Our quizzes come in multiple formats:\n\n• **Multiple Choice** - Select the correct answer from options\n• **True/False** - Quick knowledge checks\n• **Fill in the Blank** - Type the answer\n• **Essay** - Open-ended responses (graded by instructor)\n• **Code Challenge** - Write and test code\n• **Adaptive Quizzes** - Difficulty adjusts based on your performance\n\nQuizzes provide instant feedback with explanations. Track your scores on the dashboard!",
    ],
    topic: "quiz-types",
  },
  {
    patterns: [/enrolled|enroll|enrollment|how\s+to\s+enroll|join\s+course|start\s+course/i],
    responses: [
      "Enrolling in a course is simple:\n\n1. Browse our **Course Catalog**\n2. Click on a course you're interested in\n3. Review the syllabus, reviews, and instructor info\n4. Click **\"Enroll Now\"** (free) or **\"Buy Now\"** (paid)\n5. For paid courses, complete the payment\n6. Start learning immediately!\n\nYou can also enroll via voice command: just say \"enroll in a course\"!",
    ],
    topic: "enrollment",
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
        "That's quite a detailed message! Let me help you with that.\n\nCould you break it down into a shorter question? That way I can give you the most accurate and helpful response.",
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
      response: `${personalizedGreeting} I'm the SmartLMS Assistant, and I'm here to help you with courses, quizzes, certificates, account questions, pricing, and more. What can I help you with today?`,
      quickReplies: ["Browse Courses", "View Pricing", "Account Help"],
      topic: "greeting",
    };
  }

  if (isHelpRequest(lowerMessage)) {
    return {
      response: "I'm the SmartLMS Assistant! Here's what I can help you with:\n\n📚 **Courses** - Browse, enroll, recommendations, durations\n💰 **Pricing** - Plans, payments, refunds, discounts\n🎓 **Certificates** - Earn, verify, share credentials\n📝 **Quizzes** - Types, formats, adaptive difficulty\n👤 **Account** - Registration, login, password reset\n👨‍🏫 **Instructors** - Teach, create courses, earn money\n🔧 **Technical** - Mobile, browsers, connectivity\n🔒 **Privacy** - Data protection, security\n💬 **Support** - Contact options, help center\n\nJust ask me anything!",
      quickReplies: ["Browse Courses", "View Pricing", "Contact Support"],
      topic: "help",
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

  // Context-aware follow-ups
  if (context.lastTopic && lowerMessage.split(" ").length <= 5) {
    const contextResponses: Record<string, { response: string; topic: string } | null> = {
      courses: {
        response: "Would you like me to tell you more about a specific course or category? I can recommend courses based on your interests or experience level.",
        topic: "courses-followup",
      },
      "beginner-courses": {
        response: "All our beginner courses include step-by-step tutorials, hands-on projects, and support from the community. Would you like a specific recommendation?",
        topic: "beginner-followup",
      },
      certificates: {
        response: "Certificates are automatic! Complete any course with 80%+ and you'll get yours instantly. Want to know about a specific course's certificate?",
        topic: "certificate-followup",
      },
      pricing: {
        response: "Our pricing is simple: Free tier (limited courses), Pro (₦28,000/month for everything), and Enterprise (custom). Want details on any of these?",
        topic: "payment-followup",
      },
      refunds: {
        response: "Our 30-day guarantee covers everything. Need help with a specific refund request?",
        topic: "refund-followup",
      },
      "ai-features": {
        response: "Our AI features include smart course recommendations, auto-generated quizzes, and learning analytics. Which one interests you?",
        topic: "ai-followup",
      },
      "verify-certificate": {
        response: "You can verify certificates at our Verify Certificate page. Do you have a specific certificate ID you'd like me to help with?",
        topic: "verify-followup",
      },
      enrollment: {
        response: "Would you like help finding a specific course to enroll in? I can recommend based on your interests and experience level.",
        topic: "enrollment-followup",
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

  // Gibberish detection
  const gibberishPatterns = [
    /^[a-z]{1,2}$/i,
    /^[^a-zA-Z0-9]+$/,
    /(.)\1{4,}/,
    /^[qwertyuiop]+$/i,
  ];

  const isGibberish =
    gibberishPatterns.some((p) => p.test(lowerMessage)) ||
    (lowerMessage.length < 4 && !/[aeiou]/i.test(lowerMessage));

  if (isGibberish) {
    return {
      response:
        "I'm not quite sure I understand that. Could you rephrase your question? I'm here to help with courses, quizzes, certificates, account issues, pricing, and more.",
      quickReplies: ["Browse Courses", "Account Help", "Contact Support"],
      topic: "gibberish",
    };
  }

  // Default: offer help with available topics
  return {
    response:
      "That's a great question! I'm focused on helping you with SmartLMS. Here's what I know about:\n\n• **Courses** - Browse, enroll, recommendations, categories\n• **Pricing** - Free plan, Pro (₦28,000/mo), Enterprise\n• **Certificates** - Earn, verify, share, blockchain\n• **Quizzes** - Types, adaptive difficulty, scoring\n• **Account** - Registration, login, password reset\n• **Instructors** - Teach, create, earn 70% revenue\n• **Privacy** - Data protection, GDPR, security\n• **Technical** - Mobile, browsers, connectivity\n• **Support** - Contact options, help center\n\nWhat would you like to know about?",
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
          "max-md:bottom-24",
          isOpen && "rotate-90"
        )}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
          "max-md:bottom-[180px] max-md:right-4 max-md:w-[calc(100vw-2rem)]",
          isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4 pointer-events-none"
        )}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
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
                {isTyping ? "Typing..." : "Online \u2022 Ready to help"}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white/80 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
            aria-label="Close chat"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
