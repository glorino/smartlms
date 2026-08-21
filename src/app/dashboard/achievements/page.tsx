"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Trophy, Star, Lock } from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  type: string;
  earnedAt: string;
}

const ALL_ACHIEVEMENTS: Omit<Achievement, "id" | "earnedAt">[] = [
  { title: "First Steps", description: "Completed your first lesson", icon: "🚀", points: 10, type: "first_lesson" },
  { title: "Quiz Master", description: "Scored 100% on a quiz", icon: "🏆", points: 50, type: "quiz_master" },
  { title: "Course Champion", description: "Completed an entire course", icon: "🎓", points: 100, type: "course_complete" },
  { title: "7-Day Streak", description: "Maintained a 7-day learning streak", icon: "🔥", points: 25, type: "streak_7" },
];

export default function DashboardAchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAchievements() {
      try {
        const res = await fetch("/api/achievements");
        if (res.ok) {
          const data = await res.json();
          setAchievements(data.achievements || []);
        }
      } catch {}
      setLoading(false);
    }
    fetchAchievements();
  }, []);

  const totalPoints = achievements.reduce((sum, a) => sum + a.points, 0);
  const earnedTypes = new Set(achievements.map((a) => a.type));

  const earnedAchievements = ALL_ACHIEVEMENTS.filter((a) => earnedTypes.has(a.type)).map((a) => {
    const record = achievements.find((r) => r.type === a.type)!;
    return { ...a, earnedAt: record.earnedAt };
  });

  const availableAchievements = ALL_ACHIEVEMENTS.filter((a) => !earnedTypes.has(a.type));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Dashboard
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Achievements</h1>
        <p className="text-gray-500">Track your learning milestones</p>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
            <Trophy className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Points</p>
            <p className="text-2xl font-bold text-gray-900">{totalPoints}</p>
          </div>
        </div>
      </div>

      {earnedAchievements.length > 0 && (
        <div>
          <h2 className="mb-3 text-lg font-semibold text-gray-900">Earned</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {earnedAchievements.map((a) => (
              <div
                key={a.type}
                className="flex items-start gap-4 rounded-xl border border-indigo-100 bg-white p-4 shadow-sm"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-2xl">
                  {a.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900">{a.title}</h3>
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  </div>
                  <p className="text-sm text-gray-500">{a.description}</p>
                  <p className="mt-1 text-xs text-gray-400">
                    {new Date(a.earnedAt).toLocaleDateString()} · {a.points} pts
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {availableAchievements.length > 0 && (
        <div>
          <h2 className="mb-3 text-lg font-semibold text-gray-900">Available</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {availableAchievements.map((a) => (
              <div
                key={a.type}
                className="flex items-start gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4 opacity-60"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-200 text-2xl">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-600">{a.title}</h3>
                  <p className="text-sm text-gray-400">{a.description}</p>
                  <p className="mt-1 text-xs text-gray-400">{a.points} pts</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
