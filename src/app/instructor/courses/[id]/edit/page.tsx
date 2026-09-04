"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Plus,
  Trash2,
  GripVertical,
  Save,
  Send,
  Image as ImageIcon,
  Video,
  FileText,
  File,
  ClipboardList,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  X,
  Globe,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";

type LessonType = "VIDEO" | "TEXT" | "PDF" | "ASSIGNMENT" | "QUIZ" | "EMBEDDED";

interface QuizQuestionOption {
  text: string;
  isCorrect: boolean;
}

interface QuizQuestion {
  id: string;
  text: string;
  type: "multiple_choice" | "true_false" | "fill_blank";
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
  videoUrl: string | null;
  videoType: string | null;
  duration: number;
  order: number;
  isPreview: boolean;
  quiz?: QuizData;
  assignment?: AssignmentData;
}

interface Section {
  id: string;
  title: string;
  description: string;
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
  { value: "EMBEDDED", label: "Embedded" },
  { value: "ASSIGNMENT", label: "Assignment" },
  { value: "QUIZ", label: "Quiz" },
];

const questionTypeOptions = [
  { value: "multiple_choice", label: "Multiple Choice" },
  { value: "true_false", label: "True / False" },
  { value: "fill_blank", label: "Fill in the Blank" },
];

let idCounter = 200;
function generateId() {
  return `edit-${++idCounter}`;
}

function detectVideoType(url: string | null): string | null {
  if (!url) return null;
  const normalized = url.toLowerCase();
  if (normalized.includes("youtube.com") || normalized.includes("youtu.be")) return "youtube";
  if (normalized.includes("vimeo.com")) return "vimeo";
  if (normalized.includes("loom.com")) return "loom";
  return "file";
}

