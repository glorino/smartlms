"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  Sparkles,
  Loader2,
  ChevronDown,
  ChevronRight,
  FileText,
  Video,
  HelpCircle,
  CheckCircle2,
} from "lucide-react";

interface CourseCreatorProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CourseOutline {
  title: string;
  description: string;
  level: string;
  sections: {
    title: string;
    description: string;
    lessons: {
      title: string;
      type: string;
      description: string;
      estimatedDuration: string;
    }[];
  }[];
  learningOutcomes: string[];
  prerequisites: string[];
  estimatedHours: number;
}

const lessonTypeIcon: Record<string, any> = {
  TEXT: FileText,
  VIDEO: Video,
  QUIZ: HelpCircle,
};

export default function CourseCreator({ isOpen, onClose }: CourseCreatorProps) {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [duration, setDuration] = useState("Self-paced");
  const [outcomes, setOutcomes] = useState("");
  const [generating, setGenerating] = useState(false);
  const [outline, setOutline] = useState<CourseOutline | null>(null);
  const [expandedSections, setExpandedSections] = useState<
    Record<number, boolean>
  >({});

  const toggleSection = (idx: number) => {
    setExpandedSections((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const generateOutline = async () => {
    if (!topic.trim()) return;
    setGenerating(true);
    setOutline(null);
    try {
      const res = await fetch("/api/ai/course-creator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic.trim(),
          level,
          duration,
          learningOutcomes: outcomes
            .split("\n")
            .map((o) => o.trim())
            .filter(Boolean),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setOutline(data.outline);
      }
    } catch {}
    setGenerating(false);
  };

  const createCourse = () => {
    if (!outline) return;
    const params = new URLSearchParams({
      title: outline.title,
      description: outline.description,
      level: outline.level,
      outcomes: outline.learningOutcomes.join(","),
    });
    router.push("/instructor/courses/new?" + params.toString());
    onClose();
  };

  const reset = () => {
    setTopic("");
    setLevel("Beginner");
    setDuration("Self-paced");
    setOutcomes("");
    setOutline(null);
    setExpandedSections({});
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100">
              <Sparkles className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                AI Course Creator
              </h2>
              <p className="text-sm text-gray-500">
                Generate a full course outline with AI
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {!outline ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course Topic *
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Introduction to Machine Learning"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Level
                  </label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option>Self-paced</option>
                    <option>2 weeks</option>
                    <option>4 weeks</option>
                    <option>8 weeks</option>
                    <option>12 weeks</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Learning Outcomes{" "}
                  <span className="text-gray-400">(one per line, optional)</span>
                </label>
                <textarea
                  value={outcomes}
                  onChange={(e) => setOutcomes(e.target.value)}
                  placeholder={"Understand core concepts\nBuild practical projects\nApply best practices"}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <button
                onClick={generateOutline}
                disabled={!topic.trim() || generating}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {generating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating Course Outline...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate Course Outline
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="rounded-lg border border-indigo-100 bg-indigo-50/50 p-4">
                <h3 className="text-xl font-bold text-gray-900">
                  {outline.title}
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  {outline.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-500">
                  <span>Level: {outline.level}</span>
                  <span>Est. {outline.estimatedHours} hours</span>
                  <span>{outline.sections.length} sections</span>
                </div>
              </div>

              {outline.learningOutcomes?.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Learning Outcomes
                  </h4>
                  <ul className="space-y-1">
                    {outline.learningOutcomes.map((outcome, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-sm text-gray-600"
                      >
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                        {outcome}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {outline.prerequisites?.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Prerequisites
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {outline.prerequisites.map((pre, i) => (
                      <span
                        key={i}
                        className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600"
                      >
                        {pre}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700">
                  Course Sections
                </h4>
                {outline.sections.map((section, si) => {
                  const isExpanded = expandedSections[si] !== false;
                  const SectionIcon = isExpanded ? ChevronDown : ChevronRight;
                  return (
                    <div
                      key={si}
                      className="rounded-lg border border-gray-200 overflow-hidden"
                    >
                      <div
                        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                        onClick={() => toggleSection(si)}
                      >
                        <div className="flex items-center gap-3">
                          <SectionIcon className="h-4 w-4 text-gray-400" />
                          <div>
                            <h5 className="text-sm font-medium text-gray-900">
                              {section.title}
                            </h5>
                            <p className="text-xs text-gray-500">
                              {section.description}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs text-gray-400">
                          {section.lessons.length} lessons
                        </span>
                      </div>
                      {isExpanded && (
                        <div className="border-t border-gray-100 px-4 pb-4">
                          {section.lessons.map((lesson, li) => {
                            const Icon =
                              lessonTypeIcon[lesson.type] || FileText;
                            return (
                              <div
                                key={li}
                                className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0"
                              >
                                <Icon className="h-4 w-4 text-gray-400 shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm text-gray-900">
                                    {lesson.title}
                                  </p>
                                  <p className="text-xs text-gray-500 truncate">
                                    {lesson.description}
                                  </p>
                                </div>
                                <span className="text-xs text-gray-400 shrink-0">
                                  {lesson.estimatedDuration}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setOutline(null);
                    setGenerating(false);
                  }}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Edit &amp; Regenerate
                </button>
                <button
                  onClick={createCourse}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Create Course
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
