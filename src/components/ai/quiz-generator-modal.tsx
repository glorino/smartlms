"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Sparkles, X, Plus, Trash2, GripVertical, CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

interface GeneratedAnswer {
  content: string;
  isCorrect: boolean;
  explanation: string;
}

interface GeneratedQuestion {
  content: string;
  type: string;
  points: number;
  explanation: string;
  answers: GeneratedAnswer[];
}

interface QuizGeneratorModalProps {
  courseId: string;
  courseName: string;
  onQuizGenerated: (quiz: {
    id: string;
    title: string;
    questions: GeneratedQuestion[];
  }) => void;
  onClose: () => void;
}

export default function QuizGeneratorModal({
  courseId,
  courseName,
  onQuizGenerated,
  onClose,
}: QuizGeneratorModalProps) {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("MEDIUM");
  const [questionCount, setQuestionCount] = useState("5");
  const [questionTypes, setQuestionTypes] = useState<string[]>(["MULTIPLE_CHOICE"]);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([]);
  const [generatedTitle, setGeneratedTitle] = useState("");
  const [generatedDescription, setGeneratedDescription] = useState("");
  const [step, setStep] = useState<"form" | "preview">("form");

  const toggleType = (type: string) => {
    setQuestionTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic");
      return;
    }
    if (questionTypes.length === 0) {
      toast.error("Select at least one question type");
      return;
    }

    setGenerating(true);
    try {
      const res = await fetch("/api/ai/quiz-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId,
          topic,
          difficulty,
          questionCount: Number(questionCount),
          questionTypes,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setGeneratedQuestions(data.questions || []);
        setGeneratedTitle(data.title || `AI Quiz: ${topic}`);
        setGeneratedDescription(data.description || "");
        setStep("preview");
        toast.success(`Generated ${data.questions?.length || 0} questions`);
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to generate quiz");
      }
    } catch {
      toast.error("Failed to generate quiz");
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    if (generatedQuestions.length === 0) return;

    setSaving(true);
    try {
      const totalPoints = generatedQuestions.reduce((sum, q) => sum + q.points, 0);
      const res = await fetch("/api/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: generatedTitle,
          description: generatedDescription,
          courseId,
          difficulty,
          points: totalPoints,
          questions: generatedQuestions.map((q, i) => ({
            content: q.content,
            type: q.type,
            points: q.points,
            explanation: q.explanation,
            order: i,
            answers: q.answers.map((a, ai) => ({
              content: a.content,
              isCorrect: a.isCorrect,
              explanation: a.explanation,
              order: ai,
            })),
          })),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        onQuizGenerated({
          id: data.quiz.id,
          title: data.quiz.title,
          questions: generatedQuestions,
        });
        toast.success("Quiz saved successfully!");
        onClose();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to save quiz");
      }
    } catch {
      toast.error("Failed to save quiz");
    } finally {
      setSaving(false);
    }
  };

  const removeQuestion = (index: number) => {
    setGeneratedQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const typeLabels: Record<string, string> = {
    MULTIPLE_CHOICE: "Multiple Choice",
    TRUE_FALSE: "True / False",
    SHORT_ANSWER: "Short Answer",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b p-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              AI Quiz Generator
            </h2>
            <p className="mt-1 text-sm text-gray-500">{courseName}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6">
          {step === "form" ? (
            <div className="space-y-5">
              <Input
                label="Topic"
                placeholder="e.g. React Hooks, Database Design, Python Basics"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="EASY">Easy</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HARD">Hard</option>
                  </select>
                </div>
                <Input
                  label="Number of Questions"
                  type="number"
                  min={1}
                  max={20}
                  value={questionCount}
                  onChange={(e) => setQuestionCount(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Question Types</label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(typeLabels).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => toggleType(value)}
                      className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                        questionTypes.includes(value)
                          ? "border-purple-500 bg-purple-50 text-purple-700"
                          : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={generating || !topic.trim() || questionTypes.length === 0}
                className="w-full gap-2"
              >
                {generating ? (
                  <>
                    <Spinner size="sm" color="white" />
                    Generating with AI...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate with AI
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{generatedTitle}</h3>
                  <p className="text-sm text-gray-500">{generatedDescription}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setStep("form")}>
                  Edit Settings
                </Button>
              </div>

              {generatedQuestions.length === 0 ? (
                <div className="flex flex-col items-center py-10 text-center">
                  <AlertCircle className="h-10 w-10 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">No questions generated. Try different settings.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {generatedQuestions.map((q, qIndex) => (
                    <Card key={qIndex} className="border-gray-200">
                      <CardContent className="p-4 space-y-2">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <GripVertical className="h-4 w-4 text-gray-400" />
                            <span className="text-xs font-bold text-gray-500">Q{qIndex + 1}</span>
                            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                              {q.type.replace("_", " ")}
                            </span>
                            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
                              {q.points} pt{q.points !== 1 ? "s" : ""}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeQuestion(qIndex)}
                            className="h-7 w-7 text-gray-400 hover:text-red-500"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>

                        <p className="text-sm font-medium text-gray-800">{q.content}</p>

                        <div className="space-y-1 pl-6">
                          {q.answers.map((a, aIndex) => (
                            <div key={aIndex} className="flex items-center gap-2 text-sm">
                              {a.isCorrect ? (
                                <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
                              ) : (
                                <span className="h-3.5 w-3.5 shrink-0 rounded-full border border-gray-300" />
                              )}
                              <span className={a.isCorrect ? "font-medium text-green-700" : "text-gray-600"}>
                                {a.content}
                              </span>
                            </div>
                          ))}
                        </div>

                        {q.explanation && (
                          <p className="text-xs text-gray-500 italic pl-6">
                            Explanation: {q.explanation}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {generatedQuestions.length > 0 && (
                <div className="flex gap-3 pt-2">
                  <Button onClick={handleSave} disabled={saving} className="gap-2">
                    {saving ? <Spinner size="sm" color="white" /> : <CheckCircle2 className="h-4 w-4" />}
                    {saving ? "Saving..." : `Add ${generatedQuestions.length} Questions to Quiz`}
                  </Button>
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
