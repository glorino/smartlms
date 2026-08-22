"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Award,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  TrendingUp,
  Download,
  Eye,
  Play,
  Medal,
  BookMarked,
  Timer,
  GraduationCap,
  ArrowUpRight,
  History,
  Shield,
  X,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface EnrollmentCourse {
  id: string;
  title: string;
  slug: string;
  thumbnail: string | null;
  price: number;
  salePrice: number | null;
  currency: string;
  level: string;
  category: string | null;
  instructor: { id: string; name: string | null; avatar: string | null };
}

interface Enrollment {
  id: string;
  status: "ACTIVE" | "COMPLETED" | "EXPIRED" | "CANCELLED";
  progress: number;
  enrolledAt: string;
  completedAt: string | null;
  expiresAt: string | null;
  course: EnrollmentCourse;
}

export default function TrainingPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingEnrollment, setViewingEnrollment] = useState<Enrollment | null>(null);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  useEffect(() => {
    async function fetchEnrollments() {
      try {
        const res = await fetch("/api/enrollments");
        const data = await res.json();
        if (res.ok) {
          setEnrollments(data.enrollments || []);
        } else {
          toast.error(data.error || "Failed to load enrollments");
        }
      } catch {
        toast.error("Failed to load enrollments");
      } finally {
        setLoading(false);
      }
    }
    fetchEnrollments();
  }, []);

  const calendarDays = (() => {
    const year = new Date().getFullYear();
    const month = currentMonth;
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: { day: number; events: string[] }[] = [];
    const events: Record<number, string[]> = {};

    enrollments.forEach((e) => {
      if (e.expiresAt) {
        const d = new Date(e.expiresAt);
        if (d.getFullYear() === year && d.getMonth() === month) {
          const day = d.getDate();
          if (!events[day]) events[day] = [];
          events[day].push(`${e.course.title} expires`);
        }
      }
      if (e.completedAt) {
        const d = new Date(e.completedAt);
        if (d.getFullYear() === year && d.getMonth() === month) {
          const day = d.getDate();
          if (!events[day]) events[day] = [];
          events[day].push(`${e.course.title} completed`);
        }
      }
    });

    for (let i = 0; i < firstDay; i++) {
      days.push({ day: 0, events: [] });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      days.push({ day: d, events: events[d] || [] });
    }
    return days;
  })();

  const completedEnrollments = enrollments.filter((e) => e.status === "COMPLETED");
  const inProgressEnrollments = enrollments.filter((e) => e.status === "ACTIVE" && e.progress > 0);
  const notStartedEnrollments = enrollments.filter((e) => e.status === "ACTIVE" && e.progress === 0);

  const filteredEnrollments = enrollments.filter((enrollment) => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "in-progress") return enrollment.status === "ACTIVE" && enrollment.progress > 0;
    if (selectedFilter === "completed") return enrollment.status === "COMPLETED";
    if (selectedFilter === "not-started") return enrollment.status === "ACTIVE" && enrollment.progress === 0;
    return true;
  });

  function getStatusBadge(status: Enrollment["status"]) {
    switch (status) {
      case "COMPLETED":
        return <Badge variant="success">Completed</Badge>;
      case "ACTIVE":
        return <Badge variant="warning">Active</Badge>;
      case "EXPIRED":
        return <Badge variant="danger">Expired</Badge>;
      case "CANCELLED":
        return <Badge variant="secondary">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  }

  function escapeCSV(value: string) {
    if (value.includes(",") || value.includes('"') || value.includes("\n")) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }

  function exportReport() {
    const headers = ["Title", "Category", "Level", "Status", "Progress", "Enrolled At"];
    const rows = enrollments.map((e) => [
      escapeCSV(e.course.title),
      escapeCSV(e.course.category || ""),
      escapeCSV(e.course.level),
      escapeCSV(e.status),
      escapeCSV(`${e.progress}%`),
      escapeCSV(new Date(e.enrolledAt).toLocaleDateString()),
    ]);
    const csv = [headers.map(escapeCSV).join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "training_report.csv";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
    toast.success("Training report exported");
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (enrollments.length === 0) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Training Center</h1>
            <p className="mt-1 text-gray-500">
              Manage your assigned trainings and track compliance status.
            </p>
          </div>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-gray-100 p-4">
              <BookOpen className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">No Enrolled Courses</h3>
            <p className="mt-1 text-sm text-gray-500">
              You haven't enrolled in any courses yet. Browse available courses to get started.
            </p>
            <Link
              href="/courses"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 shadow-sm"
            >
              <GraduationCap className="h-4 w-4" />
              Browse Courses
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Training Center</h1>
          <p className="mt-1 text-gray-500">
            Manage your assigned trainings and track compliance status.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
            onClick={exportReport}
          >
            <Download className="h-4 w-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="transition-all hover:shadow-lg hover:-translate-y-0.5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Total Courses</p>
                <p className="text-3xl font-bold text-gray-900">{enrollments.length}</p>
              </div>
              <div className="rounded-xl bg-blue-500 p-3 shadow-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="transition-all hover:shadow-lg hover:-translate-y-0.5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="text-3xl font-bold text-emerald-600">{completedEnrollments.length}</p>
                <p className="text-xs text-gray-400">
                  {enrollments.length > 0
                    ? `${Math.round((completedEnrollments.length / enrollments.length) * 100)}% completion rate`
                    : "0% completion rate"}
                </p>
              </div>
              <div className="rounded-xl bg-emerald-500 p-3 shadow-lg">
                <CheckCircle2 className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="transition-all hover:shadow-lg hover:-translate-y-0.5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">In Progress</p>
                <p className="text-3xl font-bold text-amber-600">{inProgressEnrollments.length}</p>
                <p className="text-xs text-gray-400">{notStartedEnrollments.length} not started</p>
              </div>
              <div className="rounded-xl bg-amber-500 p-3 shadow-lg">
                <Timer className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="transition-all hover:shadow-lg hover:-translate-y-0.5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Active Enrollments</p>
                <p className="text-3xl font-bold text-indigo-600">
                  {enrollments.filter((e) => e.status === "ACTIVE").length}
                </p>
                <p className="text-xs text-gray-400">currently active</p>
              </div>
              <div className="rounded-xl bg-indigo-500 p-3 shadow-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Training Calendar */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-indigo-600" />
            Training Calendar
          </CardTitle>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentMonth((prev) => (prev > 0 ? prev - 1 : 11))}
              className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="min-w-[120px] text-center text-sm font-medium text-gray-900">
              {monthNames[currentMonth]} {new Date().getFullYear()}
            </span>
            <button
              onClick={() => setCurrentMonth((prev) => (prev < 11 ? prev + 1 : 0))}
              className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="p-2 text-center text-xs font-semibold text-gray-500"
              >
                {day}
              </div>
            ))}
            {calendarDays.map((day, index) => (
              <div
                key={index}
                className={`min-h-[80px] rounded-lg border p-1.5 transition-colors ${
                  day.day === 0
                    ? "border-transparent bg-transparent"
                    : day.day === new Date().getDate()
                      ? "border-indigo-300 bg-indigo-50"
                      : "border-gray-100 hover:bg-gray-50"
                }`}
              >
                {day.day > 0 && (
                  <>
                    <span
                      className={`text-xs font-medium ${
                        day.day === new Date().getDate()
                          ? "text-indigo-600"
                          : "text-gray-700"
                      }`}
                    >
                      {day.day}
                    </span>
                    {day.events.length > 0 && (
                      <div className="mt-1 space-y-0.5">
                        {day.events.map((event, i) => (
                          <div
                            key={i}
                            className="truncate rounded bg-indigo-100 px-1 py-0.5 text-[10px] font-medium text-indigo-700"
                          >
                            {event}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Enrolled Courses */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BookMarked className="h-5 w-5 text-indigo-600" />
            My Enrolled Courses
          </CardTitle>
          <div className="flex items-center gap-2">
            {["all", "in-progress", "completed", "not-started"].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  selectedFilter === filter
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1).replace("-", " ")}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredEnrollments.map((enrollment) => {
              const isCompleted = enrollment.status === "COMPLETED";
              const hasProgress = enrollment.progress > 0;
              const courseStatus = isCompleted ? "completed" : hasProgress ? "in-progress" : "not-started";

              return (
                <div
                  key={enrollment.id}
                  className={`group rounded-xl border p-4 transition-all hover:shadow-md ${
                    isCompleted
                      ? "border-green-200 bg-green-50/30"
                      : "border-gray-100 hover:border-indigo-200"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-lg ${
                        isCompleted
                          ? "bg-gradient-to-br from-green-500 to-emerald-600"
                          : "bg-gradient-to-br from-indigo-500 to-purple-600"
                      } text-white`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-6 w-6" />
                      ) : (
                        <BookOpen className="h-6 w-6" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-gray-900 group-hover:text-indigo-600">
                              {enrollment.course.title}
                            </h4>
                            {getStatusBadge(enrollment.status)}
                          </div>
                          <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                            {enrollment.course.category && (
                              <>
                                <span>{enrollment.course.category}</span>
                                <span>·</span>
                              </>
                            )}
                            <span>{enrollment.course.level}</span>
                            {enrollment.course.instructor?.name && (
                              <>
                                <span>·</span>
                                <span>{enrollment.course.instructor.name}</span>
                              </>
                            )}
                            {enrollment.expiresAt && (
                              <>
                                <span>·</span>
                                <span>Expires: {new Date(enrollment.expiresAt).toLocaleDateString()}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Progress</span>
                          <span className="font-medium text-gray-700">
                            {enrollment.progress}%
                          </span>
                        </div>
                        <Progress
                          value={enrollment.progress}
                          className="mt-1 h-2"
                          color={
                            isCompleted
                              ? "green"
                              : enrollment.progress > 50
                                ? "default"
                                : "blue"
                          }
                        />
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <p className="text-xs text-gray-400">
                          Enrolled: {new Date(enrollment.enrolledAt).toLocaleDateString()}
                        </p>
                        <Link
                          href={`/courses/${enrollment.course.slug || enrollment.course.id}/learn`}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-indigo-700 shadow-sm"
                        >
                          {isCompleted ? (
                            <>
                              <Eye className="h-3 w-3" />
                              Review
                            </>
                          ) : (
                            <>
                              <Play className="h-3 w-3" />
                              Continue
                            </>
                          )}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Training History */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-indigo-600" />
            Training History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {completedEnrollments.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-center">
              <Award className="h-8 w-8 text-gray-300" />
              <p className="mt-2 text-sm text-gray-500">No completed courses yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Training
                    </th>
                    <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Completed Date
                    </th>
                    <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Progress
                    </th>
                    <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Category
                    </th>
                    <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {completedEnrollments.map((enrollment) => (
                    <tr key={enrollment.id} className="transition-colors hover:bg-gray-50/50">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-100 text-green-600">
                            <CheckCircle2 className="h-4 w-4" />
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {enrollment.course.title}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 text-sm text-gray-500">
                        {enrollment.completedAt
                          ? new Date(enrollment.completedAt).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="py-4">
                        <Badge variant="success" className="text-xs">
                          {enrollment.progress}%
                        </Badge>
                      </td>
                      <td className="py-4 text-sm text-gray-500">
                        {enrollment.course.category || "-"}
                      </td>
                      <td className="py-4 text-right">
                        <button
                          className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-indigo-600"
                          onClick={() => setViewingEnrollment(enrollment)}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {viewingEnrollment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">{viewingEnrollment.course.title}</h2>
              <button onClick={() => setViewingEnrollment(null)} className="rounded-sm opacity-70 hover:opacity-100">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-gray-500">Category</p>
                  <p className="font-medium">{viewingEnrollment.course.category || "-"}</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-gray-500">Level</p>
                  <p className="font-medium capitalize">{viewingEnrollment.course.level}</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-gray-500">Status</p>
                  <p className="font-medium capitalize">{viewingEnrollment.status.toLowerCase()}</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-gray-500">Enrolled</p>
                  <p className="font-medium">{new Date(viewingEnrollment.enrolledAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="rounded-lg bg-gray-50 p-3">
                <div className="flex items-center justify-between">
                  <p className="text-gray-500">Progress</p>
                  <p className="font-medium">{viewingEnrollment.progress}%</p>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                  <div
                    className={`h-2 rounded-full ${viewingEnrollment.status === "COMPLETED" ? "bg-green-500" : "bg-indigo-500"}`}
                    style={{ width: `${viewingEnrollment.progress}%` }}
                  />
                </div>
              </div>
              {viewingEnrollment.course.instructor?.name && (
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-gray-500">Instructor</p>
                  <p className="font-medium">{viewingEnrollment.course.instructor.name}</p>
                </div>
              )}
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="outline" onClick={() => setViewingEnrollment(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
