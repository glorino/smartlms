"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Play,
  Pause,
  Check,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  MessageSquare,
  StickyNote,
  X,
  Send,
  FileText,
  Video,
  CheckCircle2,
  Circle,
  Menu,
  ArrowLeft,
  ClipboardCheck,
  Award,
  RotateCcw,
  Bot,
} from "lucide-react";
import DOMPurify from "dompurify";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import QuizEngine from "@/components/quiz/quiz-engine";
import AITutor from "@/components/ai/ai-tutor";
import type { Quiz as AppQuiz, Question as AppQuestion } from "@/types";

interface LessonData {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  type: string;
  videoUrl: string | null;
  videoType: string | null;
  pdfUrl: string | null;
  duration: number | null;
  order: number;
  sectionId: string;
}

interface SectionData {
  id: string;
  title: string;
  order: number;
  lessons: LessonData[];
}

interface CourseData {
  id: string;
  title: string;
  sections: SectionData[];
  quizzes: { id: string; title: string; passingScore: number; lessonId: string | null }[];
}

interface Note {
  id: string;
  content: string;
  createdAt: string;
}

interface QAItem {
  id: string;
  question: string;
  answer: string | null;
  createdAt: string;
}

function getVideoType(url: string | null): string | null {
  if (!url) return null;
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  if (url.includes("vimeo.com")) return "vimeo";
  return "native";
}

function getEmbedUrl(url: string, type: string): string {
  if (type === "youtube") {
    const match = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
    if (match) return `https://www.youtube.com/embed/${match[1]}`;
    return url;
  }
  if (type === "vimeo") {
    const match = url.match(/vimeo\.com\/(\d+)/);
    if (match) return `https://player.vimeo.com/video/${match[1]}`;
    return url;
  }
  return url;
}

