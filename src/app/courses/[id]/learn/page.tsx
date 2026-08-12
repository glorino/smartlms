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
} from "lucide-react";
import DOMPurify from "dompurify";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";

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

  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [questions, setQuestions] = useState<QAItem[]>([]);
  const [newQuestion, setNewQuestion] = useState("");

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
    if (course) {
      const total = course.sections.reduce(
        (acc, s) => acc + s.lessons.length,
        0
      );
      const completed = completedLessons.size;
      setProgress(total > 0 ? Math.round((completed / total) * 100) : 0);
    }
  }, [course, completedLessons]);

  const allLessons = course?.sections.flatMap((s) => s.lessons) || [];
  const currentIndex = allLessons.findIndex((l) => l.id === currentLesson?.id);

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

  const markComplete = () => {
    if (currentLesson) {
      setCompletedLessons((prev) => new Set(prev).add(currentLesson.id));
    }
  };

  const addNote = () => {
    if (newNote.trim()) {
      setNotes((prev) => [
        { id: Date.now().toString(), content: newNote, createdAt: new Date().toISOString() },
        ...prev,
      ]);
      setNewNote("");
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
          className={`${sidebarOpen ? "w-80" : "w-0"} shrink-0 overflow-hidden border-r border-gray-800 bg-gray-900 transition-all duration-300`}
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

        {/* Main Content Area */}
        <main className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            {/* Video / Content Player */}
            <div className="relative aspect-video bg-black">
              {currentLesson.type === "VIDEO" && currentLesson.videoUrl ? (
                isPlaying ? (
                  currentLesson.videoType === "youtube" ? (
                    <iframe
                      src={currentLesson.videoUrl}
                      title={currentLesson.title}
                      className="h-full w-full"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                  ) : (
                    <video
                      src={currentLesson.videoUrl}
                      title={currentLesson.title}
                      className="h-full w-full object-cover"
                      controls
                      autoPlay
                    />
                  )
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
              ) : currentLesson.type === "VIDEO" ? (
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <Video className="mx-auto h-16 w-16 text-gray-600" />
                    <p className="mt-4 text-gray-400">No video available for this lesson</p>
                  </div>
                </div>
              ) : currentLesson.content ? (
                <div className="aspect-video h-auto min-h-[300px] bg-gray-900 p-6 overflow-y-auto">
                  <div
                    className="prose prose-invert max-w-none text-sm text-gray-300"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(currentLesson.content) }}
                  />
                </div>
              ) : (
                <div className="flex h-full items-center justify-center bg-gray-900">
                  <div className="text-center">
                    <FileText className="mx-auto h-16 w-16 text-gray-600" />
                    <p className="mt-4 text-gray-400">
                      {currentLesson.type === "TEXT" ? "No content available" : "Text content"}
                    </p>
                  </div>
                </div>
              )}
            </div>

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
            <div className="flex items-center justify-between bg-gray-900 px-6 py-4">
              <Button
                variant="outline"
                onClick={goPrev}
                disabled={currentIndex <= 0}
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              <Button
                onClick={goNext}
                disabled={currentIndex >= allLessons.length - 1}
              >
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
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
                          <p className="text-sm text-gray-300">{note.content}</p>
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
          onClick={() => setRightPanel(rightPanel === "notes" ? "none" : "notes")}
          className={`flex flex-1 flex-col items-center gap-1 py-3 text-xs ${
            rightPanel === "notes" ? "text-blue-400" : "text-gray-400"
          }`}
        >
          <StickyNote className="h-5 w-5" />
          Notes
        </button>
        <button
          onClick={() => setRightPanel(rightPanel === "qa" ? "none" : "qa")}
          className={`flex flex-1 flex-col items-center gap-1 py-3 text-xs ${
            rightPanel === "qa" ? "text-blue-400" : "text-gray-400"
          }`}
        >
          <MessageSquare className="h-5 w-5" />
          Q&A
        </button>
      </div>
    </div>
  );
}
