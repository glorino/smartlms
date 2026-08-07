"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Award,
  RotateCcw,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
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

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.id as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [screen, setScreen] = useState<Screen>("info");

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [result, setResult] = useState<QuizResult | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function loadQuiz() {
      try {
        const res = await fetch(`/api/quizzes/${quizId}`);
        if (res.ok) {
          const data = await res.json();
          setQuiz(data);
          if (data.timeLimit) {
            setTimeLeft(data.timeLimit * 60);
          }
        }
      } catch {
        console.error("Failed to load quiz");
      } finally {
        setLoading(false);
      }
    }
    loadQuiz();
  }, [quizId]);

  const startTimer = useCallback(() => {
    if (!quiz?.timeLimit) return;
    setTimeLeft(quiz.timeLimit * 60);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [quiz]);

  useEffect(() => {
    if (screen === "quiz" && quiz?.timeLimit) {
      startTimer();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [screen, quiz, startTimer]);

  useEffect(() => {
    if (timeLeft === 0 && screen === "quiz" && quiz?.timeLimit) {
      handleSubmit();
    }
  }, [timeLeft, screen, quiz]);

  const startQuiz = () => {
    setScreen("quiz");
    setCurrentQuestion(0);
    setAnswers({});
  };

  const selectAnswer = (questionId: string, answerId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answerId }));
  };

  const handleSubmit = async () => {
    if (timerRef.current) clearInterval(timerRef.current);

    if (!quiz) return;

    let correctCount = 0;
    let incorrectCount = 0;
    let totalPoints = 0;
    let score = 0;

    quiz.questions.forEach((q: Question) => {
      totalPoints += q.points;
      const selectedAnswerId = answers[q.id];
      const correctAnswer = q.answers.find((a) => a.isCorrect);
      if (selectedAnswerId && correctAnswer && selectedAnswerId === correctAnswer.id) {
        correctCount++;
        score += q.points;
      } else {
        incorrectCount++;
      }
    });

    const passed = totalPoints > 0 ? (score / totalPoints) * 100 >= quiz.passingScore : false;

    setResult({
      score,
      totalPoints,
      passed,
      correctCount,
      incorrectCount,
      answers,
    });
    setScreen("results");

    try {
      await fetch(`/api/quizzes/${quizId}/attempts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          score,
          totalPoints,
          passed,
          answers,
          timeTaken: quiz.timeLimit ? quiz.timeLimit * 60 - timeLeft : null,
        }),
      });
    } catch (err) {
      console.error("Failed to save attempt", err);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
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

              <Button onClick={startQuiz} className="mt-6 w-full" size="lg">
                Start Quiz
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // QUIZ SCREEN
  if (screen === "quiz") {
    const q = quiz.questions[currentQuestion];
    const answered = Object.keys(answers).length;
    const percentage = Math.round((answered / quiz.questions.length) * 100);

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Timer Bar */}
        <div className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <div className="flex items-center gap-4">
              <h2 className="text-sm font-semibold text-gray-900">
                {quiz.title}
              </h2>
              <Badge variant="secondary">
                {answered}/{quiz.questions.length} answered
              </Badge>
            </div>
            {quiz.timeLimit && (
              <div
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 font-mono text-sm font-bold ${
                  timeLeft < 60
                    ? "bg-red-50 text-red-600"
                    : timeLeft < 300
                    ? "bg-yellow-50 text-yellow-600"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                <Clock className="h-4 w-4" />
                {formatTime(timeLeft)}
              </div>
            )}
          </div>
          <Progress value={percentage} color="blue" />
        </div>

        <div className="mx-auto max-w-3xl px-4 py-8">
          {/* Question */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="mb-4 flex items-start justify-between">
                <Badge variant="outline">
                  Question {currentQuestion + 1} of {quiz.questions.length}
                </Badge>
                <Badge variant="secondary">{q.points} pts</Badge>
              </div>

              <p className="text-lg font-medium text-gray-900">{q.content}</p>
              {q.imageUrl && (
                <img
                  src={q.imageUrl}
                  alt="Question"
                  className="mt-4 max-h-64 rounded-lg border object-contain"
                />
              )}

              {/* Answers */}
              <div className="mt-6 space-y-3">
                {(q.type === "SINGLE_CHOICE" || q.type === "MULTIPLE_CHOICE" || q.type === "TRUE_FALSE") &&
                  q.answers.map((answer) => {
                    const isSelected = answers[q.id] === answer.id;
                    return (
                      <button
                        key={answer.id}
                        onClick={() => selectAnswer(q.id, answer.id)}
                        className={`flex w-full items-center gap-3 rounded-xl border-2 p-4 text-left transition-all ${
                          isSelected
                            ? "border-primary bg-primary/5"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <div
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                            isSelected
                              ? "border-primary bg-primary text-white"
                              : "border-gray-300"
                          }`}
                        >
                          {isSelected && <Check className="h-4 w-4" />}
                        </div>
                        <span className="text-sm text-gray-700">
                          {answer.content}
                        </span>
                      </button>
                    );
                  })}

                {q.type === "SHORT_ANSWER" && (
                  <input
                    type="text"
                    value={answers[q.id] || ""}
                    onChange={(e) => selectAnswer(q.id, e.target.value)}
                    placeholder="Type your answer..."
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                )}

                {q.type === "LONG_ANSWER" && (
                  <textarea
                    value={answers[q.id] || ""}
                    onChange={(e) => selectAnswer(q.id, e.target.value)}
                    placeholder="Type your answer..."
                    rows={4}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                )}

                {q.type === "FILL_IN_BLANK" && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700">The answer is:</span>
                    <input
                      type="text"
                      value={answers[q.id] || ""}
                      onChange={(e) => selectAnswer(q.id, e.target.value)}
                      className="w-48 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                )}

                {q.type === "NUMERIC" && (
                  <input
                    type="number"
                    value={answers[q.id] || ""}
                    onChange={(e) => selectAnswer(q.id, e.target.value)}
                    placeholder="Enter a number..."
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                )}
              </div>

              {q.hint && (
                <p className="mt-4 text-sm text-gray-500 italic">
                  Hint: {q.hint}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Question Navigation */}
          <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
            {quiz.questions.map((_, i) => {
              const questionId = quiz.questions[i].id;
              const isAnswered = !!answers[questionId];
              return (
                <button
                  key={i}
                  onClick={() => setCurrentQuestion(i)}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                    i === currentQuestion
                      ? "bg-primary text-white"
                      : isAnswered
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestion((p) => Math.max(0, p - 1))}
              disabled={currentQuestion === 0}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            {currentQuestion === quiz.questions.length - 1 ? (
              <Button
                onClick={handleSubmit}
                className="bg-green-600 hover:bg-green-700"
              >
                Submit Quiz
              </Button>
            ) : (
              <Button
                onClick={() =>
                  setCurrentQuestion((p) =>
                    Math.min(quiz.questions.length - 1, p + 1)
                  )
                }
              >
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
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
                  <X className="h-10 w-10 text-red-600" />
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

              <div className="mt-8 grid grid-cols-3 gap-4">
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
                              <Check className="h-4 w-4 text-white" />
                            ) : (
                              <X className="h-4 w-4 text-white" />
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
                <Button
                  variant="outline"
                  onClick={startQuiz}
                  className="flex-1"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Retry
                </Button>
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
