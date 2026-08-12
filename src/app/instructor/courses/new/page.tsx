"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Upload,
  Plus,
  Trash2,
  GripVertical,
  Save,
  Send,
  Image as ImageIcon,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Video,
  BookOpen,
  File,
  ClipboardList,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

type LessonType = "VIDEO" | "TEXT" | "PDF" | "ASSIGNMENT" | "QUIZ";
type QuestionType = "multiple_choice" | "true_false" | "fill_blank";

interface QuizQuestionOption {
  text: string;
  isCorrect: boolean;
}

interface QuizQuestion {
  id: string;
  text: string;
  type: QuestionType;
  options: QuizQuestionOption[];
  correctAnswer: string;
  points: number;
  explanation: string;
}

interface QuizData {
  title: string;
  timeLimit: number;
  passingScore: number;
  maxAttempts: number;
  shuffleQuestions: boolean;
  showCorrectAnswers: boolean;
  questions: QuizQuestion[];
}

interface AssignmentData {
  title: string;
  description: string;
  maxScore: number;
  dueDate: string;
}

interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  content: string;
  duration: number;
  order: number;
  quiz?: QuizData;
  assignment?: AssignmentData;
}

interface Section {
  id: string;
  title: string;
  lessons: Lesson[];
}

const categoryOptions = [
  { value: "Web Development", label: "Web Development" },
  { value: "Data Science", label: "Data Science" },
  { value: "Marketing", label: "Marketing" },
  { value: "Programming", label: "Programming" },
  { value: "Design", label: "Design" },
  { value: "Security", label: "Security" },
  { value: "Cloud", label: "Cloud" },
  { value: "Finance", label: "Finance" },
  { value: "Mobile", label: "Mobile" },
  { value: "Data", label: "Data" },
];

const levelOptions = [
  { value: "Beginner", label: "Beginner" },
  { value: "Intermediate", label: "Intermediate" },
  { value: "Advanced", label: "Advanced" },
];

const languageOptions = [
  { value: "English", label: "English" },
  { value: "Spanish", label: "Spanish" },
  { value: "French", label: "French" },
  { value: "German", label: "German" },
  { value: "Portuguese", label: "Portuguese" },
  { value: "Chinese", label: "Chinese" },
  { value: "Japanese", label: "Japanese" },
  { value: "Korean", label: "Korean" },
  { value: "Arabic", label: "Arabic" },
  { value: "Hindi", label: "Hindi" },
  { value: "Russian", label: "Russian" },
  { value: "Italian", label: "Italian" },
];

const lessonTypeOptions = [
  { value: "VIDEO", label: "Video" },
  { value: "TEXT", label: "Text" },
  { value: "PDF", label: "PDF" },
  { value: "ASSIGNMENT", label: "Assignment" },
  { value: "QUIZ", label: "Quiz" },
];

const questionTypeOptions = [
  { value: "multiple_choice", label: "Multiple Choice" },
  { value: "true_false", label: "True / False" },
  { value: "fill_blank", label: "Fill in the Blank" },
];

let idCounter = 100;
function generateId() {
  return String(++idCounter);
}

function defaultQuiz(): QuizData {
  return {
    title: "Quiz",
    timeLimit: 15,
    passingScore: 70,
    maxAttempts: 3,
    shuffleQuestions: false,
    showCorrectAnswers: true,
    questions: [],
  };
}

function defaultAssignment(): AssignmentData {
  return { title: "Assignment", description: "", maxScore: 100, dueDate: "" };
}

function defaultQuestion(): QuizQuestion {
  return {
    id: generateId(),
    text: "",
    type: "multiple_choice",
    options: [
      { text: "", isCorrect: true },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ],
    correctAnswer: "",
    points: 10,
    explanation: "",
  };
}

function defaultLesson(order: number): Lesson {
  return {
    id: generateId(),
    title: "",
    type: "VIDEO",
    content: "",
    duration: 0,
    order,
  };
}

function toast(message: string, type: "success" | "error") {
  const el = document.createElement("div");
  el.className = `fixed top-6 right-6 z-[9999] flex items-center gap-3 rounded-xl px-5 py-4 text-sm font-medium shadow-2xl transition-all duration-300 animate-in slide-in-from-right-8 ${
    type === "success"
      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
      : "bg-gradient-to-r from-red-500 to-rose-600 text-white"
  }`;
  el.innerHTML = `
    ${type === "success" ? '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>' : '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>'}
    ${message}
  `;
  document.body.appendChild(el);
  setTimeout(() => {
    el.style.opacity = "0";
    el.style.transform = "translateX(100px)";
    setTimeout(() => el.remove(), 400);
  }, 3500);
}

