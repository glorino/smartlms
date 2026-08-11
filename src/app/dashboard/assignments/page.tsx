"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Loader2,
  Send,
  ArrowLeft,
  Eye,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

interface Assignment {
  id: string;
  title: string;
  description?: string;
  score?: number;
  maxScore: number;
  feedback?: string;
  status: string;
  submittedAt?: string;
  gradedAt?: string;
  content?: string;
  createdAt: string;
  lesson?: {
    id: string;
    title: string;
    course?: {
      id: string;
      title: string;
      slug: string;
    };
  };
}

function statusBadge(status: string) {
  switch (status) {
    case "PENDING":
      return (
        <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-700">
          <Clock className="mr-1 h-3 w-3" />
          Pending
        </Badge>
      );
    case "SUBMITTED":
      return (
        <Badge variant="outline" className="border-blue-300 bg-blue-50 text-blue-700">
          <Send className="mr-1 h-3 w-3" />
          Submitted
        </Badge>
      );
    case "GRADED":
      return (
        <Badge variant="outline" className="border-green-300 bg-green-50 text-green-700">
          <CheckCircle2 className="mr-1 h-3 w-3" />
          Graded
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [submitContent, setSubmitContent] = useState("");
  const [activeView, setActiveView] = useState<"list" | "submit" | "feedback">("list");
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  useEffect(() => {
    fetchAssignments();
  }, []);

  async function fetchAssignments() {
    try {
      const res = await fetch("/api/assignments");
      const data = await res.json();
      if (res.ok) {
        setAssignments(data.assignments || []);
      }
    } catch {
      console.error("Failed to fetch assignments");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(assignmentId: string) {
    if (!submitContent.trim()) return;
    setSubmittingId(assignmentId);
    try {
      const res = await fetch("/api/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignmentId, content: submitContent }),
      });
      if (res.ok) {
        setSubmitContent("");
        setActiveView("list");
        setSelectedAssignment(null);
        fetchAssignments();
      }
    } catch {
      console.error("Failed to submit assignment");
    } finally {
      setSubmittingId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
        {activeView === "list" && (
          <>
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">My Assignments</h1>
              <p className="mt-1 text-sm text-gray-500">
                View and submit your course assignments
              </p>
            </div>

            {assignments.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <FileText className="h-12 w-12 text-gray-300" />
                  <p className="mt-4 text-lg font-medium text-gray-900">No assignments yet</p>
                  <p className="mt-1 text-sm text-gray-500">
                    Assignments will appear here when your instructor creates them.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {assignments.map((assignment) => (
                  <Card key={assignment.id} className="transition-shadow hover:shadow-md">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                              {assignment.title}
                            </h3>
                            {statusBadge(assignment.status)}
                          </div>
                          {assignment.lesson?.course && (
                            <p className="mt-1 text-sm text-gray-500">
                              <BookOpen className="mr-1 inline h-3 w-3" />
                              {assignment.lesson.course.title}
                              {assignment.lesson.title &&
                                ` — ${assignment.lesson.title}`}
                            </p>
                          )}
                          {assignment.description && (
                            <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                              {assignment.description}
                            </p>
                          )}
                          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Due:{" "}
                              {new Date(assignment.createdAt).toLocaleDateString()}
                            </span>
                            {assignment.submittedAt && (
                              <span className="flex items-center gap-1">
                                <Send className="h-3 w-3" />
                                Submitted:{" "}
                                {new Date(assignment.submittedAt).toLocaleDateString()}
                              </span>
                            )}
                            {assignment.status === "GRADED" &&
                              assignment.score != null && (
                                <span className="font-medium text-green-600">
                                  Score: {assignment.score}/{assignment.maxScore}
                                </span>
                              )}
                          </div>
                        </div>
                        <div className="flex shrink-0 gap-2">
                          {assignment.status === "PENDING" && (
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedAssignment(assignment);
                                setActiveView("submit");
                              }}
                            >
                              <Send className="mr-1 h-4 w-4" />
                              Submit
                            </Button>
                          )}
                          {assignment.status === "GRADED" && assignment.feedback && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedAssignment(assignment);
                                setActiveView("feedback");
                              }}
                            >
                              <Eye className="mr-1 h-4 w-4" />
                              Feedback
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {activeView === "submit" && selectedAssignment && (
          <div>
            <button
              onClick={() => {
                setActiveView("list");
                setSelectedAssignment(null);
              }}
              className="mb-6 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to assignments
            </button>
            <Card>
              <CardHeader>
                <CardTitle>{selectedAssignment.title}</CardTitle>
                {selectedAssignment.lesson?.course && (
                  <p className="text-sm text-gray-500">
                    {selectedAssignment.lesson.course.title}
                  </p>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedAssignment.description && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Description</h4>
                    <p className="mt-1 text-sm text-gray-600">
                      {selectedAssignment.description}
                    </p>
                  </div>
                )}
                <Separator />
                <div>
                  <label
                    htmlFor="assignment-content"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Your Submission
                  </label>
                  <Textarea
                    id="assignment-content"
                    value={submitContent}
                    onChange={(e) => setSubmitContent(e.target.value)}
                    placeholder="Write your assignment answer here..."
                    className="mt-1 min-h-[200px]"
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setActiveView("list");
                      setSelectedAssignment(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleSubmit(selectedAssignment.id)}
                    disabled={!submitContent.trim() || submittingId === selectedAssignment.id}
                  >
                    {submittingId === selectedAssignment.id ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Submit Assignment
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeView === "feedback" && selectedAssignment && (
          <div>
            <button
              onClick={() => {
                setActiveView("list");
                setSelectedAssignment(null);
              }}
              className="mb-6 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to assignments
            </button>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{selectedAssignment.title}</CardTitle>
                  {selectedAssignment.score != null && (
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">
                        {selectedAssignment.score}/{selectedAssignment.maxScore}
                      </p>
                      <p className="text-xs text-gray-500">Score</p>
                    </div>
                  )}
                </div>
                {selectedAssignment.lesson?.course && (
                  <p className="text-sm text-gray-500">
                    {selectedAssignment.lesson.course.title}
                  </p>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedAssignment.content && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Your Submission</h4>
                    <div className="mt-2 rounded-lg bg-gray-50 p-4 text-sm text-gray-700 whitespace-pre-wrap">
                      {selectedAssignment.content}
                    </div>
                  </div>
                )}
                <Separator />
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Instructor Feedback</h4>
                  <div className="mt-2 rounded-lg bg-indigo-50 p-4 text-sm text-gray-700 whitespace-pre-wrap">
                    {selectedAssignment.feedback || "No feedback provided."}
                  </div>
                </div>
                {selectedAssignment.gradedAt && (
                  <p className="text-xs text-gray-400">
                    Graded on{" "}
                    {new Date(selectedAssignment.gradedAt).toLocaleDateString()}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        )}
    </div>
  );
}
