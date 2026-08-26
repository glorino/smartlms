"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Award,
  RotateCcw,
  ArrowLeft,
  AlertCircle,
  Trophy,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import QuizEngine from "@/components/quiz/quiz-engine";
import type { Quiz, Question } from "@/types";

type Screen = "info" | "quiz" | "results";

interface QuizResult {
  score: number;
  totalPoints: number;
  passed: boolean;
  correctCount: number;
  incorrectCount: number;
  answers: Record<string, string>;
}

interface AttemptHistory {
  score: number;
  passed: boolean;
  completedAt: string;
}

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.id as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [screen, setScreen] = useState<Screen>("info");
  const [attemptCount, setAttemptCount] = useState(0);
  const [previousAttempts, setPreviousAttempts] = useState<AttemptHistory[]>([]);
  const [maxAttempts, setMaxAttempts] = useState<number | null>(null);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<QuizResult | null>(null);

  useEffect(() => {
    async function loadQuiz() {
      try {
        const res = await fetch(`/api/quizzes/${quizId}`);
        if (res.ok) {
          const data = await res.json();
          setQuiz(data.quiz);
          setAttemptCount(data.attemptCount || 0);
          setPreviousAttempts(data.previousAttempts || []);
          setMaxAttempts(data.maxAttempts || null);
        }
      } catch {
        console.error("Failed to load quiz");
      } finally {
        setLoading(false);
      }
    }
    loadQuiz();
  }, [quizId]);

  const handleSubmit = async (
    quizAnswers: Record<string, string | string[] | Record<string, string>>,
    attemptNumber: number
  ) => {
    if (!quiz) return;

    let correctCount = 0;
    let incorrectCount = 0;
    let totalPoints = 0;
    let score = 0;
    let passed = false;

    try {
      const res = await fetch(`/api/quizzes/${quizId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: quizAnswers,
          timeTaken: null,
          attemptNumber,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        score = data.score || 0;
        totalPoints = data.totalPoints || 0;
        passed = data.passed || false;
        correctCount = Object.values(data.results || {}).filter((r: any) => r.isCorrect).length;
        incorrectCount = Object.keys(data.results || {}).length - correctCount;
      } else {
        quiz.questions.forEach((q: Question) => {
          totalPoints += q.points;
          incorrectCount++;
        });
      }
    } catch (err) {
      console.error("Failed to submit quiz", err);
      quiz.questions.forEach((q: Question) => {
        totalPoints += q.points;
        incorrectCount++;
      });
    }

    setResult({
      score,
      totalPoints,
      passed,
      correctCount,
      incorrectCount,
      answers: quizAnswers as Record<string, string>,
    });
    setScreen("results");

    if (passed) {
    }
  };

  const startQuiz = () => {
    setScreen("quiz");
    setCurrentQuestion(0);
    setAnswers({});
  };

  const getQuestionTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      MULTIPLE_CHOICE: "Multiple Choice",
      SINGLE_CHOICE: "Single Choice",
      TRUE_FALSE: "True / False",
      SHORT_ANSWER: "Short Answer",
      LONG_ANSWER: "Long Answer",
      FILL_IN_BLANK: "Fill in the Blank",
      MATCHING: "Matching",
      ORDERING: "Ordering",
      MULTI_SELECT: "Multi Select",
      ESSAY: "Essay",
      FILE_UPLOAD: "File Upload",
      CODE: "Code",
      NUMERIC: "Numeric",
      RATING: "Rating",
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <AlertCircle className="h-12 w-12 text-gray-400" />
        <p className="text-gray-500">Quiz not found</p>
        <Link href="/dashboard/quizzes">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Quizzes
          </Button>
        </Link>
      </div>
    );
  }

  const currentAttemptNumber = attemptCount + 1;
  const maxAttemptsReached = maxAttempts !== null && attemptCount >= maxAttempts;

  // INFO SCREEN
  if (screen === "info") {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="mx-auto max-w-2xl px-4">
          <Link
            href="/dashboard/quizzes"
            className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Quizzes
          </Link>

          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">{quiz.title}</CardTitle>
              {quiz.description && (
                <p className="text-gray-500">{quiz.description}</p>
              )}
            </CardHeader>
            <CardContent>
              {/* Attempt Info Banner */}
              <div className="mb-6 rounded-xl border border-indigo-200 bg-indigo-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100">
                    <Trophy className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-indigo-800">
                      Attempt {currentAttemptNumber} of {maxAttempts ?? "∞"}
                    </p>
                    <p className="text-xs text-indigo-600">
                      {maxAttemptsReached
                        ? "You have used all your attempts"
                        : `${maxAttempts ? maxAttempts - attemptCount : "Unlimited"} attempts remaining`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Previous Attempts */}
              {previousAttempts.length > 0 && (
                <div className="mb-6">
                  <h4 className="mb-3 text-sm font-semibold text-gray-700">
                    Previous Attempts
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {previousAttempts.map((attempt, i) => (
                      <div
                        key={i}
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${
                          attempt.passed
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {attempt.passed ? (
                          <ShieldCheck className="h-3 w-3" />
                        ) : (
                          <AlertCircle className="h-3 w-3" />
                        )}
                        #{i + 1}: {Math.round(attempt.score)}% —{" "}
                        {attempt.passed ? "Passed" : "Failed"}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-xl bg-gray-50 p-4 text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {quiz.questions.length}
                  </p>
                  <p className="text-sm text-gray-500">Questions</p>
                </div>
                <div className="rounded-xl bg-gray-50 p-4 text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {quiz.timeLimit ? `${quiz.timeLimit}m` : "None"}
                  </p>
                  <p className="text-sm text-gray-500">Time Limit</p>
                </div>
                <div className="rounded-xl bg-gray-50 p-4 text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {quiz.passingScore}%
                  </p>
                  <p className="text-sm text-gray-500">Passing Score</p>
                </div>
                <div className="rounded-xl bg-gray-50 p-4 text-center">
                  <Badge variant={quiz.difficulty === "easy" ? "success" : quiz.difficulty === "hard" ? "danger" : "warning"}>
                    {quiz.difficulty}
                  </Badge>
                  <p className="mt-1 text-sm text-gray-500">Difficulty</p>
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
                <h4 className="font-medium text-amber-800">Instructions</h4>
                <ul className="mt-2 space-y-1 text-sm text-amber-700">
                  <li>• Read each question carefully before answering</li>
                  <li>• You can navigate between questions freely</li>
                  <li>• The quiz will auto-submit when time runs out</li>
                  <li>• You need {quiz.passingScore}% to pass</li>
                </ul>
              </div>

              {maxAttemptsReached ? (
                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-center">
                  <AlertCircle className="mx-auto mb-2 h-8 w-8 text-red-500" />
                  <p className="font-semibold text-red-700">Max Attempts Reached</p>
                  <p className="mt-1 text-sm text-red-600">
                    You have used all {maxAttempts} allowed attempts for this quiz.
                  </p>
                </div>
              ) : (
                <Button onClick={startQuiz} className="mt-6 w-full" size="lg">
                  Start Quiz
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // QUIZ SCREEN
  if (screen === "quiz") {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-5xl px-4">
          <QuizEngine
            quiz={quiz}
            maxAttempts={maxAttempts}
            currentAttempt={currentAttemptNumber}
            previousAttempts={previousAttempts}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    );
  }

  // RESULTS SCREEN
  if (screen === "results" && result) {
    const percentage =
      result.totalPoints > 0
        ? Math.round((result.score / result.totalPoints) * 100)
        : 0;

    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="mx-auto max-w-2xl px-4">
          <Card>
            <CardContent className="p-8 text-center">
              <div
                className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full ${
                  result.passed ? "bg-green-100" : "bg-red-100"
                }`}
              >
                {result.passed ? (
                  <Award className="h-10 w-10 text-green-600" />
                ) : (
                  <RotateCcw className="h-10 w-10 text-red-600" />
                )}
              </div>

              <h1 className="text-2xl font-bold text-gray-900">
                {result.passed ? "Congratulations!" : "Keep Practicing!"}
              </h1>
              <p className="mt-2 text-gray-600">
                {result.passed
                  ? "You passed the quiz!"
                  : "You didn't pass this time, but don't give up!"}
              </p>

              {/* Attempt badge */}
              <div className="mt-4">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                  <Trophy className="h-3 w-3" />
                  Attempt {currentAttemptNumber} of {maxAttempts ?? "∞"}
                </span>
              </div>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-3xl font-bold text-gray-900">
                    {percentage}%
                  </p>
                  <p className="text-sm text-gray-500">Your Score</p>
                </div>
                <div className="rounded-xl bg-green-50 p-4">
                  <p className="text-3xl font-bold text-green-600">
                    {result.correctCount}
                  </p>
                  <p className="text-sm text-gray-500">Correct</p>
                </div>
                <div className="rounded-xl bg-red-50 p-4">
                  <p className="text-3xl font-bold text-red-600">
                    {result.incorrectCount}
                  </p>
                  <p className="text-sm text-gray-500">Incorrect</p>
                </div>
              </div>

              <p className="mt-4 text-sm text-gray-500">
                Passing score: {quiz.passingScore}%
              </p>

              {/* Answer Review */}
              <div className="mt-8 text-left">
                <h3 className="mb-4 font-semibold text-gray-900">
                  Answer Review
                </h3>
                <div className="space-y-4">
                  {quiz.questions.map((q: Question, i: number) => {
                    const selectedId = result.answers[q.id];
                    const correctAnswer = q.answers.find((a) => a.isCorrect);
                    const isCorrect = selectedId === correctAnswer?.id;
                    const selectedAnswer = q.answers.find(
                      (a) => a.id === selectedId
                    );

                    return (
                      <div
                        key={q.id}
                        className={`rounded-xl border p-4 ${
                          isCorrect
                            ? "border-green-200 bg-green-50"
                            : "border-red-200 bg-red-50"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                              isCorrect ? "bg-green-500" : "bg-red-500"
                            }`}
                          >
                            {isCorrect ? (
                              <span className="text-xs text-white">✓</span>
                            ) : (
                              <span className="text-xs text-white">✗</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              Q{i + 1}. {q.content}
                            </p>
                            {!isCorrect && (
                              <div className="mt-2 space-y-1 text-sm">
                                <p className="text-red-600">
                                  Your answer:{" "}
                                  {selectedAnswer?.content || "No answer"}
                                </p>
                                <p className="text-green-600">
                                  Correct answer: {correctAnswer?.content}
                                </p>
                              </div>
                            )}
                            {q.explanation && (
                              <p className="mt-2 text-sm text-gray-600 italic">
                                {q.explanation}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                {!maxAttemptsReached && (
                  <Button
                    variant="outline"
                    onClick={startQuiz}
                    className="flex-1"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Retry
                  </Button>
                )}
                <Link href="/dashboard/quizzes" className="flex-1">
                  <Button className="w-full">Back to Quizzes</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return null;
}