function formatDuration(totalSeconds: number) {
  if (totalSeconds <= 0) return "0m";
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export default function NewCoursePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [language, setLanguage] = useState("English");
  const [price, setPrice] = useState("");
  const [tags, setTags] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [thumbnailBase64, setThumbnailBase64] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [sections, setSections] = useState<Section[]>([
    { id: generateId(), title: "Section 1", lessons: [] },
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [expandedLessons, setExpandedLessons] = useState<Record<string, boolean>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (thumbnailUrl.trim()) {
      setThumbnailPreview(thumbnailUrl.trim());
    } else if (thumbnailBase64) {
      setThumbnailPreview(thumbnailBase64);
    } else {
      setThumbnailPreview("");
    }
  }, [thumbnailUrl, thumbnailBase64]);

  const toggleSection = useCallback((id: string) => {
    setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const toggleLesson = useCallback((id: string) => {
    setExpandedLessons((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast("Please upload an image file", "error");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast("File size must be under 5MB", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setThumbnailBase64(reader.result as string);
      setThumbnailUrl("");
    };
    reader.readAsDataURL(file);
  };

  const removeThumbnail = () => {
    setThumbnailUrl("");
    setThumbnailBase64("");
    setThumbnailPreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const addSection = () => {
    const newSection: Section = {
      id: generateId(),
      title: `Section ${sections.length + 1}`,
      lessons: [],
    };
    setSections((prev) => [...prev, newSection]);
    setExpandedSections((prev) => ({ ...prev, [newSection.id]: true }));
  };

  const removeSection = (sectionId: string) => {
    setSections((prev) => prev.filter((s) => s.id !== sectionId));
  };

  const updateSectionTitle = (sectionId: string, newTitle: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, title: newTitle } : s))
    );
  };

  const addLesson = (sectionId: string) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id !== sectionId) return s;
        const newLesson = defaultLesson(s.lessons.length);
        setExpandedLessons((p) => ({ ...p, [newLesson.id]: true }));
        return { ...s, lessons: [...s.lessons, newLesson] };
      })
    );
  };

  const removeLesson = (sectionId: string, lessonId: string) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? { ...s, lessons: s.lessons.filter((l) => l.id !== lessonId) }
          : s
      )
    );
  };

  const updateLesson = (sectionId: string, lessonId: string, updates: Partial<Lesson>) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              lessons: s.lessons.map((l) =>
                l.id === lessonId ? { ...l, ...updates } : l
              ),
            }
          : s
      )
    );
  };

  const updateQuiz = (sectionId: string, lessonId: string, updates: Partial<QuizData>) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              lessons: s.lessons.map((l) =>
                l.id === lessonId && l.quiz
                  ? { ...l, quiz: { ...l.quiz, ...updates } }
                  : l
              ),
            }
          : s
      )
    );
  };

  const updateQuizQuestion = (
    sectionId: string,
    lessonId: string,
    questionId: string,
    updates: Partial<QuizQuestion>
  ) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              lessons: s.lessons.map((l) =>
                l.id === lessonId && l.quiz
                  ? {
                      ...l,
                      quiz: {
                        ...l.quiz,
                        questions: l.quiz.questions.map((q) =>
                          q.id === questionId ? { ...q, ...updates } : q
                        ),
                      },
                    }
                  : l
              ),
            }
          : s
      )
    );
  };

  const addQuestionToQuiz = (sectionId: string, lessonId: string) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              lessons: s.lessons.map((l) =>
                l.id === lessonId && l.quiz
                  ? {
                      ...l,
                      quiz: {
                        ...l.quiz,
                        questions: [...l.quiz.questions, defaultQuestion()],
                      },
                    }
                  : l
              ),
            }
          : s
      )
    );
  };

  const removeQuestionFromQuiz = (sectionId: string, lessonId: string, questionId: string) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              lessons: s.lessons.map((l) =>
                l.id === lessonId && l.quiz
                  ? {
                      ...l,
                      quiz: {
                        ...l.quiz,
                        questions: l.quiz.questions.filter((q) => q.id !== questionId),
                      },
                    }
                  : l
              ),
            }
          : s
      )
    );
  };

  const updateAssignment = (
    sectionId: string,
    lessonId: string,
    updates: Partial<AssignmentData>
  ) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              lessons: s.lessons.map((l) =>
                l.id === lessonId && l.assignment
                  ? { ...l, assignment: { ...l.assignment, ...updates } }
                  : l
              ),
            }
          : s
      )
    );
  };

  const buildPayload = (status: "PUBLISHED" | "DRAFT") => {
    const tagList = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const thumbnail = thumbnailPreview || "";

    return {
      title,
      description,
      shortDescription,
      category,
      level,
      language,
      price: parseFloat(price) || 0,
      thumbnail,
      tags: tagList,
      status,
      sections: sections.map((s, sIdx) => ({
        title: s.title,
        order: sIdx,
        lessons: s.lessons.map((l, lIdx) => {
          const lessonPayload: Record<string, unknown> = {
            title: l.title,
            type: l.type,
            content: l.content,
            duration: l.duration,
            order: lIdx,
          };
          if (l.type === "QUIZ" && l.quiz) {
            lessonPayload.quiz = {
              title: l.quiz.title,
              timeLimit: l.quiz.timeLimit,
              passingScore: l.quiz.passingScore,
              maxAttempts: l.quiz.maxAttempts,
              shuffleQuestions: l.quiz.shuffleQuestions,
              showCorrectAnswers: l.quiz.showCorrectAnswers,
              questions: l.quiz.questions.map((q, qIdx) => {
                const qp: Record<string, unknown> = {
                  text: q.text,
                  type: q.type,
                  points: q.points,
                  explanation: q.explanation,
                  order: qIdx,
                };
                if (q.type === "multiple_choice") {
                  qp.options = q.options;
                  const correctIdx = q.options.findIndex((o) => o.isCorrect);
                  qp.correctAnswer = String(correctIdx);
                } else if (q.type === "true_false") {
                  qp.correctAnswer = q.correctAnswer;
                  qp.options = [
                    { text: "True", isCorrect: q.correctAnswer === "true" },
                    { text: "False", isCorrect: q.correctAnswer === "false" },
                  ];
                } else {
                  qp.correctAnswer = q.correctAnswer;
                }
                return qp;
              }),
            };
          }
          if (l.type === "ASSIGNMENT" && l.assignment) {
            lessonPayload.assignment = {
              title: l.assignment.title,
              description: l.assignment.description,
              maxScore: l.assignment.maxScore,
              dueDate: l.assignment.dueDate || undefined,
            };
          }
          return lessonPayload;
        }),
      })),
    };
  };

  const validate = (): string | null => {
    if (!title.trim()) return "Course title is required";
    if (!category) return "Please select a category";
    if (!level) return "Please select a level";
    if (sections.length === 0) return "Add at least one section";
    for (const s of sections) {
      if (!s.title.trim()) return `Section title cannot be empty`;
      for (const l of s.lessons) {
        if (!l.title.trim()) return `Lesson title cannot be empty in "${s.title}"`;
        if (l.type === "QUIZ" && l.quiz) {
          if (!l.quiz.questions.length) return `Quiz "${l.quiz.title}" needs at least one question`;
          for (const q of l.quiz.questions) {
            if (!q.text.trim()) return `Question text is required in "${l.quiz.title}"`;
            if (q.type === "multiple_choice") {
              const filled = q.options.filter((o) => o.text.trim());
              if (filled.length < 2) return `Quiz question needs at least 2 options in "${l.quiz.title}"`;
            }
          }
        }
      }
    }
    return null;
  };

  const handleSubmit = async (status: "PUBLISHED" | "DRAFT") => {
    const error = validate();
    if (error) {
      toast(error, "error");
      return;
    }

    setSubmitting(true);
    try {
      const payload = buildPayload(status);
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: "Failed to create course" }));
        throw new Error(err.message || "Failed to create course");
      }
      toast(
        status === "PUBLISHED" ? "Course published successfully!" : "Draft saved!",
        "success"
      );
      setTimeout(() => {
        window.location.href = "/instructor/courses";
      }, 1500);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Something went wrong", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const totalLessons = sections.reduce((a, s) => a + s.lessons.length, 0);
  const totalQuizzes = sections.reduce(
    (a, s) => a + s.lessons.filter((l) => l.type === "QUIZ").length,
    0
  );
  const totalAssignments = sections.reduce(
    (a, s) => a + s.lessons.filter((l) => l.type === "ASSIGNMENT").length,
    0
  );

  const lessonIcon = (type: LessonType) => {
    switch (type) {
      case "VIDEO":
        return <Video className="h-3.5 w-3.5" />;
      case "TEXT":
        return <FileText className="h-3.5 w-3.5" />;
      case "PDF":
        return <File className="h-3.5 w-3.5" />;
      case "ASSIGNMENT":
        return <ClipboardList className="h-3.5 w-3.5" />;
      case "QUIZ":
        return <HelpCircle className="h-3.5 w-3.5" />;
    }
  };

  const lessonBadge = (type: LessonType) => {
    switch (type) {
      case "VIDEO":
        return <Badge variant="default">{lessonIcon(type)} <span className="ml-1">Video</span></Badge>;
      case "TEXT":
        return <Badge variant="secondary">{lessonIcon(type)} <span className="ml-1">Text</span></Badge>;
      case "PDF":
        return <Badge variant="secondary">{lessonIcon(type)} <span className="ml-1">PDF</span></Badge>;
      case "ASSIGNMENT":
        return <Badge variant="warning">{lessonIcon(type)} <span className="ml-1">Assignment</span></Badge>;
      case "QUIZ":
        return <Badge variant="danger">{lessonIcon(type)} <span className="ml-1">Quiz</span></Badge>;
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-4">
          <Link href="/instructor/courses">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Create New Course
            </h1>
            <p className="mt-1 text-gray-500">
              Fill in the details below to publish your course
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {/* Basic Information */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Basic Information</CardTitle>
                <CardDescription>Provide the basic details about your course</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <Input
                  label="Course Title *"
                  placeholder="e.g. Complete Web Development Bootcamp"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Description
                  </label>
                  <Textarea
                    placeholder="Describe what students will learn in this course..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>
                <Input
                  label="Short Description"
                  placeholder="A brief one-liner about your course"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="Category *"
                    options={categoryOptions}
                    placeholder="Select category"
                    value={category}
                    onChange={setCategory}
                  />
                  <Select
                    label="Level *"
                    options={levelOptions}
                    placeholder="Select level"
                    value={level}
                    onChange={setLevel}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="Language"
                    options={languageOptions}
                    placeholder="Select language"
                    value={language}
                    onChange={setLanguage}
                  />
                  <Input
                    label="Price (₦)"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
                <Input
                  label="Tags"
                  placeholder="e.g. javascript, react, beginner"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Separate tags with commas</p>
              </CardContent>
            </Card>

            {/* Thumbnail */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Thumbnail</CardTitle>
                <CardDescription>Upload or paste a cover image URL for your course</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    label="Image URL"
                    placeholder="https://example.com/image.jpg"
                    value={thumbnailUrl}
                    onChange={(e) => {
                      setThumbnailUrl(e.target.value);
                      if (e.target.value.trim()) setThumbnailBase64("");
                    }}
                  />
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Or Upload File
                    </label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="block w-full text-sm text-gray-500 file:mr-3 file:rounded-md file:border-0 file:bg-gradient-to-r file:from-indigo-500 file:to-purple-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:from-indigo-600 hover:file:to-purple-700 file:cursor-pointer file:shadow-md"
                    />
                  </div>
                </div>
                {thumbnailPreview ? (
                  <div className="relative overflow-hidden rounded-xl border border-gray-200">
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      className="h-48 w-full object-cover"
                      onError={() => {
                        if (thumbnailUrl.trim()) {
                          toast("Could not load image from URL", "error");
                        }
                      }}
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute right-3 top-3"
                      onClick={removeThumbnail}
                    >
                      <X className="mr-1 h-3.5 w-3.5" /> Remove
                    </Button>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex h-48 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 transition-colors hover:border-primary hover:bg-gray-50"
                  >
                    <ImageIcon className="h-12 w-12 text-gray-300" />
                    <span className="mt-3 text-sm font-medium text-gray-500">
                      Click to upload or drag an image
                    </span>
                    <span className="mt-1 text-xs text-gray-400">
                      PNG, JPG, WebP up to 5MB
                    </span>
                  </button>
                )}
              </CardContent>
            </Card>

            {/* Course Content */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Course Content</CardTitle>
                    <CardDescription>
                      {sections.length} section{sections.length !== 1 ? "s" : ""} &middot;{" "}
                      {totalLessons} lesson{totalLessons !== 1 ? "s" : ""} &middot;{" "}
                      {totalQuizzes} quiz{totalQuizzes !== 1 ? "zes" : ""}
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2" onClick={addSection}>
                    <Plus className="h-4 w-4" />
                    Add Section
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {sections.map((section, sIdx) => {
                  const isExpanded = expandedSections[section.id] !== false;
                  return (
                    <div
                      key={section.id}
                      className="rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-md"
                    >
                      <div className="flex items-center gap-3 px-4 py-3">
                        <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-gray-300" />
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                          {sIdx + 1}
                        </span>
                        <input
                          type="text"
                          value={section.title}
                          onChange={(e) => updateSectionTitle(section.id, e.target.value)}
                          className="flex-1 border-none bg-transparent text-sm font-semibold text-gray-900 focus:outline-none focus:ring-0"
                          placeholder="Section title"
                        />
                        <Badge variant="outline" className="text-xs">
                          {section.lessons.length} lesson{section.lessons.length !== 1 ? "s" : ""}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => toggleSection(section.id)}
                        >
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-700"
                          onClick={() => removeSection(section.id)}
                          disabled={sections.length <= 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {isExpanded && (
                        <div className="border-t border-gray-100 px-4 pb-4 pt-3">
                          <div className="space-y-2">
                            {section.lessons.map((lesson, lIdx) => {
                              const lExpanded = expandedLessons[lesson.id] !== false;
                              return (
                                <div
                                  key={lesson.id}
                                  className="rounded-lg border border-gray-100 bg-gray-50/50"
                                >
                                  <div className="flex items-center gap-2 px-3 py-2.5">
                                    <GripVertical className="h-3.5 w-3.5 shrink-0 cursor-grab text-gray-300" />
                                    <span className="text-xs font-medium text-gray-400 w-4">
                                      {lIdx + 1}
                                    </span>
                                    {lessonBadge(lesson.type)}
                                    <input
                                      type="text"
                                      value={lesson.title}
                                      onChange={(e) =>
                                        updateLesson(section.id, lesson.id, {
                                          title: e.target.value,
                                        })
                                      }
                                      className="flex-1 border-none bg-transparent text-sm text-gray-700 focus:outline-none focus:ring-0"
                                      placeholder="Lesson title"
                                    />
                                    <div className="flex items-center gap-1 text-xs text-gray-400">
                                      <Clock className="h-3 w-3" />
                                      <input
                                        type="number"
                                        min="0"
                                        value={lesson.duration || ""}
                                        onChange={(e) =>
                                          updateLesson(section.id, lesson.id, {
                                            duration: parseInt(e.target.value) || 0,
                                          })
                                        }
                                        className="w-14 border-none bg-transparent text-center text-xs text-gray-500 focus:outline-none focus:ring-0"
                                        placeholder="sec"
                                        title="Duration in seconds"
                                      />
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7"
                                      onClick={() => toggleLesson(lesson.id)}
                                    >
                                      {lExpanded ? (
                                        <ChevronUp className="h-3.5 w-3.5" />
                                      ) : (
                                        <ChevronDown className="h-3.5 w-3.5" />
                                      )}
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7 text-red-400 hover:text-red-600"
                                      onClick={() => removeLesson(section.id, lesson.id)}
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                  </div>

                                  {lExpanded && (
                                    <div className="border-t border-gray-100 bg-white px-3 py-3 space-y-3 rounded-b-lg">
                                      <Select
                                        label="Lesson Type"
                                        options={lessonTypeOptions}
                                        value={lesson.type}
                                        onChange={(val) => {
                                          const newType = val as LessonType;
                                          const updates: Partial<Lesson> = { type: newType };
                                          if (newType === "QUIZ" && !lesson.quiz) {
                                            updates.quiz = defaultQuiz();
                                          }
                                          if (newType === "ASSIGNMENT" && !lesson.assignment) {
                                            updates.assignment = defaultAssignment();
                                          }
                                          if (newType !== "QUIZ") updates.quiz = undefined;
                                          if (newType !== "ASSIGNMENT") updates.assignment = undefined;
                                          updateLesson(section.id, lesson.id, updates);
                                        }}
                                      />

                                      {lesson.type === "VIDEO" && (
                                        <Input
                                          label="Video URL"
                                          placeholder="https://youtube.com/watch?v=... or vimeo link"
                                          value={lesson.content}
                                          onChange={(e) =>
                                            updateLesson(section.id, lesson.id, {
                                              content: e.target.value,
                                            })
                                          }
                                        />
                                      )}

                                      {lesson.type === "TEXT" && (
                                        <div>
                                          <label className="block text-sm font-medium text-foreground mb-1.5">
                                            Text Content (Markdown supported)
                                          </label>
                                          <Textarea
                                            placeholder="Write your lesson content here... Supports **bold**, *italic*, `code`, and more."
                                            value={lesson.content}
                                            onChange={(e) =>
                                              updateLesson(section.id, lesson.id, {
                                                content: e.target.value,
                                              })
                                            }
                                            className="min-h-[150px] font-mono text-sm"
                                          />
                                        </div>
                                      )}

                                      {lesson.type === "PDF" && (
                                        <Input
                                          label="PDF URL"
                                          placeholder="https://example.com/document.pdf"
                                          value={lesson.content}
                                          onChange={(e) =>
                                            updateLesson(section.id, lesson.id, {
                                              content: e.target.value,
                                            })
                                          }
                                        />
                                      )}

                                      {lesson.type === "ASSIGNMENT" && lesson.assignment && (
                                        <div className="space-y-3 rounded-lg border border-amber-200 bg-amber-50/50 p-4">
                                          <div className="flex items-center gap-2 text-sm font-semibold text-amber-800">
                                            <ClipboardList className="h-4 w-4" />
                                            Assignment Configuration
                                          </div>
                                          <Input
                                            label="Assignment Title"
                                            placeholder="Assignment title"
                                            value={lesson.assignment.title}
                                            onChange={(e) =>
                                              updateAssignment(section.id, lesson.id, {
                                                title: e.target.value,
                                              })
                                            }
                                          />
                                          <div>
                                            <label className="block text-sm font-medium text-foreground mb-1.5">
                                              Description
                                            </label>
                                            <Textarea
                                              placeholder="Describe the assignment requirements..."
                                              value={lesson.assignment.description}
                                              onChange={(e) =>
                                                updateAssignment(section.id, lesson.id, {
                                                  description: e.target.value,
                                                })
                                              }
                                              className="min-h-[80px]"
                                            />
                                          </div>
                                          <div className="grid grid-cols-2 gap-4">
                                            <Input
                                              label="Max Score"
                                              type="number"
                                              min="0"
                                              value={lesson.assignment.maxScore}
                                              onChange={(e) =>
                                                updateAssignment(section.id, lesson.id, {
                                                  maxScore: parseInt(e.target.value) || 0,
                                                })
                                              }
                                            />
                                            <Input
                                              label="Due Date"
                                              type="datetime-local"
                                              value={lesson.assignment.dueDate}
                                              onChange={(e) =>
                                                updateAssignment(section.id, lesson.id, {
                                                  dueDate: e.target.value,
                                                })
                                              }
                                            />
                                          </div>
                                        </div>
                                      )}

                                      {lesson.type === "QUIZ" && lesson.quiz && (
                                        <QuizConfigPanel
                                          quiz={lesson.quiz}
                                          sectionId={section.id}
                                          lessonId={lesson.id}
                                          updateQuiz={updateQuiz}
                                          updateQuestion={updateQuizQuestion}
                                          addQuestion={addQuestionToQuiz}
                                          removeQuestion={removeQuestionFromQuiz}
                                        />
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                          <button
                            onClick={() => addLesson(section.id)}
                            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 p-2.5 text-sm text-gray-500 transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary"
                          >
                            <Plus className="h-4 w-4" />
                            Add Lesson
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}

                {sections.length === 0 && (
                  <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-16">
                    <BookOpen className="h-12 w-12 text-gray-300" />
                    <p className="mt-3 text-sm text-gray-500">No sections yet</p>
                    <Button variant="outline" size="sm" className="mt-3 gap-2" onClick={addSection}>
                      <Plus className="h-4 w-4" /> Add First Section
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Publish</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full gap-2"
                  onClick={() => handleSubmit("PUBLISHED")}
                  disabled={submitting}
                >
                  {submitting ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  Publish Course
                </Button>
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => handleSubmit("DRAFT")}
                  disabled={submitting}
                >
                  {submitting ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Save as Draft
                </Button>
              </CardContent>
            </Card>

            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Course Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Sections</span>
                  <span className="font-semibold">{sections.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Total Lessons</span>
                  <span className="font-semibold">{totalLessons}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Quizzes</span>
                  <span className="font-semibold">{totalQuizzes}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Assignments</span>
                  <span className="font-semibold">{totalAssignments}</span>
                </div>
                <div className="my-2 h-px bg-gray-100" />
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Price</span>
                  <span className="font-semibold">
                    {price && parseFloat(price) > 0 ? `₦${parseFloat(price).toLocaleString()}` : "Free"}
                  </span>
                </div>
                {tags.trim() && (
                  <div className="flex flex-wrap gap-1 pt-2">
                    {tags
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean)
                      .map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Validation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <ValidationCheck label="Title provided" ok={!!title.trim()} />
                <ValidationCheck label="Category selected" ok={!!category} />
                <ValidationCheck label="Level selected" ok={!!level} />
                <ValidationCheck label="At least 1 section" ok={sections.length > 0} />
                <ValidationCheck
                  label="All lessons have titles"
                  ok={sections.every((s) => s.lessons.every((l) => l.title.trim()))}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes slide-in-from-right-8 {
          from {
            opacity: 0;
            transform: translateX(2rem);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-in {
          animation-duration: 400ms;
          animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
          animation-fill-mode: both;
        }
        .slide-in-from-right-8 {
          animation-name: slide-in-from-right-8;
        }
      `}</style>
    </div>
  );
}

function ValidationCheck({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div className="flex items-center gap-2">
      {ok ? (
        <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
      ) : (
        <AlertCircle className="h-4 w-4 shrink-0 text-gray-300" />
      )}
      <span className={ok ? "text-gray-700" : "text-gray-400"}>{label}</span>
    </div>
  );
}

interface QuizConfigPanelProps {
  quiz: QuizData;
  sectionId: string;
  lessonId: string;
  updateQuiz: (sId: string, lId: string, u: Partial<QuizData>) => void;
  updateQuestion: (
    sId: string,
    lId: string,
    qId: string,
    u: Partial<QuizQuestion>
  ) => void;
  addQuestion: (sId: string, lId: string) => void;
  removeQuestion: (sId: string, lId: string, qId: string) => void;
}

function QuizConfigPanel({
  quiz,
  sectionId,
  lessonId,
  updateQuiz,
  updateQuestion,
  addQuestion,
  removeQuestion,
}: QuizConfigPanelProps) {
  return (
    <div className="space-y-4 rounded-lg border border-red-200 bg-red-50/30 p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-red-800">
        <HelpCircle className="h-4 w-4" />
        Quiz Configuration
      </div>

      <Input
        label="Quiz Title"
        placeholder="Quiz title"
        value={quiz.title}
        onChange={(e) => updateQuiz(sectionId, lessonId, { title: e.target.value })}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Time Limit (minutes)"
          type="number"
          min="1"
          value={quiz.timeLimit}
          onChange={(e) =>
            updateQuiz(sectionId, lessonId, { timeLimit: parseInt(e.target.value) || 1 })
          }
        />
        <Input
          label="Passing Score (%)"
          type="number"
          min="0"
          max="100"
          value={quiz.passingScore}
          onChange={(e) =>
            updateQuiz(sectionId, lessonId, { passingScore: parseInt(e.target.value) || 0 })
          }
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Max Attempts"
          type="number"
          min="1"
          max="10"
          value={quiz.maxAttempts}
          onChange={(e) =>
            updateQuiz(sectionId, lessonId, { maxAttempts: parseInt(e.target.value) || 1 })
          }
        />
        <div className="space-y-3 pt-6">
          <div className="flex items-center gap-3">
            <Switch
              checked={quiz.shuffleQuestions}
              onCheckedChange={(v) => updateQuiz(sectionId, lessonId, { shuffleQuestions: v })}
            />
            <span className="text-sm text-gray-700">Shuffle questions</span>
          </div>
          <div className="flex items-center gap-3">
            <Switch
              checked={quiz.showCorrectAnswers}
              onCheckedChange={(v) => updateQuiz(sectionId, lessonId, { showCorrectAnswers: v })}
            />
            <span className="text-sm text-gray-700">Show correct answers</span>
          </div>
        </div>
      </div>

      <div className="my-2 h-px bg-red-100" />

      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">
          Questions ({quiz.questions.length})
        </span>
        <Button
          variant="outline"
          size="sm"
          className="gap-1"
          onClick={() => addQuestion(sectionId, lessonId)}
        >
          <Plus className="h-3.5 w-3.5" /> Add Question
        </Button>
      </div>

      <div className="space-y-3">
        {quiz.questions.map((q, qIdx) => (
          <QuestionEditor
            key={q.id}
            question={q}
            index={qIdx}
            sectionId={sectionId}
            lessonId={lessonId}
            updateQuestion={updateQuestion}
            removeQuestion={removeQuestion}
          />
        ))}
        {quiz.questions.length === 0 && (
          <p className="py-4 text-center text-sm text-gray-400">
            No questions yet. Click &quot;Add Question&quot; to start.
          </p>
        )}
      </div>
    </div>
  );
}

interface QuestionEditorProps {
  question: QuizQuestion;
  index: number;
  sectionId: string;
  lessonId: string;
  updateQuestion: (
    sId: string,
    lId: string,
    qId: string,
    u: Partial<QuizQuestion>
  ) => void;
  removeQuestion: (sId: string, lId: string, qId: string) => void;
}

function QuestionEditor({
  question,
  index,
  sectionId,
  lessonId,
  updateQuestion,
  removeQuestion,
}: QuestionEditorProps) {
  const [expanded, setExpanded] = useState(index < 3);

  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      <div className="flex items-center gap-2 px-3 py-2.5">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 shrink-0"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <ChevronUp className="h-3.5 w-3.5" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" />
          )}
        </Button>
        <span className="text-xs font-bold text-gray-400">Q{index + 1}</span>
        <span className="flex-1 truncate text-sm text-gray-700">
          {question.text || "Untitled question"}
        </span>
        <Badge variant="outline" className="text-xs capitalize">
          {question.type.replace("_", " ")}
        </Badge>
        <Badge variant="secondary" className="text-xs">
          {question.points}pt
        </Badge>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-red-400 hover:text-red-600"
          onClick={() => removeQuestion(sectionId, lessonId, question.id)}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>

      {expanded && (
        <div className="border-t border-gray-100 space-y-3 px-3 py-3">
          <Textarea
            placeholder="Type your question here..."
            value={question.text}
            onChange={(e) =>
              updateQuestion(sectionId, lessonId, question.id, { text: e.target.value })
            }
            className="min-h-[60px]"
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Question Type"
              options={questionTypeOptions}
              value={question.type}
              onChange={(val) => {
                const newType = val as QuestionType;
                const updates: Partial<QuizQuestion> = { type: newType };
                if (newType === "multiple_choice") {
                  updates.options = question.options.length >= 4 ? question.options : [
                    { text: "", isCorrect: true },
                    { text: "", isCorrect: false },
                    { text: "", isCorrect: false },
                    { text: "", isCorrect: false },
                  ];
                  updates.correctAnswer = "";
                } else if (newType === "true_false") {
                  updates.options = [
                    { text: "True", isCorrect: true },
                    { text: "False", isCorrect: false },
                  ];
                  updates.correctAnswer = "true";
                } else {
                  updates.options = [];
                  updates.correctAnswer = "";
                }
                updateQuestion(sectionId, lessonId, question.id, updates);
              }}
            />
            <Input
              label="Points"
              type="number"
              min="0"
              value={question.points}
              onChange={(e) =>
                updateQuestion(sectionId, lessonId, question.id, {
                  points: parseInt(e.target.value) || 0,
                })
              }
            />
          </div>

          {question.type === "multiple_choice" && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Answers (select correct one)
              </label>
              {question.options.map((opt, oIdx) => (
                <div key={oIdx} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`q-${question.id}`}
                    checked={opt.isCorrect}
                    onChange={() => {
                      const newOpts = question.options.map((o, i) => ({
                        ...o,
                        isCorrect: i === oIdx,
                      }));
                      updateQuestion(sectionId, lessonId, question.id, { options: newOpts });
                    }}
                    className="h-4 w-4 shrink-0 accent-primary"
                  />
                  <input
                    type="text"
                    value={opt.text}
                    onChange={(e) => {
                      const newOpts = [...question.options];
                      newOpts[oIdx] = { ...newOpts[oIdx], text: e.target.value };
                      updateQuestion(sectionId, lessonId, question.id, { options: newOpts });
                    }}
                    placeholder={`Option ${oIdx + 1}`}
                    className="flex-1 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  {question.options.length > 2 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 shrink-0 text-red-400 hover:text-red-600"
                      onClick={() => {
                        const newOpts = question.options.filter((_, i) => i !== oIdx);
                        if (!newOpts.some((o) => o.isCorrect) && newOpts.length > 0) {
                          newOpts[0].isCorrect = true;
                        }
                        updateQuestion(sectionId, lessonId, question.id, { options: newOpts });
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
              {question.options.length < 6 && (
                <button
                  onClick={() => {
                    const newOpts = [...question.options, { text: "", isCorrect: false }];
                    updateQuestion(sectionId, lessonId, question.id, { options: newOpts });
                  }}
                  className="flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  <Plus className="h-3 w-3" /> Add option
                </button>
              )}
            </div>
          )}

          {question.type === "true_false" && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Correct Answer
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name={`tf-${question.id}`}
                    checked={question.correctAnswer === "true"}
                    onChange={() =>
                      updateQuestion(sectionId, lessonId, question.id, {
                        correctAnswer: "true",
                      })
                    }
                    className="h-4 w-4 accent-primary"
                  />
                  True
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name={`tf-${question.id}`}
                    checked={question.correctAnswer === "false"}
                    onChange={() =>
                      updateQuestion(sectionId, lessonId, question.id, {
                        correctAnswer: "false",
                      })
                    }
                    className="h-4 w-4 accent-primary"
                  />
                  False
                </label>
              </div>
            </div>
          )}

          {question.type === "fill_blank" && (
            <Input
              label="Correct Answer"
              placeholder="Type the correct answer"
              value={question.correctAnswer}
              onChange={(e) =>
                updateQuestion(sectionId, lessonId, question.id, {
                  correctAnswer: e.target.value,
                })
              }
            />
          )}

          <Input
            label="Explanation (optional)"
            placeholder="Explain the correct answer..."
            value={question.explanation}
            onChange={(e) =>
              updateQuestion(sectionId, lessonId, question.id, {
                explanation: e.target.value,
              })
            }
          />
        </div>
      )}
    </div>
  );
}
