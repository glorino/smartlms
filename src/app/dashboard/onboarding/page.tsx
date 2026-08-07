"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  CheckCircle2,
  Circle,
  Play,
  FileCheck,
  BookOpen,
  Users,
  Shield,
  Upload,
  ChevronRight,
  Sparkles,
  Video,
  ClipboardCheck,
  FileText,
  UserCheck,
  PartyPopper,
  ArrowRight,
  Building2,
  Image,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const onboardingSteps = [
  {
    id: 1,
    title: "Complete Your Profile",
    description: "Add your photo, bio, and contact information so your team can get to know you.",
    icon: UserCheck,
    color: "bg-blue-500",
    completed: false,
    href: "/dashboard/settings",
  },
  {
    id: 2,
    title: "Watch Intro Video",
    description: "Learn about our company culture, values, and what to expect in your first 90 days.",
    icon: Video,
    color: "bg-purple-500",
    completed: false,
    href: "/courses/company-intro",
  },
  {
    id: 3,
    title: "Take Assessment Quiz",
    description: "Complete the initial skills assessment to help us tailor your learning path.",
    icon: ClipboardCheck,
    color: "bg-amber-500",
    completed: false,
    href: "/dashboard/quizzes",
  },
  {
    id: 4,
    title: "Review Company Policies",
    description: "Read and acknowledge our employee handbook, code of conduct, and policies.",
    icon: FileText,
    color: "bg-emerald-500",
    completed: false,
    href: "/courses/company-policies",
  },
  {
    id: 5,
    title: "Meet Your Team",
    description: "Join your team's introduction session and connect with your colleagues.",
    icon: Users,
    color: "bg-rose-500",
    completed: false,
    href: "/live-classes",
  },
];

export default function OnboardingPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [showWelcome, setShowWelcome] = useState(true);

  const completedCount = completedSteps.size;
  const progressPercent = (completedCount / onboardingSteps.length) * 100;
  const isComplete = completedCount === onboardingSteps.length;

  const toggleStep = (stepId: number) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(stepId)) {
        next.delete(stepId);
      } else {
        next.add(stepId);
      }
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
                Welcome to SmartLMS, {user?.name || "Team Member"}! 🎉
              </h1>
              <p className="mt-4 text-lg text-indigo-100">
                We&apos;re thrilled to have you on board. Let&apos;s get you set up for success
                with a quick onboarding process.
              </p>
              <button
                onClick={() => setShowWelcome(false)}
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3 font-semibold text-indigo-600 shadow-lg transition-all hover:bg-indigo-50 hover:shadow-xl"
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
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-sm font-medium text-gray-900">5-10 Minutes</p>
                <p className="text-xs text-gray-500">Quick & Easy</p>
              </div>
              <div className="space-y-2">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-sm font-medium text-gray-900">5 Steps</p>
                <p className="text-xs text-gray-500">Simple Checklist</p>
              </div>
              <div className="space-y-2">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                  <Sparkles className="h-6 w-6 text-purple-600" />
                </div>
                <p className="text-sm font-medium text-gray-900">Get Started</p>
                <p className="text-xs text-gray-500">Begin Your Journey</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Onboarding Checklist
        </h1>
        <p className="mt-1 text-gray-500">
          Complete these steps to get started at your new organization.
        </p>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Overall Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {completedCount} of {onboardingSteps.length} completed
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-indigo-600">
                  {Math.round(progressPercent)}%
                </p>
              </div>
            </div>
            <Progress value={progressPercent} className="h-3" color="default" />
            {isComplete && (
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-green-50 p-3 text-green-700">
                <PartyPopper className="h-5 w-5" />
                <p className="text-sm font-medium">
                  Congratulations! You&apos;ve completed your onboarding! 🎉
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Progress Steps Visual */}
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-500 mb-4">Steps</p>
            <div className="flex flex-col gap-3">
              {onboardingSteps.map((step, index) => {
                const isCompleted = completedSteps.has(step.id);
                return (
                  <button
                    key={step.id}
                    onClick={() => toggleStep(step.id)}
                    className={`flex items-center gap-3 rounded-lg p-2 text-left transition-all ${
                      isCompleted
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-green-500" />
                    ) : (
                      <Circle className="h-5 w-5 shrink-0 text-gray-300" />
                    )}
                    <span className="text-sm font-medium truncate">
                      {step.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Onboarding Steps */}
      <div className="space-y-4">
        {onboardingSteps.map((step, index) => {
          const isCompleted = completedSteps.has(step.id);
          const StepIcon = step.icon;

          return (
            <Card
              key={step.id}
              className={`transition-all hover:shadow-md ${
                isCompleted ? "border-green-200 bg-green-50/30" : ""
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {/* Step Number / Check */}
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

                  {/* Step Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {step.title}
                      </h3>
                      {isCompleted && (
                        <Badge variant="success" className="text-xs">
                          Done
                        </Badge>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {step.description}
                    </p>
                    <div className="mt-3 flex items-center gap-3">
                      <Link
                        href={step.href}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 shadow-sm"
                      >
                        <StepIcon className="h-4 w-4" />
                        {isCompleted ? "Review" : "Start Step"}
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

      {/* Organization Branding Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-indigo-600" />
            Organization Branding
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Logo Upload */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700">Company Logo</p>
              <div className="flex h-40 items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:border-indigo-400 hover:bg-indigo-50 cursor-pointer">
                <div className="text-center">
                  <Image className="mx-auto h-10 w-10 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">
                    Click to upload or drag and drop
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    PNG, JPG, SVG up to 5MB
                  </p>
                </div>
              </div>
            </div>

            {/* Brand Colors */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700">Brand Colors</p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-indigo-600 shadow-inner" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Primary Color</p>
                    <p className="text-xs text-gray-500">#6366F1</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-purple-600 shadow-inner" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Secondary Color</p>
                    <p className="text-xs text-gray-500">#9333EA</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-emerald-500 shadow-inner" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Accent Color</p>
                    <p className="text-xs text-gray-500">#10B981</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 shadow-sm">
              <Upload className="h-4 w-4" />
              Save Branding
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Clock({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
