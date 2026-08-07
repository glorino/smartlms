"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Users,
  Globe,
  BookOpen,
  Award,
  Heart,
  Sparkles,
  Target,
  Lightbulb,
  ArrowRight,
  Star,
  ChevronRight,
} from "lucide-react";
import Navbar from "@/components/layout/navbar";

function useCounter(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, end, duration]);

  return { count, ref };
}

const stats = [
  { label: "Students Worldwide", value: 100000, suffix: "+", icon: Users, color: "from-blue-500 to-indigo-600" },
  { label: "Courses Available", value: 500, suffix: "+", icon: BookOpen, color: "from-green-400 to-blue-500" },
  { label: "Expert Instructors", value: 200, suffix: "+", icon: GraduationCap, color: "from-orange-400 to-pink-500" },
  { label: "Countries Reached", value: 50, suffix: "+", icon: Globe, color: "from-purple-500 to-indigo-600" },
];

const features = [
  {
    title: "AI-Powered Learning",
    description: "Personalized learning paths, smart quizzes, and AI-generated summaries adapt to your pace and style.",
    icon: Sparkles,
    color: "from-blue-500 to-cyan-400",
    bg: "bg-blue-50",
  },
  {
    title: "Expert Instructors",
    description: "Learn from industry professionals and world-class educators with real-world experience.",
    icon: GraduationCap,
    color: "from-purple-500 to-pink-500",
    bg: "bg-purple-50",
  },
  {
    title: "Global Community",
    description: "Connect with 100,000+ learners and educators across 50+ countries worldwide.",
    icon: Globe,
    color: "from-green-400 to-emerald-500",
    bg: "bg-green-50",
  },
  {
    title: "Flexible Learning",
    description: "Study anytime, anywhere with offline access, mobile apps, and self-paced courses.",
    icon: Lightbulb,
    color: "from-orange-400 to-red-500",
    bg: "bg-orange-50",
  },
];

const team = [
  { name: "Sarah Johnson", role: "CEO & Founder", avatar: "SJ", color: "from-indigo-500 to-purple-600" },
  { name: "Michael Chen", role: "CTO", avatar: "MC", color: "from-blue-500 to-cyan-500" },
  { name: "Emily Rodriguez", role: "Head of Design", avatar: "ER", color: "from-pink-500 to-rose-500" },
  { name: "Alex Kim", role: "Lead Engineer", avatar: "AK", color: "from-green-400 to-emerald-500" },
];

