"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  FileQuestion,
  Clock,
  Award,
  Play,
  Check,
  X,
  BookOpen,
  Filter,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Spinner } from "@/components/ui/spinner";

interface QuizItem {
  id: string;
  title: string;
  description: string | null;
  difficulty: string;
  timeLimit: number | null;
  passingScore: number;
  totalQuestions: number;
  courseName: string;
  courseId: string;
}

interface QuizAttempt {
  id: string;
  quizId: string;
  quizTitle: string;
  courseName: string;
  score: number;
  totalPoints: number;
  passed: boolean;
  completedAt: string;
  timeTaken: number | null;
}

export default function MyQuizzesPage() {
  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [courseFilter, setCourseFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");

  useEffect(() => {
    async function loadData() {
      try {
        const [quizzesRes, attemptsRes] = await Promise.all([
          fetch("/api/quizzes"),
          fetch("/api/quizzes/attempts"),
        ]);

        if (quizzesRes.ok) {
          const data = await quizzesRes.json();
          const quizList = Array.isArray(data) ? data : data.quizzes || data.data || [];
          setQuizzes(quizList);
        } else if (quizzesRes.status === 500) {
          setError("Failed to load quizzes. Please try again later.");
        }

        if (attemptsRes.ok) {
          const data = await attemptsRes.json();
          const attemptList = Array.isArray(data) ? data : data.attempts || data.data || [];
          setAttempts(attemptList);
        }
      } catch (e) {
        console.error("Failed to load quiz data:", e);
        setError("Failed to connect to the server. Please check your connection.");
        setQuizzes([]);
        setAttempts([]);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const courseNames = useMemo(
    () => [...new Set(quizzes.map((q) => q.courseName))],
    [quizzes]
  );

  const filteredQuizzes = useMemo(() => {
    return quizzes.filter((q) => {
      const matchesCourse =
        courseFilter === "all" || q.courseName === courseFilter;
      const matchesDifficulty =
        difficultyFilter === "all" ||
        q.difficulty.toLowerCase() === difficultyFilter;
      return matchesCourse && matchesDifficulty;
    });
  }, [quizzes, courseFilter, difficultyFilter]);

  const getDifficultyColor = (d: string) => {
    switch (d.toLowerCase()) {
      case "easy":
        return "success";
      case "medium":
        return "warning";
      case "hard":
        return "danger";
      default:
        return "secondary";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Spinner size="lg" />
        <p className="text-sm text-gray-500">Loading quizzes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Quizzes</h1>
          <p className="mt-1 text-gray-600">Test your knowledge and track your progress</p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-red-100 p-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Something went wrong</h3>
            <p className="mt-1 text-sm text-gray-500">{error}</p>
            <Button
              className="mt-4"
              variant="outline"
              onClick={() => {
                setLoading(true);
                setError(null);
                fetch("/api/quizzes")
                  .then((r) => r.json())
                  .then((data) => {
                    const list = Array.isArray(data) ? data : data.quizzes || data.data || [];
                    setQuizzes(list);
                  })
                  .catch(() => setError("Failed to connect to the server."))
                  .finally(() => setLoading(false));
              }}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Quizzes</h1>
        <p className="mt-1 text-gray-600">
          Test your knowledge and track your progress
        </p>
      </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none"
            >
              <option value="all">All Courses</option>
              {courseNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <Tabs defaultValue="available">
          <TabsList>
            <TabsTrigger value="available">
              Available ({filteredQuizzes.length})
            </TabsTrigger>
            <TabsTrigger value="attempts">
              Past Attempts ({attempts.length})
            </TabsTrigger>
          </TabsList>

          {/* Available Quizzes */}
          <TabsContent value="available">
            {filteredQuizzes.length === 0 ? (
              <Card className="mt-6">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="rounded-full bg-gray-100 p-4">
                    <FileQuestion className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">
                    No quizzes available
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 max-w-sm text-center">
                    {quizzes.length === 0
                      ? "No quizzes have been published yet. Enroll in a course to unlock quizzes."
                      : "No quizzes match your current filters. Try adjusting your filters."}
                  </p>
                  <Link href="/courses" className="mt-4">
                    <Button variant="outline">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Browse Courses
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredQuizzes.map((quiz) => (
                  <Card
                    key={quiz.id}
                    className="group transition-shadow hover:shadow-md"
                  >
                    <CardContent className="p-5">
                      <div className="mb-3 flex items-start justify-between">
                        <Badge variant={getDifficultyColor(quiz.difficulty) as any}>
                          {quiz.difficulty}
                        </Badge>
                        {quiz.timeLimit && (
                          <span className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="h-3.5 w-3.5" />
                            {quiz.timeLimit} min
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {quiz.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {quiz.courseName}
                      </p>
                      {quiz.description && (
                        <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                          {quiz.description}
                        </p>
                      )}
                      <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                        <span>{quiz.totalQuestions} questions</span>
                        <span>Pass: {quiz.passingScore}%</span>
                      </div>
                      <Link href={`/quiz/${quiz.id}`}>
                        <Button className="mt-4 w-full">
                          <Play className="mr-2 h-4 w-4" />
                          Start Quiz
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Past Attempts */}
          <TabsContent value="attempts">
            {attempts.length === 0 ? (
              <Card className="mt-6">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="rounded-full bg-gray-100 p-4">
                    <Award className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">
                    No quiz attempts yet
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 max-w-sm text-center">
                    Start a quiz to see your results here
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="mt-6 space-y-3">
                {attempts.map((attempt) => {
                  const percentage =
                    attempt.totalPoints > 0
                      ? Math.round(
                          (attempt.score / attempt.totalPoints) * 100
                        )
                      : 0;
                  return (
                    <Card key={attempt.id}>
                      <CardContent className="flex items-center gap-4 p-4">
                        <div
                          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${
                            attempt.passed ? "bg-green-50" : "bg-red-50"
                          }`}
                        >
                          {attempt.passed ? (
                            <Check className="h-7 w-7 text-green-600" />
                          ) : (
                            <X className="h-7 w-7 text-red-600" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {attempt.quizTitle}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {attempt.courseName}
                              </p>
                            </div>
                            <Badge
                              variant={attempt.passed ? "success" : "danger"}
                            >
                              {attempt.passed ? "Passed" : "Failed"}
                            </Badge>
                          </div>
                          <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                            <span>
                              Score: {attempt.score}/{attempt.totalPoints} (
                              {percentage}%)
                            </span>
                            <span>
                              {new Date(
                                attempt.completedAt
                              ).toLocaleDateString()}
                            </span>
                            {attempt.timeTaken && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                {Math.floor(attempt.timeTaken / 60)}m
                              </span>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
    </div>
  );
}
