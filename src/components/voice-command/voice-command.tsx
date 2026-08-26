"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Mic,
  MicOff,
  HelpCircle,
  X,
  Volume2,
  VolumeX,
  AlertTriangle,
  Loader2,
  ChevronRight,
  Navigation,
  Brain,
  Zap,
  Keyboard,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface VoiceCommand {
  patterns: RegExp[];
  action:
    | "navigate"
    | "search"
    | "openChat"
    | "help"
    | "scroll"
    | "goBack"
    | "enroll"
    | "quiz"
    | "readPage"
    | "askAI";
  target?: string;
  description: string;
  speakResponse?: string;
  icon?: string;
}

const NAV_COMMANDS: VoiceCommand[] = [
  { patterns: [/courses?/i, /browse/i, /learn/i, /class/i, /lesson/i], action: "navigate", target: "/courses", description: "courses", speakResponse: "Opening courses." },
  { patterns: [/dashboard/i, /home\s*page/i, /my\s*page/i, /main/i], action: "navigate", target: "/dashboard", description: "dashboard", speakResponse: "Opening your dashboard." },
  { patterns: [/certificate/i, /credential/i, /badge/i], action: "navigate", target: "/dashboard/certificates", description: "certificates", speakResponse: "Opening your certificates." },
  { patterns: [/quiz/i, /quizzes/i, /test/i, /assessment/i, /exam/i], action: "navigate", target: "/dashboard/quizzes", description: "quizzes", speakResponse: "Opening quizzes." },
  { patterns: [/setting/i, /account/i, /profile/i, /preferences/i], action: "navigate", target: "/dashboard/settings", description: "settings", speakResponse: "Opening settings." },
  { patterns: [/live\s*class/i, /live\s*session/i, /webinar/i, /stream/i, /join.*live/i], action: "navigate", target: "/live-classes", description: "live classes", speakResponse: "Opening live classes." },
  { patterns: [/training/i, /course/i], action: "navigate", target: "/courses", description: "training", speakResponse: "Opening training courses." },
  { patterns: [/notification/i, /alerts?/i], action: "navigate", target: "/dashboard/notifications", description: "notifications", speakResponse: "Opening notifications." },
  { patterns: [/bookmark/i, /saved/i, /favorites?/i, /wishlist/i], action: "navigate", target: "/dashboard/bookmarks", description: "bookmarks", speakResponse: "Opening bookmarks." },
  { patterns: [/message/i, /inbox/i, /chat/i, /mail/i], action: "navigate", target: "/dashboard/messages", description: "messages", speakResponse: "Opening messages." },
  { patterns: [/assignment/i, /homework/i, /task/i, /submit/i], action: "navigate", target: "/dashboard/quizzes", description: "assignments", speakResponse: "Opening assignments." },
  { patterns: [/pricing/i, /plan/i, /subscription/i, /cost/i, /price/i, /how\s*much/i], action: "navigate", target: "/pricing", description: "pricing", speakResponse: "Opening pricing page." },
  { patterns: [/about/i, /who\s*are\s*you/i, /company/i, /team/i], action: "navigate", target: "/about", description: "about", speakResponse: "Opening about page." },
  { patterns: [/login/i, /sign\s*in/i, /log\s*in/i], action: "navigate", target: "/login", description: "login", speakResponse: "Opening login page." },
  { patterns: [/register/i, /sign\s*up/i, /create.*account/i, /join/i], action: "navigate", target: "/register", description: "registration", speakResponse: "Opening registration." },
  { patterns: [/instructor/i, /teach/i, /become.*teacher/i, /create.*course/i], action: "navigate", target: "/instructor/courses", description: "instructor area", speakResponse: "Opening instructor area." },
  { patterns: [/career/i, /job/i, /employment/i, /hiring/i], action: "navigate", target: "/dashboard/career", description: "career paths", speakResponse: "Opening career paths." },
  { patterns: [/community/i, /forum/i, /discussion/i, /group/i], action: "navigate", target: "/community", description: "community", speakResponse: "Opening community." },
  { patterns: [/blog/i, /article/i, /post/i, /news/i], action: "navigate", target: "/blog", description: "blog", speakResponse: "Opening blog." },
  { patterns: [/help/i, /support/i, /contact/i, /assist/i], action: "navigate", target: "/help", description: "help center", speakResponse: "Opening help center." },
];

