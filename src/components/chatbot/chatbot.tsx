"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { SITE_CONFIG } from "@/lib/constants";
import { ThumbsUp, ThumbsDown } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  quickReplies?: string[];
  rating?: "up" | "down" | null;
}

const getTypingDelay = (response: string): number => {
  const baseDelay = 500;
  const perCharDelay = Math.min(response.length * 0.2, 300);
  return baseDelay + perCharDelay + Math.random() * 100;
};

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
      text: "Hello! I'm the SmartLMS AI Assistant. I can help you with courses, pricing, account issues, learning tips, and much more. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
      quickReplies: ["Browse Courses", "View Pricing", "Account Help"],
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  useEffect(() => {
    const handler = () => setIsOpen(true);
    window.addEventListener("smartlms:open-chat", handler);
    return () => window.removeEventListener("smartlms:open-chat", handler);
  }, []);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const fetchAIResponse = async (message: string): Promise<{ response: string; suggestions: string[] }> => {
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (!res.ok) {
        throw new Error("Failed to get AI response");
      }

      const data = await res.json();
      return {
        response: data.response,
        suggestions: data.suggestions || [],
      };
    } catch (error) {
      console.error("AI chat error:", error);
      return {
        response: `I'm having trouble connecting right now. Please try again in a moment, or contact ${SITE_CONFIG.contact.email} for assistance.`,
        suggestions: ["Contact Support"],
      };
    }
  };

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

      const { response, suggestions } = await fetchAIResponse(reply);
      const delay = getTypingDelay(response);
      await new Promise((resolve) => setTimeout(resolve, delay));

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: "bot",
        timestamp: new Date(),
        quickReplies: suggestions.length > 0 ? suggestions : undefined,
        rating: null,
      };

      setIsTyping(false);
      setMessages((prev) => [...prev, botResponse]);
    },
    []
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

    const { response, suggestions } = await fetchAIResponse(userMessage.text);
    const delay = getTypingDelay(response);
    await new Promise((resolve) => setTimeout(resolve, delay));

    const botResponse: Message = {
      id: (Date.now() + 1).toString(),
      text: response,
      sender: "bot",
      timestamp: new Date(),
      quickReplies: suggestions.length > 0 ? suggestions : undefined,
      rating: null,
    };

    setIsTyping(false);
    setMessages((prev) => [...prev, botResponse]);
  }, [inputValue, isTyping]);

  const handleRateResponse = useCallback((messageId: string, rating: "up" | "down") => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, rating } : msg
      )
    );
  }, []);

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
        id="chatbot"
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
              <h3 className="text-white font-semibold">SmartLMS AI Assistant</h3>
              <p className="text-white/80 text-xs">
                {isTyping ? "Thinking..." : "AI-Powered • Ready to help"}
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
        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[350px] min-h-[200px] bg-gray-50/50">
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
              
              {/* Quick Replies */}
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

              {/* Rating Buttons */}
              {message.sender === "bot" && message.rating !== undefined && !isTyping && (
                <div className="flex items-center gap-2 px-1">
                  <span className="text-xs text-gray-400">Was this helpful?</span>
                  <button
                    onClick={() => handleRateResponse(message.id, "up")}
                    className={cn(
                      "p-1 rounded transition-colors",
                      message.rating === "up"
                        ? "text-green-500 bg-green-50"
                        : "text-gray-400 hover:text-green-500 hover:bg-green-50"
                    )}
                    aria-label="Yes, helpful"
                  >
                    <ThumbsUp className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleRateResponse(message.id, "down")}
                    className={cn(
                      "p-1 rounded transition-colors",
                      message.rating === "down"
                        ? "text-red-500 bg-red-50"
                        : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                    )}
                    aria-label="No, not helpful"
                  >
                    <ThumbsDown className="w-3 h-3" />
                  </button>
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
              placeholder="Ask me anything about SmartLMS..."
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
