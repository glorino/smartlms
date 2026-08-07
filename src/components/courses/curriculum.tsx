"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Play,
  FileText,
  HelpCircle,
  Lock,
  Check,
  Clock,
} from "lucide-react";

type LessonType = "video" | "text" | "quiz";

type Lesson = {
  id: string;
  title: string;
  type: LessonType;
  duration: string;
  completed: boolean;
  locked: boolean;
};

type Section = {
  id: string;
  title: string;
  lessons: Lesson[];
};

type CurriculumProps = {
  sections: Section[];
  currentLessonId?: string;
  onLessonClick?: (lessonId: string) => void;
};

const lessonTypeIcons = {
  video: Play,
  text: FileText,
  quiz: HelpCircle,
};

const lessonTypeColors = {
  video: "text-blue-500",
  text: "text-emerald-500",
  quiz: "text-purple-500",
};

export default function Curriculum({ sections, currentLessonId, onLessonClick }: CurriculumProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(sections.map((s) => s.id))
  );

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  const totalLessons = sections.reduce((acc, s) => acc + s.lessons.length, 0);
  const completedLessons = sections.reduce(
    (acc, s) => acc + s.lessons.filter((l) => l.completed).length,
    0
  );
  const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="border-b border-gray-200 p-4 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Curriculum</h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {completedLessons}/{totalLessons} lessons
          </span>
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500 dark:text-gray-400">{progress}% complete</span>
          </div>
          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="h-full rounded-full bg-blue-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        {sections.map((section) => {
          const isExpanded = expandedSections.has(section.id);
          const sectionCompleted = section.lessons.filter((l) => l.completed).length;

          return (
            <div key={section.id}>
              <button
                onClick={() => toggleSection(section.id)}
                className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                <div className="flex items-center gap-3">
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-500" />
                  )}
                  <span className="font-medium text-gray-900 dark:text-white">{section.title}</span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {sectionCompleted}/{section.lessons.length}
                </span>
              </button>

              {isExpanded && (
                <div className="divide-y divide-gray-50 bg-gray-50 dark:divide-gray-700/50 dark:bg-gray-700/20">
                  {section.lessons.map((lesson) => {
                    const Icon = lessonTypeIcons[lesson.type];
                    const isCurrent = currentLessonId === lesson.id;

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => !lesson.locked && onLessonClick?.(lesson.id)}
                        disabled={lesson.locked}
                        className={`flex w-full items-center gap-3 px-4 py-3 pl-12 text-left transition-colors ${
                          isCurrent
                            ? "border-l-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                            : lesson.locked
                            ? "cursor-not-allowed opacity-50"
                            : "hover:bg-gray-100 dark:hover:bg-gray-700/30"
                        }`}
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                          {lesson.completed ? (
                            <Check className="h-4 w-4 text-emerald-500" />
                          ) : lesson.locked ? (
                            <Lock className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Icon className={`h-4 w-4 ${lessonTypeColors[lesson.type]}`} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`truncate text-sm ${
                              lesson.completed
                                ? "text-gray-500 line-through dark:text-gray-400"
                                : "text-gray-900 dark:text-white"
                            }`}
                          >
                            {lesson.title}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <span className="capitalize">{lesson.type}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {lesson.duration}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
