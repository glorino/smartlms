"use client";

import Link from "next/link";
import {
  GraduationCap,
  DollarSign,
  Users,
  BarChart3,
  Video,
  BookOpen,
  ArrowRight,
  Check,
} from "lucide-react";
import Navbar from "@/components/layout/navbar";

const benefits = [
  {
    icon: DollarSign,
    title: "Earn Revenue",
    description: "Set your own prices and keep 100% of your earnings. No hidden fees.",
  },
  {
    icon: Users,
    title: "Reach Global Students",
    description: "Access 100,000+ students across 50+ countries.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Track enrollments, completion rates, and revenue in real-time.",
  },
  {
    icon: Video,
    title: "Live Classes",
    description: "Host live sessions via Zoom, Google Meet, or Jitsi.",
  },
  {
    icon: BookOpen,
    title: "AI Course Builder",
    description: "Use AI to generate course outlines, quizzes, and content.",
  },
  {
    icon: GraduationCap,
    title: "Certificate Builder",
    description: "Create custom certificates with QR verification.",
  },
];

const steps = [
  {
    step: 1,
    title: "Create Your Account",
    description: "Sign up as an instructor in under a minute.",
  },
  {
    step: 2,
    title: "Build Your Course",
    description: "Use our drag-and-drop builder to create engaging content.",
  },
  {
    step: 3,
    title: "Publish & Earn",
    description: "Launch your course and start earning from day one.",
  },
];

export default function BecomeInstructorPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <div className="gradient-primary py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-5xl font-bold text-white">
            Become an Instructor
          </h1>
          <p className="mt-6 text-xl text-white/80">
            Share your expertise, build your brand, and earn money teaching
            what you love.
          </p>
          <Link
            href="/register?role=INSTRUCTOR"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-lg font-semibold text-indigo-600 shadow-lg transition-shadow hover:shadow-xl"
          >
            Start Teaching Today
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Benefits */}
      <div className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
          Why Teach on SmartLMS?
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <benefit.icon className="mb-4 h-10 w-10 text-indigo-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                {benefit.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Steps */}
      <div className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
            Get Started in 3 Steps
          </h2>
          <div className="space-y-8">
            {steps.map((step) => (
              <div
                key={step.step}
                className="flex items-start gap-6"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-lg font-bold text-white">
                  {step.step}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gray-900 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl font-bold text-white">
            Ready to Share Your Knowledge?
          </h2>
          <p className="mt-4 text-lg text-gray-400">
            Join thousands of instructors earning on SmartLMS
          </p>
          <Link
            href="/register?role=INSTRUCTOR"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-indigo-700"
          >
            Become an Instructor
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
