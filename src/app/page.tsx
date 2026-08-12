"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  BookOpen,
  Brain,
  Award,
  Video,
  BarChart3,
  ArrowRight,
  Check,
  Star,
  Users,
  Globe,
  Zap,
  GraduationCap,
  Clock,
  Trophy,
  Target,
  Sparkles,
  FileCheck,
  Shield,
  Timer,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import HeroSlider from "@/components/home/hero-slider";
import {
  HOME_TESTIMONIALS,
  HOME_STATS,
  TRUSTED_LOGOS,
} from "@/lib/constants";

const typingWords = [
  "Web Development",
  "Data Science",
  "AI & Machine Learning",
  "Design",
  "Business",
];

const features = [
  {
    icon: Brain,
    title: "AI Course Builder",
    description:
      "Generate entire course outlines, lessons, and quizzes with our advanced AI engine. Create content 10x faster.",
    gradient: "from-blue-500 to-cyan-400",
  },
  {
    icon: BookOpen,
    title: "14 Question Types",
    description:
      "From multiple choice to drag-and-drop, matching to code challenges. Every assessment type you need.",
    gradient: "from-purple-500 to-pink-400",
  },
  {
    icon: Award,
    title: "Certificate Builder",
    description:
      "Design custom certificates with templates, auto-issue on course completion, and verify authenticity.",
    gradient: "from-amber-500 to-orange-400",
  },
  {
    icon: Video,
    title: "Live Classes",
    description:
      "Built-in live video sessions with screen sharing, whiteboard, and real-time Q&A. No third-party tools needed.",
    gradient: "from-green-500 to-emerald-400",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "Track student progress, engagement, and completion rates with beautiful, actionable analytics.",
    gradient: "from-rose-500 to-red-400",
  },
  {
    icon: Users,
    title: "Community & SCORM",
    description:
      "Import and export SCORM packages, build learning communities, and foster collaboration.",
    gradient: "from-indigo-500 to-violet-400",
  },
];

const testimonials = HOME_TESTIMONIALS;
const trustedLogos = TRUSTED_LOGOS;

const courseOutline = [
  { title: "Introduction to React", duration: "12 min", done: true },
  { title: "Components & Props", duration: "18 min", done: true },
  { title: "State Management", duration: "24 min", done: false },
  { title: "Hooks Deep Dive", duration: "22 min", done: false },
  { title: "Project: Build a Todo App", duration: "45 min", done: false },
];

const quizOptions = [
  { label: "A", text: "useState", correct: false },
  { label: "B", text: "useEffect", correct: true },
  { label: "C", text: "useReducer", correct: false },
  { label: "D", text: "useMemo", correct: false },
];

