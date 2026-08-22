"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  CheckCircle2,
  Circle,
  ArrowRight,
  BookOpen,
  Search,
  Play,
  Award,
  Trophy,
  MessageSquare,
  Plus,
  FileCheck,
  Video,
  Users,
  Settings,
  BarChart3,
  Sparkles,
  PartyPopper,
  Palette,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const themeColors = [
  { name: "Indigo", value: "indigo", gradient: "from-indigo-600 via-purple-600 to-pink-500", btn: "bg-indigo-500", ring: "ring-indigo-500", text: "text-indigo-600", bg: "bg-indigo-50", hover: "hover:bg-indigo-100", hex: "#6366f1" },
  { name: "Blue", value: "blue", gradient: "from-blue-600 via-blue-500 to-cyan-500", btn: "bg-blue-500", ring: "ring-blue-500", text: "text-blue-600", bg: "bg-blue-50", hover: "hover:bg-blue-100", hex: "#3b82f6" },
  { name: "Emerald", value: "emerald", gradient: "from-emerald-600 via-green-500 to-teal-500", btn: "bg-emerald-500", ring: "ring-emerald-500", text: "text-emerald-600", bg: "bg-emerald-50", hover: "hover:bg-emerald-100", hex: "#10b981" },
  { name: "Rose", value: "rose", gradient: "from-rose-600 via-pink-500 to-red-500", btn: "bg-rose-500", ring: "ring-rose-500", text: "text-rose-600", bg: "bg-rose-50", hover: "hover:bg-rose-100", hex: "#f43f5e" },
  { name: "Amber", value: "amber", gradient: "from-amber-600 via-orange-500 to-yellow-500", btn: "bg-amber-500", ring: "ring-amber-500", text: "text-amber-600", bg: "bg-amber-50", hover: "hover:bg-amber-100", hex: "#f59e0b" },
  { name: "Purple", value: "purple", gradient: "from-purple-600 via-violet-500 to-indigo-500", btn: "bg-purple-500", ring: "ring-purple-500", text: "text-purple-600", bg: "bg-purple-50", hover: "hover:bg-purple-100", hex: "#a855f7" },
];

interface Step {
  id: number;
  title: string;
  description: string;
  icon: any;
  color: string;
  href: string;
}

const studentSteps: Step[] = [
  {
    id: 1,
    title: "Browse the Course Catalog",
    description: "Explore available courses and find something that interests you.",
    icon: Search,
    color: "bg-blue-500",
    href: "/courses",
  },
  {
    id: 2,
    title: "Enroll in Your First Course",
    description: "Pick a course and enroll to start learning right away.",
    icon: BookOpen,
    color: "bg-emerald-500",
    href: "/courses",
  },
  {
    id: 3,
    title: "Complete Your First Lesson",
    description: "Start watching videos and reading content to build knowledge.",
    icon: Play,
    color: "bg-purple-500",
    href: "/dashboard/courses",
  },
  {
    id: 4,
    title: "Take a Quiz",
    description: "Test your understanding with course quizzes and track your progress.",
    icon: FileCheck,
    color: "bg-amber-500",
    href: "/dashboard/quizzes",
  },
  {
    id: 5,
    title: "Earn Your First Certificate",
    description: "Complete a course and earn a certificate to showcase your skills.",
    icon: Award,
    color: "bg-rose-500",
    href: "/dashboard/certificates",
  },
];

const instructorSteps: Step[] = [
  {
    id: 1,
    title: "Create Your First Course",
    description: "Set up a new course with a title, description, and category.",
    icon: Plus,
    color: "bg-blue-500",
    href: "/instructor/courses/new",
  },
  {
    id: 2,
    title: "Add Course Content",
    description: "Add lessons with videos, text content, and downloadable resources.",
    icon: BookOpen,
    color: "bg-emerald-500",
    href: "/instructor/courses",
  },
  {
    id: 3,
    title: "Create Quizzes",
    description: "Build assessments to test student knowledge on your course material.",
    icon: FileCheck,
    color: "bg-purple-500",
    href: "/instructor/quizzes",
  },
  {
    id: 4,
    title: "Schedule a Live Class",
    description: "Set up a live video session to interact with students in real time.",
    icon: Video,
    color: "bg-amber-500",
    href: "/instructor/live-classes",
  },
  {
    id: 5,
    title: "Publish Your Course",
    description: "Review and publish your course to make it available to students.",
    icon: Sparkles,
    color: "bg-rose-500",
    href: "/instructor/courses",
  },
];

