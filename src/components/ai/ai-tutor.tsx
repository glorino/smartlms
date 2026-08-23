"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Send, X, Loader2, MessageSquare, ChevronDown, Bot, User, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

interface EngagementAnalysis {
  engagement: "high" | "medium" | "low";
  emotion: "confused" | "frustrated" | "engaged" | "bored" | "excited";
  sentiment: number;
  recommendations: string[];
}

interface AITutorProps {
  courseId: string;
  lessonId?: string;
  courseName: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function AITutor({ courseId, lessonId, courseName, isOpen, onClose }: AITutorProps) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [engagementAnalysis, setEngagementAnalysis] = useState<EngagementAnalysis | null>(null);
  const [showEngagementTip, setShowEngagementTip] = useState(false);
  const [engagementLoading, setEngagementLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messageCountRef = useRef(0);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && courseId && lessonId) {
      setSuggestionsLoading(true);
      fetch("/api/ai/tutor/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, lessonId }),
      })
        .then((res) => res.json())
        .then((data) => setSuggestions(data.suggestions || []))
        .catch(() => setSuggestions([]))
        .finally(() => setSuggestionsLoading(false));
    }
  }, [isOpen, courseId, lessonId]);

  const analyzeEngagement = async (recentMessages: string[]) => {
    if (recentMessages.length < 3) return;

    setEngagementLoading(true);
    try {
      const res = await fetch("/api/ai/emotion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: recentMessages }),
      });

      if (res.ok) {
        const data = await res.json();
        setEngagementAnalysis(data.analysis);

        if (
          data.analysis.engagement === "low" ||
          data.analysis.emotion === "confused" ||
          data.analysis.emotion === "frustrated"
        ) {
          setShowEngagementTip(true);
        }
      }
    } catch (error) {
      console.error("Engagement analysis error:", error);
    } finally {
      setEngagementLoading(false);
    }
  };

  const sendMessage = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || loading) return;

    setInput("");
    setLoading(true);

    const userMessage: Message = { role: "user", content: msg };
    setMessages((prev) => [...prev, userMessage]);
    messageCountRef.current += 1;

    if (messageCountRef.current % 5 === 0 && messageCountRef.current > 0) {
      const recentUserMessages = [...messages, userMessage]
        .filter((m) => m.role === "user")
        .slice(-5)
        .map((m) => m.content);
      analyzeEngagement(recentUserMessages);
    }

    try {
      const res = await fetch("/api/ai/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: msg,
          courseId,
          conversationId,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        let responseContent = data.response;

        if (engagementAnalysis?.recommendations && engagementAnalysis.recommendations.length > 0) {
          const lastRecommendation = engagementAnalysis.recommendations[0];
          if (
            engagementAnalysis.emotion === "confused" &&
            !responseContent.toLowerCase().includes("let me explain")
          ) {
            responseContent = `Let me try explaining this differently.\n\n${responseContent}`;
          } else if (engagementAnalysis.emotion === "frustrated") {
            responseContent = `I understand this can be challenging. Take your time.\n\n${responseContent}`;
          }
        }

        const assistantMessage: Message = {
          role: "assistant",
          content: responseContent,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        if (data.conversationId) {
          setConversationId(data.conversationId);
        }
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Sorry, I encountered an error. Please try again." },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Network error. Please check your connection and try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const dismissEngagementTip = () => {
    setShowEngagementTip(false);
  };

  const getEngagementColor = (level: string) => {
    switch (level) {
      case "high":
        return "text-green-400 bg-green-500/10";
      case "medium":
        return "text-yellow-400 bg-yellow-500/10";
      case "low":
        return "text-red-400 bg-red-500/10";
      default:
        return "text-gray-400 bg-gray-500/10";
    }
  };

  const getEmotionEmoji = (emotion: string) => {
    switch (emotion) {
      case "confused":
        return "Confused";
      case "frustrated":
        return "Frustrated";
      case "engaged":
        return "Engaged";
      case "bored":
        return "Bored";
      case "excited":
        return "Excited";
      default:
        return "Neutral";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="flex h-full flex-col bg-gray-900 border-l border-gray-800">
      <div className="flex items-center justify-between border-b border-gray-800 px-4 py-3">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-blue-400" />
          <h3 className="text-sm font-semibold text-white">AI Tutor</h3>
          {engagementAnalysis && (
            <div className={cn("px-2 py-0.5 rounded-full text-xs", getEngagementColor(engagementAnalysis.engagement))}>
              {getEmotionEmoji(engagementAnalysis.emotion)}
            </div>
          )}
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-800 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {showEngagementTip && engagementAnalysis?.recommendations && (
        <div className="border-b border-gray-800 px-4 py-3 bg-blue-500/5">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-blue-300 font-medium">Need help?</p>
              <p className="text-xs text-gray-400 mt-1">
                {engagementAnalysis.recommendations[0] || "I can explain this differently if you'd like."}
              </p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => {
                    sendMessage("Can you explain this differently?");
                    setShowEngagementTip(false);
                  }}
                  className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded hover:bg-blue-500/30"
                >
                  Explain differently
                </button>
                <button
                  onClick={() => {
                    sendMessage("I need a break");
                    setShowEngagementTip(false);
                  }}
                  className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
                >
                  Take a break
                </button>
                <button
                  onClick={dismissEngagementTip}
                  className="text-xs px-2 py-1 text-gray-500 hover:text-gray-400"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {messages.length === 0 && suggestions.length > 0 && (
        <div className="border-b border-gray-800 px-4 py-3">
          <p className="mb-2 text-xs font-medium text-gray-400">Suggested questions:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => sendMessage(s)}
                className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-1.5 text-xs text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-3 rounded-full bg-blue-500/10 p-3">
              <Bot className="h-8 w-8 text-blue-400" />
            </div>
            <p className="text-sm font-medium text-white">AI Tutor</p>
            <p className="mt-1 text-xs text-gray-400">
              Ask anything about {courseName}
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && (
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-500/20">
                <Bot className="h-4 w-4 text-blue-400" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-br-md"
                  : "bg-gray-800 text-gray-200 rounded-bl-md"
              }`}
            >
              <p className="whitespace-pre-wrap break-words">{msg.content}</p>
            </div>
            {msg.role === "user" && (
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-700">
                <User className="h-4 w-4 text-gray-300" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-500/20">
              <Bot className="h-4 w-4 text-blue-400" />
            </div>
            <div className="rounded-2xl rounded-bl-md bg-gray-800 px-4 py-3">
              <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-800 px-4 py-3">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question..."
            rows={1}
            className="flex-1 resize-none rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="rounded-xl bg-blue-600 p-2.5 text-white hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
