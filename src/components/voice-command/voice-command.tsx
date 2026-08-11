"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Mic, MicOff, HelpCircle, X, Volume2, AlertTriangle } from "lucide-react";
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
  action: "navigate" | "search" | "openChat" | "help" | "scroll" | "goBack" | "enroll" | "quiz";
  target?: string;
  description: string;
}

const VOICE_COMMANDS: VoiceCommand[] = [
  { patterns: [/go\s*to\s*courses?/i, /open\s*courses?/i, /show\s*courses?/i, /browse\s*courses?/i, /courses?\s*page/i], action: "navigate", target: "/courses", description: "Go to courses page" },
  { patterns: [/go\s*to\s*dashboard/i, /open\s*dashboard/i, /show\s*dashboard/i, /my\s*dashboard/i, /dashboard/i], action: "navigate", target: "/dashboard", description: "Go to dashboard" },
  { patterns: [/go\s*to\s*certificate/i, /open\s*certificate/i, /show\s*certificate/i, /my\s*certificate/i, /certificate/i], action: "navigate", target: "/dashboard/certificates", description: "Go to certificates" },
  { patterns: [/go\s*to\s*quiz/i, /open\s*quiz/i, /show\s*quiz/i, /take\s*quiz/i, /start\s*quiz/i, /quiz/i], action: "navigate", target: "/dashboard/quizzes", description: "Go to quizzes" },
  { patterns: [/go\s*to\s*setting/i, /open\s*setting/i, /show\s*setting/i, /my\s*setting/i, /setting/i], action: "navigate", target: "/dashboard/settings", description: "Go to settings" },
  { patterns: [/go\s*to\s*live/i, /open\s*live/i, /live\s*class/i, /join\s*live/i, /live\s*session/i], action: "navigate", target: "/live-classes", description: "Go to live classes" },
  { patterns: [/go\s*to\s*training/i, /open\s*training/i, /show\s*training/i, /training/i], action: "navigate", target: "/courses", description: "Go to training" },
  { patterns: [/go\s*to\s*notification/i, /open\s*notification/i, /show\s*notification/i, /my\s*notification/i, /notification/i], action: "navigate", target: "/dashboard/notifications", description: "Go to notifications" },
  { patterns: [/go\s*to\s*bookmark/i, /open\s*bookmark/i, /show\s*bookmark/i, /my\s*bookmark/i, /bookmark/i], action: "navigate", target: "/dashboard/bookmarks", description: "Go to bookmarks" },
  { patterns: [/go\s*to\s*message/i, /open\s*message/i, /show\s*message/i, /my\s*message/i, /message/i], action: "navigate", target: "/dashboard/messages", description: "Go to messages" },
  { patterns: [/go\s*to\s*profile/i, /open\s*profile/i, /show\s*profile/i, /my\s*profile/i, /profile/i], action: "navigate", target: "/dashboard/settings", description: "Go to profile" },
  { patterns: [/go\s*to\s*assignment/i, /open\s*assignment/i, /show\s*assignment/i, /my\s*assignment/i, /assignment/i], action: "navigate", target: "/dashboard/assignments", description: "Go to assignments" },
  { patterns: [/go\s*home/i, /open\s*home/i, /home\s*page/i, /back\s*to\s*home/i, /go\s*back\s*home/i, /homepage/i], action: "navigate", target: "/", description: "Go to home page" },
  { patterns: [/go\s*to\s*pricing/i, /open\s*pricing/i, /show\s*pricing/i, /pricing/i, /how\s*much/i, /cost/i, /plan/i, /subscription/i], action: "navigate", target: "/pricing", description: "Go to pricing" },
  { patterns: [/go\s*to\s*about/i, /open\s*about/i, /about\s*page/i, /about\s*us/i], action: "navigate", target: "/about", description: "Go to about page" },
  { patterns: [/go\s*to\s*login/i, /open\s*login/i, /login\s*page/i, /sign\s*in/i], action: "navigate", target: "/login", description: "Go to login" },
  { patterns: [/go\s*to\s*register/i, /open\s*register/i, /register\s*page/i, /sign\s*up/i, /create\s*account/i], action: "navigate", target: "/register", description: "Go to registration" },
  { patterns: [/go\s*to\s*instructor/i, /open\s*instructor/i, /instructor\s*dashboard/i, /teach/i, /become.*instructor/i], action: "navigate", target: "/instructor/courses", description: "Go to instructor area" },
  { patterns: [/enroll.*course/i, /start.*course/i, /begin.*course/i, /join.*course/i], action: "enroll", description: "Enroll in a course" },
  { patterns: [/take.*quiz/i, /start.*quiz/i, /begin.*quiz/i, /do.*quiz/i], action: "quiz", description: "Take a quiz" },
  { patterns: [/search\s+for\s+(.+)/i, /find\s+(.+)/i, /look\s+for\s+(.+)/i, /search\s+(.+)/i], action: "search", description: "Search for a course" },
  { patterns: [/open\s*chat/i, /start\s*chat/i, /chat\s*bot/i, /ai\s*help/i, /talk\s*to/i, /ask.*assistant/i], action: "openChat", description: "Open the AI chatbot" },
  { patterns: [/help/i, /what\s*can\s*you\s*do/i, /commands?/i, /voice\s*command/i, /options/i], action: "help", description: "Show available commands" },
  { patterns: [/scroll\s*down/i, /page\s*down/i], action: "scroll", target: "down", description: "Scroll down" },
  { patterns: [/scroll\s*up/i, /page\s*up/i], action: "scroll", target: "up", description: "Scroll up" },
  { patterns: [/go\s*back/i, /back\s*button/i, /previous\s*page/i, /back\s*again/i], action: "goBack", description: "Go back to previous page" },
];

