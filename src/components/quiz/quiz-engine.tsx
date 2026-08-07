"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  AlertCircle,
  Send,
} from "lucide-react";

type QuestionType = "multiple-choice" | "true-false" | "fill-blank" | "matching";

type Option = {
  id: string;
  text: string;
};

type Question = {
  id: string;
  type: QuestionType;
  text: string;
  options?: Option[];
  correctAnswer?: string | string[];
  points: number;
  explanation?: string;
};

type Quiz = {
  id: string;
  title: string;
  questions: Question[];
  timeLimit: number;
};

type QuizEngineProps = {
  quiz: Quiz;
  onSubmit?: (answers: Record<string, string | string[] | Record<string, string>>) => void;
};

export default function QuizEngine({ quiz, onSubmit }: QuizEngineProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[] | Record<string, string>>>({});
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;
  const answeredCount = Object.keys(answers).length;

  const handleSubmit = useCallback(() => {
    setIsSubmitted(true);
    setShowConfirm(false);
    onSubmit?.(answers);
  }, [answers, onSubmit]);

  useEffect(() => {
    if (isSubmitted) return;

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
  }, [isSubmitted, handleSubmit]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

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
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{quiz.title}</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </p>
          </div>
          <div
            className={`flex items-center gap-2 rounded-lg px-4 py-2 font-mono text-lg font-bold ${
              timeLeft < 60
                ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                : "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white"
            }`}
          >
            <Clock className="h-5 w-5" />
            {formatTime(timeLeft)}
          </div>
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
        <div className="mb-6">
          <div className="mb-4 flex items-start gap-2">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600 dark:bg-blue-900 dark:text-blue-400">
              {currentQuestionIndex + 1}
            </span>
            <div>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {currentQuestion.text}
              </p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {currentQuestion.points} point{currentQuestion.points !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {/* Answer Options */}
          {currentQuestion.type === "multiple-choice" && currentQuestion.options && (
            <div className="space-y-3">
              {currentQuestion.options.map((option) => {
                const isSelected = answers[currentQuestion.id] === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => handleAnswer(currentQuestion.id, option.id)}
                    disabled={isSubmitted}
                    className={`flex w-full items-center gap-3 rounded-lg border-2 p-4 text-left transition-all ${
                      isSubmitted
                        ? option.id === currentQuestion.correctAnswer
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
                    {isSubmitted && option.id === currentQuestion.correctAnswer && (
                      <Check className="ml-auto h-5 w-5 text-emerald-500" />
                    )}
                    {isSubmitted && isSelected && option.id !== currentQuestion.correctAnswer && (
                      <X className="ml-auto h-5 w-5 text-red-500" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {currentQuestion.type === "true-false" && (
            <div className="flex gap-4">
              {["true", "false"].map((value) => {
                const isSelected = answers[currentQuestion.id] === value;
                return (
                  <button
                    key={value}
                    onClick={() => handleAnswer(currentQuestion.id, value)}
                    disabled={isSubmitted}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-lg border-2 p-4 transition-all ${
                      isSubmitted
                        ? value === currentQuestion.correctAnswer
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
                  </button>
                );
              })}
            </div>
          )}

          {currentQuestion.type === "fill-blank" && (
            <input
              type="text"
              value={(answers[currentQuestion.id] as string) || ""}
              onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
              disabled={isSubmitted}
              placeholder="Type your answer..."
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          )}

          {currentQuestion.type === "matching" && currentQuestion.options && (
            <div className="space-y-3">
              {currentQuestion.options.map((option) => {
                const selectedMatch = (answers[currentQuestion.id] as Record<string, string>)?.[option.id];
                return (
                  <div key={option.id} className="flex items-center gap-4">
                    <span className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-700/50 dark:text-gray-300">
                      {option.text}
                    </span>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                    <select
                      value={selectedMatch || ""}
                      onChange={(e) => {
                        const current = (answers[currentQuestion.id] as Record<string, string>) || {};
                        handleAnswer(currentQuestion.id, { ...current, [option.id]: e.target.value } as Record<string, string>);
                      }}
                      disabled={isSubmitted}
                      className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Select match</option>
                      {currentQuestion.options?.map((opt) => (
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
    </div>
  );
}