export default function HomePage() {
  const [typedWord, setTypedWord] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeQuizOption, setActiveQuizOption] = useState<number | null>(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const [counters, setCounters] = useState({
    students: 0,
    courses: 0,
    countries: 0,
    rating: 0,
  });
  const statsRef = useRef<HTMLDivElement>(null);

  const stats = HOME_STATS;

  useEffect(() => {
    const currentWord = typingWords[wordIndex];
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          setTypedWord(currentWord.substring(0, charIndex + 1));
          setCharIndex(charIndex + 1);
          if (charIndex + 1 === currentWord.length) {
            setTimeout(() => setIsDeleting(true), 1500);
          }
        } else {
          setTypedWord(currentWord.substring(0, charIndex - 1));
          setCharIndex(charIndex - 1);
          if (charIndex - 1 === 0) {
            setIsDeleting(false);
            setWordIndex((prev) => (prev + 1) % typingWords.length);
          }
        }
      },
      isDeleting ? 40 : 80
    );
    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, wordIndex]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !statsVisible) {
          setStatsVisible(true);
        }
      },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, [statsVisible]);

  useEffect(() => {
    if (!statsVisible) return;
    stats.forEach((stat) => {
      const duration = 2000;
      const steps = 60;
      const stepDuration = duration / steps;
      const increment = stat.target / steps;
      let current = 0;
      const interval = setInterval(() => {
        current += increment;
        if (current >= stat.target) {
          current = stat.target;
          clearInterval(interval);
        }
        setCounters((prev) => ({
          ...prev,
          [stat.key]: stat.isDecimal
            ? Math.round(current * 10) / 10
            : Math.round(current),
        }));
      }, stepDuration);
    });
  }, [statsVisible]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] overflow-hidden bg-gradient-to-br from-[#0f0a2e] via-[#1a1145] to-[#0d0b2e]">
        {/* Animated background orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-indigo-600/20 blur-[120px] animate-pulse-slow" />
          <div className="absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-[120px] animate-pulse-slow" style={{ animationDelay: "1s" }} />
          <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-[100px] animate-pulse-slow" style={{ animationDelay: "2s" }} />
        </div>

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 pt-20 pb-24 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left: Copy */}
            <div className="max-w-2xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur-md">
                <Zap className="h-4 w-4 text-amber-400" />
                AI-Powered Learning Platform
                <span className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>

              <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl leading-[1.08]">
                Stop Guessing.
                <br />
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Start Learning.
                </span>
              </h1>

              <div className="mt-4 text-2xl font-semibold text-white/50 sm:text-3xl">
                Master{" "}
                <span className="min-w-[260px] inline-block bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  {typedWord}
                  <span className="ml-0.5 inline-block w-[3px] animate-pulse bg-cyan-400 align-middle h-[1.1em]" />
                </span>
                {" "}with SmartLMS
              </div>

              <p className="mt-6 max-w-xl text-lg text-white/60 sm:text-xl leading-relaxed">
                The most advanced LMS combining AI course creation, 14 quiz types,
                live classes, and beautiful certificates — all in one platform.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/register"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:shadow-xl hover:shadow-indigo-500/40 hover:-translate-y-0.5"
                >
                  Start Learning Free
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/courses"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10"
                >
                  Explore Courses
                </Link>
              </div>

              <div className="mt-10 flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[
                    "from-blue-400 to-indigo-500",
                    "from-purple-400 to-pink-500",
                    "from-emerald-400 to-teal-500",
                    "from-amber-400 to-orange-500",
                    "from-rose-400 to-red-500",
                  ].map((g, i) => (
                    <div
                      key={i}
                      className={`h-10 w-10 rounded-full border-2 border-[#0f0a2e] bg-gradient-to-br ${g} flex items-center justify-center text-[10px] font-bold text-white`}
                    >
                      {["JD", "AS", "MK", "LR", "TP"][i]}
                    </div>
                  ))}
                </div>
                <span className="text-sm text-white/50">
                  Join <span className="font-semibold text-white/80">100,000+</span> learners worldwide
                </span>
              </div>
            </div>

            {/* Right: Hero Slider */}
            <div className="relative hidden lg:block">
              {/* Glow behind the card */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-3xl" />

              <div className="relative">
                <HeroSlider />

                {/* Floating badge: Certificate */}
                <div className="absolute -left-6 top-12 animate-bounce rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2.5 backdrop-blur-xl shadow-lg z-20" style={{ animationDuration: "3s" }}>
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-500">
                      <Award className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-white">Certificate Earned</p>
                      <p className="text-[9px] text-white/40">Web Development 101</p>
                    </div>
                  </div>
                </div>

                {/* Floating badge: Quiz Score */}
                <div className="absolute -right-4 top-1/2 -translate-y-1/2 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2.5 backdrop-blur-xl shadow-lg z-20">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500">
                      <Target className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-white">Quiz Score</p>
                      <p className="text-[9px] font-bold text-emerald-400">95%</p>
                    </div>
                  </div>
                </div>

                {/* Floating badge: Rating */}
                <div className="absolute -right-6 bottom-16 animate-bounce rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2.5 backdrop-blur-xl shadow-lg z-20" style={{ animationDuration: "4s", animationDelay: "1s" }}>
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-yellow-400 to-amber-500">
                      <Star className="h-4 w-4 text-white fill-white" />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-white">4.9 Rating</p>
                      <p className="text-[9px] text-white/40">12,847 reviews</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Curved bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 80L1440 80L1440 20C1440 20 1140 60 720 60C300 60 0 20 0 20L0 80Z" fill="var(--background)" />
          </svg>
        </div>
      </section>

      {/* Social Proof Strip */}
      <section className="relative bg-[var(--background)] py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-medium text-gray-400 mb-8">
            Trusted by educators at leading institutions
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {trustedLogos.map((logo) => (
              <div
                key={logo.name}
                className="flex items-center gap-2.5 text-gray-300 transition-colors hover:text-gray-500"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-lg font-bold text-gray-400">
                  {logo.letter}
                </div>
                <span className="text-lg font-semibold tracking-tight">{logo.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Counter */}
      <section ref={statsRef} className="relative bg-[var(--background)] pb-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-xl sm:grid-cols-4 sm:p-10">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center text-center"
              >
                <span className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                  {stat.isDecimal
                    ? counters[stat.key].toFixed(1)
                    : counters[stat.key]}
                  {stat.suffix}
                </span>
                <span className="mt-1 text-sm font-medium text-gray-500">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Showcase - 3 Mini Demos */}
      <section className="bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="inline-block rounded-full bg-indigo-100 px-4 py-1.5 text-sm font-medium text-indigo-700">
              See It In Action
            </span>
            <h2 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
              Powerful Tools, Beautifully Crafted
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              Explore the features that make SmartLMS the most loved learning platform.
            </p>
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {/* Demo 1: AI Course Builder */}
            <div className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-2xl hover:-translate-y-1">
              <div className="absolute -inset-1 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative p-8">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-lg shadow-blue-500/25">
                  <Brain className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">AI Course Builder</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Generate entire course outlines with a single prompt
                </p>

                {/* Mockup */}
                <div className="mt-6 rounded-xl bg-gray-50 p-4 border border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="h-4 w-4 text-blue-500" />
                    <span className="text-xs font-medium text-blue-600">Generating...</span>
                  </div>
                  <div className="space-y-2">
                    {courseOutline.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 rounded-lg bg-white p-2.5 text-xs text-gray-600 shadow-sm border border-gray-100"
                        style={{
                          opacity: 0,
                          animation: `fadeIn 0.3s ease-out ${i * 0.15}s forwards`,
                        }}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-blue-500" />
                        <span className="flex-1">{item.title}</span>
                        <span className="text-[10px] text-gray-400">{item.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Demo 2: Quiz Engine */}
            <div className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-2xl hover:-translate-y-1">
              <div className="absolute -inset-1 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative p-8">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-400 text-white shadow-lg shadow-purple-500/25">
                  <FileCheck className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Quiz Engine</h3>
                <p className="mt-2 text-sm text-gray-500">
                  14 question types with timed assessments
                </p>

                {/* Mockup */}
                <div className="mt-6 rounded-xl bg-gray-50 p-4 border border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-purple-600">Question 3 of 10</span>
                    <div className="flex items-center gap-1.5 text-xs">
                      <Timer className="h-3.5 w-3.5 text-red-500" />
                      <span className="font-mono font-semibold text-red-500">0:42</span>
                    </div>
                  </div>
                  <p className="mb-3 text-xs font-medium text-gray-700">
                    Which hook is used for side effects in React?
                  </p>
                  <div className="space-y-1.5">
                    {quizOptions.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveQuizOption(i)}
                        className={`flex w-full items-center gap-2.5 rounded-lg border-2 p-2.5 text-left text-xs transition-all ${
                          activeQuizOption === i
                            ? opt.correct
                              ? "border-green-500 bg-green-50 text-green-700"
                              : "border-red-500 bg-red-50 text-red-700"
                            : "border-gray-200 bg-white text-gray-600 hover:border-purple-300 hover:bg-purple-50"
                        }`}
                      >
                        <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md bg-gray-100 text-[10px] font-bold text-gray-500">
                          {opt.label}
                        </span>
                        <span className="flex-1">{opt.text}</span>
                        {activeQuizOption === i && opt.correct && (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        )}
                        {activeQuizOption === i && !opt.correct && (
                          <RotateCcw className="h-4 w-4 text-red-400" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Demo 3: Certificate */}
            <div className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-2xl hover:-translate-y-1">
              <div className="absolute -inset-1 bg-gradient-to-br from-amber-500/5 to-orange-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative p-8">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-400 text-white shadow-lg shadow-amber-500/25">
                  <Award className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Certificate Builder</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Auto-issue beautiful certificates with QR verification
                </p>

                {/* Mockup */}
                <div className="mt-6 rounded-xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 p-4">
                  <div className="text-center">
                    <Trophy className="mx-auto h-8 w-8 text-amber-500" />
                    <p className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-amber-600">
                      Certificate of Completion
                    </p>
                    <p className="mt-2 text-xs text-gray-500">This certifies that</p>
                    <p className="mt-0.5 text-sm font-bold text-gray-900">Sarah Johnson</p>
                    <p className="mt-1 text-[10px] text-gray-500">has successfully completed</p>
                    <p className="mt-0.5 text-xs font-semibold text-amber-700">
                      React Masterclass
                    </p>
                    <div className="mt-3 flex items-center justify-center gap-3">
                      <div className="h-px flex-1 bg-amber-200" />
                      <div className="h-12 w-12 rounded-lg bg-white border border-amber-200 flex items-center justify-center">
                        <div className="grid grid-cols-4 gap-0.5">
                          {Array.from({ length: 16 }).map((_, i) => (
                            <div
                              key={i}
                              className={`h-1.5 w-1.5 ${
                                Math.random() > 0.4 ? "bg-gray-800" : "bg-transparent"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="h-px flex-1 bg-amber-200" />
                    </div>
                    <div className="mt-2 flex items-center justify-center gap-1">
                      <Shield className="h-3 w-3 text-amber-500" />
                      <span className="text-[9px] font-medium text-amber-600">
                        Verified · QR: SLM-2024-8F3K
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full Features Grid */}
      <section className="py-24 bg-[var(--background)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="inline-block rounded-full bg-indigo-100 px-4 py-1.5 text-sm font-medium text-indigo-700">
              Features
            </span>
            <h2 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
              Everything You Need to Teach
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              A complete learning management system with tools that rival the
              biggest platforms, powered by artificial intelligence.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-7 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1"
              >
                <div
                  className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} text-white shadow-lg`}
                >
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
                <div
                  className={`absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br ${feature.gradient} opacity-0 blur-3xl transition-opacity group-hover:opacity-10`}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Carousel */}
      <section className="relative overflow-hidden bg-gray-900 py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.12),transparent_60%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white/80">
              Testimonials
            </span>
            <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              Loved by Educators Worldwide
            </h2>
          </div>

          {/* Auto-scrolling carousel */}
          <div className="relative mt-16 overflow-hidden">
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-gray-900 to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-gray-900 to-transparent z-10" />
            <div
              className="flex gap-6"
              style={{
                animation: "scroll 30s linear infinite",
                width: "max-content",
              }}
            >
              {[...testimonials, ...testimonials].map((testimonial, i) => (
                <div
                  key={`${testimonial.name}-${i}`}
                  className="flex w-[380px] flex-shrink-0 flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-sm"
                >
                  <div className="mb-4 flex gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, j) => (
                      <Star
                        key={j}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="flex-1 text-sm text-gray-300 leading-relaxed">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>
                  <div className="mt-5 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {testimonial.name}
                      </p>
                      <p className="text-xs text-gray-400">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.04]" />
        <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white/80 backdrop-blur-md mb-6">
            <GraduationCap className="h-4 w-4" />
            Start in 60 seconds — No credit card required
          </div>
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl leading-tight">
            Ready to Transform
            <br />
            Your Teaching?
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-white/70 leading-relaxed">
            Join over 100,000 educators and institutions already using SmartLMS
            to create exceptional learning experiences. Start building for free today.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/register"
              className="group inline-flex items-center gap-2 rounded-xl bg-white px-10 py-4 text-base font-bold text-indigo-700 shadow-xl transition-all hover:shadow-2xl hover:-translate-y-0.5"
            >
              Get Started for Free
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 px-10 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all hover:border-white/60 hover:bg-white/10"
            >
              Book a Demo
            </Link>
          </div>
        </div>
      </section>

      <Footer />

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