function findCommand(transcript: string): { command: VoiceCommand; searchTerm?: string } | null {
  const lower = transcript.toLowerCase().trim();

  for (const cmd of VOICE_COMMANDS) {
    for (const pattern of cmd.patterns) {
      const match = lower.match(pattern);
      if (match) {
        if (cmd.action === "search" && match[1]) {
          return { command: cmd, searchTerm: match[1].trim() };
        }
        return { command: cmd };
      }
    }
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
  const recognitionRef = useRef<any>(null);
  const feedbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
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
          processCommand(finalTranscript);
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error("Speech recognition error:", event.error);
        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          setPermissionDenied(true);
          setFeedback("Microphone permission denied. Please allow access in your browser settings.");
        } else if (event.error === "network") {
          setFeedback("Network error. Please check your internet connection and try again.");
        } else if (event.error !== "no-speech") {
          setFeedback("Error: " + event.error + ". Please try again.");
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        setTimeout(() => setTranscript(""), 2000);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current);
      }
    };
  }, []);

  const processCommand = useCallback(
    (text: string) => {
      const match = findCommand(text);

      if (!match) {
        setFeedback(`Command not recognized: "${text}". Say "help" for available commands.`);
        clearFeedbackAfterDelay();
        return;
      }

      const { command, searchTerm } = match;

      switch (command.action) {
        case "navigate":
          setFeedback(`Navigating to ${command.description}...`);
          router.push(command.target!);
          break;
        case "search":
          if (searchTerm) {
            setFeedback(`Searching for "${searchTerm}"...`);
            router.push(`/courses?search=${encodeURIComponent(searchTerm)}`);
          } else {
            setFeedback("What would you like to search for? Say 'search for [topic]'.");
          }
          break;
        case "openChat":
          setFeedback("Opening AI assistant...");
          const chatButton =
            document.querySelector<HTMLButtonElement>('[aria-label="Open chat"]');
          if (chatButton) {
            chatButton.click();
          } else {
            setFeedback("Chat is not available on this page.");
          }
          break;
        case "help":
          setShowHelp(true);
          setFeedback("Showing available commands.");
          break;
        case "scroll":
          const direction = command.target === "up" ? -1 : 1;
          window.scrollBy({ top: direction * 400, behavior: "smooth" });
          setFeedback(`Scrolling ${command.target}...`);
          break;
        case "goBack":
          setFeedback("Going back...");
          router.back();
          break;
        case "enroll":
          setFeedback("Opening courses to enroll...");
          router.push("/courses");
          break;
        case "quiz":
          setFeedback("Opening quizzes...");
          router.push("/dashboard/quizzes");
          break;
      }

      clearFeedbackAfterDelay();
    },
    [router]
  );

  const clearFeedbackAfterDelay = () => {
    if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
    feedbackTimeoutRef.current = setTimeout(() => setFeedback(""), 5000);
  };

  const toggleListening = async () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      setPermissionDenied(false);
    } catch {
      setPermissionDenied(true);
      setFeedback("Microphone access denied. Please allow microphone access and try again.");
      clearFeedbackAfterDelay();
      return;
    }

    setTranscript("");
    setFeedback("");
    try {
      recognitionRef.current.start();
      setIsListening(true);
      setFeedback("Listening... Say a command like \"go to courses\" or \"help\"");
    } catch (e) {
      console.error("Failed to start recognition:", e);
      setFeedback("Failed to start voice recognition. Please try again.");
      clearFeedbackAfterDelay();
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
              <p className="text-sm font-medium text-gray-900">Voice commands unavailable</p>
              <p className="mt-1 text-xs text-gray-500">
                Your browser doesn&apos;t support speech recognition. Try Chrome, Edge, or Safari.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Main Button */}
      <div className="fixed bottom-6 left-6 z-50" role="region" aria-label="Voice commands">
        <div className="relative group">
          {feedback && (
            <div
              className="absolute bottom-full left-0 mb-3 w-80 rounded-xl bg-gray-900 px-4 py-3 text-sm text-white shadow-xl"
              role="status"
              aria-live="polite"
            >
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 shrink-0 text-indigo-400" />
                <span>{feedback}</span>
              </div>
              {transcript && (
                <div className="mt-2 border-t border-gray-700 pt-2 text-xs text-gray-400">
                  &quot;{transcript}&quot;
                </div>
              )}
              <div className="absolute -bottom-1.5 left-6 h-3 w-3 rotate-45 bg-gray-900" />
            </div>
          )}

          {/* Tooltip - shown on hover when not listening */}
          {!isListening && !feedback && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-1.5 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
              Voice Commands
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-2 w-2 rotate-45 bg-gray-900" />
            </div>
          )}

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
            aria-label={isListening ? "Stop voice command" : "Start voice command"}
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

          <button
            onClick={() => setShowHelp(true)}
            className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-gray-500 shadow-md hover:bg-gray-50 hover:text-gray-700 transition-colors"
            aria-label="Voice command help"
          >
            <HelpCircle className="h-4 w-4" />
          </button>
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
          <div className="mx-4 w-full max-w-md rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 p-2">
                  <Mic className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Voice Commands</h3>
              </div>
              <button
                onClick={() => setShowHelp(false)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                aria-label="Close help"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 max-h-96 overflow-y-auto">
              <p className="mb-4 text-sm text-gray-500">
                Click the microphone and say any of these naturally:
              </p>
              <div className="space-y-2">
                <div className="rounded-xl border border-gray-100 p-3 hover:bg-gray-50 transition-colors">
                  <p className="font-mono text-sm font-medium text-indigo-600">&quot;Go to courses&quot;</p>
                  <p className="mt-0.5 text-xs text-gray-500">Navigate to the courses page</p>
                </div>
                <div className="rounded-xl border border-gray-100 p-3 hover:bg-gray-50 transition-colors">
                  <p className="font-mono text-sm font-medium text-indigo-600">&quot;Open dashboard&quot;</p>
                  <p className="mt-0.5 text-xs text-gray-500">Go to your dashboard</p>
                </div>
                <div className="rounded-xl border border-gray-100 p-3 hover:bg-gray-50 transition-colors">
                  <p className="font-mono text-sm font-medium text-indigo-600">&quot;Search for React&quot;</p>
                  <p className="mt-0.5 text-xs text-gray-500">Search courses by topic</p>
                </div>
                <div className="rounded-xl border border-gray-100 p-3 hover:bg-gray-50 transition-colors">
                  <p className="font-mono text-sm font-medium text-indigo-600">&quot;Open chat&quot;</p>
                  <p className="mt-0.5 text-xs text-gray-500">Open the AI assistant</p>
                </div>
                <div className="rounded-xl border border-gray-100 p-3 hover:bg-gray-50 transition-colors">
                  <p className="font-mono text-sm font-medium text-indigo-600">&quot;Go to pricing&quot;</p>
                  <p className="mt-0.5 text-xs text-gray-500">View pricing plans</p>
                </div>
                <div className="rounded-xl border border-gray-100 p-3 hover:bg-gray-50 transition-colors">
                  <p className="font-mono text-sm font-medium text-indigo-600">&quot;Scroll down&quot;</p>
                  <p className="mt-0.5 text-xs text-gray-500">Scroll the page down</p>
                </div>
                <div className="rounded-xl border border-gray-100 p-3 hover:bg-gray-50 transition-colors">
                  <p className="font-mono text-sm font-medium text-indigo-600">&quot;Go back&quot;</p>
                  <p className="mt-0.5 text-xs text-gray-500">Navigate to previous page</p>
                </div>
                <div className="rounded-xl border border-gray-100 p-3 hover:bg-gray-50 transition-colors">
                  <p className="font-mono text-sm font-medium text-indigo-600">&quot;Help&quot;</p>
                  <p className="mt-0.5 text-xs text-gray-500">Show this list of commands</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 px-6 py-4">
              <Button
                onClick={() => setShowHelp(false)}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
              >
                Got it
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