const adminSteps: Step[] = [
  {
    id: 1,
    title: "Review Platform Analytics",
    description: "Check enrollment numbers, revenue, and user growth on the dashboard.",
    icon: BarChart3,
    color: "bg-blue-500",
    href: "/admin/analytics",
  },
  {
    id: 2,
    title: "Manage Users",
    description: "View and manage students, instructors, and their roles.",
    icon: Users,
    color: "bg-emerald-500",
    href: "/admin/users",
  },
  {
    id: 3,
    title: "Review Courses",
    description: "Monitor published courses and their quality across the platform.",
    icon: BookOpen,
    color: "bg-purple-500",
    href: "/admin/courses",
  },
  {
    id: 4,
    title: "Configure Settings",
    description: "Set up payment gateways, email notifications, and platform preferences.",
    icon: Settings,
    color: "bg-amber-500",
    href: "/admin/settings",
  },
  {
    id: 5,
    title: "Monitor System Health",
    description: "Check system status and ensure everything is running smoothly.",
    icon: CheckCircle2,
    color: "bg-rose-500",
    href: "/admin/health",
  },
];

export default function OnboardingPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const role = (user as any)?.role || "STUDENT";
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [showWelcome, setShowWelcome] = useState(true);
  const [selectedColor, setSelectedColor] = useState("indigo");

  const theme = themeColors.find((c) => c.value === selectedColor) || themeColors[0];

  useEffect(() => {
    const saved = localStorage.getItem("onboarding-theme");
    if (saved && themeColors.find((c) => c.value === saved)) {
      setSelectedColor(saved);
    }
  }, []);

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    localStorage.setItem("onboarding-theme", color);
  };

  const steps = role === "ADMIN" ? adminSteps : role === "INSTRUCTOR" ? instructorSteps : studentSteps;
  const roleLabel = role === "ADMIN" ? "Admin" : role === "INSTRUCTOR" ? "Instructor" : "Student";
  const completedCount = completedSteps.size;
  const progressPercent = (completedCount / steps.length) * 100;
  const isComplete = completedCount === steps.length;

  const toggleStep = (stepId: number) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(stepId)) next.delete(stepId);
      else next.add(stepId);
      return next;
    });
  };

  if (showWelcome && completedCount === 0) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Card className="w-full max-w-2xl overflow-hidden">
          <div className={`bg-gradient-to-r ${theme.gradient} p-12 text-center text-white relative overflow-hidden`}>
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
            <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/10" />
            <div className="relative z-10">
              <PartyPopper className="mx-auto h-16 w-16 text-yellow-300" />
              <h1 className="mt-4 text-3xl font-bold">
                Welcome to SmartLMS, {user?.name || "there"}!
              </h1>
              <p className="mt-4 text-lg text-white/80">
                {role === "ADMIN"
                  ? "You have full control of the platform. Here\u2019s how to get started."
                  : role === "INSTRUCTOR"
                  ? "Ready to teach? Let\u2019s set up your courses and content."
                  : "Let\u2019s get you started on your learning journey."}
              </p>
              <Badge className="mt-4" variant="outline">{roleLabel}</Badge>
              <button
                onClick={() => setShowWelcome(false)}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3 font-semibold shadow-lg transition-all hover:bg-white/90 hover:shadow-xl"
                style={{ color: theme.hex }}
              >
                Get Started
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
          <CardContent className="p-8">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Palette className="h-4 w-4 text-gray-400" />
                <p className="text-sm font-medium text-gray-500">Choose your theme color</p>
              </div>
              <div className="flex items-center gap-3">
                {themeColors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => handleColorChange(color.value)}
                    className={`relative h-10 w-10 rounded-full transition-all ${
                      selectedColor === color.value
                        ? `ring-2 ring-offset-2 ${color.ring} scale-110`
                        : "hover:scale-105"
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  >
                    {selectedColor === color.value && (
                      <CheckCircle2 className="h-5 w-5 text-white absolute inset-0 m-auto drop-shadow-md" />
                    )}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${theme.bg}`}>
                  <span className={`text-2xl font-bold ${theme.text}`}>{steps.length}</span>
                </div>
                <p className="text-sm font-medium text-gray-900">Quick Steps</p>
                <p className="text-xs text-gray-500">Tailored for you</p>
              </div>
              <div className="space-y-2">
                <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${theme.bg}`}>
                  <CheckCircle2 className={`h-6 w-6 ${theme.text}`} />
                </div>
                <p className="text-sm font-medium text-gray-900">Track Progress</p>
                <p className="text-xs text-gray-500">Mark steps complete</p>
              </div>
              <div className="space-y-2">
                <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${theme.bg}`}>
                  <Sparkles className={`h-6 w-6 ${theme.text}`} />
                </div>
                <p className="text-sm font-medium text-gray-900">Get Started</p>
                <p className="text-xs text-gray-500">Begin {role === "INSTRUCTOR" ? "teaching" : role === "ADMIN" ? "managing" : "learning"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Getting Started</h1>
        <p className="mt-1 text-gray-500">
          {role === "ADMIN"
            ? "Platform setup checklist for administrators."
            : role === "INSTRUCTOR"
            ? "Follow these steps to create and publish your first course."
            : "Follow these steps to begin your learning journey."}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Overall Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {completedCount} of {steps.length} completed
                </p>
              </div>
              <div className="text-right">
                <p className={`text-3xl font-bold ${theme.text}`}>{Math.round(progressPercent)}%</p>
              </div>
            </div>
            <Progress value={progressPercent} className="h-3" color="default" />
            {isComplete && (
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-green-50 p-3 text-green-700">
                <PartyPopper className="h-5 w-5" />
                <p className="text-sm font-medium">Congratulations! You&apos;ve completed onboarding!</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-500 mb-4">Steps</p>
            <div className="flex flex-col gap-3">
              {steps.map((step) => {
                const isCompleted = completedSteps.has(step.id);
                return (
                  <button
                    key={step.id}
                    onClick={() => toggleStep(step.id)}
                    className={`flex items-center gap-3 rounded-lg p-2 text-left transition-all ${
                      isCompleted ? "bg-green-50 text-green-700" : `${theme.bg} ${theme.text} hover:${theme.hover}`
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-green-500" />
                    ) : (
                      <Circle className="h-5 w-5 shrink-0 text-gray-300" />
                    )}
                    <span className="text-sm font-medium truncate">{step.title}</span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.has(step.id);
          const StepIcon = step.icon;
          return (
            <Card
              key={step.id}
              className={`transition-all hover:shadow-md ${isCompleted ? "border-green-200 bg-green-50/30" : ""}`}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => toggleStep(step.id)}
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all ${
                      isCompleted
                        ? "bg-green-500 text-white shadow-lg shadow-green-500/30"
                        : `${step.color} text-white shadow-lg`
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-6 w-6" />
                    ) : (
                      <span className="text-lg font-bold">{index + 1}</span>
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                      {isCompleted && <Badge variant="success" className="text-xs">Done</Badge>}
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{step.description}</p>
                    <div className="mt-3 flex items-center gap-3">
                      <Link
                        href={step.href}
                        className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors shadow-sm ${
                          isCompleted ? "bg-green-600 hover:bg-green-700" : `${theme.btn} hover:opacity-90`
                        }`}
                      >
                        <StepIcon className="h-4 w-4" />
                        {isCompleted ? "Review" : "Go to Step"}
                      </Link>
                      <button
                        onClick={() => toggleStep(step.id)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
                      >
                        {isCompleted ? "Mark Incomplete" : "Mark Complete"}
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
