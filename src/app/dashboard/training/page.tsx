"use client";

import { useState } from "react";
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
  FileCheck,
  TrendingUp,
  Filter,
  Download,
  Eye,
  Play,
  Medal,
  BookMarked,
  Timer,
  BarChart3,
  GraduationCap,
  ArrowUpRight,
  History,
  Shield,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const trainingCourses = [
  {
    id: 1,
    title: "Cybersecurity Awareness 2026",
    type: "mandatory",
    dueDate: "Aug 15, 2026",
    progress: 65,
    status: "in-progress",
    category: "Security",
    duration: "2 hours",
    lastAccessed: "2 hours ago",
  },
  {
    id: 2,
    title: "Workplace Safety Fundamentals",
    type: "mandatory",
    dueDate: "Aug 20, 2026",
    progress: 100,
    status: "completed",
    category: "Safety",
    duration: "1.5 hours",
    lastAccessed: "Yesterday",
  },
  {
    id: 3,
    title: "Advanced Data Analytics",
    type: "elective",
    dueDate: "Sep 1, 2026",
    progress: 30,
    status: "in-progress",
    category: "Data",
    duration: "4 hours",
    lastAccessed: "3 days ago",
  },
  {
    id: 4,
    title: "Leadership & Management Skills",
    type: "mandatory",
    dueDate: "Aug 30, 2026",
    progress: 0,
    status: "not-started",
    category: "Leadership",
    duration: "3 hours",
    lastAccessed: "Never",
  },
  {
    id: 5,
    title: "Diversity & Inclusion Training",
    type: "mandatory",
    dueDate: "Aug 10, 2026",
    progress: 100,
    status: "completed",
    category: "HR",
    duration: "1 hour",
    lastAccessed: "1 week ago",
  },
  {
    id: 6,
    title: "Cloud Computing Essentials",
    type: "elective",
    dueDate: "Sep 15, 2026",
    progress: 15,
    status: "in-progress",
    category: "Technology",
    duration: "5 hours",
    lastAccessed: "5 days ago",
  },
];

const complianceStatus = [
  { id: 1, training: "Cybersecurity Awareness", status: "in-progress", score: null, expires: "Dec 2026" },
  { id: 2, training: "Workplace Safety", status: "passed", score: 95, expires: "Aug 2027" },
  { id: 3, training: "Diversity & Inclusion", status: "passed", score: 88, expires: "Aug 2027" },
  { id: 4, training: "Data Privacy (GDPR)", status: "pending", score: null, expires: "Oct 2026" },
  { id: 5, training: "Ethics & Compliance", status: "failed", score: 62, expires: "Aug 2026" },
];

const trainingHistory = [
  { id: 1, title: "Workplace Safety Fundamentals", completedDate: "Aug 5, 2026", score: 95, certificate: true },
  { id: 2, title: "Diversity & Inclusion Training", completedDate: "Aug 1, 2026", score: 88, certificate: true },
  { id: 3, title: "Fire Safety Awareness", completedDate: "Jul 20, 2026", score: 100, certificate: true },
  { id: 4, title: "First Aid Basics", completedDate: "Jul 15, 2026", score: 92, certificate: true },
  { id: 5, title: "Anti-Harassment Training", completedDate: "Jul 1, 2026", score: 90, certificate: true },
];

const upcomingMandatory = trainingCourses.filter(
  (t) => t.type === "mandatory" && t.status !== "completed"
);

const certificates = trainingHistory.filter((t) => t.certificate);

