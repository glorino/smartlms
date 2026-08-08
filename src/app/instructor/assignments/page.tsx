"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  Filter,
  Eye,
  Download,
  Star,
  Users,
  BarChart3,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

interface Assignment {
  id: string;
  title: string;
  course: string;
  totalSubmissions: number;
  graded: number;
  pending: number;
  avgScore: number;
  dueDate: string;
  status: "active" | "closed" | "draft";
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

export default function AssignmentsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [grade, setGrade] = useState("");
  const [feedback, setFeedback] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "graded" | "late">("all");
  const [viewingAssignment, setViewingAssignment] = useState<Assignment | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/instructor/assignments");
        if (res.ok) {
          const data = await res.json();
          setSubmissions(data.submissions || []);
          setAssignments(data.assignments || []);
        }
      } catch {
        setSubmissions([]);
        setAssignments([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

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
        }
      } catch {
        // handle error
      }
      setSelectedSubmission(null);
      setGrade("");
      setFeedback("");
      toast.success("Grade submitted successfully");
    }
  };

  const handleExportSubmissions = async () => {
    try {
      const res = await fetch("/api/instructor/assignments?format=csv");
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "submissions.csv";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
        toast.success("Submissions exported successfully");
      } else {
        toast.error("Failed to export submissions");
      }
    } catch {
      toast.error("Failed to export submissions");
    }
  };

  const handleExportAssignment = async (assignment: Assignment) => {
    try {
      const res = await fetch(`/api/instructor/assignments?assignmentId=${assignment.id}&format=csv`);
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${assignment.title.replace(/\s+/g, "_")}_submissions.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
        toast.success("Assignment submissions exported");
      } else {
        toast.error("Failed to export");
      }
    } catch {
      toast.error("Failed to export");
    }
  };

  const handleDownloadSubmission = () => {
    if (!selectedSubmission?.content) {
      toast.error("No submission content to download");
      return;
    }
    const blob = new Blob([selectedSubmission.content], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedSubmission.studentName.replace(/\s+/g, "_")}_submission.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
    toast.success("Submission downloaded");
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
        <p className="mt-1 text-gray-600">Review and grade student submissions</p>
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

      <Tabs defaultValue="submissions">
        <TabsList>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
        </TabsList>

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
                          <Button
                            size="sm"
                            onClick={() => setSelectedSubmission(sub)}
                          >
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

        <TabsContent value="assignments">
          <div className="mt-4 space-y-4">
            {assignments.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <FileText className="h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No assignments yet</h3>
                  <p className="mt-1 text-sm text-gray-500">Create assignments for your courses</p>
                </CardContent>
              </Card>
            ) : (
              assignments.map((assignment) => (
                <Card key={assignment.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">{assignment.title}</h3>
                          <Badge
                            variant={
                              assignment.status === "active"
                                ? "default"
                                : assignment.status === "closed"
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {assignment.status}
                          </Badge>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">{assignment.course}</p>
                        <p className="mt-1 text-xs text-gray-400">
                          Due: {new Date(assignment.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setViewingAssignment(assignment)}>
                          <Eye className="mr-1 h-4 w-4" />
                          View
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleExportAssignment(assignment)}>
                          <Download className="mr-1 h-4 w-4" />
                          Export
                        </Button>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-4 gap-4 text-center">
                      <div>
                        <p className="text-lg font-bold text-gray-900">{assignment.totalSubmissions}</p>
                        <p className="text-xs text-gray-500">Submissions</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-emerald-600">{assignment.graded}</p>
                        <p className="text-xs text-gray-500">Graded</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-amber-600">{assignment.pending}</p>
                        <p className="text-xs text-gray-500">Pending</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-blue-600">{assignment.avgScore}%</p>
                        <p className="text-xs text-gray-500">Avg. Score</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <Progress
                        value={(assignment.graded / assignment.totalSubmissions) * 100}
                        className="h-2"
                        color="green"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

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
                <p className="mt-1 text-sm text-gray-500">
                  Student: {selectedSubmission.studentName}
                </p>
                <p className="text-sm text-gray-500">
                  Email: {selectedSubmission.studentEmail}
                </p>
                <p className="text-sm text-gray-500">
                  Submitted: {new Date(selectedSubmission.submittedAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">
                  Status: {selectedSubmission.status}
                </p>
                {selectedSubmission.content && (
                  <p className="mt-2 text-sm text-gray-600 border-t pt-2">
                    {selectedSubmission.content}
                  </p>
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
                <div className="mt-7">
                  <Button variant="outline" onClick={handleDownloadSubmission}>
                    <Download className="mr-1 h-4 w-4" />
                    Download
                  </Button>
                </div>
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

      {viewingAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-lg mx-4">
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle>{viewingAssignment.title}</CardTitle>
                <CardDescription>{viewingAssignment.course}</CardDescription>
              </div>
              <button
                onClick={() => setViewingAssignment(null)}
                className="rounded-sm opacity-70 hover:opacity-100"
              >
                <X className="h-4 w-4" />
              </button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Status</p>
                  <Badge variant={viewingAssignment.status === "active" ? "default" : viewingAssignment.status === "closed" ? "secondary" : "outline"}>
                    {viewingAssignment.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-gray-500">Due Date</p>
                  <p className="font-medium">{new Date(viewingAssignment.dueDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-500">Total Submissions</p>
                  <p className="font-medium">{viewingAssignment.totalSubmissions}</p>
                </div>
                <div>
                  <p className="text-gray-500">Avg Score</p>
                  <p className="font-medium">{viewingAssignment.avgScore}%</p>
                </div>
                <div>
                  <p className="text-gray-500">Graded</p>
                  <p className="font-medium text-emerald-600">{viewingAssignment.graded}</p>
                </div>
                <div>
                  <p className="text-gray-500">Pending</p>
                  <p className="font-medium text-amber-600">{viewingAssignment.pending}</p>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setViewingAssignment(null)}>
                  Close
                </Button>
                <Button onClick={() => handleExportAssignment(viewingAssignment)}>
                  <Download className="mr-1 h-4 w-4" />
                  Export CSV
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
