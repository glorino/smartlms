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
  Play,
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

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Senior Instructor, Tech Academy",
    rating: 5,
    content:
      "SmartLMS transformed how I create courses. The AI builder cut my preparation time from weeks to hours. The analytics help me understand exactly what my students need.",
  },
  {
    name: "Michael Chen",
    role: "CEO, LearnPro",
    rating: 5,
    content:
      "We migrated 500+ courses to SmartLMS. The SCORM support made it seamless, and our students love the live class feature. Best LMS we have ever used.",
  },
  {
    name: "Elena Rodriguez",
    role: "University Professor",
    rating: 5,
    content:
      "The 14 question types and certificate builder are game-changers. My students are more engaged, and completion rates jumped 40% since switching to SmartLMS.",
  },
  {
    name: "David Kim",
    role: "Corporate Training Lead",
    rating: 5,
    content:
      "We onboard 200 employees monthly. SmartLMS automated our entire training pipeline. The analytics dashboard gives us insights we never had before.",
  },
  {
    name: "Aisha Patel",
    role: "Founder, SkillUp Academy",
    rating: 5,
    content:
      "From zero to 10,000 students in 6 months. SmartLMS scaled with us beautifully. The certificate builder adds such a professional touch to our courses.",
  },
];

const trustedLogos = [
  { name: "Google", letter: "G" },
  { name: "Microsoft", letter: "M" },
  { name: "Stanford", letter: "S" },
  { name: "MIT", letter: "M" },
  { name: "Meta", letter: "F" },
  { name: "Apple", letter: "A" },
];

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

  const stats = [
    { label: "Students", target: 100, suffix: "K+", key: "students" as const },
    { label: "Courses", target: 500, suffix: "+", key: "courses" as const },
    { label: "Countries", target: 50, suffix: "+", key: "countries" as const },
    { label: "Rating", target: 4.9, suffix: "", key: "rating" as const, isDecimal: true },
  ];

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

            {/* Right: Course Player Mockup */}
            <div className="relative hidden lg:block">
              {/* Glow behind the card */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-3xl" />

              <div className="relative">
                {/* Main player card */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-1.5 shadow-2xl backdrop-blur-xl">
                  <div className="rounded-xl bg-gradient-to-br from-gray-900/90 to-gray-800/90 overflow-hidden">
                    {/* Browser dots */}
                    <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
                      <div className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                      <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
                      <div className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
                      <div className="ml-3 flex-1 rounded-md bg-white/5 px-3 py-1 text-[10px] text-white/30">
                        smartlms.com/learn/react-masterclass
                      </div>
                    </div>

                    {/* Video area */}
                    <div className="relative mx-3 mt-3 aspect-video rounded-lg bg-gradient-to-br from-indigo-900/50 to-purple-900/50 flex items-center justify-center overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.15),transparent_70%)]" />
                      <div className="relative flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-white/15 backdrop-blur-md border border-white/20 transition-all hover:scale-110 hover:bg-white/25">
                        <Play className="h-7 w-7 text-white fill-white ml-1" />
                      </div>
                      {/* Video overlay text */}
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                        <div className="flex items-center justify-between text-[10px] text-white/70">
                          <span>Lesson 3: State Management</span>
                          <span>12:45 / 24:10</span>
                        </div>
                        <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-white/10">
                          <div className="h-full w-[52%] rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />
                        </div>
                      </div>
                    </div>

                    {/* Course info */}
                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-white">
                        React Masterclass 2024
                      </h3>
                      <p className="mt-0.5 text-[10px] text-white/40">
                        24 Lessons · 8h 30m · By Sarah Johnson
                      </p>

                      {/* Progress bar */}
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-[10px] text-white/40">
                          <span>Progress</span>
                          <span>42%</span>
                        </div>
                        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                          <div className="h-full w-[42%] rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500" />
                        </div>
                      </div>

                      {/* Lesson list */}
                      <div className="mt-4 space-y-1">
                        {courseOutline.map((lesson, i) => (
                          <div
                            key={i}
                            className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[11px] transition-colors ${
                              i === 2
                                ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/20"
                                : lesson.done
                                ? "text-white/50"
                                : "text-white/30"
                            }`}
                          >
                            {lesson.done ? (
                              <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-emerald-400" />
                            ) : i === 2 ? (
                              <div className="h-3.5 w-3.5 flex-shrink-0 rounded-full border-2 border-indigo-400 flex items-center justify-center">
                                <div className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                              </div>
                            ) : (
                              <div className="h-3.5 w-3.5 flex-shrink-0 rounded-full border border-white/20" />
                            )}
                            <span className="flex-1 truncate">{lesson.title}</span>
                            <span className="flex-shrink-0 text-[10px] text-white/30">{lesson.duration}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating badge: Certificate */}
                <div className="absolute -left-6 top-12 animate-bounce rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2.5 backdrop-blur-xl shadow-lg" style={{ animationDuration: "3s" }}>
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
                <div className="absolute -right-4 top-1/2 -translate-y-1/2 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2.5 backdrop-blur-xl shadow-lg">
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
                <div className="absolute -right-6 bottom-16 animate-bounce rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2.5 backdrop-blur-xl shadow-lg" style={{ animationDuration: "4s", animationDelay: "1s" }}>
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

      {/* See SmartLMS in Action - Video Section */}
      <section className="relative bg-[var(--background)] py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.06),transparent_70%)]" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-400 backdrop-blur-sm">
              <Play className="h-3.5 w-3.5 fill-indigo-400" />
              Watch the Demo
            </span>
            <h2 className="mt-5 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
              See SmartLMS in{" "}
              <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Action
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-gray-500">
              See how SmartLMS transforms learning
            </p>
          </div>

          {/* Video Player */}
          <div className="group relative mx-auto max-w-4xl">
            {/* Gradient border glow */}
            <div className="absolute -inset-[2px] rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-60 blur-sm transition-opacity group-hover:opacity-100" />
            <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

            <div className="relative overflow-hidden rounded-3xl bg-gray-950 p-1">
              <div className="relative aspect-video overflow-hidden rounded-2xl bg-black">
                <video
                  ref={(el) => {
                    if (el) {
                      el.play().catch(() => {});
                    }
                  }}
                  id="intro-video"
                  src="https://www.w3schools.com/html/mov_bbb.mp4"
                  muted
                  loop
                  playsInline
                  autoPlay
                  className="h-full w-full object-cover"
                  poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%236366f1'/%3E%3Cstop offset='50%25' style='stop-color:%23a855f7'/%3E%3Cstop offset='100%25' style='stop-color:%23ec4899'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1920' height='1080' fill='url(%23g)'/%3E%3Ctext x='960' y='540' text-anchor='middle' dominant-baseline='middle' fill='white' font-size='48' font-family='system-ui'%3ESmartLMS%3C/text%3E%3C/svg%3E"
                />

                {/* Gradient overlay */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

                {/* Play/Pause button */}
                <button
                  onClick={() => {
                    const video = document.getElementById("intro-video") as HTMLVideoElement;
                    if (video) {
                      if (video.paused) {
                        video.play();
                      } else {
                        video.pause();
                      }
                    }
                  }}
                  className="pointer-events-auto absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-20 w-20 items-center justify-center rounded-full border-2 border-white/20 bg-white/10 backdrop-blur-md transition-all hover:scale-110 hover:bg-white/20 hover:border-white/40 cursor-pointer"
                  aria-label="Play or Pause"
                >
                  <Play className="h-9 w-9 text-white fill-white ml-1" />
                </button>

                {/* Caption */}
                <div className="pointer-events-none absolute bottom-0 inset-x-0 p-6 text-center">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-5 py-2 backdrop-blur-md">
                    <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-sm font-medium text-white/90">
                      See how SmartLMS transforms learning
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Highlights Below Video */}
          <div className="mt-12 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3 mx-auto">
            {[
              {
                icon: Brain,
                title: "AI-Powered",
                description: "Generate courses, quizzes, and content with advanced AI",
                gradient: "from-indigo-500 to-blue-500",
                shadow: "shadow-indigo-500/20",
              },
              {
                icon: Sparkles,
                title: "Beautiful Design",
                description: "Stunning interfaces that learners actually enjoy using",
                gradient: "from-purple-500 to-pink-500",
                shadow: "shadow-purple-500/20",
              },
              {
                icon: BarChart3,
                title: "Track Progress",
                description: "Real-time analytics and insights on every learner",
                gradient: "from-amber-500 to-orange-500",
                shadow: "shadow-amber-500/20",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm transition-all hover:shadow-xl hover:-translate-y-1"
              >
                <div
                  className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${item.gradient} text-white shadow-lg ${item.shadow}`}
                >
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-gray-900">{item.title}</h3>
                <p className="mt-1.5 text-sm text-gray-500 leading-relaxed">
                  {item.description}
                </p>
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
                      React Masterclass 2024
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
