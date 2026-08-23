"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  FileText,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Eye,
  Download,
  Star,
  BarChart3,
  X,
  Plus,
  Pencil,
  Trash2,
  Calendar,
  BookOpen,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

interface Course {
  id: string;
  title: string;
}

interface Lesson {
  id: string;
  title: string;
}

interface ManagedAssignment {
  id: string;
  title: string;
  description: string | null;
  maxScore: number;
  dueDate: string | null;
  status: string;
  course: { id: string; title: string };
  lesson: { id: string; title: string } | null;
  createdAt: string;
}

interface Submission {
  id: string;
  studentName: string;
  studentEmail: string;
  assignmentTitle: string;
  course: string;
  courseId: string;
  submittedAt: string;
  score: number | null;
  feedback: string | null;
  content: string | null;
  status: "pending" | "graded" | "late";
}

interface AssignmentFormData {
  title: string;
  description: string;
  courseId: string;
  lessonId: string;
  maxScore: string;
  dueDate: string;
  status: string;
}

const defaultForm: AssignmentFormData = {
  title: "",
  description: "",
  courseId: "",
  lessonId: "",
  maxScore: "100",
  dueDate: "",
  status: "ACTIVE",
};

export default function AssignmentsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [assignments, setAssignments] = useState<ManagedAssignment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [grade, setGrade] = useState("");
  const [feedback, setFeedback] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "graded" | "late">("all");

  const [showForm, setShowForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<ManagedAssignment | null>(null);
  const [formData, setFormData] = useState<AssignmentFormData>(defaultForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (formData.courseId) {
      fetchLessons(formData.courseId);
    } else {
      setLessons([]);
      setFormData((prev) => ({ ...prev, lessonId: "" }));
    }
  }, [formData.courseId]);

  async function fetchLessons(courseId: string) {
    try {
      const res = await fetch(`/api/instructor/courses/${courseId}/lessons`);
      if (res.ok) {
        const data = await res.json();
        setLessons(data.lessons || []);
      }
    } catch {
      setLessons([]);
    }
  }

  async function fetchData() {
    try {
      const [subRes, manageRes] = await Promise.all([
        fetch("/api/instructor/assignments"),
        fetch("/api/instructor/assignments/manage"),
      ]);

      if (subRes.ok) {
        const subData = await subRes.json();
        setSubmissions(subData.submissions || []);
      }

      if (manageRes.ok) {
        const manageData = await manageRes.json();
        setAssignments(manageData.assignments || []);
        setCourses(manageData.courses || []);
      }
    } catch {
      setSubmissions([]);
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  }

  const filtered = submissions.filter((s) => {
    const matchesSearch =
      s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.assignmentTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || s.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    totalSubmissions: submissions.length,
    pending: submissions.filter((s) => s.status === "pending" || s.status === "late").length,
    graded: submissions.filter((s) => s.status === "graded").length,
    avgScore:
      submissions.filter((s) => s.score !== null).length > 0
        ? Math.round(
            submissions
              .filter((s) => s.score !== null)
              .reduce((acc, s) => acc + (s.score || 0), 0) /
              submissions.filter((s) => s.score !== null).length
          )
        : 0,
  };

  function openCreateForm() {
    setEditingAssignment(null);
    setFormData(defaultForm);
    setShowForm(true);
  }

  function openEditForm(assignment: ManagedAssignment) {
    setEditingAssignment(assignment);
    setFormData({
      title: assignment.title,
      description: assignment.description || "",
      courseId: assignment.course.id,
      lessonId: assignment.lesson?.id || "",
      maxScore: String(assignment.maxScore),
      dueDate: assignment.dueDate ? new Date(assignment.dueDate).toISOString().slice(0, 16) : "",
      status: assignment.status,
    });
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingAssignment(null);
    setFormData(defaultForm);
    setLessons([]);
  }

  async function handleSave() {
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!formData.courseId) {
      toast.error("Please select a course");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...(editingAssignment && { id: editingAssignment.id }),
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        courseId: formData.courseId,
        lessonId: formData.lessonId || null,
        maxScore: Number(formData.maxScore) || 100,
        dueDate: formData.dueDate || null,
        status: formData.status,
      };

      const res = await fetch("/api/instructor/assignments/manage", {
        method: editingAssignment ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(editingAssignment ? "Assignment updated" : "Assignment created");
        closeForm();
        await fetchData();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to save assignment");
      }
    } catch {
      toast.error("Failed to save assignment");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this assignment?")) return;

    setDeleting(id);
    try {
      const res = await fetch(`/api/instructor/assignments/manage?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Assignment deleted");
        await fetchData();
      } else {
        toast.error("Failed to delete assignment");
      }
    } catch {
      toast.error("Failed to delete assignment");
    } finally {
      setDeleting(null);
    }
  }

  const handleGrade = async () => {
    if (selectedSubmission && grade) {
      try {
        const res = await fetch("/api/instructor/assignments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            assignmentId: selectedSubmission.id,
            grade: Number(grade),
            feedback,
          }),
        });
        if (res.ok) {
          setSubmissions(
            submissions.map((s) =>
              s.id === selectedSubmission.id
                ? { ...s, score: Number(grade), status: "graded" as const, feedback }
                : s
            )
          );
          toast.success("Grade submitted");
        }
      } catch {
        toast.error("Failed to submit grade");
      }
      setSelectedSubmission(null);
      setGrade("");
      setFeedback("");
    }
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
          <p className="mt-1 text-gray-600">Create, manage, and grade student assignments</p>
        </div>
        <Button onClick={openCreateForm}>
          <Plus className="mr-2 h-4 w-4" />
          Create Assignment
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Submissions</p>
                <p className="mt-1 text-3xl font-bold text-gray-900">{stats.totalSubmissions}</p>
              </div>
              <div className="rounded-xl bg-blue-500 p-3">
                <FileText className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending Review</p>
                <p className="mt-1 text-3xl font-bold text-gray-900">{stats.pending}</p>
              </div>
              <div className="rounded-xl bg-amber-500 p-3">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Graded</p>
                <p className="mt-1 text-3xl font-bold text-gray-900">{stats.graded}</p>
              </div>
              <div className="rounded-xl bg-emerald-500 p-3">
                <CheckCircle2 className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Avg. Score</p>
                <p className="mt-1 text-3xl font-bold text-gray-900">{stats.avgScore}%</p>
              </div>
              <div className="rounded-xl bg-purple-500 p-3">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="assignments">
        <TabsList>
          <TabsTrigger value="assignments">My Assignments ({assignments.length})</TabsTrigger>
          <TabsTrigger value="submissions">Submissions ({submissions.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="assignments">
          <div className="mt-4 space-y-4">
            {assignments.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <FileText className="h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No assignments yet</h3>
                  <p className="mt-1 text-sm text-gray-500">Create your first assignment to get started</p>
                  <Button className="mt-4" onClick={openCreateForm}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Assignment
                  </Button>
                </CardContent>
              </Card>
            ) : (
              assignments.map((assignment) => (
                <Card key={assignment.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">{assignment.title}</h3>
                          <Badge
                            variant={
                              assignment.status === "ACTIVE"
                                ? "default"
                                : assignment.status === "CLOSED"
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {assignment.status}
                          </Badge>
                        </div>
                        {assignment.description && (
                          <p className="mt-1 text-sm text-gray-500 line-clamp-2">{assignment.description}</p>
                        )}
                        <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            {assignment.course.title}
                          </span>
                          {assignment.lesson && (
                            <span className="flex items-center gap-1">
                              <FileText className="h-4 w-4" />
                              {assignment.lesson.title}
                            </span>
                          )}
                          <span>Max Score: {assignment.maxScore}</span>
                          {assignment.dueDate && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Due: {new Date(assignment.dueDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEditForm(assignment)}>
                          <Pencil className="mr-1 h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(assignment.id)}
                          disabled={deleting === assignment.id}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          {deleting === assignment.id ? (
                            <Spinner size="sm" />
                          ) : (
                            <Trash2 className="mr-1 h-4 w-4" />
                          )}
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="submissions">
          <Card className="mt-4">
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search submissions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-10 rounded-lg border border-gray-200 bg-white pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-400" />
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
                      className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="graded">Graded</option>
                      <option value="late">Late</option>
                    </select>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <FileText className="h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No submissions found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchQuery ? "Try a different search term" : "No submissions yet"}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filtered.map((sub) => (
                    <div
                      key={sub.id}
                      className="flex items-center gap-4 rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-md"
                    >
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white">
                        {sub.studentName.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">{sub.studentName}</h3>
                          <Badge
                            variant={
                              sub.status === "graded"
                                ? "success"
                                : sub.status === "late"
                                ? "danger"
                                : "warning"
                            }
                          >
                            {sub.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500">{sub.assignmentTitle}</p>
                        <p className="text-xs text-gray-400">
                          Submitted: {new Date(sub.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        {sub.score !== null ? (
                          <div>
                            <p className="text-2xl font-bold text-gray-900">{sub.score}%</p>
                            <div className="flex items-center gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < Math.round(sub.score! / 20)
                                      ? "fill-amber-400 text-amber-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        ) : (
                          <Button size="sm" onClick={() => setSelectedSubmission(sub)}>
                            Grade
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{editingAssignment ? "Edit Assignment" : "Create Assignment"}</CardTitle>
                  <CardDescription>
                    {editingAssignment ? "Update assignment details" : "Create a new assignment for your students"}
                  </CardDescription>
                </div>
                <button onClick={closeForm} className="rounded-sm opacity-70 hover:opacity-100">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Assignment title"
              />
              <Textarea
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the assignment..."
                className="min-h-[80px]"
              />
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Course</label>
                <select
                  value={formData.courseId}
                  onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">Select a course</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>
              {formData.courseId && lessons.length > 0 && (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Attach to Lesson (optional)
                  </label>
                  <select
                    value={formData.lessonId}
                    onChange={(e) => setFormData({ ...formData, lessonId: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="">No specific lesson</option>
                    {lessons.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Max Score"
                  type="number"
                  min="1"
                  value={formData.maxScore}
                  onChange={(e) => setFormData({ ...formData, maxScore: e.target.value })}
                />
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Due Date</label>
                  <input
                    type="datetime-local"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="DRAFT">Draft</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" onClick={closeForm}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? <Spinner size="sm" className="mr-2" /> : null}
                  {editingAssignment ? "Update" : "Create"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-lg mx-4">
            <CardHeader>
              <CardTitle>Grade Submission</CardTitle>
              <CardDescription>
                {selectedSubmission.studentName} - {selectedSubmission.assignmentTitle}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <p className="text-sm font-medium text-gray-700">Submission Details</p>
                <p className="mt-1 text-sm text-gray-500">Student: {selectedSubmission.studentName}</p>
                <p className="text-sm text-gray-500">Email: {selectedSubmission.studentEmail}</p>
                <p className="text-sm text-gray-500">
                  Submitted: {new Date(selectedSubmission.submittedAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">Status: {selectedSubmission.status}</p>
                {selectedSubmission.content && (
                  <p className="mt-2 text-sm text-gray-600 border-t pt-2">{selectedSubmission.content}</p>
                )}
              </div>
              <div className="flex items-center gap-4">
                <Input
                  label="Score (0-100)"
                  type="number"
                  min="0"
                  max="100"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  placeholder="Enter score"
                />
              </div>
              <Textarea
                label="Feedback"
                placeholder="Provide feedback to the student..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedSubmission(null);
                    setGrade("");
                    setFeedback("");
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleGrade} disabled={!grade}>
                  Submit Grade
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