const testimonials = [
  {
    name: "Jessica Park",
    role: "Web Developer Student",
    text: "SmartLMS completely transformed my career. The AI-powered learning paths helped me go from beginner to landing my dream job in just 6 months.",
    avatar: "JP",
    color: "from-blue-400 to-indigo-500",
  },
  {
    name: "David Okafor",
    role: "Course Instructor",
    text: "As an instructor, the tools here are unmatched. AI-generated quizzes, real-time analytics, and a supportive community make teaching a joy.",
    avatar: "DO",
    color: "from-green-400 to-emerald-500",
  },
  {
    name: "Maria Santos",
    role: "Data Science Student",
    text: "The live classes and recordings are incredible. I can learn from the best instructors worldwide and replay whenever I need to.",
    avatar: "MS",
    color: "from-orange-400 to-pink-500",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 py-24">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-white" />
          <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-white" />
          <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
            <Heart className="h-4 w-4" />
            Trusted by 100,000+ learners worldwide
          </div>
          <h1 className="text-5xl font-extrabold leading-tight text-white md:text-7xl">
            Education Without
            <span className="block bg-gradient-to-r from-yellow-200 to-pink-200 bg-clip-text text-transparent">
              Boundaries
            </span>
          </h1>
          <p className="mx-auto mt-8 max-w-3xl text-xl text-white/80">
            SmartLMS combines the best features from the world&apos;s top learning
            platforms into one powerful, AI-driven solution. We&apos;re making
            quality education accessible to everyone, everywhere.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="group rounded-2xl bg-white px-8 py-4 text-lg font-bold text-indigo-600 shadow-xl transition-all hover:scale-105 hover:shadow-2xl"
            >
              Start Learning Free
              <ArrowRight className="ml-2 inline h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/courses"
              className="rounded-2xl border-2 border-white/30 px-8 py-4 text-lg font-bold text-white backdrop-blur-sm transition-all hover:border-white/60 hover:bg-white/10"
            >
              Browse Courses
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative -mt-12 z-10 px-4">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((stat) => {
              const { count, ref } = useCounter(stat.value);
              return (
                <div
                  key={stat.label}
                  ref={ref}
                  className="rounded-2xl bg-white p-6 text-center shadow-xl transition-transform hover:scale-105"
                >
                  <div
                    className={`mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${stat.color}`}
                  >
                    <stat.icon className="h-7 w-7 text-white" />
                  </div>
                  <p className="text-3xl font-extrabold text-gray-900">
                    {stat.value >= 1000
                      ? `${Math.floor(count / 1000)}K`
                      : count}
                    {stat.suffix}
                  </p>
                  <p className="mt-1 text-sm font-medium text-gray-500">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-16 text-center">
            <span className="mb-4 inline-block rounded-full bg-indigo-100 px-4 py-1.5 text-sm font-semibold text-indigo-700">
              Why SmartLMS?
            </span>
            <h2 className="mt-4 text-4xl font-extrabold text-gray-900">
              Everything you need to
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {" "}succeed
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-500">
              Our platform combines cutting-edge technology with proven learning
              science to deliver results.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className={`group rounded-2xl ${feature.bg} p-6 transition-all hover:scale-105 hover:shadow-xl`}
              >
                <div
                  className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.color} shadow-lg`}
                >
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 p-8 text-white shadow-2xl md:p-12">
              <Target className="mb-6 h-12 w-12 text-yellow-300" />
              <h3 className="mb-4 text-3xl font-extrabold">Our Mission</h3>
              <p className="text-lg leading-relaxed text-white/90">
                To democratize education by building the most comprehensive,
                AI-powered learning platform that adapts to every student&apos;s
                unique needs and empowers instructors to teach effectively at
                scale.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {["Accessibility", "Quality", "Innovation"].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium backdrop-blur-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 p-8 text-white shadow-2xl md:p-12">
              <Lightbulb className="mb-6 h-12 w-12 text-yellow-300" />
              <h3 className="mb-4 text-3xl font-extrabold">Our Vision</h3>
              <p className="text-lg leading-relaxed text-white/90">
                A world where anyone, anywhere can access world-class education,
                learn at their own pace, and achieve their full potential —
                regardless of geography, income, or background.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {["Global", "Inclusive", "Future-Ready"].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium backdrop-blur-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-16 text-center">
            <span className="mb-4 inline-block rounded-full bg-green-100 px-4 py-1.5 text-sm font-semibold text-green-700">
              Our Team
            </span>
            <h2 className="mt-4 text-4xl font-extrabold text-gray-900">
              Meet the people behind
              <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                {" "}SmartLMS
              </span>
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {team.map((member) => (
              <div
                key={member.name}
                className="group rounded-2xl bg-white p-6 text-center shadow-md transition-all hover:-translate-y-2 hover:shadow-2xl"
              >
                <div
                  className={`mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br ${member.color} text-3xl font-bold text-white shadow-lg transition-transform group-hover:scale-110`}
                >
                  {member.avatar}
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  {member.name}
                </h3>
                <p className="mt-1 text-sm font-medium text-gray-500">
                  {member.role}
                </p>
                <div className="mt-4 flex justify-center gap-3 opacity-0 transition-opacity group-hover:opacity-100">
                  {["Twitter", "LinkedIn"].map((social) => (
                    <span
                      key={social}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-600 transition-colors hover:bg-indigo-100 hover:text-indigo-600"
                    >
                      {social[0]}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-16 text-center">
            <span className="mb-4 inline-block rounded-full bg-yellow-100 px-4 py-1.5 text-sm font-semibold text-yellow-700">
              Testimonials
            </span>
            <h2 className="mt-4 text-4xl font-extrabold text-gray-900">
              Loved by learners
              <span className="bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
                {" "}worldwide
              </span>
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="rounded-2xl bg-gradient-to-br from-gray-50 to-white p-6 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-4 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="mb-6 text-sm leading-relaxed text-gray-600">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${t.color} text-sm font-bold text-white`}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 py-24">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-white" />
          <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-white" />
        </div>
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-4xl font-extrabold text-white md:text-5xl">
            Ready to Transform Your Future?
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-xl text-white/80">
            Join 100,000+ students and 200+ expert instructors. Start your
            learning journey today — it&apos;s completely free.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="group rounded-2xl bg-white px-8 py-4 text-lg font-bold text-indigo-600 shadow-xl transition-all hover:scale-105 hover:shadow-2xl"
            >
              Get Started Free
              <ChevronRight className="ml-1 inline h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/courses"
              className="rounded-2xl border-2 border-white/30 px-8 py-4 text-lg font-bold text-white backdrop-blur-sm transition-all hover:border-white/60 hover:bg-white/10"
            >
              Explore Courses
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
