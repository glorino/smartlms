"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  BookOpen,
  Award,
  TrendingUp,
  Clock,
  Play,
  Calendar,
  BarChart3,
  ChevronRight,
  FileCheck,
  ArrowUpRight,
  Users,
  DollarSign,
  Package,
  PlusCircle,
  Flame,
  Target,
  Zap,
  BookMarked,
  Trophy,
  Star,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  GraduationCap,
  Timer,
  Medal,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const motivationalQuotes = [
  "The expert in anything was once a beginner.",
  "Success is the sum of small efforts, repeated day in and day out.",
  "The only way to do great work is to love what you do.",
  "Learning never exhausts the mind.",
  "Education is the passport to the future.",
];

const recentActivityData = [
  {
    id: 1,
    type: "quiz",
    title: "Completed Quiz: React Hooks",
    course: "Complete Web Development Bootcamp",
    time: "2 hours ago",
    score: 92,
    icon: FileCheck,
    color: "bg-blue-100 text-blue-600",
  },
  {
    id: 2,
    type: "lesson",
    title: "Completed Lesson: Node.js Basics",
    course: "Node.js Masterclass",
    time: "5 hours ago",
    icon: CheckCircle2,
    color: "bg-green-100 text-green-600",
  },
  {
    id: 3,
    type: "certificate",
    title: "Earned Certificate",
    course: "UI/UX Design Fundamentals",
    time: "2 days ago",
    icon: Award,
    color: "bg-amber-100 text-amber-600",
  },
  {
    id: 4,
    type: "quiz",
    title: "Completed Quiz: CSS Grid",
    course: "Complete Web Development Bootcamp",
    time: "3 days ago",
    score: 88,
    icon: FileCheck,
    color: "bg-blue-100 text-blue-600",
  },
];

const upcomingDeadlines = [
  {
    id: 1,
    title: "JavaScript Advanced Quiz",
    course: "Web Development Bootcamp",
    dueDate: "Tomorrow, 11:59 PM",
    type: "quiz",
    urgent: true,
  },
  {
    id: 2,
    title: "ML Model Assignment",
    course: "Machine Learning & AI",
    dueDate: "Aug 12, 2026",
    type: "assignment",
    urgent: false,
  },
  {
    id: 3,
    title: "Design Portfolio Submission",
    course: "UI/UX Design Fundamentals",
    dueDate: "Aug 15, 2026",
    type: "assignment",
    urgent: false,
  },
];

const recommendedCourses = [
  {
    id: 1,
    title: "TypeScript Mastery",
    category: "Web Development",
    rating: 4.8,
    students: 1234,
    image: "/courses/typescript.jpg",
    price: "Free",
  },
  {
    id: 2,
    title: "Python for Data Science",
    category: "Data Science",
    rating: 4.9,
    students: 2345,
    image: "/courses/python.jpg",
    price: "$29.99",
  },
  {
    id: 3,
    title: "Docker & Kubernetes",
    category: "DevOps",
    rating: 4.7,
    students: 987,
    image: "/courses/docker.jpg",
    price: "$39.99",
  },
];

