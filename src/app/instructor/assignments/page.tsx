"use client";

import { useState } from "react";
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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

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
  submittedAt: string;
  score: number | null;
  status: "pending" | "graded" | "late";
}

const mockAssignments: Assignment[] = [
  {
    id: "1",
    title: "Build a Todo App with React",
    course: "Advanced React & Next.js Masterclass",
    totalSubmissions: 45,
    graded: 38,
    pending: 7,
    avgScore: 82,
    dueDate: "2026-08-10",
    status: "active",
  },
  {
    id: "2",
    title: "Responsive Landing Page",
    course: "Complete Web Development Bootcamp",
    totalSubmissions: 62,
    graded: 62,
    pending: 0,
    avgScore: 88,
    dueDate: "2026-08-05",
    status: "closed",
  },
  {
    id: "3",
    title: "REST API Design",
    course: "Complete Web Development Bootcamp",
    totalSubmissions: 40,
    graded: 25,
    pending: 15,
    avgScore: 76,
    dueDate: "2026-08-15",
    status: "active",
  },
  {
    id: "4",
    title: "Figma Wireframe Project",
    course: "UI/UX Design Fundamentals",
    totalSubmissions: 38,
    graded: 38,
    pending: 0,
    avgScore: 91,
    dueDate: "2026-07-28",
    status: "closed",
  },
];

const mockSubmissions: Submission[] = [
  { id: "1", studentName: "Alice Johnson", studentEmail: "alice@example.com", assignmentTitle: "Build a Todo App with React", course: "Advanced React & Next.js Masterclass", submittedAt: "2026-08-06", score: null, status: "pending" },
  { id: "2", studentName: "Bob Smith", studentEmail: "bob@example.com", assignmentTitle: "Build a Todo App with React", course: "Advanced React & Next.js Masterclass", submittedAt: "2026-08-05", score: 85, status: "graded" },
  { id: "3", studentName: "Carol Williams", studentEmail: "carol@example.com", assignmentTitle: "REST API Design", course: "Complete Web Development Bootcamp", submittedAt: "2026-08-04", score: null, status: "pending" },
  { id: "4", studentName: "David Brown", studentEmail: "david@example.com", assignmentTitle: "Build a Todo App with React", course: "Advanced React & Next.js Masterclass", submittedAt: "2026-08-03", score: 72, status: "graded" },
  { id: "5", studentName: "Emma Davis", studentEmail: "emma@example.com", assignmentTitle: "REST API Design", course: "Complete Web Development Bootcamp", submittedAt: "2026-08-02", score: 90, status: "graded" },
  { id: "6", studentName: "Frank Miller", studentEmail: "frank@example.com", assignmentTitle: "Build a Todo App with React", course: "Advanced React & Next.js Masterclass", submittedAt: "2026-08-01", score: null, status: "late" },
  { id: "7", studentName: "Grace Wilson", studentEmail: "grace@example.com", assignmentTitle: "REST API Design", course: "Complete Web Development Bootcamp", submittedAt: "2026-07-30", score: null, status: "pending" },
];

export default function AssignmentsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>(mockSubmissions);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [grade, setGrade] = useState("");
  const [feedback, setFeedback] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "graded" | "late">("all");

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
    avgScore: Math.round(
      submissions
        .filter((s) => s.score !== null)
        .reduce((acc, s) => acc + (s.score || 0), 0) /
        submissions.filter((s) => s.score !== null).length
    ),
  };

  const handleGrade = () => {
    if (selectedSubmission && grade) {
      setSubmissions(
        submissions.map((s) =>
          s.id === selectedSubmission.id
            ? { ...s, score: Number(grade), status: "graded" as const }
            : s
        )
      );
      setSelectedSubmission(null);
      setGrade("");
      setFeedback("");
    }
  };

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
            {mockAssignments.map((assignment) => (
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
                      <Button variant="outline" size="sm">
                        <Eye className="mr-1 h-4 w-4" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
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
            ))}
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
                  <Button variant="outline">
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
    </div>
  );
}