export default function CourseLearnPage() {
  const params = useParams();
  const courseId = params.id as string;

  const [course, setCourse] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentLesson, setCurrentLesson] = useState<LessonData | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [rightPanel, setRightPanel] = useState<"none" | "notes" | "qa">("none");
  const [aiTutorOpen, setAiTutorOpen] = useState(false);

  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [questions, setQuestions] = useState<QAItem[]>([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [passedQuizzes, setPassedQuizzes] = useState<Set<string>>(new Set());
  const [showInlineQuiz, setShowInlineQuiz] = useState(false);
  const [inlineQuiz, setInlineQuiz] = useState<any>(null);
  const [inlineQuizScreen, setInlineQuizScreen] = useState<"info" | "quiz" | "results">("info");
  const [inlineQuizResult, setInlineQuizResult] = useState<{ score: number; totalPoints: number; passed: boolean; correctCount: number; incorrectCount: number; answers: Record<string, string> } | null>(null);
  const [inlineQuizAttemptCount, setInlineQuizAttemptCount] = useState(0);
  const [inlineQuizPreviousAttempts, setInlineQuizPreviousAttempts] = useState<{ score: number; passed: boolean; completedAt: string }[]>([]);

  useEffect(() => {
    async function loadCourse() {
      try {
        const res = await fetch(`/api/courses/${courseId}`);
        if (res.ok) {
          const data = await res.json();
          setCourse(data.course);
          if (data.course?.sections?.[0]?.lessons?.[0]) {
            setCurrentLesson(data.course.sections[0].lessons[0]);
          }
        }
      } catch (err) {
        console.error("Failed to load course", err);
      } finally {
        setLoading(false);
      }
    }
    loadCourse();
  }, [courseId]);

  useEffect(() => {
    if (!course) return;
    async function loadProgress() {
      try {
        const res = await fetch(`/api/progress?courseId=${courseId}`);
        if (res.ok) {
          const data = await res.json();
          const completed = new Set<string>();
          for (const p of data.progress || []) {
            if (p.completed) {
              completed.add(p.lessonId);
            }
          }
          setCompletedLessons(completed);
        }
      } catch {}
    }
    loadProgress();
  }, [course, courseId]);

  useEffect(() => {
    if (!course) return;
    async function loadQuizAttempts() {
      try {
        const passed = new Set<string>();
        for (const quiz of course!.quizzes || []) {
          if (!quiz.lessonId) continue;
          try {
            const res = await fetch(`/api/quizzes/attempts?quizId=${quiz.id}`);
            if (res.ok) {
              const data = await res.json();
              const attempts = data.attempts || [];
              const hasPassed = attempts.some((a: any) => a.passed);
              if (hasPassed) {
                passed.add(quiz.lessonId);
              }
            }
          } catch {}
        }
        setPassedQuizzes(passed);
      } catch {}
    }
    loadQuizAttempts();
  }, [course]);

  useEffect(() => {
    if (course) {
      const total = course.sections.reduce(
        (acc, s) => acc + s.lessons.length,
        0
      );
      const completed = completedLessons.size;
      setProgress(total > 0 ? Math.round((completed / total) * 100) : 0);
    }
  }, [course, completedLessons]);

  useEffect(() => {
    if (!currentLesson) return;
    async function loadNotes() {
      try {
        const res = await fetch(
          `/api/notes?lessonId=${currentLesson!.id}&courseId=${courseId}`
        );
        if (res.ok) {
          const data = await res.json();
          setNotes(data.notes || []);
        }
      } catch (err) {
        console.error("Failed to load notes", err);
      }
    }
    loadNotes();
  }, [currentLesson, courseId]);

  const allLessons = course?.sections.flatMap((s) => s.lessons) || [];
  const currentIndex = allLessons.findIndex((l) => l.id === currentLesson?.id);

  const getQuizForLesson = (lessonId: string) => {
    return course?.quizzes?.find((q) => q.lessonId === lessonId) || null;
  };

  const currentQuiz = currentLesson ? getQuizForLesson(currentLesson.id) : null;
  const hasPassedCurrentQuiz = currentLesson ? (!currentQuiz || passedQuizzes.has(currentLesson.id)) : true;
  const canGoNext = completedLessons.has(currentLesson?.id || "") && hasPassedCurrentQuiz;

  const goToLesson = (lesson: LessonData) => {
    setCurrentLesson(lesson);
    setIsPlaying(false);
  };

  const goNext = () => {
    if (currentIndex < allLessons.length - 1) {
      goToLesson(allLessons[currentIndex + 1]);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      goToLesson(allLessons[currentIndex - 1]);
    }
  };

  const markComplete = async () => {
    if (currentLesson) {
      setCompletedLessons((prev) => new Set(prev).add(currentLesson.id));
      try {
        await fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lessonId: currentLesson.id,
            courseId,
            completed: true,
          }),
        });
      } catch (err) {
        console.error("Failed to save progress", err);
      }
    }
  };

  const handleQuizComplete = (lessonId: string, passed: boolean) => {
    if (passed) {
      setPassedQuizzes((prev) => new Set(prev).add(lessonId));
    }
  };

  const openInlineQuiz = async (quizId: string) => {
    try {
      const res = await fetch(`/api/quizzes/${quizId}`);
      if (res.ok) {
        const data = await res.json();
        setInlineQuiz(data.quiz);
        setInlineQuizAttemptCount(data.attemptCount || 0);
        setInlineQuizPreviousAttempts(data.previousAttempts || []);
        setShowInlineQuiz(true);
        setInlineQuizScreen("info");
        setInlineQuizResult(null);
      }
    } catch (err) {
      console.error("Failed to load quiz", err);
    }
  };

  const handleInlineQuizSubmit = async (
    quizAnswers: Record<string, string | string[] | Record<string, string>>,
    attemptNumber: number
  ) => {
    if (!inlineQuiz) return;

    let correctCount = 0;
    let incorrectCount = 0;
    let totalPoints = 0;
    let score = 0;

    inlineQuiz.questions.forEach((q: any) => {
      totalPoints += q.points;
      const selectedAnswerId = quizAnswers[q.id] as string;
      const correctAnswer = q.answers.find((a: any) => a.isCorrect);
      if (selectedAnswerId && correctAnswer && selectedAnswerId === correctAnswer.id) {
        correctCount++;
        score += q.points;
      } else {
        incorrectCount++;
      }
    });

    const passed = totalPoints > 0 ? (score / totalPoints) * 100 >= inlineQuiz.passingScore : false;

    setInlineQuizResult({
      score,
      totalPoints,
      passed,
      correctCount,
      incorrectCount,
      answers: quizAnswers as Record<string, string>,
    });
    setInlineQuizScreen("results");
    setInlineQuizAttemptCount((prev) => prev + 1);
    setInlineQuizPreviousAttempts((prev) => [
      ...prev,
      { score, passed, completedAt: new Date().toISOString() },
    ]);

    try {
      await fetch(`/api/quizzes/${inlineQuiz.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: quizAnswers,
          timeTaken: null,
          attemptNumber,
        }),
      });
    } catch (err) {
      console.error("Failed to save attempt", err);
    }

    if (passed && currentLesson) {
      handleQuizComplete(currentLesson.id, true);
    }
  };

  const addNote = async () => {
    if (newNote.trim() && currentLesson) {
      try {
        const res = await fetch("/api/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lessonId: currentLesson.id,
            courseId,
            content: newNote,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          setNotes((prev) => [data.note, ...prev]);
        }
      } catch (err) {
        console.error("Failed to save note", err);
      }
      setNewNote("");
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      const res = await fetch(`/api/notes/${noteId}`, { method: "DELETE" });
      if (res.ok) {
        setNotes((prev) => prev.filter((n) => n.id !== noteId));
      }
    } catch (err) {
      console.error("Failed to delete note", err);
    }
  };

  const addQuestion = () => {
    if (newQuestion.trim()) {
      setQuestions((prev) => [
        { id: Date.now().toString(), question: newQuestion, answer: null, createdAt: new Date().toISOString() },
        ...prev,
      ]);
      setNewQuestion("");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!course || !currentLesson) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <p className="text-gray-500">Course not found</p>
        <Link href="/courses">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Courses
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-gray-950">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-gray-800 bg-gray-900 px-4 py-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-white"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link
            href={`/courses/${courseId}`}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">{course.title}</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden w-48 sm:block">
            <Progress value={progress} color="blue" />
          </div>
          <span className="text-xs text-gray-400">{progress}% complete</span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Curriculum */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-80 shrink-0 overflow-hidden border-r border-gray-800 bg-gray-900 transition-transform duration-300 md:relative md:z-auto md:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="h-full w-80 overflow-y-auto">
            <div className="p-4">
              <h3 className="mb-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">
                Course Content
              </h3>
              <div className="space-y-4">
                {course.sections.map((section) => (
                  <div key={section.id}>
                    <h4 className="mb-2 text-xs font-medium text-gray-500">
                      {section.title}
                    </h4>
                    <div className="space-y-1">
                      {section.lessons.map((lesson) => {
                        const isActive = lesson.id === currentLesson.id;
                        const isComplete = completedLessons.has(lesson.id);
                        const lessonQuiz = getQuizForLesson(lesson.id);
                        const quizPassed = passedQuizzes.has(lesson.id);
                        return (
                          <button
                            key={lesson.id}
                            onClick={() => goToLesson(lesson)}
                            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                              isActive
                                ? "bg-blue-600/20 text-blue-400"
                                : "text-gray-400 hover:bg-gray-800 hover:text-white"
                            }`}
                          >
                            {isComplete ? (
                              <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
                            ) : lesson.type === "VIDEO" ? (
                              <Play className="h-4 w-4 shrink-0" />
                            ) : (
                              <FileText className="h-4 w-4 shrink-0" />
                            )}
                            <span className="line-clamp-1">{lesson.title}</span>
                            {lessonQuiz && (
                              <span className={`shrink-0 rounded px-1 py-0.5 text-[10px] font-bold ${quizPassed ? "bg-green-900/50 text-green-400" : "bg-amber-900/50 text-amber-400"}`}>
                                Q
                              </span>
                            )}
                            {lesson.duration && (
                              <span className="ml-auto shrink-0 text-xs text-gray-600">
                                {Math.floor(lesson.duration / 60)}:
                                {String(lesson.duration % 60).padStart(2, "0")}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <main className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            {/* Video Player */}
            {currentLesson.type === "VIDEO" && (
              <div className="relative aspect-video bg-black">
                {currentLesson.videoUrl ? (
                  isPlaying ? (
                    (() => {
                      const detectedType = currentLesson.videoType || getVideoType(currentLesson.videoUrl);
                      const embedUrl = getEmbedUrl(currentLesson.videoUrl, detectedType || "native");
                      if (detectedType === "youtube" || detectedType === "vimeo") {
                        return (
                          <iframe
                            src={embedUrl}
                            title={currentLesson.title}
                            className="h-full w-full"
                            allowFullScreen
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          />
                        );
                      }
                      return (
                        <video
                          src={currentLesson.videoUrl}
                          title={currentLesson.title}
                          className="h-full w-full"
                          controls
                          autoPlay
                          playsInline
                        />
                      );
                    })()
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <button
                        onClick={() => setIsPlaying(true)}
                        className="group rounded-full bg-white/10 p-6 transition-all hover:bg-white/20"
                      >
                        <Play className="h-12 w-12 text-white group-hover:scale-110 transition-transform" />
                      </button>
                    </div>
                  )
                ) : currentLesson.content ? (
                  <div className="min-h-[50vh] bg-gray-900">
                    <div className="lesson-content mx-auto max-w-4xl px-6 py-10 sm:px-8 lg:px-12">
                      <div
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(currentLesson.content) }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center">
                      <Video className="mx-auto h-16 w-16 text-gray-600" />
                      <p className="mt-4 text-gray-400">No video available for this lesson</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Text / Content */}
            {currentLesson.type !== "VIDEO" && (
              <div className="min-h-[70vh] bg-gray-900">
                {currentLesson.content ? (
                  <div className="lesson-content mx-auto max-w-4xl px-6 py-10 sm:px-8 lg:px-12">
                    <div
                      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(currentLesson.content) }}
                    />
                  </div>
                ) : (
                  <div className="flex min-h-[70vh] items-center justify-center">
                    <div className="text-center">
                      <FileText className="mx-auto h-16 w-16 text-gray-600" />
                      <p className="mt-4 text-gray-400">
                        {currentLesson.type === "TEXT" ? "No content available" : "Text content"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Lesson Info */}
            <div className="border-b border-gray-800 bg-gray-900 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-semibold text-white">
                    {currentLesson.title}
                  </h1>
                  {currentLesson.description && (
                    <p className="mt-1 text-sm text-gray-400">
                      {currentLesson.description}
                    </p>
                  )}
                </div>
                <Button
                  onClick={markComplete}
                  variant={completedLessons.has(currentLesson.id) ? "outline" : "default"}
                  className={
                    completedLessons.has(currentLesson.id)
                      ? "border-green-600 text-green-500"
                      : ""
                  }
                >
                  <Check className="mr-2 h-4 w-4" />
                  {completedLessons.has(currentLesson.id) ? "Completed" : "Mark Complete"}
                </Button>
              </div>
            </div>

            {/* Resources */}
            {(currentLesson.videoUrl || (currentLesson as any).pdfUrl) && (
              <div className="border-b border-gray-800 bg-gray-900 px-6 py-4">
                <h3 className="mb-3 text-sm font-semibold text-white">Resources</h3>
                <div className="flex flex-wrap gap-2">
                  {currentLesson.videoUrl && (
                    <a
                      href={currentLesson.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-lg border border-gray-700 px-3 py-2 text-sm text-gray-300 hover:bg-gray-800"
                    >
                      <Video className="h-4 w-4" />
                      Video Resource
                    </a>
                  )}
                  {(currentLesson as any).pdfUrl && (
                    <a
                      href={(currentLesson as any).pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-lg border border-gray-700 px-3 py-2 text-sm text-gray-300 hover:bg-gray-800"
                    >
                      <FileText className="h-4 w-4" />
                      PDF Resource
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between bg-gray-900 px-6 pb-20 pr-24 pt-4">
              <Button
                variant="outline"
                onClick={goPrev}
                disabled={currentIndex <= 0}
                className="border-gray-600 bg-gray-800 text-gray-200 hover:bg-gray-700 hover:text-white disabled:opacity-30 disabled:hover:bg-gray-800"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              <div className="flex items-center gap-3">
                {currentQuiz && !hasPassedCurrentQuiz && (
                  <Button
                    variant="outline"
                    onClick={() => openInlineQuiz(currentQuiz.id)}
                    className="border-amber-600 bg-amber-900/30 text-amber-300 hover:bg-amber-900/50 hover:text-amber-200"
                  >
                    <ClipboardCheck className="mr-2 h-4 w-4" />
                    Take Quiz ({Math.round(currentQuiz.passingScore)}% to pass)
                  </Button>
                )}
                {currentQuiz && hasPassedCurrentQuiz && (
                  <span className="flex items-center gap-1.5 text-sm text-green-400">
                    <CheckCircle2 className="h-4 w-4" />
                    Quiz Passed
                  </span>
                )}
                <Button
                  onClick={goNext}
                  disabled={currentIndex >= allLessons.length - 1 || !canGoNext}
                  className="disabled:opacity-30"
                >
                  {!completedLessons.has(currentLesson?.id || "")
                    ? "Complete this lesson first"
                    : currentQuiz && !hasPassedCurrentQuiz
                    ? "Pass the quiz to continue"
                    : "Next"}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </main>

        {/* Right Panel */}
        {rightPanel !== "none" && (
          <aside className="w-80 shrink-0 border-l border-gray-800 bg-gray-900">
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-gray-800 px-4 py-3">
                <h3 className="text-sm font-semibold text-white">
                  {rightPanel === "notes" ? "Notes" : "Q & A"}
                </h3>
                <button
                  onClick={() => setRightPanel("none")}
                  className="rounded-lg p-1 text-gray-400 hover:bg-gray-800 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {rightPanel === "notes" ? (
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <textarea
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Add a note..."
                        rows={3}
                        className="flex-1 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <Button size="sm" onClick={addNote} className="w-full">
                      <Send className="mr-2 h-3 w-3" />
                      Save Note
                    </Button>
                    <div className="space-y-3">
                      {notes.map((note) => (
                        <div
                          key={note.id}
                          className="rounded-lg border border-gray-700 bg-gray-800 p-3"
                        >
                          <div className="flex items-start justify-between">
                            <p className="text-sm text-gray-300">{note.content}</p>
                            <button
                              onClick={() => deleteNote(note.id)}
                              className="ml-2 shrink-0 rounded p-1 text-gray-500 hover:bg-gray-700 hover:text-red-400"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                          <p className="mt-1 text-xs text-gray-500">
                            {new Date(note.createdAt).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        placeholder="Ask a question..."
                        className="flex-1 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                        onKeyDown={(e) => e.key === "Enter" && addQuestion()}
                      />
                      <Button size="sm" onClick={addQuestion}>
                        <Send className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {questions.map((q) => (
                        <div
                          key={q.id}
                          className="rounded-lg border border-gray-700 bg-gray-800 p-3"
                        >
                          <p className="text-sm font-medium text-white">
                            {q.question}
                          </p>
                          {q.answer ? (
                            <p className="mt-2 text-sm text-gray-400">{q.answer}</p>
                          ) : (
                            <p className="mt-2 text-xs text-gray-500 italic">
                              Awaiting answer...
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* Bottom Panel Toggle (mobile) */}
      <div className="flex border-t border-gray-800 bg-gray-900 sm:hidden">
        <button
          onClick={() => {
            setRightPanel(rightPanel === "notes" ? "none" : "notes");
            setAiTutorOpen(false);
          }}
          className={`flex flex-1 flex-col items-center gap-1 py-3 text-xs ${
            rightPanel === "notes" ? "text-blue-400" : "text-gray-400"
          }`}
        >
          <StickyNote className="h-5 w-5" />
          Notes
        </button>
        <button
          onClick={() => {
            setRightPanel(rightPanel === "qa" ? "none" : "qa");
            setAiTutorOpen(false);
          }}
          className={`flex flex-1 flex-col items-center gap-1 py-3 text-xs ${
            rightPanel === "qa" ? "text-blue-400" : "text-gray-400"
          }`}
        >
          <MessageSquare className="h-5 w-5" />
          Q&A
        </button>
        <button
          onClick={() => {
            setAiTutorOpen(!aiTutorOpen);
            setRightPanel("none");
          }}
          className={`flex flex-1 flex-col items-center gap-1 py-3 text-xs ${
            aiTutorOpen ? "text-blue-400" : "text-gray-400"
          }`}
        >
          <Bot className="h-5 w-5" />
          AI Tutor
        </button>
      </div>

      {/* Floating AI Tutor Button (desktop) */}
      <button
        onClick={() => {
          setAiTutorOpen(!aiTutorOpen);
          setRightPanel("none");
        }}
        className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full px-4 py-3 text-sm font-medium shadow-lg transition-all hover:scale-105 ${
          aiTutorOpen
            ? "bg-blue-700 text-white"
            : "bg-blue-600 text-white hover:bg-blue-500"
        }`}
      >
        <Bot className="h-5 w-5" />
        <span className="hidden sm:inline">AI Tutor</span>
      </button>

      {/* AI Tutor Panel */}
      {aiTutorOpen && (
        <aside className="fixed inset-y-0 right-0 z-50 w-96 max-w-full md:relative md:z-auto">
          <AITutor
            courseId={courseId}
            lessonId={currentLesson?.id}
            courseName={course.title}
            isOpen={aiTutorOpen}
            onClose={() => setAiTutorOpen(false)}
          />
        </aside>
      )}

      {/* Inline Quiz Overlay */}
      {showInlineQuiz && inlineQuiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <button
              onClick={() => {
                setShowInlineQuiz(false);
                setInlineQuiz(null);
              }}
              className="absolute right-4 top-4 z-10 rounded-full bg-gray-100 p-2 text-gray-600 hover:bg-gray-200"
            >
              <X className="h-5 w-5" />
            </button>

            {inlineQuizScreen === "info" && (
              <div className="p-8">
                <div className="mb-6 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100">
                    <ClipboardCheck className="h-8 w-8 text-indigo-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{inlineQuiz.title}</h2>
                  {inlineQuiz.description && (
                    <p className="mt-2 text-gray-500">{inlineQuiz.description}</p>
                  )}
                </div>

                <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div className="rounded-xl bg-gray-50 p-4 text-center">
                    <p className="text-2xl font-bold text-gray-900">{inlineQuiz.questions.length}</p>
                    <p className="text-sm text-gray-500">Questions</p>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-4 text-center">
                    <p className="text-2xl font-bold text-gray-900">{inlineQuiz.timeLimit ? `${inlineQuiz.timeLimit}m` : "None"}</p>
                    <p className="text-sm text-gray-500">Time Limit</p>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-4 text-center">
                    <p className="text-2xl font-bold text-gray-900">{inlineQuiz.passingScore}%</p>
                    <p className="text-sm text-gray-500">Passing Score</p>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-4 text-center">
                    <p className="text-2xl font-bold text-gray-900">{inlineQuizAttemptCount}</p>
                    <p className="text-sm text-gray-500">Attempts Used</p>
                  </div>
                </div>

                {inlineQuizPreviousAttempts.length > 0 && (
                  <div className="mb-6">
                    <h4 className="mb-3 text-sm font-semibold text-gray-700">Previous Attempts</h4>
                    <div className="flex flex-wrap gap-2">
                      {inlineQuizPreviousAttempts.map((attempt, i) => (
                        <span
                          key={i}
                          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                            attempt.passed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                          }`}
                        >
                          #{i + 1}: {Math.round(attempt.score)}% — {attempt.passed ? "Passed" : "Failed"}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <h4 className="font-medium text-amber-800">Instructions</h4>
                  <ul className="mt-2 space-y-1 text-sm text-amber-700">
                    <li>• Read each question carefully before answering</li>
                    <li>• You can navigate between questions freely</li>
                    <li>• You need {inlineQuiz.passingScore}% to pass</li>
                  </ul>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowInlineQuiz(false);
                      setInlineQuiz(null);
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => setInlineQuizScreen("quiz")}
                    className="flex-1"
                  >
                    Start Quiz
                  </Button>
                </div>
              </div>
            )}

            {inlineQuizScreen === "quiz" && (
              <div className="p-4">
                <QuizEngine
                  quiz={inlineQuiz}
                  maxAttempts={inlineQuiz.maxAttempts}
                  currentAttempt={inlineQuizAttemptCount + 1}
                  previousAttempts={inlineQuizPreviousAttempts}
                  onSubmit={handleInlineQuizSubmit}
                />
              </div>
            )}

            {inlineQuizScreen === "results" && inlineQuizResult && (
              <div className="p-8 text-center">
                <div
                  className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full ${
                    inlineQuizResult.passed ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  {inlineQuizResult.passed ? (
                    <Award className="h-10 w-10 text-green-600" />
                  ) : (
                    <RotateCcw className="h-10 w-10 text-red-600" />
                  )}
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {inlineQuizResult.passed ? "Congratulations!" : "Keep Practicing!"}
                </h2>
                <p className="mt-2 text-gray-600">
                  {inlineQuizResult.passed ? "You passed the quiz!" : "You didn't pass this time, but don't give up!"}
                </p>
                <div className="mt-6 grid grid-cols-3 gap-4">
                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-3xl font-bold text-gray-900">
                      {inlineQuizResult.totalPoints > 0 ? Math.round((inlineQuizResult.score / inlineQuizResult.totalPoints) * 100) : 0}%
                    </p>
                    <p className="text-sm text-gray-500">Your Score</p>
                  </div>
                  <div className="rounded-xl bg-green-50 p-4">
                    <p className="text-3xl font-bold text-green-600">{inlineQuizResult.correctCount}</p>
                    <p className="text-sm text-gray-500">Correct</p>
                  </div>
                  <div className="rounded-xl bg-red-50 p-4">
                    <p className="text-3xl font-bold text-red-600">{inlineQuizResult.incorrectCount}</p>
                    <p className="text-sm text-gray-500">Incorrect</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-gray-500">Passing score: {inlineQuiz.passingScore}%</p>
                <div className="mt-8 flex gap-3">
                  {!inlineQuizResult.passed && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setInlineQuizScreen("info");
                        setInlineQuizResult(null);
                      }}
                      className="flex-1"
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Retry
                    </Button>
                  )}
                  <Button
                    onClick={() => {
                      setShowInlineQuiz(false);
                      setInlineQuiz(null);
                    }}
                    className="flex-1"
                  >
                    {inlineQuizResult.passed ? "Continue to Next Lesson" : "Close"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
