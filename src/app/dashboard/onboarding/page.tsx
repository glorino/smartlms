"use client";

import { useState } from "react";
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
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

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
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-12 text-center text-white relative overflow-hidden">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
            <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/10" />
            <div className="relative z-10">
              <PartyPopper className="mx-auto h-16 w-16 text-yellow-300" />
              <h1 className="mt-4 text-3xl font-bold">
                Welcome to SmartLMS, {user?.name || "there"}!
              </h1>
              <p className="mt-4 text-lg text-indigo-100">
                {role === "ADMIN"
                  ? "You have full control of the platform. Here\u2019s how to get started."
                  : role === "INSTRUCTOR"
                  ? "Ready to teach? Let\u2019s set up your courses and content."
                  : "Let\u2019s get you started on your learning journey."}
              </p>
              <Badge className="mt-4" variant="outline">{roleLabel}</Badge>
              <button
                onClick={() => setShowWelcome(false)}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3 font-semibold text-indigo-600 shadow-lg transition-all hover:bg-indigo-50 hover:shadow-xl"
              >
                Get Started
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
          <CardContent className="p-8">
            <div className="grid grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                  <span className="text-2xl font-bold text-blue-600">{steps.length}</span>
                </div>
                <p className="text-sm font-medium text-gray-900">Quick Steps</p>
                <p className="text-xs text-gray-500">Tailored for you</p>
              </div>
              <div className="space-y-2">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-sm font-medium text-gray-900">Track Progress</p>
                <p className="text-xs text-gray-500">Mark steps complete</p>
              </div>
              <div className="space-y-2">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                  <Sparkles className="h-6 w-6 text-purple-600" />
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
                <p className="text-3xl font-bold text-indigo-600">{Math.round(progressPercent)}%</p>
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
                      isCompleted ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-600 hover:bg-gray-100"
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
                        className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 shadow-sm"
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
