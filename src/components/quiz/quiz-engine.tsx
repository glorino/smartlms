"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  AlertCircle,
  Send,
  Trophy,
  RotateCcw,
} from "lucide-react";
import type { Quiz as AppQuiz, Question as AppQuestion, Answer as AppAnswer } from "@/types";

type QuizEngineProps = {
  quiz: AppQuiz;
  maxAttempts?: number | null;
  currentAttempt?: number;
  previousAttempts?: { score: number; passed: boolean; completedAt: string }[];
  onSubmit?: (answers: Record<string, string | string[] | Record<string, string>>, attemptNumber: number) => void;
};

function getTimerColor(percentage: number): string {
  if (percentage > 50) return "#22c55e";
  if (percentage > 25) return "#eab308";
  if (percentage > 10) return "#f97316";
  return "#ef4444";
}

function CircularTimer({
  timeLeft,
  totalTime,
}: {
  timeLeft: number;
  totalTime: number;
}) {
  const percentage = totalTime > 0 ? (timeLeft / totalTime) * 100 : 0;
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  const color = getTimerColor(percentage);
  const isPulsing = timeLeft <= 30;

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (
    <div className="relative flex items-center justify-center">
      <style jsx>{`
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.08); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes timesup-fade {
          0% { opacity: 0; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.05); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes timesup-badge {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .pulsing-ring {
          animation: pulse-ring 1s ease-in-out infinite;
        }
        .timesup-overlay {
          animation: timesup-fade 0.5s ease-out forwards;
        }
        .timesup-badge {
          animation: timesup-badge 0.6s ease-out 0.3s forwards;
          opacity: 0;
        }
      `}</style>
      <svg width="140" height="140" className={isPulsing ? "pulsing-ring" : ""}>
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="8"
          className="dark:stroke-gray-700"
        />
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 70 70)"
          style={{ transition: "stroke-dashoffset 1s linear, stroke 0.5s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-3xl font-bold text-gray-900 dark:text-white">
          {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {timeLeft <= 30 ? "Almost up!" : "remaining"}
        </span>
      </div>
    </div>
  );
}

function TimesUpOverlay() {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        .shake { animation: shake 0.6s ease-in-out; }
      `}</style>
      <div className="timesup-overlay mx-4 text-center">
        <div className="shake mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
          <Clock className="h-12 w-12 text-red-500" />
        </div>
        <h2 className="text-4xl font-bold text-white">Time&apos;s Up!</h2>
        <p className="mt-3 text-lg text-gray-300">
          Your quiz is being submitted automatically.
        </p>
        <div className="timesup-badge mt-6 inline-flex items-center gap-2 rounded-full bg-red-500/20 px-6 py-3 text-sm font-medium text-red-300">
          <AlertCircle className="h-4 w-4" />
          Auto-submitting your answers...
        </div>
      </div>
    </div>
  );
}

function mapDbQuestionType(dbType: string): string {
  const map: Record<string, string> = {
    MULTIPLE_CHOICE: "multiple-choice",
    SINGLE_CHOICE: "multiple-choice",
    TRUE_FALSE: "true-false",
    FILL_IN_BLANK: "fill-blank",
    FILL_BLANK: "fill-blank",
    MATCHING: "matching",
    MULTI_SELECT: "multi-select",
    SHORT_ANSWER: "short-answer",
    LONG_ANSWER: "long-answer",
    ESSAY: "long-answer",
    FILE_UPLOAD: "file-upload",
    CODE: "code",
    NUMERIC: "numeric",
    RATING: "rating",
    ORDERING: "ordering",
  };
  return map[dbType] || "multiple-choice";
}

function findCorrectAnswer(question: AppQuestion): string | undefined {
  const correct = question.answers.find((a) => a.isCorrect);
  return correct?.id;
}

function mapQuestionToOptions(question: AppQuestion) {
  return question.answers.map((a) => ({
    id: a.id,
    text: a.content,
    imageUrl: a.imageUrl,
  }));
}

export default function QuizEngine({
  quiz,
  maxAttempts = 3,
  currentAttempt = 1,
  previousAttempts = [],
  onSubmit,
}: QuizEngineProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[] | Record<string, string>>>({});
  const [timeLeft, setTimeLeft] = useState((quiz.timeLimit || 0) * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showTimesUp, setShowTimesUp] = useState(false);
  const totalTime = useRef((quiz.timeLimit || 0) * 60);

  const dbQuestion = quiz.questions[currentQuestionIndex];
  const mappedType = dbQuestion ? mapDbQuestionType(dbQuestion.type) : "multiple-choice";
  const mappedOptions = dbQuestion ? mapQuestionToOptions(dbQuestion) : [];
  const correctAnswer = dbQuestion ? findCorrectAnswer(dbQuestion) : undefined;
  const totalQuestions = quiz.questions.length;
  const answeredCount = Object.keys(answers).length;
  const maxAttemptsReached = maxAttempts !== null && maxAttempts !== undefined && currentAttempt > maxAttempts;

  const handleSubmit = useCallback(() => {
    if (isSubmitted) return;
    setShowTimesUp(true);
    setIsSubmitted(true);
    setShowConfirm(false);
    onSubmit?.(answers, currentAttempt);
  }, [answers, onSubmit, isSubmitted, currentAttempt]);

  useEffect(() => {
    if (isSubmitted) return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSubmitted, handleSubmit, timeLeft]);

  const handleAnswer = (questionId: string, answer: string | string[] | Record<string, string>) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleMultiSelect = (questionId: string, optionId: string) => {
    if (isSubmitted) return;
    setAnswers((prev) => {
      const current = (prev[questionId] as string[]) || [];
      const exists = current.includes(optionId);
      return {
        ...prev,
        [questionId]: exists
          ? current.filter((id) => id !== optionId)
          : [...current, optionId],
      };
    });
  };

  const getQuestionStatus = (index: number) => {
    const question = quiz.questions[index];
    if (answers[question.id] !== undefined) return "answered";
    return "unanswered";
  };

  return (
    <div className="flex min-h-[600px] flex-col rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 lg:flex-row">
      {/* Main Content */}
      <div className="flex flex-1 flex-col p-6">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{quiz.title}</h2>
            <div className="mt-1 flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                <Trophy className="h-3 w-3" />
                Attempt {currentAttempt} of {maxAttempts ?? "∞"}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </span>
            </div>
            {previousAttempts.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {previousAttempts.map((attempt, i) => (
                  <span
                    key={i}
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      attempt.passed
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}
                  >
                    {attempt.passed ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <X className="h-3 w-3" />
                    )}
                    #{i + 1}: {Math.round(attempt.score)}%
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Circular Timer */}
          {quiz.timeLimit && quiz.timeLimit > 0 && (
            <div className="flex-shrink-0">
              <CircularTimer timeLeft={timeLeft} totalTime={totalTime.current} />
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="h-full rounded-full bg-blue-500 transition-all duration-300"
              style={{
                width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Question */}
        {dbQuestion && (
        <div className="mb-6">
          <div className="mb-4 flex items-start gap-2">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600 dark:bg-blue-900 dark:text-blue-400">
              {currentQuestionIndex + 1}
            </span>
            <div>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {dbQuestion.content}
              </p>
              {dbQuestion.imageUrl && (
                <img
                  src={dbQuestion.imageUrl}
                  alt={`Question ${currentQuestionIndex + 1} image`}
                  className="mt-3 max-w-full rounded-lg object-contain"
                  style={{ maxHeight: 320 }}
                />
              )}
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {dbQuestion.points} point{dbQuestion.points !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {/* Answer Options */}
          {mappedType === "multiple-choice" && (
            <div className="space-y-3">
              {mappedOptions.map((option) => {
                const isSelected = answers[dbQuestion.id] === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => handleAnswer(dbQuestion.id, option.id)}
                    disabled={isSubmitted}
                    className={`flex w-full items-center gap-3 rounded-lg border-2 p-4 text-left transition-all ${
                      isSubmitted
                        ? option.id === correctAnswer
                          ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                          : isSelected
                          ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                          : "border-gray-200 dark:border-gray-700"
                        : isSelected
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
                    }`}
                  >
                    <div
                      className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 ${
                        isSelected
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    >
                      {isSelected && <div className="h-2 w-2 rounded-full bg-white" />}
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">{option.text}</span>
                    {option.imageUrl && (
                      <img
                        src={option.imageUrl}
                        alt={`Option ${option.text}`}
                        className="ml-auto max-h-16 rounded object-contain"
                      />
                    )}
                    {isSubmitted && option.id === correctAnswer && (
                      <Check className="ml-auto h-5 w-5 text-emerald-500" />
                    )}
                    {isSubmitted && isSelected && option.id !== correctAnswer && (
                      <X className="ml-auto h-5 w-5 text-red-500" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {mappedType === "true-false" && (
            <div className="flex gap-4">
              {["true", "false"].map((value) => {
                const isSelected = answers[dbQuestion.id] === value;
                const correctVal = dbQuestion.answers.find((a) => a.isCorrect);
                const correctText = correctVal ? correctVal.content.toLowerCase() : "";
                const tfOption = mappedOptions.find((o) => o.text.toLowerCase() === value);
                return (
                  <button
                    key={value}
                    onClick={() => handleAnswer(dbQuestion.id, value)}
                    disabled={isSubmitted}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-lg border-2 p-4 transition-all ${
                      isSubmitted
                        ? value === correctText
                          ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                          : isSelected
                          ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                          : "border-gray-200 dark:border-gray-700"
                        : isSelected
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
                    }`}
                  >
                    {value === "true" ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <X className="h-5 w-5" />
                    )}
                    <span className="font-medium text-gray-700 dark:text-gray-300 capitalize">
                      {value}
                    </span>
                    {tfOption?.imageUrl && (
                      <img
                        src={tfOption.imageUrl}
                        alt={`${value} option`}
                        className="max-h-12 rounded object-contain"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {mappedType === "fill-blank" && (
            <input
              type="text"
              value={(answers[dbQuestion.id] as string) || ""}
              onChange={(e) => handleAnswer(dbQuestion.id, e.target.value)}
              disabled={isSubmitted}
              placeholder="Type your answer..."
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          )}

          {mappedType === "matching" && (
            <div className="space-y-3">
              {mappedOptions.map((option) => {
                const selectedMatch = (answers[dbQuestion.id] as Record<string, string>)?.[option.id];
                return (
                  <div key={option.id} className="flex items-center gap-4">
                    <span className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-700/50 dark:text-gray-300">
                      {option.text}
                    </span>
                    {option.imageUrl && (
                      <img
                        src={option.imageUrl}
                        alt={`Match option ${option.text}`}
                        className="max-h-12 rounded object-contain"
                      />
                    )}
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                    <select
                      value={selectedMatch || ""}
                      onChange={(e) => {
                        const current = (answers[dbQuestion.id] as Record<string, string>) || {};
                        handleAnswer(dbQuestion.id, { ...current, [option.id]: e.target.value } as Record<string, string>);
                      }}
                      disabled={isSubmitted}
                      className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Select match</option>
                      {mappedOptions.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.text}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        )}

        {/* Navigation */}
        <div className="mt-auto flex items-center justify-between">
          <button
            onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0}
            className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>

          <div className="flex items-center gap-3">
            {currentQuestionIndex === totalQuestions - 1 ? (
              <button
                onClick={() => setShowConfirm(true)}
                className="flex items-center gap-2 rounded-lg bg-blue-500 px-6 py-2 text-sm font-medium text-white hover:bg-blue-600"
              >
                <Send className="h-4 w-4" />
                Submit Quiz
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestionIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar - Question Navigation */}
      <div className="w-full border-t border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-700/30 lg:w-64 lg:border-t-0 lg:border-l">
        <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
          Questions
        </h3>
        <div className="grid grid-cols-5 gap-2 lg:grid-cols-4">
          {quiz.questions.map((question, index) => {
            const status = getQuestionStatus(index);
            return (
              <button
                key={question.id}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`flex h-10 w-full items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                  index === currentQuestionIndex
                    ? "bg-blue-500 text-white"
                    : status === "answered"
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                    : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-blue-500" />
            <span className="text-gray-600 dark:text-gray-400">Current</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-emerald-100 dark:bg-emerald-900/30" />
            <span className="text-gray-600 dark:text-gray-400">Answered ({answeredCount})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-white dark:bg-gray-700" />
            <span className="text-gray-600 dark:text-gray-400">
              Unanswered ({totalQuestions - answeredCount})
            </span>
          </div>
        </div>

        {/* Attempt Info */}
        <div className="mt-4 rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-600 dark:bg-gray-800">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Attempt Info</p>
          <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
            {currentAttempt} / {maxAttempts ?? "∞"}
          </p>
          {maxAttemptsReached && (
            <p className="mt-1 text-xs text-red-500">Max attempts reached</p>
          )}
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30">
              <AlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Submit Quiz?
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              You have answered {answeredCount} out of {totalQuestions} questions.
              {answeredCount < totalQuestions && (
                <span className="mt-1 block text-yellow-600 dark:text-yellow-400">
                  You still have {totalQuestions - answeredCount} unanswered questions.
                </span>
              )}
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Time's Up Overlay */}
      {showTimesUp && <TimesUpOverlay />}
    </div>
  );
}
