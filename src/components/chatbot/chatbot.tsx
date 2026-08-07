"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const smartResponses: { keywords: string[]; response: string }[] = [
  {
    keywords: ["enroll", "enrollment", "sign up", "register", "course"],
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
      "We offer flexible pricing plans: Free (limited courses), Pro ($19/month for all courses), and Enterprise (custom pricing for teams). Check our Pricing page for full details.",
  },
  {
    keywords: ["contact", "support", "help", "assist"],
    response:
      "You can reach our support team at support@smartlms.com. We're available 24/7 to help with any questions about courses, account issues, or technical problems.",
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
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate bot thinking time
    await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 700));

    const botResponse: Message = {
      id: (Date.now() + 1).toString(),
      text: getSmartResponse(userMessage.text),
      sender: "bot",
      timestamp: new Date(),
    };

    setIsTyping(false);
    setMessages((prev) => [...prev, botResponse]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

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
              <p className="text-white/80 text-xs">Online • Ready to help</p>
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
                "flex",
                message.sender === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed",
                  message.sender === "user"
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-br-md"
                    : "bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-md"
                )}
              >
                {message.text}
              </div>
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
              onKeyPress={handleKeyPress}
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
