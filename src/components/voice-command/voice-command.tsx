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

const VOICE_COMMANDS = [
  { command: "navigate to courses", action: "navigate", target: "/courses", description: "Go to courses page" },
  { command: "navigate to dashboard", action: "navigate", target: "/dashboard", description: "Go to dashboard" },
  { command: "navigate to certificates", action: "navigate", target: "/dashboard/certificates", description: "Go to certificates" },
  { command: "navigate to quizzes", action: "navigate", target: "/quizzes", description: "Go to quizzes" },
  { command: "navigate to settings", action: "navigate", target: "/dashboard/settings", description: "Go to settings" },
  { command: "navigate to live classes", action: "navigate", target: "/live-classes", description: "Go to live classes" },
  { command: "navigate to training", action: "navigate", target: "/courses", description: "Go to training" },
  { command: "navigate to notifications", action: "navigate", target: "/dashboard/notifications", description: "Go to notifications" },
  { command: "navigate to bookmarks", action: "navigate", target: "/dashboard/bookmarks", description: "Go to bookmarks" },
  { command: "navigate to messages", action: "navigate", target: "/dashboard/messages", description: "Go to messages" },
  { command: "navigate to profile", action: "navigate", target: "/dashboard/profile", description: "Go to profile" },
  { command: "navigate to assignments", action: "navigate", target: "/dashboard/assignments", description: "Go to assignments" },
  { command: "go home", action: "navigate", target: "/", description: "Go to home page" },
  { command: "search for", action: "search", target: "", description: "Search for a course" },
  { command: "open chat", action: "openChat", target: "", description: "Open the AI chatbot" },
  { command: "help", action: "help", target: "", description: "Show available commands" },
];

function findCommand(transcript: string): { command: typeof VOICE_COMMANDS[0]; searchTerm?: string } | null {
  const lower = transcript.toLowerCase().trim();

  for (const cmd of VOICE_COMMANDS) {
    if (cmd.action === "search" && lower.startsWith(cmd.command)) {
      const searchTerm = lower.slice(cmd.command.length).trim();
      return { command: cmd, searchTerm: searchTerm || undefined };
    }
    if (lower === cmd.command || lower.includes(cmd.command)) {
      return { command: cmd };
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
        } else if (event.error !== "no-speech") {
          setFeedback("Error: " + event.error);
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
          router.push(command.target);
          break;
        case "search":
          if (searchTerm) {
            setFeedback(`Searching for "${searchTerm}"...`);
            router.push(`/courses?search=${encodeURIComponent(searchTerm)}`);
          } else {
            setFeedback("What would you like to search for?");
          }
          break;
        case "openChat":
          setFeedback("Opening chat...");
          const chatButton =
            document.querySelector<HTMLButtonElement>('[data-chat-toggle="true"]') ||
            document.querySelector<HTMLButtonElement>('[aria-label="Open chat"]');
          if (chatButton) {
            chatButton.click();
          } else {
            setFeedback("Chat button not found on this page.");
          }
          break;
        case "help":
          setShowHelp(true);
          setFeedback("Showing available commands");
          break;
      }

      clearFeedbackAfterDelay();
    },
    [router]
  );

  const clearFeedbackAfterDelay = () => {
    if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
    feedbackTimeoutRef.current = setTimeout(() => setFeedback(""), 4000);
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
      setFeedback("Listening... Try saying a command");
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
              className="absolute bottom-full left-0 mb-3 w-72 rounded-xl bg-gray-900 px-4 py-3 text-sm text-white shadow-xl"
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
        >
          <div className="mx-4 w-full max-w-md rounded-2xl bg-white shadow-2xl">
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
                Click the microphone button and say one of these commands:
              </p>
              <div className="space-y-2">
                {VOICE_COMMANDS.map((cmd) => (
                  <div
                    key={cmd.command}
                    className="flex items-center justify-between rounded-xl border border-gray-100 p-3 hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <p className="font-mono text-sm font-medium text-indigo-600">
                        &quot;{cmd.command}
                        {cmd.action === "search" ? " [course name]" : ""}&quot;
                      </p>
                      <p className="mt-0.5 text-xs text-gray-500">{cmd.description}</p>
                    </div>
                  </div>
                ))}
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
