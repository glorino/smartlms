"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  FileCheck,
  Plus,
  Edit,
  Eye,
  Trash2,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Clock,
  Users,
  Star,
  BookOpen,
  GripVertical,
  X,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import QuizGeneratorModal from "@/components/ai/quiz-generator-modal";

interface QuizQuestion {
  content: string;
  type: string;
  points: number;
  explanation: string;
  imageUrl: string;
  answers: { content: string; isCorrect: boolean; imageUrl: string }[];
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  timeLimit: number | null;
  passingScore: number;
  maxAttempts: number | null;
  difficulty: string;
  points: number;
  courseId: string;
  courseName: string;
  totalQuestions: number;
  isPublished?: boolean;
}

interface Course {
  id: string;
  title: string;
}

const defaultQuestion: QuizQuestion = {
  content: "",
  type: "SINGLE_CHOICE",
  points: 1,
  explanation: "",
  imageUrl: "",
  answers: [
    { content: "", isCorrect: true, imageUrl: "" },
    { content: "", isCorrect: false, imageUrl: "" },
    { content: "", isCorrect: false, imageUrl: "" },
    { content: "", isCorrect: false, imageUrl: "" },
  ],
};

export default function InstructorQuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCourse, setFilterCourse] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingQuizId, setEditingQuizId] = useState<string | null>(null);

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formCourseId, setFormCourseId] = useState("");
  const [formTimeLimit, setFormTimeLimit] = useState("30");
  const [formPassingScore, setFormPassingScore] = useState("60");
  const [formMaxAttempts, setFormMaxAttempts] = useState("3");
  const [formDifficulty, setFormDifficulty] = useState("MEDIUM");
  const [formQuestions, setFormQuestions] = useState<QuizQuestion[]>([{ ...defaultQuestion }]);
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiCourseId, setAiCourseId] = useState("");
  const [aiCourseName, setAiCourseName] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const [quizzesRes, coursesRes] = await Promise.all([
          fetch("/api/quizzes"),
          fetch("/api/courses?allStatus=true&limit=100"),
        ]);
        if (quizzesRes.ok) {
          const data = await quizzesRes.json();
          setQuizzes(data.quizzes || []);
        }
        if (coursesRes.ok) {
          const data = await coursesRes.json();
          setCourses(data.courses || []);
        }
      } catch {
        // Use empty state
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filtered = quizzes.filter((q) => {
    const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = filterCourse === "all" || q.courseId === filterCourse;
    return matchesSearch && matchesCourse;
  });

  const resetForm = () => {
    setFormTitle("");
    setFormDescription("");
    setFormCourseId("");
    setFormTimeLimit("30");
    setFormPassingScore("60");
    setFormMaxAttempts("3");
    setFormDifficulty("MEDIUM");
    setFormQuestions([{ ...defaultQuestion }]);
    setEditingQuizId(null);
  };

  const handleEdit = async (quiz: Quiz) => {
    setEditingQuizId(quiz.id);
    setFormTitle(quiz.title);
    setFormDescription(quiz.description || "");
    setFormCourseId(quiz.courseId);
    setFormTimeLimit(quiz.timeLimit?.toString() || "30");
    setFormPassingScore(quiz.passingScore?.toString() || "60");
    setFormMaxAttempts(quiz.maxAttempts?.toString() || "3");
    setFormDifficulty(quiz.difficulty || "MEDIUM");
    setShowForm(true);

    try {
      const res = await fetch(`/api/quizzes/${quiz.id}`);
      if (res.ok) {
        const data = await res.json();
        const quizData = data.quiz;
        if (quizData.questions && quizData.questions.length > 0) {
          setFormQuestions(
            quizData.questions.map((q: any) => ({
              content: q.content,
              type: q.type || "SINGLE_CHOICE",
              points: q.points || 1,
              explanation: q.explanation || "",
              imageUrl: q.imageUrl || "",
              answers:
                q.answers && q.answers.length > 0
                  ? q.answers.map((a: any) => ({
                      content: a.content,
                      isCorrect: a.isCorrect,
                      imageUrl: a.imageUrl || "",
                    }))
                  : [
                      { content: "", isCorrect: true, imageUrl: "" },
                      { content: "", isCorrect: false, imageUrl: "" },
                    ],
            }))
          );
        }
      }
    } catch {
      toast.error("Failed to load quiz data");
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdate = async () => {
    if (!formTitle || !formCourseId) {
      toast.error("Title and course are required");
      return;
    }

    const validQuestions = formQuestions.filter((q) => q.content.trim());
    if (validQuestions.length === 0) {
      toast.error("Add at least one question");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/quizzes/${editingQuizId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formTitle,
          description: formDescription,
          courseId: formCourseId,
          timeLimit: Number(formTimeLimit) || null,
          passingScore: Number(formPassingScore) || 60,
          maxAttempts: Number(formMaxAttempts) || null,
          difficulty: formDifficulty,
          points: validQuestions.reduce((sum, q) => sum + q.points, 0),
          questions: validQuestions.map((q, i) => ({
            ...q,
            order: i,
            answers: q.answers.filter((a) => a.content.trim()),
          })),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setQuizzes(
          quizzes.map((q) =>
            q.id === editingQuizId
              ? {
                  ...q,
                  title: data.quiz.title,
                  description: data.quiz.description || "",
                  timeLimit: data.quiz.timeLimit,
                  passingScore: data.quiz.passingScore,
                  maxAttempts: data.quiz.maxAttempts,
                  difficulty: data.quiz.difficulty,
                  points: data.quiz.points,
                  courseId: data.quiz.courseId,
                  courseName: courses.find((c) => c.id === data.quiz.courseId)?.title || q.courseName,
                  totalQuestions: data.quiz.questions?.length || 0,
                }
              : q
          )
        );
        setShowForm(false);
        resetForm();
        toast.success("Quiz updated successfully!");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to update quiz");
      }
    } catch {
      toast.error("Failed to update quiz");
    } finally {
      setSaving(false);
    }
  };

  const addQuestion = () => {
    setFormQuestions([...formQuestions, { ...defaultQuestion }]);
  };

  const removeQuestion = (index: number) => {
    if (formQuestions.length > 1) {
      setFormQuestions(formQuestions.filter((_, i) => i !== index));
    }
  };

  const updateQuestion = (index: number, field: keyof QuizQuestion, value: any) => {
    const updated = [...formQuestions];
    (updated[index] as any)[field] = value;
    setFormQuestions(updated);
  };

  const updateAnswer = (qIndex: number, aIndex: number, field: string, value: any) => {
    const updated = [...formQuestions];
    (updated[qIndex].answers[aIndex] as any)[field] = value;
    setFormQuestions(updated);
  };

  const setCorrectAnswer = (qIndex: number, aIndex: number) => {
    const updated = [...formQuestions];
    updated[qIndex].answers = updated[qIndex].answers.map((a, i) => ({
      ...a,
      isCorrect: i === aIndex,
    }));
    setFormQuestions(updated);
  };

  const addAnswer = (qIndex: number) => {
    const updated = [...formQuestions];
    updated[qIndex].answers.push({ content: "", isCorrect: false, imageUrl: "" });
    setFormQuestions(updated);
  };

  const removeAnswer = (qIndex: number, aIndex: number) => {
    const updated = [...formQuestions];
    if (updated[qIndex].answers.length > 2) {
      updated[qIndex].answers.splice(aIndex, 1);
      setFormQuestions(updated);
    }
  };

  const handleCreate = async () => {
    if (!formTitle || !formCourseId) {
      toast.error("Title and course are required");
      return;
    }

    const validQuestions = formQuestions.filter((q) => q.content.trim());
    if (validQuestions.length === 0) {
      toast.error("Add at least one question");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formTitle,
          description: formDescription,
          courseId: formCourseId,
          timeLimit: Number(formTimeLimit) || null,
          passingScore: Number(formPassingScore) || 60,
          maxAttempts: Number(formMaxAttempts) || null,
          difficulty: formDifficulty,
          points: validQuestions.reduce((sum, q) => sum + q.points, 0),
          questions: validQuestions.map((q, i) => ({
            ...q,
            order: i,
            answers: q.answers.filter((a) => a.content.trim()),
          })),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setQuizzes([
          {
            id: data.quiz.id,
            title: data.quiz.title,
            description: data.quiz.description || "",
            timeLimit: data.quiz.timeLimit,
            passingScore: data.quiz.passingScore,
            maxAttempts: data.quiz.maxAttempts,
            difficulty: data.quiz.difficulty,
            points: data.quiz.points,
            courseId: data.quiz.courseId,
            courseName: courses.find((c) => c.id === data.quiz.courseId)?.title || "",
            totalQuestions: data.quiz.questions?.length || 0,
          },
          ...quizzes,
        ]);
        setShowForm(false);
        resetForm();
        toast.success("Quiz created successfully!");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to create quiz");
      }
    } catch {
      toast.error("Failed to create quiz");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (quizId: string) => {
    if (!confirm("Are you sure you want to delete this quiz?")) return;
    try {
      const res = await fetch(`/api/quizzes/${quizId}`, { method: "DELETE" });
      if (res.ok) {
        setQuizzes(quizzes.filter((q) => q.id !== quizId));
        toast.success("Quiz deleted");
      } else {
        const data = await res.json().catch(() => ({ error: "Failed to delete quiz" }));
        toast.error(data.error || "Failed to delete quiz");
      }
    } catch {
      toast.error("Failed to delete quiz");
    }
  };

  const difficultyColors: Record<string, string> = {
    EASY: "bg-emerald-100 text-emerald-700",
    MEDIUM: "bg-amber-100 text-amber-700",
    HARD: "bg-red-100 text-red-700",
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showAIModal && aiCourseId && (
        <QuizGeneratorModal
          courseId={aiCourseId}
          courseName={aiCourseName}
          onQuizGenerated={(quiz) => {
            setQuizzes((prev) => [
              {
                id: quiz.id,
                title: quiz.title,
                description: "",
                timeLimit: null,
                passingScore: 60,
                maxAttempts: null,
                difficulty: "MEDIUM",
                points: quiz.questions.reduce((s, q) => s + q.points, 0),
                courseId: aiCourseId,
                courseName: aiCourseName,
                totalQuestions: quiz.questions.length,
                isPublished: true,
              },
              ...prev,
            ]);
            setShowAIModal(false);
          }}
          onClose={() => setShowAIModal(false)}
        />
      )}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quiz Management</h1>
          <p className="mt-1 text-gray-600">Create and manage quizzes for your courses</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => {
              if (courses.length === 0) {
                toast.error("No courses available. Create a course first.");
                return;
              }
              if (filterCourse !== "all") {
                const c = courses.find((c) => c.id === filterCourse);
                setAiCourseId(filterCourse);
                setAiCourseName(c?.title || "");
              } else {
                setAiCourseId(courses[0].id);
                setAiCourseName(courses[0].title);
              }
              setShowAIModal(true);
            }}
          >
            <Sparkles className="h-4 w-4" />
            AI Generate
          </Button>
          <Button className="gap-2" onClick={() => setShowForm(!showForm)}>
            {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showForm ? "Cancel" : "Create Quiz"}
          </Button>
        </div>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingQuizId ? "Edit Quiz" : "Create New Quiz"}</CardTitle>
            <CardDescription>{editingQuizId ? "Update questions and quiz settings" : "Add questions and configure quiz settings"}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input
                label="Quiz Title"
                placeholder="e.g. Module 1 Assessment"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
              />
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Course</label>
                <select
                  value={formCourseId}
                  onChange={(e) => setFormCourseId(e.target.value)}
                  className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">Select a course</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>
            </div>

            <Textarea
              label="Description"
              placeholder="Brief description of this quiz"
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              className="min-h-[60px]"
            />

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <Input
                label="Time Limit (min)"
                type="number"
                value={formTimeLimit}
                onChange={(e) => setFormTimeLimit(e.target.value)}
              />
              <Input
                label="Passing Score (%)"
                type="number"
                value={formPassingScore}
                onChange={(e) => setFormPassingScore(e.target.value)}
              />
              <Input
                label="Max Attempts"
                type="number"
                value={formMaxAttempts}
                onChange={(e) => setFormMaxAttempts(e.target.value)}
              />
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Difficulty</label>
                <select
                  value={formDifficulty}
                  onChange={(e) => setFormDifficulty(e.target.value)}
                  className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Questions</h3>
                <Button variant="outline" size="sm" className="gap-2" onClick={addQuestion}>
                  <Plus className="h-4 w-4" />
                  Add Question
                </Button>
              </div>

              {formQuestions.map((q, qIndex) => (
                <Card key={qIndex} className="border-gray-200">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-5 w-5 text-gray-400" />
                        <span className="text-sm font-bold text-gray-500">Q{qIndex + 1}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="Points"
                          type="number"
                          value={q.points.toString()}
                          onChange={(e) => updateQuestion(qIndex, "points", Number(e.target.value))}
                          className="w-20"
                        />
                        {formQuestions.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeQuestion(qIndex)}
                            className="h-8 w-8 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>

                    <Input
                      placeholder="Question text"
                      value={q.content}
                      onChange={(e) => updateQuestion(qIndex, "content", e.target.value)}
                    />

                    <div className="space-y-2">
                      <p className="text-xs font-medium text-gray-500">Answer Options (click radio to mark correct)</p>
                      {q.answers.map((a, aIndex) => (
                        <div key={aIndex} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`correct-${qIndex}`}
                            checked={a.isCorrect}
                            onChange={() => setCorrectAnswer(qIndex, aIndex)}
                            className="h-4 w-4 text-indigo-600"
                          />
                          <Input
                            placeholder={`Option ${aIndex + 1}`}
                            value={a.content}
                            onChange={(e) => updateAnswer(qIndex, aIndex, "content", e.target.value)}
                            className="flex-1"
                          />
                          {q.answers.length > 2 && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeAnswer(qIndex, aIndex)}
                              className="h-8 w-8 text-gray-400 hover:text-red-500"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1 text-indigo-600"
                        onClick={() => addAnswer(qIndex)}
                      >
                        <Plus className="h-3 w-3" />
                        Add Option
                      </Button>
                    </div>

                    <Input
                      placeholder="Explanation (shown after submission)"
                      value={q.explanation}
                      onChange={(e) => updateQuestion(qIndex, "explanation", e.target.value)}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex gap-3">
              <Button className="gap-2" onClick={editingQuizId ? handleUpdate : handleCreate} disabled={saving}>
                {saving ? <Spinner size="sm" /> : <FileCheck className="h-4 w-4" />}
                {editingQuizId ? "Update Quiz" : "Create Quiz"}
              </Button>
              <Button variant="outline" onClick={() => { setShowForm(false); resetForm(); }}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search quizzes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 rounded-lg border border-gray-200 bg-white pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <select
                value={filterCourse}
                onChange={(e) => setFilterCourse(e.target.value)}
                className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="all">All Courses</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <FileCheck className="h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No quizzes found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery ? "Try a different search" : "Create your first quiz to get started"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((quiz) => (
                <div
                  key={quiz.id}
                  className="flex items-center gap-4 rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-md"
                >
                  <div className="rounded-xl bg-purple-500 p-3">
                    <FileCheck className="h-6 w-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{quiz.title}</h3>
                        <p className="text-sm text-gray-500">{quiz.courseName}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${difficultyColors[quiz.difficulty] || difficultyColors.MEDIUM}`}>
                          {quiz.difficulty}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <FileCheck className="h-3.5 w-3.5" />
                        {quiz.totalQuestions} questions
                      </span>
                      {quiz.timeLimit && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {quiz.timeLimit} min
                        </span>
                      )}
                      <span>Pass: {quiz.passingScore}%</span>
                      {quiz.maxAttempts && <span>Max: {quiz.maxAttempts} attempts</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/quiz/${quiz.id}`} className="text-gray-500 hover:text-gray-700">
                      <Eye className="h-4 w-4" />
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Edit"
                      onClick={() => handleEdit(quiz)}
                      className="text-indigo-500 hover:text-indigo-700"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Delete"
                      onClick={() => handleDelete(quiz.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