function findCommand(transcript: string): { command: VoiceCommand; searchTerm?: string } | null {
  const lower = transcript.toLowerCase().trim();

  const goMatch = lower.match(
    /(?:go\s*to|open|show|take\s*me\s*to|navigate\s*to|i\s*(?:want|need)\s*to\s*(?:see|go)|where\s*(?:is|are)|take\s*me)\s+(.+)/i
  );
  if (goMatch) {
    const target = goMatch[1].trim();
    for (const cmd of NAV_COMMANDS) {
      for (const pattern of cmd.patterns) {
        if (pattern.test(target)) {
          return { command: cmd };
        }
      }
    }
  }

  for (const cmd of NAV_COMMANDS) {
    for (const pattern of cmd.patterns) {
      if (pattern.test(lower)) {
        return { command: cmd };
      }
    }
  }

  const searchMatch = lower.match(
    /(?:search|find|look\s*for|look\s*up|hunt|google|look\s*into)\s+(.+)/i
  );
  if (searchMatch) {
    return {
      command: { patterns: [], action: "search", description: "search" },
      searchTerm: searchMatch[1].trim(),
    };
  }

  const aiMatch = lower.match(
    /(?:ask\s*(?:ai|assistant|bot|you|smart\s*lms)|ai|what\s*is|what\s*are|how\s*(?:do|can|to|much|about)|tell\s*me\s*about|explain|describe|define|help\s*me\s*(?:understand|with)|can\s*you|could\s*you|what\s*do\s*you|which|why\s*do|when\s*did|where\s*can)\s+(.+)/i
  );
  if (aiMatch) {
    return {
      command: { patterns: [], action: "askAI", description: "ask AI" },
      searchTerm: aiMatch[1].trim(),
    };
  }

  if (/^(?:ask|ai|hey|hello|hi|hey\s*there)/i.test(lower)) {
    return {
      command: { patterns: [], action: "askAI", description: "ask AI" },
      searchTerm: lower.replace(/^(?:ask|ai|hey|hello|hi|hey\s*there)\s*/i, "").trim() || undefined,
    };
  }

  if (/chat|assistant|bot|talk|converse/i.test(lower)) {
    return { command: { patterns: [], action: "openChat", description: "chat" } };
  }

  if (/scroll\s*down|page\s*down|down/i.test(lower)) {
    return { command: { patterns: [], action: "scroll", target: "down", description: "scroll down" } };
  }
  if (/scroll\s*up|page\s*up|up\s*page/i.test(lower)) {
    return { command: { patterns: [], action: "scroll", target: "up", description: "scroll up" } };
  }

  if (/go\s*back|back|previous|return/i.test(lower)) {
    return { command: { patterns: [], action: "goBack", description: "go back" } };
  }

  if (/read|read\s*(?:the|this)\s*page|what(?:'s| is)\s*(?:on|this)/i.test(lower)) {
    return { command: { patterns: [], action: "readPage", description: "read page" } };
  }

  if (/^(?:help|commands?|what\s*can|options|menu)/i.test(lower)) {
    return { command: { patterns: [], action: "help", description: "help" } };
  }

  if (/enrol|sign\s*up\s*for|register\s*for|start\s*(?:a\s*)?course/i.test(lower)) {
    return { command: { patterns: [], action: "enroll", description: "enroll" } };
  }

  if (/take|start|do|begin|take\s*a/i.test(lower) && /quiz|test|exam|assessment/i.test(lower)) {
    return { command: { patterns: [], action: "quiz", description: "quiz" } };
  }

  if (lower.length > 5 && /\?|what|how|why|when|where|who|which|can|do|is|are|should/i.test(lower)) {
    return {
      command: { patterns: [], action: "askAI", description: "ask AI" },
      searchTerm: lower,
    };
  }

  return null;
}

function speak(text: string, enabled: boolean) {
  if (!enabled || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;
  utterance.lang = "en-US";
  const voices = window.speechSynthesis.getVoices();
  const preferred =
    voices.find((v) => v.lang === "en-US" && v.name.includes("Google")) ||
    voices.find((v) => v.lang.startsWith("en"));
  if (preferred) utterance.voice = preferred;
  window.speechSynthesis.speak(utterance);
}

function readPageContent(): string {
  const main = document.querySelector("main") || document.querySelector("[role='main']") || document.body;
  const headings = main.querySelectorAll("h1, h2, h3");
  const paragraphs = main.querySelectorAll("p");
  let text = "";
  headings.forEach((h, i) => {
    if (i < 5) text += `${h.textContent}. `;
  });
  paragraphs.forEach((p, i) => {
    if (i < 5 && p.textContent && p.textContent.length > 10) text += `${p.textContent}. `;
  });
  return text || "No readable content found on this page.";
}

function AudioWaveform({ isActive }: { isActive: boolean }) {
  if (!isActive) return null;
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="absolute bg-white/30 rounded-full"
          style={{
            width: "3px",
            animationDelay: `${i * 0.15}s`,
            animation: isActive ? "waveform 1.2s ease-in-out infinite" : "none",
          }}
        />
      ))}
      <style jsx>{`
        @keyframes waveform {
          0%, 100% { height: 8px; opacity: 0.3; }
          50% { height: 24px; opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}

function PulseRing({ isActive, color }: { isActive: boolean; color: string }) {
  if (!isActive) return null;
  return (
    <>
      <span
        className={cn(
          "absolute inset-0 rounded-full animate-ping",
          color === "indigo" ? "bg-indigo-400" : "bg-red-400"
        )}
        style={{ animationDuration: "1.5s", opacity: 0.15 }}
      />
      <span
        className={cn(
          "absolute -inset-1 rounded-full animate-ping",
          color === "indigo" ? "bg-indigo-300" : "bg-red-300"
        )}
        style={{ animationDuration: "2s", animationDelay: "0.3s", opacity: 0.1 }}
      />
    </>
  );
}

function StatusIndicator({
  isListening,
  isProcessing,
  hasPermission,
  feedback,
}: {
  isListening: boolean;
  isProcessing: boolean;
  hasPermission: boolean;
  feedback: string;
}) {
  if (!hasPermission) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-amber-600">
        <AlertTriangle className="h-3 w-3" />
        <span>Mic blocked</span>
      </div>
    );
  }
  if (isProcessing) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-purple-600">
        <Loader2 className="h-3 w-3 animate-spin" />
        <span>Thinking</span>
      </div>
    );
  }
  if (isListening) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-red-500">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
        </span>
        <span>Listening</span>
      </div>
    );
  }
  return null;
}

export default function VoiceCommand() {
  const router = useRouter();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [showHelp, setShowHelp] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<{ role: string; content: string }[]>([]);
  const [showTranscript, setShowTranscript] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const recognitionRef = useRef<any>(null);
  const feedbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isListeningRef = useRef(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";
      recognition.maxAlternatives = 3;

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
          } else {
            interimTranscript += result[0].transcript;
          }
        }

        setTranscript(finalTranscript || interimTranscript);

        if (finalTranscript) {
          processCommand(finalTranscript.trim());
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          setPermissionDenied(true);
          const msg = "Microphone permission denied. Please allow access in your browser settings.";
          setFeedback(msg);
          speak(msg, voiceEnabled);
          setIsListening(false);
          isListeningRef.current = false;
        } else if (event.error === "network") {
          const msg = "Network error. Check your connection and try again.";
          setFeedback(msg);
          speak(msg, voiceEnabled);
        } else if (event.error === "no-speech") {
          if (isListeningRef.current) {
            try { recognition.start(); } catch {}
          }
        } else if (event.error !== "aborted") {
          const msg = `Error: ${event.error}. Tap mic to try again.`;
          setFeedback(msg);
          speak(msg, voiceEnabled);
        }
      };

      recognition.onend = () => {
        if (isListeningRef.current) {
          try {
            recognition.start();
          } catch {
            setIsListening(false);
            isListeningRef.current = false;
          }
        } else {
          setIsListening(false);
          setTimeout(() => setTranscript(""), 2000);
        }
      };

      recognitionRef.current = recognition;
    }

    return () => {
      isListeningRef.current = false;
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch {}
      }
      if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "m") {
        e.preventDefault();
        toggleListening();
      }
      if (e.key === "Escape") {
        setShowHelp(false);
        setShowActions(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isListening]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setShowActions(false);
      }
    };
    if (showActions) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showActions]);

  const fetchAIResponse = async (question: string): Promise<string> => {
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: question,
          context: conversationHistory.slice(-6),
        }),
      });

      if (!res.ok) throw new Error("AI unavailable");

      const data = await res.json();
      const response = data.response || "I couldn't process that. Can you try rephrasing?";

      setConversationHistory((prev) => [
        ...prev.slice(-6),
        { role: "user", content: question },
        { role: "assistant", content: response },
      ]);

      return response;
    } catch {
      return "I'm having trouble reaching my AI brain right now. Please try again in a moment.";
    }
  };

  const processCommand = useCallback(
    async (text: string) => {
      const match = findCommand(text);

      if (!match) {
        setIsProcessing(true);
        setFeedback(`Thinking about "${text.substring(0, 50)}${text.length > 50 ? "..." : ""}"...`);
        speak("Let me think about that.", voiceEnabled);

        const aiResponse = await fetchAIResponse(text);
        setFeedback(`AI: ${aiResponse.substring(0, 120)}${aiResponse.length > 120 ? "..." : ""}`);
        speak(aiResponse, voiceEnabled);
        setIsProcessing(false);
        clearFeedbackAfterDelay();
        return;
      }

      const { command, searchTerm } = match;

      switch (command.action) {
        case "navigate":
          setFeedback(`Opening ${command.description}...`);
          speak(command.speakResponse || `Opening ${command.description}.`, voiceEnabled);
          router.push(command.target!);
          break;

        case "search":
          if (searchTerm) {
            setFeedback(`Searching for "${searchTerm}"...`);
            speak(`Searching for ${searchTerm}.`, voiceEnabled);
            router.push(`/courses?search=${encodeURIComponent(searchTerm)}`);
          } else {
            const msg = "What would you like to search for? Say 'search for' followed by a topic.";
            setFeedback(msg);
            speak("What would you like to search for?", voiceEnabled);
          }
          break;

        case "openChat":
          setFeedback("Opening AI assistant...");
          speak("Opening the AI assistant.", voiceEnabled);
          const chatBtn = document.querySelector<HTMLButtonElement>('[aria-label="Open chat"]');
          if (chatBtn) {
            chatBtn.click();
          } else {
            const chatEvent = new CustomEvent("smartlms:open-chat");
            window.dispatchEvent(chatEvent);
          }
          break;

        case "help":
          setShowHelp(true);
          setFeedback("Here are your voice commands.");
          speak("Here are the available voice commands.", voiceEnabled);
          break;

        case "scroll":
          window.scrollBy({ top: command.target === "up" ? -400 : 400, behavior: "smooth" });
          setFeedback(`Scrolling ${command.target}...`);
          speak(`Scrolling ${command.target}.`, voiceEnabled);
          break;

        case "goBack":
          setFeedback("Going back...");
          speak("Going back.", voiceEnabled);
          router.back();
          break;

        case "enroll":
          setFeedback("Opening courses to enroll...");
          speak("Opening courses.", voiceEnabled);
          router.push("/courses");
          break;

        case "quiz":
          setFeedback("Opening quizzes...");
          speak("Opening quizzes.", voiceEnabled);
          router.push("/dashboard/quizzes");
          break;

        case "readPage":
          const pageText = readPageContent();
          setFeedback("Reading page content...");
          speak(pageText, voiceEnabled);
          break;

        case "askAI":
          if (searchTerm) {
            setIsProcessing(true);
            setFeedback(`AI thinking about "${searchTerm.substring(0, 40)}${searchTerm.length > 40 ? "..." : ""}"...`);
            speak("Let me think about that.", voiceEnabled);

            const aiResponse = await fetchAIResponse(searchTerm);
            setFeedback(`AI: ${aiResponse.substring(0, 120)}${aiResponse.length > 120 ? "..." : ""}`);
            speak(aiResponse, voiceEnabled);
            setIsProcessing(false);
          } else {
            const msg = "What would you like to ask? Say your question after 'ask AI'.";
            setFeedback(msg);
            speak("What would you like to know?", voiceEnabled);
          }
          break;
      }

      clearFeedbackAfterDelay();
    },
    [router, voiceEnabled, conversationHistory]
  );

  const clearFeedbackAfterDelay = () => {
    if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
    feedbackTimeoutRef.current = setTimeout(() => {
      setFeedback("");
      setTranscript("");
    }, 10000);
  };

  const toggleListening = async () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      isListeningRef.current = false;
      recognitionRef.current.stop();
      setIsListening(false);
      if (voiceEnabled && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      setPermissionDenied(false);
    } catch {
      setPermissionDenied(true);
      const msg = "Microphone access denied. Please allow microphone access and try again.";
      setFeedback(msg);
      speak(msg, voiceEnabled);
      clearFeedbackAfterDelay();
      return;
    }

    setTranscript("");
    setFeedback("");
    try {
      isListeningRef.current = true;
      recognitionRef.current.start();
      setIsListening(true);
      setFeedback("Listening...");
      speak("I'm listening.", voiceEnabled);
    } catch {
      const msg = "Failed to start. Please try again.";
      setFeedback(msg);
      speak(msg, voiceEnabled);
      clearFeedbackAfterDelay();
    }
  };

  const toggleVoice = () => {
    const next = !voiceEnabled;
    setVoiceEnabled(next);
    if (next) {
      speak("Voice responses enabled.", true);
    } else {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    }
  };

  if (!isSupported) {
    return (
      <div className="fixed bottom-6 left-6 z-50 hidden sm:block">
        <div className="rounded-xl bg-white p-4 shadow-lg border border-gray-200 max-w-xs">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-amber-100 p-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Voice unavailable</p>
              <p className="mt-1 text-xs text-gray-500">Use Chrome, Edge, or Safari for voice commands.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed bottom-6 left-6 z-50" ref={panelRef} role="region" aria-label="Voice commands">
        {/* Status bar */}
        {isListening && (
          <div className="absolute bottom-full left-0 mb-3 w-72">
            <div className="rounded-xl bg-white shadow-xl border border-gray-200 overflow-hidden">
              <div className="px-4 py-3">
                <div className="flex items-center justify-between mb-2">
                  <StatusIndicator
                    isListening={isListening}
                    isProcessing={isProcessing}
                    hasPermission={!permissionDenied}
                    feedback={feedback}
                  />
                  <button
                    onClick={() => {
                      isListeningRef.current = false;
                      recognitionRef.current?.stop();
                      setIsListening(false);
                      setTranscript("");
                      setFeedback("");
                    }}
                    className="rounded-full p-1 hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Stop listening"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                {transcript && (
                  <div className="text-sm text-gray-700 font-medium truncate">
                    &quot;{transcript}&quot;
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Feedback bubble */}
        {feedback && !isListening && (
          <div className="absolute bottom-full left-0 mb-3 w-80">
            <div className="rounded-xl bg-gray-900 shadow-xl overflow-hidden">
              <div className="px-4 py-3">
                <div className="flex items-start gap-2">
                  {isProcessing ? (
                    <Loader2 className="h-4 w-4 shrink-0 text-purple-400 animate-spin mt-0.5" />
                  ) : (
                    <Volume2 className="h-4 w-4 shrink-0 text-indigo-400 mt-0.5" />
                  )}
                  <div className="flex-1 min-w-0">
                    <span className="text-sm text-white break-words">{feedback}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-1.5 left-6 h-3 w-3 rotate-45 bg-gray-900" />
          </div>
        )}

        {/* Tooltip */}
        {!isListening && !feedback && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-1.5 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
            Voice Commands
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-2 w-2 rotate-45 bg-gray-900" />
          </div>
        )}

        {/* Action buttons */}
        <div className="relative group">
          <div className={cn(
            "flex items-center gap-2 transition-all duration-300",
            showActions ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto"
          )}>
            {/* Voice toggle */}
            <button
              onClick={toggleVoice}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full shadow-md transition-all duration-200",
                voiceEnabled
                  ? "bg-white text-indigo-600 hover:bg-indigo-50 border border-indigo-200"
                  : "bg-white text-gray-400 hover:bg-gray-50 border border-gray-200"
              )}
              aria-label={voiceEnabled ? "Disable voice responses" : "Enable voice responses"}
              title={voiceEnabled ? "Voice ON" : "Voice OFF"}
            >
              {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>

            {/* Help */}
            <button
              onClick={() => setShowHelp(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-500 hover:text-gray-700 shadow-md border border-gray-200 hover:bg-gray-50 transition-all duration-200"
              aria-label="Voice command help"
              title="Help"
            >
              <HelpCircle className="h-4 w-4" />
            </button>
          </div>

          {/* Main mic button */}
          <button
            onClick={toggleListening}
            className={cn(
              "relative flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-300",
              "focus:outline-none focus:ring-4 mt-2",
              permissionDenied
                ? "bg-gray-400 text-white shadow-gray-400/30 hover:bg-gray-500"
                : isListening
                ? "bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-red-500/30 focus:ring-red-300"
                : "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-indigo-500/30 hover:shadow-xl hover:scale-105 focus:ring-indigo-300"
            )}
            aria-label={isListening ? "Stop listening" : "Start voice command"}
            aria-pressed={isListening}
          >
            <PulseRing isActive={isListening} color={isListening ? "red" : "indigo"} />
            <AudioWaveform isActive={isListening} />
            {isListening ? (
              <MicOff className="h-6 w-6 relative z-10" />
            ) : (
              <Mic className="h-6 w-6 relative z-10" />
            )}
          </button>

          {/* Keyboard shortcut hint */}
          {!isListening && !feedback && (
            <div className="absolute -right-1 top-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-gray-100 text-gray-500 rounded border border-gray-200">
                Ctrl+M
              </kbd>
            </div>
          )}
        </div>
      </div>

      {/* Help Modal */}
      {showHelp && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Voice commands help"
          onClick={() => setShowHelp(false)}
        >
          <div className="mx-4 w-full max-w-lg rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 p-2">
                  <Mic className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Voice Assistant</h3>
                  <p className="text-xs text-gray-500">Speak naturally — I understand conversational language</p>
                </div>
              </div>
              <button
                onClick={() => setShowHelp(false)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
              {/* Quick start */}
              <div className="rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 p-4 border border-indigo-100">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-indigo-100 p-1.5 mt-0.5">
                    <Zap className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-indigo-700">Quick Start</p>
                    <p className="mt-1 text-xs text-indigo-600">
                      Tap the mic button or press <kbd className="px-1 py-0.5 text-[10px] font-mono bg-indigo-100 rounded">Ctrl+M</kbd> to start.
                      Speak naturally — no need for exact commands.
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div>
                <h4 className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  <Navigation className="h-3.5 w-3.5" />
                  Navigation
                </h4>
                <div className="space-y-1.5">
                  {[
                    { say: "Go to courses", alt: "I want to see my courses" },
                    { say: "Open dashboard", alt: "Show me the dashboard" },
                    { say: "Take me to pricing", alt: "How much does it cost?" },
                    { say: "Go to my certificates", alt: "Where are my certificates?" },
                    { say: "Open live classes", alt: "I want to join a live session" },
                  ].map((item) => (
                    <div key={item.say} className="flex items-center gap-3 rounded-lg border border-gray-100 p-2.5 hover:bg-gray-50 group/item">
                      <div className="flex-1">
                        <p className="font-mono text-sm font-medium text-indigo-600">&quot;{item.say}&quot;</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Also: <span className="italic">&quot;{item.alt}&quot;</span>
                        </p>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-gray-300 group-hover/item:text-gray-500 transition-colors" />
                    </div>
                  ))}
                </div>
              </div>

              {/* AI */}
              <div>
                <h4 className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  <Brain className="h-3.5 w-3.5" />
                  Ask AI Anything
                </h4>
                <div className="space-y-1.5">
                  {[
                    { say: "What courses do you have?", alt: "Ask AI about available courses" },
                    { say: "How do I reset my password?", alt: "Explain the certificate system" },
                    { say: "Tell me about web development", alt: "What is React?" },
                    { say: "Can you help me with my assignment?", alt: "How do quizzes work?" },
                  ].map((item) => (
                    <div key={item.say} className="flex items-center gap-3 rounded-lg border border-gray-100 p-2.5 hover:bg-gray-50 group/item">
                      <div className="flex-1">
                        <p className="font-mono text-sm font-medium text-indigo-600">&quot;{item.say}&quot;</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Also: <span className="italic">&quot;{item.alt}&quot;</span>
                        </p>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-gray-300 group-hover/item:text-gray-500 transition-colors" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div>
                <h4 className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  <Zap className="h-3.5 w-3.5" />
                  Actions
                </h4>
                <div className="space-y-1.5">
                  {[
                    { say: "Search for React", alt: "Find courses about JavaScript" },
                    { say: "Open chat", alt: "I need help" },
                    { say: "Scroll down / up", alt: "Page down / Page up" },
                    { say: "Go back", alt: "Return to previous page" },
                    { say: "Read the page", alt: "What's on this page?" },
                    { say: "Help", alt: "What can you do?" },
                  ].map((item) => (
                    <div key={item.say} className="flex items-center gap-3 rounded-lg border border-gray-100 p-2.5 hover:bg-gray-50 group/item">
                      <div className="flex-1">
                        <p className="font-mono text-sm font-medium text-indigo-600">&quot;{item.say}&quot;</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Also: <span className="italic">&quot;{item.alt}&quot;</span>
                        </p>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-gray-300 group-hover/item:text-gray-500 transition-colors" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Keyboard shortcuts */}
              <div>
                <h4 className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  <Keyboard className="h-3.5 w-3.5" />
                  Keyboard Shortcuts
                </h4>
                <div className="space-y-1.5">
                  {[
                    { keys: "Ctrl + M", action: "Toggle voice assistant" },
                    { keys: "Escape", action: "Close help / stop listening" },
                  ].map((item) => (
                    <div key={item.keys} className="flex items-center justify-between rounded-lg border border-gray-100 p-2.5 hover:bg-gray-50">
                      <span className="text-sm text-gray-600">{item.action}</span>
                      <kbd className="px-2 py-1 text-xs font-mono bg-gray-100 text-gray-600 rounded border border-gray-200">
                        {item.keys}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 px-6 py-4">
              <Button
                onClick={() => setShowHelp(false)}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90"
              >
                Got it — let&apos;s try it!
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
