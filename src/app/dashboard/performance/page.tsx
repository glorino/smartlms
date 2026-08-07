"use client";

import { useState } from "react";
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const quizHistory = [
  { id: 1, name: "React Hooks Quiz", score: 92, date: "Aug 5, 2026", course: "Web Development", trend: "up" as const },
  { id: 2, name: "CSS Grid Fundamentals", score: 88, date: "Aug 3, 2026", course: "Web Development", trend: "up" as const },
  { id: 3, name: "JavaScript Basics", score: 85, date: "Jul 28, 2026", course: "Web Development", trend: "neutral" as const },
  { id: 4, name: "Node.js Fundamentals", score: 78, date: "Jul 22, 2026", course: "Node.js Masterclass", trend: "down" as const },
  { id: 5, name: "HTML & CSS Quiz", score: 95, date: "Jul 15, 2026", course: "Web Development", trend: "up" as const },
  { id: 6, name: "Git Version Control", score: 90, date: "Jul 10, 2026", course: "DevOps Basics", trend: "up" as const },
];

const courseProgress = [
  { name: "Complete Web Development Bootcamp", progress: 35, total: 42, completed: 15, color: "blue" as const },
  { name: "Machine Learning & AI Masterclass", progress: 12, total: 38, completed: 5, color: "green" as const },
  { name: "UI/UX Design Fundamentals", progress: 68, total: 30, completed: 20, color: "yellow" as const },
];

const learningData = [
  { day: "Mon", hours: 2.5 },
  { day: "Tue", hours: 1.8 },
  { day: "Wed", hours: 3.2 },
  { day: "Thu", hours: 0.5 },
  { day: "Fri", hours: 2.0 },
  { day: "Sat", hours: 4.1 },
  { day: "Sun", hours: 1.5 },
];

const strengths = [
  { topic: "HTML & CSS", score: 95, icon: "🎨" },
  { topic: "React Fundamentals", score: 92, icon: "⚛️" },
  { topic: "JavaScript ES6+", score: 88, icon: "📜" },
];

const weaknesses = [
  { topic: "Node.js Backend", score: 72, icon: "🔧", suggestion: "Review Express.js middleware and async/await patterns" },
  { topic: "Database Design", score: 68, icon: "🗄️", suggestion: "Practice SQL queries and normalization concepts" },
  { topic: "Testing", score: 65, icon: "🧪", suggestion: "Complete the Testing Fundamentals course module" },
];

const aiRecommendations = [
  {
    title: "Strengthen Backend Skills",
    description: "Based on your quiz scores, focus on Node.js and Express.js concepts.",
    action: "Start Practice",
    href: "/courses",
    priority: "high" as const,
  },
  {
    title: "Complete Your Current Course",
    description: "You're 68% through UI/UX Design. Finish the remaining 10 lessons!",
    action: "Continue",
    href: "/courses",
    priority: "medium" as const,
  },
  {
    title: "Try a Database Course",
    description: "SQL and database design will complement your web development skills.",
    action: "Browse Courses",
    href: "/courses",
    priority: "medium" as const,
  },
];

const maxHours = Math.max(...learningData.map((d) => d.hours));

export default function PerformancePage() {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "all">("week");

  const averageScore = Math.round(
    quizHistory.reduce((acc, q) => acc + q.score, 0) / quizHistory.length
  );

  const totalHours = learningData.reduce((acc, d) => acc + d.hours, 0);

  const completedCourses = courseProgress.filter((c) => c.progress === 100).length;
  const totalCourses = courseProgress.length;

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
                <p className="mt-1 text-3xl font-bold text-gray-900">{averageScore}%</p>
                <div className="mt-1 flex items-center gap-1 text-xs text-emerald-600">
                  <TrendingUp className="h-3 w-3" />
                  +5% from last month
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
                <p className="mt-1 text-3xl font-bold text-gray-900">{quizHistory.length}</p>
                <p className="mt-1 text-xs text-gray-400">Last 30 days</p>
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
                <p className="mt-1 text-3xl font-bold text-gray-900">{totalHours.toFixed(1)}h</p>
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
                  {completedCourses}/{totalCourses}
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

        {/* Quiz Scores Over Time */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              Quiz Scores
            </CardTitle>
            <CardDescription>Your recent quiz performance</CardDescription>
          </CardHeader>
          <CardContent>
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
                        {quiz.trend === "up" && (
                          <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500" />
                        )}
                        {quiz.trend === "down" && (
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
          <div className="space-y-6">
            {courseProgress.map((course, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">{course.name}</p>
                    <p className="text-xs text-gray-500">
                      {course.completed} of {course.total} lessons completed
                    </p>
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
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Strengths */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-emerald-500" />
              Strengths
            </CardTitle>
            <CardDescription>Topics where you excel</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {strengths.map((s, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-2xl">{s.icon}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">{s.topic}</p>
                    <div className="mt-1">
                      <Progress
                        value={s.score}
                        className="h-2"
                        color="green"
                      />
                    </div>
                  </div>
                  <span className="text-sm font-bold text-emerald-600">{s.score}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weaknesses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-amber-500" />
              Areas for Improvement
            </CardTitle>
            <CardDescription>Topics to focus on</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weaknesses.map((w, i) => (
                <div key={i} className="rounded-lg border border-amber-200 bg-amber-50/50 p-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{w.icon}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">{w.topic}</p>
                        <span className="text-sm font-bold text-amber-600">{w.score}%</span>
                      </div>
                      <div className="mt-1">
                        <Progress
                          value={w.score}
                          className="h-2"
                          color="yellow"
                        />
                      </div>
                      <p className="mt-1.5 text-xs text-gray-600">
                        💡 {w.suggestion}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

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
            {aiRecommendations.map((rec, i) => (
              <div
                key={i}
                className="rounded-xl border border-indigo-200 bg-white p-5 transition-shadow hover:shadow-md"
              >
                <Badge
                  variant={rec.priority === "high" ? "danger" : "warning"}
                  className="mb-3"
                >
                  {rec.priority} priority
                </Badge>
                <h3 className="text-sm font-semibold text-gray-900">
                  {rec.title}
                </h3>
                <p className="mt-1.5 text-xs text-gray-600">
                  {rec.description}
                </p>
                <a
                  href={rec.href}
                  className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                >
                  {rec.action}
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
