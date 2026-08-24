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
  action: "navigate" | "search" | "openChat" | "help" | "scroll" | "goBack" | "enroll" | "quiz" | "readPage" | "askAI";
  target?: string;
  description: string;
  speakResponse?: string;
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

  // Direct "go to X" / "open X" / "show X" patterns
  const goMatch = lower.match(/(?:go\s*to|open|show|take\s*me\s*to|navigate\s*to|i\s*(?:want|need)\s*to\s*(?:see|go)|where\s*(?:is|are)|take\s*me)\s+(.+)/i);
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

  // Direct keyword match (user just says "courses" or "dashboard")
  for (const cmd of NAV_COMMANDS) {
    for (const pattern of cmd.patterns) {
      if (pattern.test(lower)) {
        return { command: cmd };
      }
    }
  }

  // Search: "search for X", "find X", "look for X"
  const searchMatch = lower.match(/(?:search|find|look\s*for|look\s*up|hunt|google|look\s*into)\s+(.+)/i);
  if (searchMatch) {
    return {
      command: { patterns: [], action: "search", description: "search" },
      searchTerm: searchMatch[1].trim(),
    };
  }

  // Ask AI: various natural phrasings
  const aiMatch = lower.match(/(?:ask\s*(?:ai|assistant|bot|you|smart\s*lms)|ai|what\s*is|what\s*are|how\s*(?:do|can|to|much|about)|tell\s*me\s*about|explain|describe|define|help\s*me\s*(?:understand|with)|can\s*you|could\s*you|what\s*do\s*you|which|why\s*do|when\s*did|where\s*can)\s+(.+)/i);
  if (aiMatch) {
    return {
      command: { patterns: [], action: "askAI", description: "ask AI" },
      searchTerm: aiMatch[1].trim(),
    };
  }

  // Simple "ask ai" without question
  if (/^(?:ask|ai|hey|hello|hi|hey\s*there)/i.test(lower)) {
    return {
      command: { patterns: [], action: "askAI", description: "ask AI" },
      searchTerm: lower.replace(/^(?:ask|ai|hey|hello|hi|hey\s*there)\s*/i, "").trim() || undefined,
    };
  }

  // Open chat
  if (/chat|assistant|bot|talk|converse/i.test(lower)) {
    return { command: { patterns: [], action: "openChat", description: "chat" } };
  }

  // Scroll
  if (/scroll\s*down|page\s*down|down/i.test(lower)) {
    return { command: { patterns: [], action: "scroll", target: "down", description: "scroll down" } };
  }
  if (/scroll\s*up|page\s*up|up\s*page/i.test(lower)) {
    return { command: { patterns: [], action: "scroll", target: "up", description: "scroll up" } };
  }

  // Go back
  if (/go\s*back|back|previous|return/i.test(lower)) {
    return { command: { patterns: [], action: "goBack", description: "go back" } };
  }

  // Read page
  if (/read|read\s*(?:the|this)\s*page|what(?:'s| is)\s*(?:on|this)/i.test(lower)) {
    return { command: { patterns: [], action: "readPage", description: "read page" } };
  }

  // Help
  if (/^(?:help|commands?|what\s*can|options|menu)/i.test(lower)) {
    return { command: { patterns: [], action: "help", description: "help" } };
  }

  // Enroll
  if (/enrol|sign\s*up\s*for|register\s*for|start\s*(?:a\s*)?course/i.test(lower)) {
    return { command: { patterns: [], action: "enroll", description: "enroll" } };
  }

  // Quiz
  if (/take|start|do|begin|take\s*a/i.test(lower) && /quiz|test|exam|assessment/i.test(lower)) {
    return { command: { patterns: [], action: "quiz", description: "quiz" } };
  }

  // If nothing matched, try AI as fallback for any question-like input
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
  const preferred = voices.find(
    (v) => v.lang === "en-US" && v.name.includes("Google")
  ) || voices.find((v) => v.lang.startsWith("en"));
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
  const recognitionRef = useRef<any>(null);
  const feedbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isListeningRef = useRef(false);

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
          // Silently restart if no speech detected
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
        // Auto-restart if still in listening mode
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
        // Fallback: send any unrecognized speech to AI
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
          speak("Here are the available voice commands. You can say things like: go to courses, open dashboard, search for React, ask AI a question, scroll down, or go back.", voiceEnabled);
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
      setFeedback("Listening... speak naturally, I'll understand.");
      speak("I'm listening. Say anything — ask a question, navigate, or give a command.", voiceEnabled);
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
              <p className="mt-1 text-xs text-gray-500">
                Use Chrome, Edge, or Safari for voice commands.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed bottom-6 left-6 z-50" role="region" aria-label="Voice commands">
        <div className="relative group">
          {/* Feedback bubble */}
          {feedback && (
            <div
              className="absolute bottom-full left-0 mb-3 w-80 rounded-xl bg-gray-900 px-4 py-3 text-sm text-white shadow-xl"
              role="status"
              aria-live="polite"
            >
              <div className="flex items-start gap-2">
                {isListening ? (
                  <Loader2 className="h-4 w-4 shrink-0 text-indigo-400 animate-spin mt-0.5" />
                ) : isProcessing ? (
                  <Loader2 className="h-4 w-4 shrink-0 text-purple-400 animate-spin mt-0.5" />
                ) : (
                  <Volume2 className="h-4 w-4 shrink-0 text-indigo-400 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <span className="break-words">{feedback}</span>
                  {transcript && transcript !== feedback && (
                    <div className="mt-1.5 border-t border-gray-700 pt-1.5 text-xs text-gray-400 italic">
                      &quot;{transcript}&quot;
                    </div>
                  )}
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

          <div className="flex items-center gap-2">
            {/* Voice toggle */}
            <button
              onClick={toggleVoice}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full shadow-md transition-all",
                voiceEnabled
                  ? "bg-white text-indigo-600 hover:bg-indigo-50 border border-indigo-200"
                  : "bg-white text-gray-400 hover:bg-gray-50 border border-gray-200"
              )}
              aria-label={voiceEnabled ? "Disable voice responses" : "Enable voice responses"}
              title={voiceEnabled ? "Voice ON" : "Voice OFF"}
            >
              {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>

            {/* Main mic button */}
            <button
              onClick={toggleListening}
              className={cn(
                "relative flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-300",
                "focus:outline-none focus:ring-4",
                permissionDenied
                  ? "bg-gray-400 text-white shadow-gray-400/30 hover:bg-gray-500"
                  : isListening
                  ? "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-red-500/30 focus:ring-red-300 animate-pulse"
                  : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-indigo-500/30 hover:shadow-xl hover:scale-110 focus:ring-indigo-300"
              )}
              aria-label={isListening ? "Stop listening" : "Start voice command"}
              aria-pressed={isListening}
            >
              {isListening && (
                <span className="absolute inset-0 rounded-full animate-ping bg-indigo-400 opacity-20" />
              )}
              {isListening ? (
                <MicOff className="h-6 w-6 relative z-10" />
              ) : (
                <Mic className="h-6 w-6 relative z-10" />
              )}
            </button>

            {/* Help button */}
            <button
              onClick={() => {
                setShowHelp(true);
                speak("Here are examples of what you can say. Try speaking naturally.", voiceEnabled);
              }}
              className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-gray-500 shadow-md hover:bg-gray-50 hover:text-gray-700 transition-colors"
              aria-label="Voice command help"
            >
              <HelpCircle className="h-4 w-4" />
            </button>
          </div>
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
                <h3 className="text-lg font-bold text-gray-900">Voice Assistant</h3>
              </div>
              <button
                onClick={() => setShowHelp(false)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto space-y-5">
              <p className="text-sm text-gray-600">
                Tap the mic and speak naturally. I understand conversational language — no need for exact phrases.
              </p>

              {/* Navigation */}
              <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Navigation</h4>
                <div className="space-y-1.5">
                  {[
                    { say: "Go to courses", alt: "I want to see my courses" },
                    { say: "Open dashboard", alt: "Show me the dashboard" },
                    { say: "Take me to pricing", alt: "How much does it cost?" },
                    { say: "Go to my certificates", alt: "Where are my certificates?" },
                    { say: "Open live classes", alt: "I want to join a live session" },
                  ].map((item) => (
                    <div key={item.say} className="rounded-lg border border-gray-100 p-2.5 hover:bg-gray-50">
                      <p className="font-mono text-sm font-medium text-indigo-600">&quot;{item.say}&quot;</p>
                      <p className="text-xs text-gray-400 mt-0.5">Also works: <span className="italic">&quot;{item.alt}&quot;</span></p>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI */}
              <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Ask AI Anything</h4>
                <div className="space-y-1.5">
                  {[
                    { say: "Ask AI what courses do you have?", alt: "What courses are available?" },
                    { say: "How do I reset my password?", alt: "Explain the certificate system" },
                    { say: "Tell me about web development", alt: "What is React?" },
                    { say: "Can you help me with my assignment?", alt: "How do quizzes work?" },
                  ].map((item) => (
                    <div key={item.say} className="rounded-lg border border-gray-100 p-2.5 hover:bg-gray-50">
                      <p className="font-mono text-sm font-medium text-indigo-600">&quot;{item.say}&quot;</p>
                      <p className="text-xs text-gray-400 mt-0.5">Also works: <span className="italic">&quot;{item.alt}&quot;</span></p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Actions</h4>
                <div className="space-y-1.5">
                  {[
                    { say: "Search for React", alt: "Find courses about JavaScript" },
                    { say: "Open chat", alt: "I need help" },
                    { say: "Scroll down", alt: "Page down" },
                    { say: "Go back", alt: "Return to previous page" },
                    { say: "Read the page", alt: "What's on this page?" },
                    { say: "Help", alt: "What can you do?" },
                  ].map((item) => (
                    <div key={item.say} className="rounded-lg border border-gray-100 p-2.5 hover:bg-gray-50">
                      <p className="font-mono text-sm font-medium text-indigo-600">&quot;{item.say}&quot;</p>
                      <p className="text-xs text-gray-400 mt-0.5">Also works: <span className="italic">&quot;{item.alt}&quot;</span></p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 p-4 border border-indigo-100">
                <p className="text-sm font-semibold text-indigo-700">Natural Language</p>
                <p className="mt-1 text-xs text-indigo-600">
                  You don&apos;t need exact commands. Just speak naturally — &quot;I want to learn React&quot;,
                  &quot;where can I find my quizzes?&quot;, or &quot;help me understand certificates&quot; all work.
                  If I don&apos;t understand a command, I&apos;ll ask the AI for help automatically.
                </p>
              </div>
            </div>

            <div className="border-t border-gray-100 px-6 py-4">
              <Button
                onClick={() => setShowHelp(false)}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
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
