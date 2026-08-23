"use client";

import { useState, useEffect } from "react";
import {
  Sparkles,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Clock,
  Target,
  BookOpen,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface RecommendedLesson {
  lessonId: string;
  title: string;
  reason: string;
  priority: number;
}

interface AdaptivePathData {
  strengths: string[];
  weaknesses: string[];
  recommendedNext: RecommendedLesson[];
  adjustedDifficulty: "easy" | "medium" | "hard";
  estimatedTimeToComplete: number;
  generatedAt: string;
}

interface AdaptivePathResponse {
  path: {
    id: string;
    pathData: AdaptivePathData;
    courseId: string;
    course: { id: string; title: string };
  } | null;
}

const difficultyConfig = {
  easy: { label: "Easy", color: "bg-green-100 text-green-800", icon: Target },
  medium: { label: "Medium", color: "bg-yellow-100 text-yellow-800", icon: Zap },
  hard: { label: "Hard", color: "bg-red-100 text-red-800", icon: AlertTriangle },
};

export default function LearningPathWidget({ courseId }: { courseId?: string }) {
  const [data, setData] = useState<AdaptivePathResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(courseId || "");
  const [courses, setCourses] = useState<{ id: string; title: string }[]>([]);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch("/api/enrollments");
        if (res.ok) {
          const json = await res.json();
          const enrolled = (json.enrollments || []).map((e: any) => ({
            id: e.courseId,
            title: e.course?.title || "Course",
          }));
          setCourses(enrolled);
          if (!courseId && enrolled.length > 0 && !selectedCourseId) {
            setSelectedCourseId(enrolled[0].id);
          }
        }
      } catch {
        // ignore
      }
    }
    fetchCourses();
  }, [courseId]);

  useEffect(() => {
    if (!selectedCourseId) return;
    async function fetchPath() {
      setLoading(true);
      try {
        const res = await fetch(`/api/ai/adaptive?courseId=${selectedCourseId}`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    fetchPath();
  }, [selectedCourseId]);

  async function handleGenerate() {
    if (!selectedCourseId) return;
    setGenerating(true);
    try {
      const res = await fetch("/api/ai/adaptive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: selectedCourseId }),
      });
      if (res.ok) {
        const json = await res.json();
        setData({ path: json.path ? { ...json.path, pathData: json.analysis } : null });
      }
    } catch {
      // ignore
    } finally {
      setGenerating(false);
    }
  }

  const pathData = data?.path?.pathData;
  const difficulty = pathData ? difficultyConfig[pathData.adjustedDifficulty] : null;

  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white/20 p-3">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Adaptive Learning Path</h3>
              <p className="text-sm text-indigo-100">AI-powered personalized recommendations</p>
            </div>
          </div>
          <button
            onClick={handleGenerate}
            disabled={generating || !selectedCourseId}
            className="inline-flex items-center gap-2 rounded-lg bg-white/20 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/30 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${generating ? "animate-spin" : ""}`} />
            {generating ? "Generating..." : data?.path ? "Regenerate Path" : "Generate Path"}
          </button>
        </div>
      </div>

      <CardContent className="p-6">
        {courses.length > 1 && !courseId && (
          <div className="mb-4">
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12 text-gray-400">
            <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
            Loading learning path...
          </div>
        ) : !pathData ? (
          <div className="py-12 text-center">
            <Sparkles className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-4 text-gray-500">No adaptive path generated yet</p>
            <p className="mt-1 text-sm text-gray-400">
              Click &quot;Generate Path&quot; to get AI-powered learning recommendations
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Difficulty & Time */}
            <div className="flex items-center gap-4">
              {difficulty && (
                <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${difficulty.color}`}>
                  <difficulty.icon className="h-4 w-4" />
                  <span className="text-sm font-medium">Difficulty: {difficulty.label}</span>
                </div>
              )}
              {pathData.estimatedTimeToComplete > 0 && (
                <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-blue-700">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    ~{Math.round(pathData.estimatedTimeToComplete / 60)}h {pathData.estimatedTimeToComplete % 60}m remaining
                  </span>
                </div>
              )}
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-green-100 bg-green-50/50 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <h4 className="font-semibold text-green-800">Strengths</h4>
                </div>
                {pathData.strengths.length > 0 ? (
                  <ul className="space-y-2">
                    {pathData.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-green-700">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-green-600/70">Keep progressing to identify strengths</p>
                )}
              </div>

              <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-amber-600" />
                  <h4 className="font-semibold text-amber-800">Areas to Improve</h4>
                </div>
                {pathData.weaknesses.length > 0 ? (
                  <ul className="space-y-2">
                    {pathData.weaknesses.map((w, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-amber-700">
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                        {w}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-amber-600/70">No weak areas identified</p>
                )}
              </div>
            </div>

            {/* Recommended Next Lessons */}
            {pathData.recommendedNext.length > 0 && (
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-indigo-600" />
                  <h4 className="font-semibold text-gray-900">Recommended Next</h4>
                </div>
                <div className="space-y-3">
                  {pathData.recommendedNext
                    .sort((a, b) => a.priority - b.priority)
                    .slice(0, 5)
                    .map((lesson, i) => (
                      <div
                        key={lesson.lessonId || i}
                        className="flex items-center gap-4 rounded-xl border border-gray-100 p-4 transition-colors hover:border-indigo-200 hover:bg-indigo-50/30"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600">
                          {lesson.priority}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-medium text-gray-900">{lesson.title}</h5>
                          <p className="mt-0.5 text-sm text-gray-500">{lesson.reason}</p>
                        </div>
                        <ChevronRight className="h-5 w-5 shrink-0 text-gray-400" />
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Last Generated */}
            {pathData.generatedAt && (
              <p className="text-right text-xs text-gray-400">
                Last generated: {new Date(pathData.generatedAt).toLocaleString()}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
