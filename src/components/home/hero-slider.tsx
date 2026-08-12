"use client";

import { useState, useEffect } from "react";
import {
  Play,
  CheckCircle2,
  Trophy,
  BookOpen,
  Users,
  BarChart3,
  Brain,
  Star,
  Zap,
} from "lucide-react";

const slides = [
  {
    id: "dashboard",
    title: "Smart Dashboard",
    subtitle: "Track your progress in real-time",
    gradient: "from-indigo-900/90 to-purple-900/90",
    content: (
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-[11px] font-semibold text-white">Welcome back, Sarah!</p>
            <p className="text-[9px] text-white/40">3 courses in progress</p>
          </div>
          <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-medium text-emerald-400">
            12 Day Streak
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Completed", value: "24", icon: CheckCircle2, color: "from-emerald-500 to-teal-500" },
            { label: "Hours", value: "48", icon: BookOpen, color: "from-blue-500 to-indigo-500" },
            { label: "Certificates", value: "5", icon: Trophy, color: "from-amber-500 to-orange-500" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-lg bg-white/[0.06] p-2 text-center border border-white/5">
              <div className={`mx-auto mb-1 flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br ${stat.color}`}>
                <stat.icon className="h-3 w-3 text-white" />
              </div>
              <p className="text-sm font-bold text-white">{stat.value}</p>
              <p className="text-[8px] text-white/40">{stat.label}</p>
            </div>
          ))}
        </div>
        <div className="rounded-lg bg-white/[0.04] p-2 border border-white/5">
          <div className="flex items-center justify-between text-[9px] text-white/50 mb-1">
            <span>Weekly Goal</span>
            <span>85%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-[85%] rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "course",
    title: "Course Player",
    subtitle: "Immersive video learning experience",
    gradient: "from-blue-900/90 to-cyan-900/90",
    content: (
      <div className="space-y-3">
        <div className="relative aspect-video rounded-lg bg-gradient-to-br from-blue-900/50 to-cyan-900/50 flex items-center justify-center overflow-hidden border border-white/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.15),transparent_70%)]" />
          <div className="relative flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white/15 backdrop-blur-md border border-white/20 hover:scale-110 transition-transform">
            <Play className="h-5 w-5 text-white fill-white ml-0.5" />
          </div>
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-2">
            <p className="text-[9px] text-white/70">Lesson 5: Advanced Patterns</p>
            <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[60%] rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" />
            </div>
          </div>
        </div>
        <div className="space-y-1">
          {["Introduction", "Setup & Config", "Core Concepts", "Components", "Advanced Patterns"].map((lesson, i) => (
            <div
              key={lesson}
              className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-[9px] ${
                i === 4 ? "bg-blue-500/15 text-blue-300 border border-blue-500/20" : i < 4 ? "text-white/50" : "text-white/30"
              }`}
            >
              {i < 4 ? (
                <CheckCircle2 className="h-3 w-3 text-emerald-400" />
              ) : i === 4 ? (
                <div className="h-3 w-3 rounded-full border-2 border-blue-400 flex items-center justify-center">
                  <div className="h-1 w-1 rounded-full bg-blue-400" />
                </div>
              ) : (
                <div className="h-3 w-3 rounded-full border border-white/20" />
              )}
              <span className="flex-1">{lesson}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "quiz",
    title: "Interactive Quizzes",
    subtitle: "Test your knowledge with engaging assessments",
    gradient: "from-emerald-900/90 to-teal-900/90",
    content: (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-medium text-emerald-400">
            Question 3 of 5
          </div>
          <div className="flex items-center gap-1 text-[9px] text-white/50">
            <Zap className="h-3 w-3 text-yellow-400" />
            <span>Score: 2/2</span>
          </div>
        </div>
        <div className="rounded-lg bg-white/[0.06] p-3 border border-white/5">
          <p className="text-[10px] font-medium text-white">
            What hook is used for side effects in React?
          </p>
        </div>
        <div className="space-y-1.5">
          {[
            { label: "A", text: "useState", correct: false },
            { label: "B", text: "useEffect", correct: true },
            { label: "C", text: "useReducer", correct: false },
            { label: "D", text: "useMemo", correct: false },
          ].map((opt) => (
            <div
              key={opt.label}
              className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-[9px] transition-all ${
                opt.correct
                  ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                  : "bg-white/[0.03] text-white/40 border border-white/5 hover:border-white/10"
              }`}
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[8px] font-bold">
                {opt.label}
              </span>
              <span className="flex-1">{opt.text}</span>
              {opt.correct && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "students",
    title: "Learn Together",
    subtitle: "Join a community of 50,000+ learners",
    gradient: "from-violet-900/90 to-purple-900/90",
    content: (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {["bg-pink-400", "bg-blue-400", "bg-emerald-400", "bg-amber-400"].map((color, i) => (
              <div
                key={i}
                className={`h-7 w-7 rounded-full ${color} border-2 border-violet-900 flex items-center justify-center text-[9px] font-bold text-white`}
              >
                {["SK", "JD", "AM", "OP"][i]}
              </div>
            ))}
          </div>
          <span className="text-[9px] text-white/50">+2,847 online now</span>
        </div>
        <div className="rounded-lg bg-white/[0.06] p-2.5 border border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-violet-400 to-purple-500">
              <Users className="h-3 w-3 text-white" />
            </div>
            <span className="text-[10px] font-semibold text-white">Study Group: React Mastery</span>
          </div>
          <div className="space-y-1.5">
            {[
              { name: "Sarah K.", msg: "Just finished the hooks section! Very clear explanations.", time: "2m ago" },
              { name: "James D.", msg: "Can someone explain the useCallback example?", time: "5m ago" },
              { name: "Maria M.", msg: "The project exercises are so practical! Love it.", time: "8m ago" },
            ].map((msg, i) => (
              <div key={i} className="rounded-md bg-white/[0.03] p-2 border border-white/5">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-medium text-white">{msg.name}</span>
                  <span className="text-[8px] text-white/30">{msg.time}</span>
                </div>
                <p className="mt-0.5 text-[8px] text-white/40">{msg.msg}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-violet-500/10 p-2 border border-violet-500/20">
          <Star className="h-4 w-4 text-violet-400 fill-violet-400" />
          <div>
            <p className="text-[9px] font-semibold text-white">Live Session in 30 min</p>
            <p className="text-[8px] text-white/40">Advanced React Patterns with Sarah Johnson</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "certificate",
    title: "Earn Certificates",
    subtitle: "Industry-recognized credentials",
    gradient: "from-amber-900/90 to-orange-900/90",
    content: (
      <div className="space-y-3">
        <div className="rounded-xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-orange-500/10 p-4 text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500">
            <Trophy className="h-6 w-6 text-white" />
          </div>
          <p className="text-[11px] font-bold text-white">Certificate of Completion</p>
          <p className="text-[9px] text-white/40 mt-0.5">React Masterclass</p>
          <div className="mt-2 flex items-center justify-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="h-3 w-3 text-amber-400 fill-amber-400" />
            ))}
          </div>
          <p className="text-[8px] text-white/30 mt-1">Verified on blockchain</p>
        </div>
        <div className="space-y-1.5">
          {["QR Code Verified", "PDF Download Ready", "Share on LinkedIn", "Employer Verification"].map((feature, i) => (
            <div key={i} className="flex items-center gap-2 rounded-md bg-white/[0.04] px-2 py-1.5 border border-white/5">
              <CheckCircle2 className="h-3 w-3 text-amber-400" />
              <span className="text-[9px] text-white/60">{feature}</span>
            </div>
          ))}
        </div>
        <div className="rounded-lg bg-white/[0.04] p-2 border border-white/5">
          <p className="text-[9px] text-white/50 mb-1">Share your achievement</p>
          <div className="flex gap-1.5">
            {["LinkedIn", "Twitter", "Facebook"].map((platform) => (
              <div
                key={platform}
                className="rounded-md bg-white/10 px-2 py-1 text-[8px] text-white/60 hover:bg-white/15 cursor-pointer transition-colors"
              >
                {platform}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-1.5 shadow-2xl backdrop-blur-xl">
      <div className={`rounded-xl bg-gradient-to-br ${slide.gradient} p-4 transition-all duration-500`}>
        {/* Browser dots */}
        <div className="mb-3 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-red-400/80" />
          <div className="h-2 w-2 rounded-full bg-yellow-400/80" />
          <div className="h-2 w-2 rounded-full bg-green-400/80" />
          <div className="ml-2 flex-1 rounded-md bg-white/5 px-2 py-0.5 text-[9px] text-white/30">
            smartlms.com/{slide.id}
          </div>
        </div>

        {/* Slide label */}
        <div className="mb-2 flex items-center gap-2">
          <Brain className="h-3.5 w-3.5 text-white/60" />
          <span className="text-[10px] font-semibold text-white">{slide.title}</span>
        </div>
        <p className="mb-3 text-[8px] text-white/40">{slide.subtitle}</p>

        {/* Slide content */}
        <div className="transition-all duration-500">{slide.content}</div>
      </div>

      {/* Dots indicator */}
      <div className="flex items-center justify-center gap-1.5 py-2.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current ? "w-6 bg-indigo-500" : "w-1.5 bg-white/20 hover:bg-white/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