export default function DashboardPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const role = (user as any)?.role || "STUDENT";

  const [quote] = useState(
    () => motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
  );

  const stats =
    role === "ADMIN"
      ? [
          { label: "Total Users", value: "1,234", icon: Users, color: "bg-blue-500", change: "+12%", trend: "up" as const, subtitle: "users" },
          { label: "Total Courses", value: "56", icon: BookOpen, color: "bg-emerald-500", change: "+8%", trend: "up" as const, subtitle: "courses" },
          { label: "Revenue", value: "$12,450", icon: DollarSign, color: "bg-amber-500", change: "+23%", trend: "up" as const, subtitle: "revenue" },
          { label: "Enrollments", value: "3,456", icon: TrendingUp, color: "bg-rose-500", change: "+15%", trend: "up" as const, subtitle: "enrollments" },
        ]
      : role === "INSTRUCTOR"
        ? [
            { label: "My Courses", value: "8", icon: Package, color: "bg-blue-500", change: "+2", trend: "up" as const, subtitle: "courses" },
            { label: "Total Students", value: "456", icon: Users, color: "bg-emerald-500", change: "+34", trend: "up" as const, subtitle: "students" },
            { label: "Earnings", value: "$3,200", icon: DollarSign, color: "bg-amber-500", change: "+$450", trend: "up" as const, subtitle: "earnings" },
            { label: "Active Courses", value: "6", icon: BookOpen, color: "bg-rose-500", change: "100%", trend: "up" as const, subtitle: "active" },
          ]
        : [
            { label: "Enrolled Courses", value: "4", icon: BookOpen, color: "bg-blue-500", change: "+2 this month", trend: "up" as const, subtitle: "courses" },
            { label: "Completed Courses", value: "1", icon: Award, color: "bg-emerald-500", change: "25%", trend: "up" as const, subtitle: "completed" },
            { label: "Quiz Scores", value: "87%", icon: Target, color: "bg-amber-500", change: "+5%", trend: "up" as const, subtitle: "average" },
            { label: "Certificates", value: "1", icon: Trophy, color: "bg-rose-500", change: "Latest: Aug 5", trend: "neutral" as const, subtitle: "earned" },
          ];

  const recentCourses =
    role === "INSTRUCTOR"
      ? [
          { title: "Complete Web Development", students: 234, status: "Published", progress: 100, lastAccessed: "", lastLesson: "" },
          { title: "Advanced React Patterns", students: 189, status: "Published", progress: 100, lastAccessed: "", lastLesson: "" },
          { title: "Node.js Masterclass", students: 0, status: "Draft", progress: 65, lastAccessed: "", lastLesson: "" },
        ]
      : [
          { title: "Complete Web Development Bootcamp", progress: 35, lastAccessed: "2 hours ago", lastLesson: "Chapter 5: React State Management", students: 0, status: "" },
          { title: "Machine Learning & AI Masterclass", progress: 12, lastAccessed: "1 day ago", lastLesson: "Lesson 3: Linear Regression", students: 0, status: "" },
          { title: "UI/UX Design Fundamentals", progress: 68, lastAccessed: "3 days ago", lastLesson: "Chapter 8: Prototyping in Figma", students: 0, status: "" },
        ];

  const quickActions =
    role === "ADMIN"
      ? [
          { label: "Manage Users", href: "/admin/users", icon: Users, color: "bg-blue-500" },
          { label: "Manage Courses", href: "/admin/courses", icon: BookOpen, color: "bg-emerald-500" },
          { label: "View Analytics", href: "/admin/analytics", icon: BarChart3, color: "bg-amber-500" },
        ]
      : role === "INSTRUCTOR"
        ? [
            { label: "Create Course", href: "/instructor/courses/new", icon: PlusCircle, color: "bg-indigo-500" },
            { label: "View Students", href: "/instructor/students", icon: Users, color: "bg-emerald-500" },
            { label: "Analytics", href: "/instructor/analytics", icon: BarChart3, color: "bg-amber-500" },
          ]
        : [
            { label: "Browse Courses", href: "/courses", icon: BookOpen, color: "bg-indigo-500" },
            { label: "Take Quiz", href: "/dashboard/quizzes", icon: FileCheck, color: "bg-emerald-500" },
            { label: "View Certificates", href: "/dashboard/certificates", icon: Award, color: "bg-amber-500" },
            { label: "Join Live Class", href: "/live-classes", icon: GraduationCap, color: "bg-rose-500" },
          ];

  const learningStreak = 7;

  if (role === "ADMIN" || role === "INSTRUCTOR") {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name || "User"} 👋
          </h1>
          <p className="mt-1 text-gray-500">
            {role === "ADMIN"
              ? "Here's your platform overview."
              : "Manage your courses and track performance."}
          </p>
          <Badge className="mt-2" variant={role === "ADMIN" ? "danger" : "warning"}>
            {role}
          </Badge>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                    <p className="mt-1 text-3xl font-bold text-gray-900">{stat.value}</p>
                    <p className="mt-1 text-xs text-gray-400">{stat.change}</p>
                  </div>
                  <div className={`rounded-xl p-3 ${stat.color}`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>My Courses</CardTitle>
                <Link
                  href={role === "INSTRUCTOR" ? "/instructor/courses" : "/courses"}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                >
                  View All <ChevronRight className="inline h-4 w-4" />
                </Link>
              </CardHeader>
              <CardContent>
                {recentCourses.length > 0 ? (
                  <div className="space-y-4">
                    {recentCourses.map((course, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-4 rounded-xl border border-gray-100 p-4 transition-colors hover:bg-gray-50"
                      >
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                          <BookOpen className="h-6 w-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="truncate font-medium text-gray-900">
                            {course.title}
                          </h4>
                          <div className="mt-2">
                            <Progress value={course.progress} className="h-2" />
                            <p className="mt-1 text-xs text-gray-400">
                              {course.progress}% complete
                              {course.lastAccessed && ` · ${course.lastAccessed}`}
                            </p>
                          </div>
                        </div>
                        <Link
                          href="/courses/1/learn"
                          className="shrink-0 rounded-lg bg-indigo-600 p-2 text-white transition-colors hover:bg-indigo-700"
                        >
                          <Play className="h-4 w-4" />
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <BookOpen className="mx-auto h-12 w-12 text-gray-300" />
                    <p className="mt-4 text-gray-500">No courses yet</p>
                    <Link
                      href="/courses"
                      className="mt-4 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                    >
                      Browse Courses
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {quickActions.map((action) => (
                    <Link
                      key={action.label}
                      href={action.href}
                      className="flex items-center gap-3 rounded-xl border border-gray-100 p-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      <action.icon className="h-5 w-5 text-indigo-600" />
                      {action.label}
                      <ArrowUpRight className="ml-auto h-4 w-4 text-gray-400" />
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivityData.slice(0, 3).map((activity) => (
                    <div key={activity.id} className="flex items-center gap-3 rounded-xl border border-gray-100 p-3">
                      <div className={`rounded-lg p-2 ${activity.color}`}>
                        <activity.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-8 text-white shadow-xl">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
        <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/10" />
        <div className="absolute right-20 bottom-4 h-20 w-20 rounded-full bg-white/5" />
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-yellow-300" />
            <h1 className="text-3xl font-bold">
              Welcome back, {user?.name || "Student"}! 👋
            </h1>
          </div>
          <p className="mt-3 max-w-xl text-lg text-indigo-100">
            &ldquo;{quote}&rdquo;
          </p>
          <div className="mt-4 flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-300" />
              <span className="text-sm font-medium">{learningStreak} day streak!</span>
            </div>
            <Badge className="bg-white/20 text-white hover:bg-white/30" variant="outline">
              STUDENT
            </Badge>
          </div>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="relative overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <div className="flex items-center gap-1">
                    {stat.trend === "up" && (
                      <TrendingUp className="h-3 w-3 text-emerald-500" />
                    )}
                    <p className={`text-xs font-medium ${stat.trend === "up" ? "text-emerald-600" : "text-gray-500"}`}>
                      {stat.change}
                    </p>
                  </div>
                  {stat.subtitle && (
                    <p className="text-xs text-gray-400">{stat.subtitle}</p>
                  )}
                </div>
                <div className={`rounded-xl p-3 ${stat.color} shadow-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Continue Learning Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b bg-gray-50/50">
              <CardTitle className="flex items-center gap-2">
                <BookMarked className="h-5 w-5 text-indigo-600" />
                Continue Learning
              </CardTitle>
              <Link
                href="/courses"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
              >
                View All <ChevronRight className="inline h-4 w-4" />
              </Link>
            </CardHeader>
            <CardContent className="p-6">
              {recentCourses.length > 0 ? (
                <div className="space-y-4">
                  {recentCourses.map((course, i) => (
                    <div
                      key={i}
                      className="group rounded-xl border border-gray-100 p-4 transition-all hover:border-indigo-200 hover:shadow-md"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg">
                          <BookOpen className="h-7 w-7" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold text-gray-900 group-hover:text-indigo-600">
                                {course.title}
                              </h4>
                              <p className="mt-1 text-sm text-gray-500">
                                Last: {course.lastLesson}
                              </p>
                            </div>
                            <Badge
                              variant={course.progress >= 75 ? "success" : course.progress >= 40 ? "warning" : "secondary"}
                            >
                              {course.progress}%
                            </Badge>
                          </div>
                          <div className="mt-3">
                            <Progress
                              value={course.progress}
                              className="h-2"
                              color={course.progress >= 75 ? "green" : course.progress >= 40 ? "default" : "blue"}
                            />
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <p className="text-xs text-gray-400">
                              <Clock className="mr-1 inline h-3 w-3" />
                              {course.lastAccessed}
                            </p>
                            <Link
                              href="/courses/1/learn"
                              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 shadow-sm"
                            >
                              <Play className="h-4 w-4" />
                              Continue
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <BookOpen className="mx-auto h-12 w-12 text-gray-300" />
                  <p className="mt-4 text-gray-500">No courses yet</p>
                  <Link
                    href="/courses"
                    className="mt-4 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                  >
                    Browse Courses
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recommended Courses */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-500" />
                Recommended For You
              </CardTitle>
              <Link
                href="/courses"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
              >
                Browse More <ChevronRight className="inline h-4 w-4" />
              </Link>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {recommendedCourses.map((course) => (
                  <div
                    key={course.id}
                    className="group rounded-xl border border-gray-100 p-4 transition-all hover:border-indigo-200 hover:shadow-md"
                  >
                    <div className="flex h-24 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100">
                      <BookOpen className="h-10 w-10 text-indigo-400" />
                    </div>
                    <div className="mt-3">
                      <Badge variant="secondary" className="text-[10px]">
                        {course.category}
                      </Badge>
                      <h4 className="mt-2 font-semibold text-gray-900 group-hover:text-indigo-600">
                        {course.title}
                      </h4>
                      <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span>{course.rating}</span>
                        <span className="text-gray-300">·</span>
                        <span>{course.students} students</span>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="font-bold text-indigo-600">{course.price}</span>
                        <Link
                          href={`/courses/${course.id}`}
                          className="text-sm font-medium text-gray-600 hover:text-indigo-600"
                        >
                          Enroll →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Learning Streak */}
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6 text-white">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-white/20 p-3">
                  <Flame className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-sm font-medium text-orange-100">Learning Streak</p>
                  <p className="text-3xl font-bold">{learningStreak} Days</p>
                </div>
              </div>
              <div className="mt-4 flex gap-1">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-8 flex-1 rounded-md ${
                      i < learningStreak
                        ? "bg-white/30"
                        : "bg-white/10"
                    }`}
                  />
                ))}
              </div>
              <div className="mt-2 flex justify-between text-xs text-orange-100">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>
          </Card>

          {/* Upcoming Deadlines */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Timer className="h-5 w-5 text-rose-500" />
                Upcoming Deadlines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingDeadlines.map((deadline) => (
                  <div
                    key={deadline.id}
                    className={`rounded-xl border p-3 ${
                      deadline.urgent
                        ? "border-red-200 bg-red-50/50"
                        : "border-gray-100"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-0.5 rounded-lg p-1.5 ${
                          deadline.urgent ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {deadline.type === "quiz" ? (
                          <FileCheck className="h-4 w-4" />
                        ) : (
                          <AlertCircle className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {deadline.title}
                        </p>
                        <p className="text-xs text-gray-500">{deadline.course}</p>
                        <p
                          className={`mt-1 text-xs font-medium ${
                            deadline.urgent ? "text-red-600" : "text-gray-500"
                          }`}
                        >
                          {deadline.urgent && "⚠️ "}
                          Due: {deadline.dueDate}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity Feed */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Zap className="h-5 w-5 text-blue-500" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-[17px] top-0 bottom-0 w-0.5 bg-gray-100" />
                <div className="space-y-4">
                  {recentActivityData.map((activity, index) => (
                    <div key={activity.id} className="relative flex gap-3">
                      <div
                        className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${activity.color}`}
                      >
                        <activity.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.title}
                        </p>
                        <p className="text-xs text-gray-500">{activity.course}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <p className="text-xs text-gray-400">{activity.time}</p>
                          {activity.score && (
                            <Badge variant="success" className="text-[10px]">
                              {activity.score}%
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Grid */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action) => (
                  <Link
                    key={action.label}
                    href={action.href}
                    className="group flex flex-col items-center gap-2 rounded-xl border border-gray-100 p-4 text-center transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:shadow-sm"
                  >
                    <div className={`rounded-xl p-3 ${action.color} text-white shadow-md transition-transform group-hover:scale-110`}>
                      <action.icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-medium text-gray-700 group-hover:text-indigo-600">
                      {action.label}
                    </span>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
