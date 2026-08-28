"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Briefcase,
  TrendingUp,
  RefreshCw,
  Loader2,
  Target,
  Clock,
  BookOpen,
  ExternalLink,
} from "lucide-react";

interface RoadmapStep {
  step: number;
  title: string;
  description: string;
  estimatedTime: string;
}

interface CareerPathItem {
  id: string;
  title: string;
  description: string;
  matchScore: number;
  skills: string[];
  recommendations: {
    matchScore: number;
    requiredSkills: string[];
    gapSkills: string[];
  };
  roadmap: RoadmapStep[];
  createdAt: string;
}

interface MatchingCourse {
  id: string;
  title: string;
  category: string;
  level: string;
  tags: string[];
  passingScore: number;
}

export default function CareerPage() {
  const [careers, setCareers] = useState<CareerPathItem[]>([]);
  const [matchingCourses, setMatchingCourses] = useState<MatchingCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const fetchCareers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/career");
      if (res.ok) {
        const data = await res.json();
        setCareers(data.careerPaths || []);
        setMatchingCourses(data.matchingCourses || []);
      }
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    fetchCareers();
  }, []);

  const generateCareerPaths = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/ai/career", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setCareers((prev) => [...(data.careerPaths || []), ...prev]);
        if (data.matchingCourses?.length > 0) {
          setMatchingCourses(data.matchingCourses);
        }
      }
    } catch {}
    setGenerating(false);
  };

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

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Career Paths</h1>
          <p className="text-gray-500">
            AI-powered career recommendations matched to your enrolled courses
          </p>
        </div>
        <button
          onClick={generateCareerPaths}
          disabled={generating}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {generating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          {generating
            ? "Generating..."
            : careers.length > 0
            ? "Regenerate"
            : "Generate Career Paths"}
        </button>
      </div>

      {careers.length === 0 && !generating && (
        <div className="rounded-xl border border-gray-100 bg-white p-12 text-center shadow-sm">
          <Briefcase className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No career paths yet
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Click &quot;Generate Career Paths&quot; to get AI-powered
            recommendations based on your courses and skills.
          </p>
        </div>
      )}

      {generating && careers.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
          <p className="mt-4 text-gray-500">Analyzing your learning profile...</p>
        </div>
      )}

      {matchingCourses.length > 0 && (
        <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-indigo-900">
            <BookOpen className="h-5 w-5" />
            Recommended Courses for Your Career Goals
          </h2>
          <p className="mt-1 text-sm text-indigo-700">
            These courses will help you develop the skills needed for your career paths.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {matchingCourses.map((course) => (
              <Link
                key={course.id}
                href={`/courses/${course.id}`}
                className="flex items-center justify-between rounded-lg border border-indigo-200 bg-white p-3 text-sm transition hover:border-indigo-400 hover:shadow-sm"
              >
                <div>
                  <p className="font-medium text-gray-900">{course.title}</p>
                  <p className="text-xs text-gray-500">{course.category} &middot; {course.level}</p>
                </div>
                <ExternalLink className="h-4 w-4 shrink-0 text-indigo-400" />
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {careers.map((career) => (
          <div
            key={career.id}
            className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden"
          >
            <div
              className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition"
              onClick={() =>
                setExpanded(expanded === career.id ? null : career.id)
              }
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-100">
                  <Briefcase className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {career.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {career.description}
                  </p>
                  <div className="mt-2 flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <Target className="h-4 w-4 text-indigo-500" />
                      <span className="text-sm font-medium text-indigo-600">
                        {career.matchScore}% match
                      </span>
                    </div>
                    {career.recommendations?.gapSkills?.length > 0 && (
                      <div className="flex items-center gap-1.5">
                        <TrendingUp className="h-4 w-4 text-amber-500" />
                        <span className="text-sm text-gray-500">
                          {career.recommendations.gapSkills.length} skills to
                          learn
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-400">
                {expanded === career.id ? "Collapse" : "Expand"}
              </div>
            </div>

            {expanded === career.id && (
              <div className="border-t border-gray-100 p-6 space-y-6">
                {career.recommendations?.requiredSkills?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Required Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {career.recommendations.requiredSkills.map(
                        (skill, i) => {
                          const isGap =
                            career.recommendations.gapSkills?.includes(skill);
                          return (
                            <span
                              key={i}
                              className={
                                "inline-block rounded-full px-3 py-1 text-xs font-medium " +
                                (isGap
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-emerald-100 text-emerald-800")
                              }
                            >
                              {(isGap ? "Gap: " : "Have: ") + skill}
                            </span>
                          );
                        }
                      )}
                    </div>
                  </div>
                )}

                {career.recommendations?.gapSkills?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Skills to Develop
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {career.recommendations.gapSkills.map((skill, i) => (
                        <span
                          key={i}
                          className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {career.roadmap?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      Learning Roadmap
                    </h4>
                    <div className="space-y-3">
                      {career.roadmap.map((step, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600">
                            {step.step || i + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h5 className="text-sm font-medium text-gray-900">
                                {step.title}
                              </h5>
                              <span className="flex items-center gap-1 text-xs text-gray-400">
                                <Clock className="h-3 w-3" />
                                {step.estimatedTime}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