function parseDurationToInt(dur: any): number {
  if (typeof dur === "number") return dur;
  if (typeof dur === "string") {
    if (dur.includes(":")) {
      const parts = dur.split(":").map(Number);
      if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
      if (parts.length === 2) return parts[0] * 60 + parts[1];
    }
    return parseInt(dur) || 0;
  }
  return 0;
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

export default function EditCoursePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
  const [sections, setSections] = useState<Section[]>([]);
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

  useEffect(() => {
    async function fetchCourse() {
      try {
        const res = await fetch(`/api/courses/${courseId}`);
        if (res.ok) {
          const data = await res.json();
          const course = data.course;
          setTitle(course.title || "");
          setDescription(course.description || "");
          setShortDescription(course.shortDescription || "");
          setCategory(course.category || "");
          setLevel(course.level || "Beginner");
          setLanguage(course.language || "English");
          setPrice(String(course.price || 0));
          setTags((course.tags || []).join(", "));
          setThumbnailUrl(course.thumbnail || "");
          setSections(
            (course.sections || []).map((s: any, sIdx: number) => ({
              id: s.id,
              title: s.title,
              description: s.description || "",
              lessons: (s.lessons || []).map((l: any, lIdx: number) => {
                const lessonData: Lesson = {
                  id: l.id,
                  title: l.title || "",
                  type: (l.type || "VIDEO") as LessonType,
                  content: l.content || "",
                  videoUrl: l.videoUrl || null,
                  videoType: l.videoType || detectVideoType(l.videoUrl),
                  duration: parseDurationToInt(l.duration),
                  order: l.order ?? lIdx,
                  isPreview: l.isPreview || false,
                };

                if (l.type === "QUIZ") {
                  const existingQuiz = (l.quizzes && l.quizzes[0]) || null;
                  if (existingQuiz) {
                    lessonData.quiz = {
                      title: existingQuiz.title || "Quiz",
                      timeLimit: existingQuiz.timeLimit || 15,
                      passingScore: existingQuiz.passingScore || 70,
                      maxAttempts: existingQuiz.maxAttempts || 3,
                      shuffleQuestions: existingQuiz.shuffleQuestions ?? false,
                      showCorrectAnswers: existingQuiz.showCorrectAnswers ?? true,
                      questions: (existingQuiz.questions || []).map((q: any) => ({
                        id: q.id,
                        text: q.content || "",
                        type: q.type === "TRUE_FALSE" ? "true_false" : q.type === "FILL_BLANK" ? "fill_blank" : "multiple_choice",
                        options: (q.answers || []).map((a: any) => ({
                          text: a.content || "",
                          isCorrect: a.isCorrect || false,
                        })),
                        correctAnswer: q.correctAnswer || "",
                        points: q.points || 1,
                        explanation: q.explanation || "",
                      })),
                    };
                  } else {
                    lessonData.quiz = defaultQuiz();
                  }
                }

                if (l.type === "ASSIGNMENT") {
                  const existingAssignment = (l.assignments && l.assignments[0]) || null;
                  if (existingAssignment) {
                    lessonData.assignment = {
                      title: existingAssignment.title || "Assignment",
                      description: existingAssignment.description || "",
                      maxScore: existingAssignment.maxScore || 100,
                      dueDate: existingAssignment.dueDate
                        ? new Date(existingAssignment.dueDate).toISOString().slice(0, 16)
                        : "",
                    };
                  } else {
                    lessonData.assignment = defaultAssignment();
                  }
                }

                return lessonData;
              }),
            }))
          );
        }
      } catch {
        toast.error("Failed to load course data");
      } finally {
        setLoading(false);
      }
    }
    fetchCourse();
  }, [courseId]);

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
      toast.error("Please upload an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be under 5MB");
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
      description: "",
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
        const newLesson: Lesson = {
          id: generateId(),
          title: "",
          type: "VIDEO",
          content: "",
          videoUrl: null,
          videoType: null,
          duration: 0,
          order: s.lessons.length,
          isPreview: false,
        };
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
                  ? { ...l, quiz: { ...l.quiz!, ...updates } }
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
                        ...l.quiz!,
                        questions: l.quiz!.questions.map((q) =>
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
                        ...l.quiz!,
                        questions: [...l.quiz!.questions, defaultQuestion()],
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
                        ...l.quiz!,
                        questions: l.quiz!.questions.filter((q) => q.id !== questionId),
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
                  ? { ...l, assignment: { ...l.assignment!, ...updates } }
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
        id: s.id.startsWith("new-") ? undefined : s.id,
        title: s.title,
        description: s.description,
        order: sIdx,
        lessons: s.lessons.map((l, lIdx) => {
          const lessonPayload: Record<string, unknown> = {
            id: l.id.startsWith("new-") ? undefined : l.id,
            title: l.title,
            type: l.type,
            content: l.type === "VIDEO" ? null : l.content,
            videoUrl: l.type === "VIDEO" ? (l.videoUrl || l.content) : null,
            videoType: l.type === "VIDEO" ? (l.videoType || detectVideoType(l.videoUrl || l.content)) : null,
            duration: l.duration,
            order: lIdx,
            isPreview: l.isPreview,
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
    if (sections.length === 0) return "Add at least one section";
    for (const s of sections) {
      if (!s.title.trim()) return "Section title cannot be empty";
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

  const handleSubmit = async (publish: boolean) => {
    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }

    setSaving(true);
    try {
      const payload = buildPayload(publish ? "PUBLISHED" : "DRAFT");
      const res = await fetch(`/api/courses/${courseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        toast.success(publish ? "Course updated and published!" : "Changes saved as draft!");
        router.push("/instructor/courses");
      } else {
        const err = await res.json().catch(() => ({ error: "Failed to save changes" }));
        toast.error(err.error || "Failed to save changes");
      }
    } catch {
      toast.error("Failed to save changes");
    } finally {
      setSaving(false);
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
      case "VIDEO": return <Video className="h-3.5 w-3.5" />;
      case "TEXT": return <FileText className="h-3.5 w-3.5" />;
      case "PDF": return <File className="h-3.5 w-3.5" />;
      case "ASSIGNMENT": return <ClipboardList className="h-3.5 w-3.5" />;
      case "QUIZ": return <HelpCircle className="h-3.5 w-3.5" />;
      case "EMBEDDED": return <Globe className="h-3.5 w-3.5" />;
    }
  };

  const lessonBadge = (type: LessonType) => {
    const variants: Record<string, string> = {
      VIDEO: "bg-blue-100 text-blue-700",
      TEXT: "bg-gray-100 text-gray-700",
      PDF: "bg-gray-100 text-gray-700",
      EMBEDDED: "bg-indigo-100 text-indigo-700",
      ASSIGNMENT: "bg-amber-100 text-amber-700",
      QUIZ: "bg-red-100 text-red-700",
    };
    return (
      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${variants[type] || variants.TEXT}`}>
        {lessonIcon(type)}
        <span className="ml-0.5">{type}</span>
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

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
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Edit Course</h1>
            <p className="mt-1 text-gray-500">Update your course details</p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Basic Information</CardTitle>
                <CardDescription>Update the basic details about your course</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <Input
                  label="Course Title *"
                  placeholder="e.g. Complete Web Development Bootcamp"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Description</label>
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
                  <Select label="Category" options={categoryOptions} placeholder="Select category" value={category} onChange={setCategory} />
                  <Select label="Level" options={levelOptions} placeholder="Select level" value={level} onChange={setLevel} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Select label="Language" options={languageOptions} placeholder="Select language" value={language} onChange={setLanguage} />
                  <Input label="Price (₦)" type="number" min="0" step="0.01" placeholder="0.00" value={price} onChange={(e) => setPrice(e.target.value)} />
                </div>
                <Input label="Tags" placeholder="e.g. javascript, react, beginner" value={tags} onChange={(e) => setTags(e.target.value)} />
                <p className="text-xs text-muted-foreground">Separate tags with commas</p>
              </CardContent>
            </Card>

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
                    <label className="block text-sm font-medium text-foreground mb-1.5">Or Upload File</label>
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
                    <img src={thumbnailPreview} alt="Thumbnail preview" className="h-48 w-full object-cover" />
                    <Button variant="destructive" size="sm" className="absolute right-3 top-3" onClick={removeThumbnail}>
                      <X className="mr-1 h-3.5 w-3.5" /> Remove
                    </Button>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex h-48 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 transition-colors hover:border-primary hover:bg-gray-50"
                  >
                    <ImageIcon className="h-12 w-12 text-gray-300" />
                    <span className="mt-3 text-sm font-medium text-gray-500">Click to upload or drag an image</span>
                    <span className="mt-1 text-xs text-gray-400">PNG, JPG, WebP up to 5MB</span>
                  </button>
                )}
              </CardContent>
            </Card>

            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Course Content</CardTitle>
                    <CardDescription>
                      {sections.length} section{sections.length !== 1 ? "s" : ""} &middot;{" "}
                      {totalLessons} lesson{totalLessons !== 1 ? "s" : ""} &middot;{" "}
                      {totalQuizzes} quiz{totalQuizzes !== 1 ? "zes" : ""} &middot;{" "}
                      {totalAssignments} assignment{totalAssignments !== 1 ? "s" : ""}
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
                    <div key={section.id} className="rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-md">
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
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleSection(section.id)}>
                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
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
                                <div key={lesson.id} className="rounded-lg border border-gray-100 bg-gray-50/50">
                                  <div className="flex items-center gap-2 px-3 py-2.5">
                                    <GripVertical className="h-3.5 w-3.5 shrink-0 cursor-grab text-gray-300" />
                                    <span className="text-xs font-medium text-gray-400 w-4">{lIdx + 1}</span>
                                    {lessonBadge(lesson.type)}
                                    <input
                                      type="text"
                                      value={lesson.title}
                                      onChange={(e) => updateLesson(section.id, lesson.id, { title: e.target.value })}
                                      className="flex-1 border-none bg-transparent text-sm text-gray-700 focus:outline-none focus:ring-0"
                                      placeholder="Lesson title"
                                    />
                                    <div className="flex items-center gap-1 text-xs text-gray-400">
                                      <span className="text-gray-400">sec</span>
                                      <input
                                        type="number"
                                        min="0"
                                        value={lesson.duration || ""}
                                        onChange={(e) =>
                                          updateLesson(section.id, lesson.id, { duration: parseInt(e.target.value) || 0 })
                                        }
                                        className="w-14 border-none bg-transparent text-center text-xs text-gray-500 focus:outline-none focus:ring-0"
                                        placeholder="0"
                                        title="Duration in seconds"
                                      />
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toggleLesson(lesson.id)}>
                                      {lExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
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
                                        <div className="space-y-3">
                                          <Input
                                            label="Video URL"
                                            placeholder="https://youtube.com/watch?v=... or vimeo link"
                                            value={lesson.videoUrl || lesson.content || ""}
                                            onChange={(e) => {
                                              const val = e.target.value;
                                              updateLesson(section.id, lesson.id, {
                                                videoUrl: val || null,
                                                content: val,
                                                videoType: detectVideoType(val),
                                              });
                                            }}
                                          />
                                          {lesson.videoUrl && lesson.videoType && (
                                            <div className="text-xs text-gray-500">
                                              Detected video source: <span className="font-medium capitalize">{lesson.videoType}</span>
                                            </div>
                                          )}
                                        </div>
                                      )}

                                      {lesson.type === "TEXT" && (
                                        <div>
                                          <label className="block text-sm font-medium text-foreground mb-1.5">Text Content (Markdown supported)</label>
                                          <Textarea
                                            placeholder="Write your lesson content here..."
                                            value={lesson.content}
                                            onChange={(e) => updateLesson(section.id, lesson.id, { content: e.target.value })}
                                            className="min-h-[150px] font-mono text-sm"
                                          />
                                        </div>
                                      )}

                                      {lesson.type === "PDF" && (
                                        <Input
                                          label="PDF URL"
                                          placeholder="https://example.com/document.pdf"
                                          value={lesson.content}
                                          onChange={(e) => updateLesson(section.id, lesson.id, { content: e.target.value })}
                                        />
                                      )}

                                      {lesson.type === "EMBEDDED" && (
                                        <div>
                                          <label className="block text-sm font-medium text-foreground mb-1.5">Embed Code or URL</label>
                                          <Textarea
                                            placeholder="<iframe src='...' /> or external link URL"
                                            value={lesson.content}
                                            onChange={(e) => updateLesson(section.id, lesson.id, { content: e.target.value })}
                                            className="min-h-[100px] font-mono text-sm"
                                          />
                                        </div>
                                      )}

                                      {lesson.type === "ASSIGNMENT" && (
                                        <div className="space-y-3 rounded-lg border border-amber-200 bg-amber-50/50 p-4">
                                          <div className="flex items-center gap-2 text-sm font-semibold text-amber-800">
                                            <ClipboardList className="h-4 w-4" />
                                            Assignment Configuration
                                          </div>
                                          {!lesson.assignment && (
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              onClick={() => updateLesson(section.id, lesson.id, { assignment: defaultAssignment() })}
                                            >
                                              <Plus className="mr-1 h-3.5 w-3.5" /> Setup Assignment
                                            </Button>
                                          )}
                                          {lesson.assignment && (
                                            <>
                                              <Input
                                                label="Assignment Title"
                                                placeholder="Assignment title"
                                                value={lesson.assignment.title}
                                                onChange={(e) => updateAssignment(section.id, lesson.id, { title: e.target.value })}
                                              />
                                              <div>
                                                <label className="block text-sm font-medium text-foreground mb-1.5">Description</label>
                                                <Textarea
                                                  placeholder="Describe the assignment requirements..."
                                                  value={lesson.assignment.description}
                                                  onChange={(e) => updateAssignment(section.id, lesson.id, { description: e.target.value })}
                                                  className="min-h-[80px]"
                                                />
                                              </div>
                                              <div className="grid grid-cols-2 gap-4">
                                                <Input
                                                  label="Max Score"
                                                  type="number"
                                                  min="0"
                                                  value={lesson.assignment.maxScore}
                                                  onChange={(e) => updateAssignment(section.id, lesson.id, { maxScore: parseInt(e.target.value) || 0 })}
                                                />
                                                <Input
                                                  label="Due Date"
                                                  type="datetime-local"
                                                  value={lesson.assignment.dueDate}
                                                  onChange={(e) => updateAssignment(section.id, lesson.id, { dueDate: e.target.value })}
                                                />
                                              </div>
                                            </>
                                          )}
                                        </div>
                                      )}

                                      {lesson.type === "QUIZ" && (
                                        <div className="space-y-4 rounded-lg border border-red-200 bg-red-50/30 p-4">
                                          <div className="flex items-center gap-2 text-sm font-semibold text-red-800">
                                            <HelpCircle className="h-4 w-4" />
                                            Quiz Configuration
                                          </div>
                                          {!lesson.quiz && (
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              onClick={() => updateLesson(section.id, lesson.id, { quiz: defaultQuiz() })}
                                            >
                                              <Plus className="mr-1 h-3.5 w-3.5" /> Setup Quiz
                                            </Button>
                                          )}
                                          {lesson.quiz && (
                                            <>
                                              <Input
                                                label="Quiz Title"
                                                placeholder="Quiz title"
                                                value={lesson.quiz.title}
                                                onChange={(e) => updateQuiz(section.id, lesson.id, { title: e.target.value })}
                                              />
                                              <div className="grid grid-cols-2 gap-4">
                                                <Input
                                                  label="Time Limit (minutes)"
                                                  type="number"
                                                  min="1"
                                                  value={lesson.quiz.timeLimit}
                                                  onChange={(e) => updateQuiz(section.id, lesson.id, { timeLimit: parseInt(e.target.value) || 1 })}
                                                />
                                                <Input
                                                  label="Passing Score (%)"
                                                  type="number"
                                                  min="0"
                                                  max="100"
                                                  value={lesson.quiz.passingScore}
                                                  onChange={(e) => updateQuiz(section.id, lesson.id, { passingScore: parseInt(e.target.value) || 0 })}
                                                />
                                              </div>
                                              <div className="grid grid-cols-2 gap-4">
                                                <Input
                                                  label="Max Attempts"
                                                  type="number"
                                                  min="1"
                                                  value={lesson.quiz.maxAttempts}
                                                  onChange={(e) => updateQuiz(section.id, lesson.id, { maxAttempts: parseInt(e.target.value) || 1 })}
                                                />
                                              </div>

                                              <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                  <span className="text-sm font-medium">Questions</span>
                                                  <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="gap-1"
                                                    onClick={() => addQuestionToQuiz(section.id, lesson.id)}
                                                  >
                                                    <Plus className="h-3.5 w-3.5" /> Add Question
                                                  </Button>
                                                </div>
                                                {lesson.quiz.questions.map((q, qIdx) => (
                                                  <div key={q.id} className="rounded-lg border border-gray-200 bg-white p-3 space-y-2">
                                                    <div className="flex items-center gap-2">
                                                      <span className="text-xs font-medium text-gray-400">Q{qIdx + 1}</span>
                                                      <Select
                                                        options={questionTypeOptions}
                                                        value={q.type}
                                                        onChange={(val) => {
                                                          const newType = val as QuizQuestion["type"];
                                                          const updates: Partial<QuizQuestion> = { type: newType };
                                                          if (newType === "true_false") {
                                                            updates.options = [
                                                              { text: "True", isCorrect: true },
                                                              { text: "False", isCorrect: false },
                                                            ];
                                                          } else if (newType === "multiple_choice" && q.options.length < 2) {
                                                            updates.options = [
                                                              { text: "", isCorrect: true },
                                                              { text: "", isCorrect: false },
                                                              { text: "", isCorrect: false },
                                                              { text: "", isCorrect: false },
                                                            ];
                                                          }
                                                          updateQuizQuestion(section.id, lesson.id, q.id, updates);
                                                        }}
                                                      />
                                                      <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6 text-red-400"
                                                        onClick={() => removeQuestionFromQuiz(section.id, lesson.id, q.id)}
                                                      >
                                                        <Trash2 className="h-3 w-3" />
                                                      </Button>
                                                    </div>
                                                    <Input
                                                      placeholder="Question text"
                                                      value={q.text}
                                                      onChange={(e) => updateQuizQuestion(section.id, lesson.id, q.id, { text: e.target.value })}
                                                    />
                                                    {q.type === "multiple_choice" && (
                                                      <div className="space-y-1.5">
                                                        {q.options.map((opt, oIdx) => (
                                                          <div key={oIdx} className="flex items-center gap-2">
                                                            <input
                                                              type="radio"
                                                              name={`q-${q.id}`}
                                                              checked={opt.isCorrect}
                                                              onChange={() => {
                                                                const newOpts = q.options.map((o, i) => ({
                                                                  ...o,
                                                                  isCorrect: i === oIdx,
                                                                }));
                                                                updateQuizQuestion(section.id, lesson.id, q.id, { options: newOpts });
                                                              }}
                                                              className="h-3.5 w-3.5 accent-primary"
                                                            />
                                                            <input
                                                              type="text"
                                                              value={opt.text}
                                                              onChange={(e) => {
                                                                const newOpts = [...q.options];
                                                                newOpts[oIdx] = { ...newOpts[oIdx], text: e.target.value };
                                                                updateQuizQuestion(section.id, lesson.id, q.id, { options: newOpts });
                                                              }}
                                                              placeholder={`Option ${oIdx + 1}`}
                                                              className="flex-1 border-none bg-transparent text-sm focus:outline-none"
                                                            />
                                                          </div>
                                                        ))}
                                                      </div>
                                                    )}
                                                    {q.type === "true_false" && (
                                                      <div className="flex gap-4 text-sm">
                                                        <label className="flex items-center gap-1.5">
                                                          <input
                                                            type="radio"
                                                            name={`tf-${q.id}`}
                                                            checked={q.correctAnswer === "true"}
                                                            onChange={() => updateQuizQuestion(section.id, lesson.id, q.id, { correctAnswer: "true" })}
                                                            className="accent-primary"
                                                          />
                                                          True
                                                        </label>
                                                        <label className="flex items-center gap-1.5">
                                                          <input
                                                            type="radio"
                                                            name={`tf-${q.id}`}
                                                            checked={q.correctAnswer === "false"}
                                                            onChange={() => updateQuizQuestion(section.id, lesson.id, q.id, { correctAnswer: "false" })}
                                                            className="accent-primary"
                                                          />
                                                          False
                                                        </label>
                                                      </div>
                                                    )}
                                                    {q.type === "fill_blank" && (
                                                      <Input
                                                        placeholder="Correct answer"
                                                        value={q.correctAnswer}
                                                        onChange={(e) => updateQuizQuestion(section.id, lesson.id, q.id, { correctAnswer: e.target.value })}
                                                      />
                                                    )}
                                                    <Input
                                                      placeholder="Explanation (optional)"
                                                      value={q.explanation}
                                                      onChange={(e) => updateQuizQuestion(section.id, lesson.id, q.id, { explanation: e.target.value })}
                                                    />
                                                  </div>
                                                ))}
                                              </div>
                                            </>
                                          )}
                                        </div>
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
                    <FileText className="h-12 w-12 text-gray-300" />
                    <p className="mt-3 text-sm text-gray-500">No sections yet</p>
                    <Button variant="outline" size="sm" className="mt-3 gap-2" onClick={addSection}>
                      <Plus className="h-4 w-4" /> Add First Section
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Publish</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full gap-2" onClick={() => handleSubmit(true)} disabled={saving}>
                  {saving ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  Update & Publish
                </Button>
                <Button variant="outline" className="w-full gap-2" onClick={() => handleSubmit(false)} disabled={saving}>
                  {saving ? (
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
                    {tags.split(",").map((t) => t.trim()).filter(Boolean).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
