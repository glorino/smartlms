"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Clock,
  Target,
  BookOpen,
  Award,
  BarChart3,
  Brain,
  Zap,
  Calendar,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface QuizAttempt {
  id: string;
  quizTitle: string;
  courseName: string;
  score: number;
  totalPoints: number;
  passed: boolean;
  completedAt: string;
}

interface Grade {
  id: string;
  score: number;
  totalPoints: number;
  percentage: number;
  letterGrade: string;
  type: string;
  createdAt: string;
}

interface Enrollment {
  id: string;
  progress: number;
  status: string;
  course: { id: string; title: string };
}

export default function PerformancePage() {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "all">("week");
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [quizRes, gradeRes, enrollRes] = await Promise.allSettled([
          fetch("/api/quizzes/attempts"),
          fetch("/api/grades"),
          fetch("/api/enrollments"),
        ]);

        if (quizRes.status === "fulfilled" && quizRes.value.ok) {
          const data = await quizRes.value.json();
          setQuizAttempts(data.attempts || []);
        }
        if (gradeRes.status === "fulfilled" && gradeRes.value.ok) {
          const data = await gradeRes.value.json();
          setGrades(data.grades || []);
        }
        if (enrollRes.status === "fulfilled" && enrollRes.value.ok) {
          const data = await enrollRes.value.json();
          setEnrollments(data.enrollments || []);
        }
      } catch {
        // Use empty state
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const averageScore = grades.length > 0
    ? Math.round(grades.reduce((acc, g) => acc + g.percentage, 0) / grades.length)
    : quizAttempts.length > 0
      ? Math.round(quizAttempts.reduce((acc, a) => acc + a.score, 0) / quizAttempts.length)
      : 0;

  const totalHours = enrollments.reduce((acc, e) => acc + (e.progress / 100) * 10, 0);

  const completedCourses = enrollments.filter((e) => e.status === "COMPLETED").length;
  const totalCourses = enrollments.length;

  const courseProgress = enrollments.slice(0, 5).map((e) => ({
    name: e.course.title,
    progress: Math.round(e.progress),
    total: 100,
    completed: Math.round(e.progress),
  }));

  const quizHistory = quizAttempts.slice(0, 10).map((a) => ({
    id: a.id,
    name: a.quizTitle,
    score: Math.round(a.score),
    date: new Date(a.completedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    course: a.courseName,
    passed: a.passed,
  }));

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const recentAttempts = quizAttempts.filter((a) => new Date(a.completedAt) >= weekAgo);
  const dailyCounts = daysOfWeek.map((_, i) => {
    const dayStart = new Date(weekAgo.getTime() + i * 24 * 60 * 60 * 1000);
    const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
    const count = recentAttempts.filter((a) => {
      const d = new Date(a.completedAt);
      return d >= dayStart && d < dayEnd;
    }).length;
    return count;
  });
  const activeDays = enrollments.filter((e) => e.status === "ACTIVE").length;
  const learningData = daysOfWeek.map((day, i) => ({
    day,
    hours: dailyCounts[i] > 0 ? dailyCounts[i] * 0.5 + activeDays * 0.3 : activeDays * 0.1,
  }));

  const maxHours = Math.max(...learningData.map((d) => d.hours));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Performance Analytics</h1>
        <p className="mt-1 text-gray-600">
          Track your learning progress and get AI-powered recommendations
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Average Score</p>
                <p className="mt-1 text-3xl font-bold text-gray-900">{loading ? "—" : `${averageScore}%`}</p>
                <div className="mt-1 flex items-center gap-1 text-xs text-emerald-600">
                  <TrendingUp className="h-3 w-3" />
                  {grades.length > 0 ? "Based on graded work" : quizAttempts.length > 0 ? "Based on quiz attempts" : "No data yet"}
                </div>
              </div>
              <div className="rounded-xl bg-blue-500 p-3">
                <Target className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Quizzes Taken</p>
                <p className="mt-1 text-3xl font-bold text-gray-900">{loading ? "—" : quizAttempts.length}</p>
                <p className="mt-1 text-xs text-gray-400">All time</p>
              </div>
              <div className="rounded-xl bg-emerald-500 p-3">
                <CheckCircle2 className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Learning Hours</p>
                <p className="mt-1 text-3xl font-bold text-gray-900">{loading ? "—" : `${totalHours.toFixed(1)}h`}</p>
                <p className="mt-1 text-xs text-gray-400">This week</p>
              </div>
              <div className="rounded-xl bg-amber-500 p-3">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Courses Completed</p>
                <p className="mt-1 text-3xl font-bold text-gray-900">
                  {loading ? "—" : `${completedCourses}/${totalCourses}`}
                </p>
                <p className="mt-1 text-xs text-gray-400">In progress</p>
              </div>
              <div className="rounded-xl bg-rose-500 p-3">
                <Award className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Learning Time Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-amber-500" />
                  Learning Time
                </CardTitle>
                <CardDescription>Hours spent learning each day</CardDescription>
              </div>
              <div className="flex gap-1 rounded-lg border border-gray-200 bg-white p-1">
                {(["week", "month", "all"] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`rounded-md px-2.5 py-1 text-xs font-medium capitalize transition-colors ${
                      timeRange === range
                        ? "bg-indigo-100 text-indigo-700"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 h-48">
              {learningData.map((day) => (
                <div key={day.day} className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-xs font-medium text-gray-600">
                    {day.hours}h
                  </span>
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-indigo-500 to-indigo-400 transition-all duration-300"
                    style={{
                      height: `${(day.hours / maxHours) * 120}px`,
                    }}
                  />
                  <span className="text-xs text-gray-500">{day.day}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quiz Scores */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              Quiz Scores
            </CardTitle>
            <CardDescription>Your recent quiz performance</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8 text-gray-400">Loading...</div>
            ) : quizHistory.length === 0 ? (
              <div className="flex justify-center py-8 text-gray-400 text-sm">No quiz attempts yet</div>
            ) : (
              <div className="space-y-3">
                {quizHistory.map((quiz) => (
                  <div key={quiz.id} className="flex items-center gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {quiz.name}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-bold ${
                            quiz.score >= 90
                              ? "text-emerald-600"
                              : quiz.score >= 80
                                ? "text-blue-600"
                                : "text-amber-600"
                          }`}>
                            {quiz.score}%
                          </span>
                          {quiz.passed ? (
                            <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500" />
                          ) : (
                            <ArrowDownRight className="h-3.5 w-3.5 text-red-500" />
                          )}
                        </div>
                      </div>
                      <div className="mt-1.5 flex items-center gap-2">
                        <Progress
                          value={quiz.score}
                          className="h-1.5 flex-1"
                          color={quiz.score >= 90 ? "green" : quiz.score >= 80 ? "blue" : "yellow"}
                        />
                        <span className="text-[10px] text-gray-400 whitespace-nowrap">
                          {quiz.date}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Course Completion */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-indigo-500" />
            Course Progress
          </CardTitle>
          <CardDescription>Track your completion across enrolled courses</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8 text-gray-400">Loading...</div>
          ) : courseProgress.length === 0 ? (
            <div className="flex justify-center py-8 text-gray-400 text-sm">No enrolled courses</div>
          ) : (
            <div className="space-y-6">
              {courseProgress.map((course, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900">{course.name}</p>
                    </div>
                    <Badge
                      variant={
                        course.progress >= 75
                          ? "success"
                          : course.progress >= 40
                            ? "warning"
                            : "secondary"
                      }
                    >
                      {course.progress}%
                    </Badge>
                  </div>
                  <Progress
                    value={course.progress}
                    className="h-2"
                    color={
                      course.progress >= 75
                        ? "green"
                        : course.progress >= 40
                          ? "default"
                          : "blue"
                    }
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card className="overflow-hidden border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-500" />
            AI Recommendations
          </CardTitle>
          <CardDescription>
            Personalized suggestions based on your performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            {averageScore < 70 && quizAttempts.length > 0 && (
              <div className="rounded-xl border border-indigo-200 bg-white p-5 transition-shadow hover:shadow-md">
                <Badge variant="danger" className="mb-3">
                  high priority
                </Badge>
                <h3 className="text-sm font-semibold text-gray-900">
                  Improve Quiz Scores
                </h3>
                <p className="mt-1.5 text-xs text-gray-600">
                  Your average score is {averageScore}%. Review course materials to improve.
                </p>
                <a
                  href="/dashboard/quizzes"
                  className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                >
                  View Quizzes
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            )}
            {completedCourses < totalCourses && totalCourses > 0 && (
              <div className="rounded-xl border border-indigo-200 bg-white p-5 transition-shadow hover:shadow-md">
                <Badge variant="warning" className="mb-3">
                  medium priority
                </Badge>
                <h3 className="text-sm font-semibold text-gray-900">
                  Complete Enrolled Courses
                </h3>
                <p className="mt-1.5 text-xs text-gray-600">
                  You have {totalCourses - completedCourses} course{totalCourses - completedCourses !== 1 ? "s" : ""} in progress. Keep going!
                </p>
                <a
                  href="/dashboard/courses"
                  className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                >
                  My Courses
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            )}
            {completedCourses >= 2 && (
              <div className="rounded-xl border border-indigo-200 bg-white p-5 transition-shadow hover:shadow-md">
                <Badge variant="success" className="mb-3">
                  suggestion
                </Badge>
                <h3 className="text-sm font-semibold text-gray-900">
                  Explore New Topics
                </h3>
                <p className="mt-1.5 text-xs text-gray-600">
                  You have completed {completedCourses} course{completedCourses !== 1 ? "s" : ""}. Try something new!
                </p>
                <a
                  href="/courses"
                  className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                >
                  Browse Courses
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            )}
            {quizAttempts.length === 0 && (
              <div className="rounded-xl border border-indigo-200 bg-white p-5 transition-shadow hover:shadow-md">
                <Badge variant="warning" className="mb-3">
                  medium priority
                </Badge>
                <h3 className="text-sm font-semibold text-gray-900">
                  Take a Quiz
                </h3>
                <p className="mt-1.5 text-xs text-gray-600">
                  Test your knowledge with quizzes in your courses.
                </p>
                <a
                  href="/dashboard/quizzes"
                  className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                >
                  View Quizzes
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            )}
            {averageScore >= 70 && completedCourses > 0 && (
              <div className="rounded-xl border border-indigo-200 bg-white p-5 transition-shadow hover:shadow-md">
                <Badge variant="success" className="mb-3">
                  great progress
                </Badge>
                <h3 className="text-sm font-semibold text-gray-900">
                  Great Work!
                </h3>
                <p className="mt-1.5 text-xs text-gray-600">
                  Your average score is {averageScore}%. Keep up the excellent work!
                </p>
                <a
                  href="/dashboard/certificates"
                  className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                >
                  View Certificates
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
