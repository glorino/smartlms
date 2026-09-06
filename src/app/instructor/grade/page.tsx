"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  Sparkles,
  Users,
  FileText,
  X,
  Star,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

interface Student {
  userId: string;
  name: string;
  email: string;
  avatar?: string;
  coursesEnrolled: { id: string; title: string }[];
}

interface Enrollment {
  id: string;
  course: { id: string; title: string };
  user: { id: string; name: string; email: string; avatar?: string };
}

interface RubricCriterion {
  criterion: string;
  maxScore: number;
  description: string;
}

interface GradingResult {
  grade: string;
  score: number;
  feedback: string;
  rubricScores: { criterion: string; score: number; feedback: string }[];
  suggestions: string[];
}

export default function AIGradingPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [submissionContent, setSubmissionContent] = useState("");
  const [assignmentId, setAssignmentId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [rubricCriteria, setRubricCriteria] = useState<RubricCriterion[]>([]);
  const [showRubric, setShowRubric] = useState(false);
  const [newCriterion, setNewCriterion] = useState({ criterion: "", maxScore: "10", description: "" });
  const [grading, setGrading] = useState(false);
  const [result, setResult] = useState<GradingResult | null>(null);

  useEffect(() => {
    async function fetchStudents() {
      try {
        const res = await fetch("/api/enrollments");
        if (res.ok) {
          const data = await res.json();
          const enrollments: Enrollment[] = data.enrollments || [];
          const map = new Map<string, Student>();
          for (const e of enrollments) {
            const uid = e.user.id;
            if (!map.has(uid)) {
              map.set(uid, {
                userId: uid,
                name: e.user.name,
                email: e.user.email,
                avatar: e.user.avatar,
                coursesEnrolled: [],
              });
            }
            map.get(uid)!.coursesEnrolled.push({ id: e.course.id, title: e.course.title });
          }
          setStudents(Array.from(map.values()));
        }
      } catch {
        // Use empty state
      } finally {
        setLoading(false);
      }
    }
    fetchStudents();
  }, []);

  const addRubricCriterion = () => {
    if (newCriterion.criterion.trim()) {
      setRubricCriteria([...rubricCriteria, { ...newCriterion, maxScore: Number(newCriterion.maxScore) || 10 }]);
      setNewCriterion({ criterion: "", maxScore: "10", description: "" });
    }
  };

  const removeRubricCriterion = (index: number) => {
    setRubricCriteria(rubricCriteria.filter((_, i) => i !== index));
  };

  const handleGrade = async () => {
    if (!submissionContent.trim()) {
      toast.error("Please paste submission content");
      return;
    }
    setGrading(true);
    setResult(null);
    try {
      const res = await fetch("/api/ai/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionContent,
          assignmentId: assignmentId || undefined,
          studentId: selectedStudent?.userId || undefined,
          courseId: courseId || undefined,
          rubric: rubricCriteria.length > 0 ? rubricCriteria : undefined,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data);
        toast.success("Grading complete");
      } else {
        const data = await res.json();
        toast.error(data.error || "Grading failed");
      }
    } catch {
      toast.error("Failed to grade submission");
    } finally {
      setGrading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Grading</h1>
          <p className="mt-1 text-gray-600">
            Grade student submissions using AI-powered analysis
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Submission Content
              </CardTitle>
              <CardDescription>
                Paste the student&apos;s work to be graded
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedStudent && (
                <div className="flex items-center justify-between rounded-lg border border-indigo-200 bg-indigo-50 p-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                      {selectedStudent.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{selectedStudent.name}</p>
                      <p className="text-xs text-gray-500">{selectedStudent.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedStudent(null);
                      setCourseId("");
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              <Textarea
                placeholder="Paste student submission content here..."
                value={submissionContent}
                onChange={(e) => setSubmissionContent(e.target.value)}
                className="min-h-[200px]"
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Assignment ID (optional)"
                  value={assignmentId}
                  onChange={(e) => setAssignmentId(e.target.value)}
                  placeholder="Enter assignment ID"
                />
                <Input
                  label="Course ID (optional)"
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  placeholder="Enter course ID"
                />
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => setShowRubric(!showRubric)}
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  {showRubric ? "Hide Rubric" : "Add Rubric Criteria (Optional)"}
                </button>
                {showRubric && (
                  <div className="mt-2 space-y-2 rounded-lg border border-gray-200 p-3">
                    {rubricCriteria.map((c, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <span className="flex-1 font-medium">{c.criterion}</span>
                        <span className="text-gray-500">/ {c.maxScore} pts</span>
                        {c.description && (
                          <span className="text-xs text-gray-400 hidden sm:inline">({c.description})</span>
                        )}
                        <button
                          onClick={() => removeRubricCriterion(i)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <Input
                        placeholder="Criterion name"
                        value={newCriterion.criterion}
                        onChange={(e) => setNewCriterion({ ...newCriterion, criterion: e.target.value })}
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        min="1"
                        placeholder="Max"
                        value={newCriterion.maxScore}
                        onChange={(e) => setNewCriterion({ ...newCriterion, maxScore: e.target.value })}
                        className="w-20"
                      />
                      <Input
                        placeholder="Description (optional)"
                        value={newCriterion.description}
                        onChange={(e) => setNewCriterion({ ...newCriterion, description: e.target.value })}
                        className="flex-1"
                      />
                      <Button size="sm" onClick={addRubricCriterion} disabled={!newCriterion.criterion.trim()}>
                        Add
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <Button
                onClick={handleGrade}
                disabled={grading || !submissionContent.trim()}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
              >
                {grading ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Grading with AI...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Grade with AI
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {result && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Grading Result
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-6 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
                  <div className="text-center">
                    <p className="text-4xl font-bold">{result.score}%</p>
                    <p className="text-sm opacity-90">Score</p>
                  </div>
                  <div className="h-12 w-px bg-white/30" />
                  <div className="text-center">
                    <p className="text-3xl font-bold">{result.grade}</p>
                    <p className="text-sm opacity-90">Grade</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">Overall Feedback</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{result.feedback}</p>
                </div>

                {result.rubricScores && result.rubricScores.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Rubric Breakdown</h4>
                    <div className="space-y-2">
                      {result.rubricScores.map((rs, i) => (
                        <div key={i} className="rounded-lg border border-gray-200 p-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-900">{rs.criterion}</span>
                            <span className="text-sm font-bold text-indigo-600">{rs.score} pts</span>
                          </div>
                          <p className="mt-1 text-xs text-gray-500">{rs.feedback}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {result.suggestions && result.suggestions.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Improvement Suggestions</h4>
                    <ul className="space-y-1.5">
                      {result.suggestions.map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <Star className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Select Student
              </CardTitle>
              <CardDescription>
                Optionally select a student to associate with the grade
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Spinner size="lg" />
                </div>
              ) : students.length === 0 ? (
                <p className="text-center text-sm text-gray-500 py-8">No students found</p>
              ) : (
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {students.map((student) => (
                    <button
                      key={student.userId}
                      onClick={() => {
                        setSelectedStudent(student);
                        if (student.coursesEnrolled.length > 0) {
                          setCourseId(student.coursesEnrolled[0].id);
                        }
                      }}
                      className={`w-full flex items-center gap-3 rounded-lg border p-3 text-left transition-all ${
                        selectedStudent?.userId === student.userId
                          ? "border-indigo-300 bg-indigo-50"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                        {student.name.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">{student.name}</p>
                        <p className="text-xs text-gray-500 truncate">{student.email}</p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {student.coursesEnrolled.slice(0, 2).map((c) => (
                            <Badge key={c.id} variant="outline" className="text-xs">
                              {c.title}
                            </Badge>
                          ))}
                          {student.coursesEnrolled.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{student.coursesEnrolled.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