export default function TrainingPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const [currentMonth, setCurrentMonth] = useState(7); // 0-indexed, 7 = August
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [viewingTraining, setViewingTraining] = useState<typeof trainingCourses[number] | null>(null);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const calendarDays = (() => {
    const year = new Date().getFullYear();
    const month = currentMonth;
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: { day: number; events: string[] }[] = [];
    const events: Record<number, string[]> = {
      5: ["Cybersecurity Quiz"],
      10: ["D&I Training Due"],
      15: ["Cybersecurity Due"],
      20: ["Safety Training Due"],
      25: ["Leadership Workshop"],
      30: ["Leadership Due"],
    };
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: 0, events: [] });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      days.push({ day: d, events: events[d] || [] });
    }
    return days;
  })();

  const completedCount = trainingCourses.filter((t) => t.status === "completed").length;
  const inProgressCount = trainingCourses.filter((t) => t.status === "in-progress").length;
  const notStartedCount = trainingCourses.filter((t) => t.status === "not-started").length;
  const totalHours = trainingCourses.reduce((sum, t) => sum + parseFloat(t.duration), 0);

  const filteredCourses = trainingCourses.filter((course) => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "mandatory") return course.type === "mandatory";
    if (selectedFilter === "elective") return course.type === "elective";
    if (selectedFilter === "in-progress") return course.status === "in-progress";
    if (selectedFilter === "completed") return course.status === "completed";
    return true;
  });

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
            onClick={() => {
              const headers = ["Title", "Type", "Category", "Status", "Progress", "Duration", "Due Date"];
              const rows = trainingCourses.map((c) => [c.title, c.type, c.category, c.status, `${c.progress}%`, c.duration, c.dueDate]);
              const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
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
            }}
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
                <p className="text-3xl font-bold text-gray-900">{trainingCourses.length}</p>
                <p className="text-xs text-gray-400">{totalHours} hours total</p>
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
                <p className="text-3xl font-bold text-emerald-600">{completedCount}</p>
                <p className="text-xs text-gray-400">
                  {Math.round((completedCount / trainingCourses.length) * 100)}% completion rate
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
                <p className="text-3xl font-bold text-amber-600">{inProgressCount}</p>
                <p className="text-xs text-gray-400">{notStartedCount} not started</p>
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
                <p className="text-sm font-medium text-gray-500">Compliance</p>
                <p className="text-3xl font-bold text-indigo-600">
                  {complianceStatus.filter((c) => c.status === "passed").length}/{complianceStatus.length}
                </p>
                <p className="text-xs text-gray-400">trainings passed</p>
              </div>
              <div className="rounded-xl bg-indigo-500 p-3 shadow-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Training Calendar + Compliance */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar */}
        <Card className="lg:col-span-2">
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
                {monthNames[currentMonth]} 2026
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

        {/* Compliance Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="h-5 w-5 text-indigo-600" />
              Compliance Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {complianceStatus.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-gray-100 p-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.training}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-500">
                        Expires: {item.expires}
                      </p>
                    </div>
                    <Badge
                      variant={
                        item.status === "passed"
                          ? "success"
                          : item.status === "failed"
                            ? "danger"
                            : item.status === "in-progress"
                              ? "warning"
                              : "secondary"
                      }
                      className="shrink-0 text-xs"
                    >
                      {item.status === "passed" && <CheckCircle2 className="mr-1 h-3 w-3" />}
                      {item.status === "failed" && <XCircle className="mr-1 h-3 w-3" />}
                      {item.status === "in-progress" && <Clock className="mr-1 h-3 w-3" />}
                      {item.status === "pending" && <AlertCircle className="mr-1 h-3 w-3" />}
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </Badge>
                  </div>
                  {item.score !== null && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Score</span>
                        <span
                          className={`font-semibold ${
                            item.score >= 80 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {item.score}%
                        </span>
                      </div>
                      <Progress
                        value={item.score}
                        className="mt-1 h-1.5"
                        color={item.score >= 80 ? "green" : "red"}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Mandatory + Assigned Courses */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Assigned Training Courses */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BookMarked className="h-5 w-5 text-indigo-600" />
                Assigned Training
              </CardTitle>
              <div className="flex items-center gap-2">
                {["all", "mandatory", "elective", "in-progress", "completed"].map(
                  (filter) => (
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
                  )
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredCourses.map((course) => (
                  <div
                    key={course.id}
                    className={`group rounded-xl border p-4 transition-all hover:shadow-md ${
                      course.status === "completed"
                        ? "border-green-200 bg-green-50/30"
                        : "border-gray-100 hover:border-indigo-200"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-lg ${
                          course.status === "completed"
                            ? "bg-gradient-to-br from-green-500 to-emerald-600"
                            : "bg-gradient-to-br from-indigo-500 to-purple-600"
                        } text-white`}
                      >
                        {course.status === "completed" ? (
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
                                {course.title}
                              </h4>
                              <Badge
                                variant={
                                  course.type === "mandatory" ? "danger" : "secondary"
                                }
                                className="text-[10px]"
                              >
                                {course.type}
                              </Badge>
                            </div>
                            <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {course.duration}
                              </span>
                              <span>·</span>
                              <span>{course.category}</span>
                              <span>·</span>
                              <span>Due: {course.dueDate}</span>
                            </div>
                          </div>
                          <Badge
                            variant={
                              course.status === "completed"
                                ? "success"
                                : course.progress > 0
                                  ? "warning"
                                  : "secondary"
                            }
                          >
                            {course.status === "completed"
                              ? "Completed"
                              : course.progress > 0
                                ? "In Progress"
                                : "Not Started"}
                          </Badge>
                        </div>
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">Progress</span>
                            <span className="font-medium text-gray-700">
                              {course.progress}%
                            </span>
                          </div>
                          <Progress
                            value={course.progress}
                            className="mt-1 h-2"
                            color={
                              course.status === "completed"
                                ? "green"
                                : course.progress > 50
                                  ? "default"
                                  : "blue"
                            }
                          />
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <p className="text-xs text-gray-400">
                            Last accessed: {course.lastAccessed}
                          </p>
                          <Link
                            href={`/courses/${course.id}/learn`}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-indigo-700 shadow-sm"
                          >
                            {course.status === "completed" ? (
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
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Mandatory */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertCircle className="h-5 w-5 text-rose-500" />
                Upcoming Mandatory
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingMandatory.map((course) => (
                  <div
                    key={course.id}
                    className="rounded-xl border border-gray-100 p-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-lg bg-rose-100 p-1.5">
                        <Timer className="h-4 w-4 text-rose-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {course.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          Due: {course.dueDate}
                        </p>
                        <div className="mt-2">
                          <Progress value={course.progress} className="h-1.5" color="blue" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Training Certificates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Award className="h-5 w-5 text-amber-500" />
                Training Certificates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {certificates.slice(0, 3).map((cert) => (
                  <div
                    key={cert.id}
                    className="flex items-center gap-3 rounded-xl border border-gray-100 p-3"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md">
                      <Medal className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {cert.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        Score: {cert.score}% · {cert.completedDate}
                      </p>
                    </div>
                    <button
                      className="shrink-0 rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-indigo-600"
                      onClick={() => {
                        const content = `Certificate of Completion\n\nThis certifies that ${user?.name || "User"} has successfully completed "${cert.title}" with a score of ${cert.score}%.\n\nCompleted: ${cert.completedDate}`;
                        const blob = new Blob([content], { type: "text/plain" });
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `${cert.title.replace(/\s+/g, "_")}_certificate.txt`;
                        document.body.appendChild(a);
                        a.click();
                        window.URL.revokeObjectURL(url);
                        a.remove();
                        toast.success("Certificate downloaded");
                      }}
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <Link
                  href="/dashboard/certificates"
                  className="flex items-center justify-center gap-1 rounded-lg border border-dashed border-gray-200 p-3 text-sm font-medium text-gray-500 transition-colors hover:border-indigo-300 hover:text-indigo-600"
                >
                  View All Certificates
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Training History */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-indigo-600" />
            Training History
          </CardTitle>
        </CardHeader>
        <CardContent>
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
                    Score
                  </th>
                  <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Certificate
                  </th>
                  <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {trainingHistory.map((item) => (
                  <tr key={item.id} className="transition-colors hover:bg-gray-50/50">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-100 text-green-600">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {item.title}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 text-sm text-gray-500">
                      {item.completedDate}
                    </td>
                    <td className="py-4">
                      <Badge
                        variant={item.score >= 80 ? "success" : "danger"}
                        className="text-xs"
                      >
                        {item.score}%
                      </Badge>
                    </td>
                    <td className="py-4">
                      {item.certificate ? (
                        <Badge variant="success" className="text-xs">
                          <Award className="mr-1 h-3 w-3" />
                          Earned
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          None
                        </Badge>
                      )}
                    </td>
                    <td className="py-4 text-right">
                      <button
                        className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-indigo-600"
                        onClick={() => {
                          const course = trainingCourses.find((c) => c.title === item.title);
                          if (course) setViewingTraining(course);
                          else {
                            toast(`Training: ${item.title}\nCompleted: ${item.completedDate}\nScore: ${item.score}%\nCertificate: ${item.certificate ? "Earned" : "Not available"}`, { icon: "ℹ️" });
                          }
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {viewingTraining && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">{viewingTraining.title}</h2>
              <button onClick={() => setViewingTraining(null)} className="rounded-sm opacity-70 hover:opacity-100">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-gray-500">Category</p>
                  <p className="font-medium">{viewingTraining.category}</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-gray-500">Type</p>
                  <p className="font-medium capitalize">{viewingTraining.type}</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-gray-500">Duration</p>
                  <p className="font-medium">{viewingTraining.duration}</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-gray-500">Due Date</p>
                  <p className="font-medium">{viewingTraining.dueDate}</p>
                </div>
              </div>
              <div className="rounded-lg bg-gray-50 p-3">
                <div className="flex items-center justify-between">
                  <p className="text-gray-500">Progress</p>
                  <p className="font-medium">{viewingTraining.progress}%</p>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                  <div
                    className={`h-2 rounded-full ${viewingTraining.status === "completed" ? "bg-green-500" : "bg-indigo-500"}`}
                    style={{ width: `${viewingTraining.progress}%` }}
                  />
                </div>
              </div>
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-gray-500">Last Accessed</p>
                <p className="font-medium">{viewingTraining.lastAccessed}</p>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="outline" onClick={() => setViewingTraining(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
