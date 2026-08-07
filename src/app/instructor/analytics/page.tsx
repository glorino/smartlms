"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  Users,
  BookOpen,
  DollarSign,
  BarChart3,
  Clock,
  Eye,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Award,
  PieChart,
  Activity,
  Download,
  FileText,
  FileSpreadsheet,
  Search,
  Filter,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { exportToCSV, exportToPDF, type Column } from "@/lib/export";

interface CourseOption {
  id: string;
  title: string;
}

interface StudentRow {
  id: string;
  name: string;
  email: string;
  courseName: string;
  enrolledAt: string;
  progress: number;
  lastAccessed: string;
  avgQuizScore: number;
  status: string;
  isActive: boolean;
}

interface EngagementSummary {
  avgCompletionRate: number;
  avgQuizScore: number;
  avgTimePerLesson: number;
  engagementScore: number;
  dropOffRate: number;
}

interface RevenueCourseRow {
  courseId: string;
  courseName: string;
  revenue: number;
  totalSales: number;
  avgRevenuePerStudent: number;
}

interface CompletionByCourse {
  courseId: string;
  courseName: string;
  completionRate: number;
  totalEnrollments: number;
  completedEnrollments: number;
  avgTimeToComplete: number;
  avgTimeToCompleteFormatted: string;
  certificatesIssued: number;
  certificateIssuanceRate: number;
}

interface AnalyticsData {
  totalStudents: number;
  totalCourses: number;
  totalRevenue: number;
  totalEnrollments: number;
  activeUsers: number;
  userGrowth: number;
  enrollmentGrowth: number;
  revenueGrowth: number;
  completionRate: number;
  monthlyRevenue: Record<string, number>;
  monthlyEnrollments: Record<string, number>;
  topCourses: Array<{
    id: string;
    title: string;
    totalStudents: number;
    rating?: number;
    price?: number;
    _count: { enrollments: number };
  }>;
  engagementMetrics: {
    avgSessionDuration: string;
    avgCompletionRate: string;
    dailyActiveUsers: number;
  };
}

export default function InstructorAnalyticsPage() {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "all">("month");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("all");
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [engagement, setEngagement] = useState<EngagementSummary | null>(null);
  const [engagementLoading, setEngagementLoading] = useState(false);
  const [revenueCourses, setRevenueCourses] = useState<RevenueCourseRow[]>([]);
  const [revenueMonthly, setRevenueMonthly] = useState<{ month: string; revenue: number; enrollments: number }[]>([]);
  const [revenueLoading, setRevenueLoading] = useState(false);
  const [completionByCourse, setCompletionByCourse] = useState<CompletionByCourse[]>([]);
  const [completionLoading, setCompletionLoading] = useState(false);
  const [studentSearch, setStudentSearch] = useState("");

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true);
      const rangeMap: Record<string, string> = { week: "7d", month: "30d", all: "1y" };
      try {
        const res = await fetch(`/api/analytics?range=${rangeMap[timeRange] || "30d"}`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch {
        // Use empty data
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, [timeRange]);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch("/api/courses?select=true");
        if (res.ok) {
          const json = await res.json();
          setCourses(json.courses || json || []);
        }
      } catch {
        // ignore
      }
    }
    fetchCourses();
  }, []);

  useEffect(() => {
    async function fetchDetailed() {
      const params = new URLSearchParams({ type: "students" });
      if (selectedCourseId !== "all") params.set("courseId", selectedCourseId);

      setStudentsLoading(true);
      setEngagementLoading(true);
      setRevenueLoading(true);
      setCompletionLoading(true);

      try {
        const [studentsRes, engagementRes, revenueRes, completionRes] = await Promise.all([
          fetch(`/api/analytics/detailed?${params}&type=students`),
          fetch(`/api/analytics/detailed?${params}&type=engagement`),
          fetch(`/api/analytics/detailed?${params}&type=revenue`),
          fetch(`/api/analytics/detailed?${params}&type=completion`),
        ]);

        if (studentsRes.ok) {
          const json = await studentsRes.json();
          setStudents(json.students || []);
        }
        if (engagementRes.ok) {
          const json = await engagementRes.json();
          setEngagement(json.summary || null);
        }
        if (revenueRes.ok) {
          const json = await revenueRes.json();
          setRevenueCourses(json.revenuePerCourse || []);
          setRevenueMonthly(json.monthlyRevenue || []);
        }
        if (completionRes.ok) {
          const json = await completionRes.json();
          setCompletionByCourse(json.completionByCourse || []);
        }
      } catch {
        // ignore
      } finally {
        setStudentsLoading(false);
        setEngagementLoading(false);
        setRevenueLoading(false);
        setCompletionLoading(false);
      }
    }
    fetchDetailed();
  }, [selectedCourseId]);

  const handleExportAll = () => {
    const allData = {
      summary: data,
      students,
      engagement,
      revenueCourses,
      revenueMonthly,
      completionByCourse,
    };
    const content = JSON.stringify(allData, null, 2);
    const blob = new Blob([content], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `instructor-analytics-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportStudentsCSV = () => {
    const columns: Column<StudentRow>[] = [
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "courseName", label: "Course" },
      {
        key: "enrolledAt",
        label: "Enrolled Date",
        format: (v) =>
          v
            ? new Date(v).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "—",
      },
      { key: "progress", label: "Progress (%)", format: (v) => `${v}%` },
      { key: "avgQuizScore", label: "Avg Quiz Score (%)", format: (v) => `${v}%` },
      { key: "status", label: "Status" },
    ];
    exportToCSV(filteredStudents, columns, `students-report-${Date.now()}`);
  };

  const handleExportStudentsPDF = () => {
    const columns: Column<StudentRow>[] = [
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "courseName", label: "Course" },
      {
        key: "enrolledAt",
        label: "Enrolled Date",
        format: (v) =>
          v
            ? new Date(v).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "—",
      },
      { key: "progress", label: "Progress (%)", format: (v) => `${v}%` },
      { key: "avgQuizScore", label: "Avg Quiz Score (%)", format: (v) => `${v}%` },
      { key: "status", label: "Status" },
    ];
    exportToPDF(filteredStudents, columns, "Students Report", `students-report-${Date.now()}`);
  };

  const handleExportRevenueCSV = () => {
    const columns: Column<RevenueCourseRow>[] = [
      { key: "courseName", label: "Course" },
      { key: "totalSales", label: "Total Sales" },
      {
        key: "revenue",
        label: "Revenue (₦)",
        format: (v) => `₦${Math.round(v).toLocaleString()}`,
      },
      {
        key: "avgRevenuePerStudent",
        label: "Avg/Student (₦)",
        format: (v) => `₦${v.toLocaleString()}`,
      },
    ];
    exportToCSV(revenueCourses, columns, `revenue-report-${Date.now()}`);
  };

  const handleExportRevenuePDF = () => {
    const columns: Column<RevenueCourseRow>[] = [
      { key: "courseName", label: "Course" },
      { key: "totalSales", label: "Total Sales" },
      {
        key: "revenue",
        label: "Revenue (₦)",
        format: (v) => `₦${Math.round(v).toLocaleString()}`,
      },
      {
        key: "avgRevenuePerStudent",
        label: "Avg/Student (₦)",
        format: (v) => `₦${v.toLocaleString()}`,
      },
    ];
    exportToPDF(revenueCourses, columns, "Revenue Report", `revenue-report-${Date.now()}`);
  };

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const engagementData = [
    { day: "Mon", hours: 42 },
    { day: "Tue", hours: 38 },
    { day: "Wed", hours: 55 },
    { day: "Thu", hours: 31 },
    { day: "Fri", hours: 48 },
    { day: "Sat", hours: 62 },
    { day: "Sun", hours: 35 },
  ];

  const enrollmentData = months.map((m, i) => {
    const key = `2026-${String(i + 1).padStart(2, "0")}`;
    return { month: m, enrollments: data?.monthlyEnrollments?.[key] || 0 };
  });

  const maxEngagement = Math.max(...engagementData.map((d) => d.hours));
  const maxEnrollments = Math.max(...enrollmentData.map((e) => e.enrollments), 1);

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.email.toLowerCase().includes(studentSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="mt-1 text-gray-600">Insights into your courses and student engagement</p>
        </div>
        <div className="flex gap-2">
          <div className="flex gap-1 rounded-lg border border-gray-200 bg-white p-1">
            {(["week", "month", "all"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
                  timeRange === range
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {range === "all" ? "All Time" : `This ${range}`}
              </button>
            ))}
          </div>
          <button
            onClick={handleExportAll}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Download className="h-4 w-4" />
            Export All
          </button>
        </div>
      </div>

      {/* Course Filter */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">Filter by Course:</span>
        </div>
        <select
          value={selectedCourseId}
          onChange={(e) => setSelectedCourseId(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value="all">All My Courses</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Students</p>
                <p className="mt-1 text-3xl font-bold text-gray-900">
                  {loading ? "—" : (data?.totalStudents || 0).toLocaleString()}
                </p>
                <div className="mt-1 flex items-center gap-1 text-xs text-emerald-600">
                  <ArrowUpRight className="h-3 w-3" />
                  {(data?.enrollmentGrowth || 0) >= 0 ? "+" : ""}
                  {data?.enrollmentGrowth || 0}% from last period
                </div>
              </div>
              <div className="rounded-xl bg-blue-500 p-3">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Completion Rate</p>
                <p className="mt-1 text-3xl font-bold text-gray-900">
                  {loading ? "—" : `${Math.round(data?.completionRate || 0)}%`}
                </p>
                <div className="mt-1 flex items-center gap-1 text-xs text-emerald-600">
                  <ArrowUpRight className="h-3 w-3" />
                  {data?.engagementMetrics?.avgCompletionRate || "—"}
                </div>
              </div>
              <div className="rounded-xl bg-emerald-500 p-3">
                <Target className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Courses</p>
                <p className="mt-1 text-3xl font-bold text-gray-900">
                  {loading ? "—" : (data?.totalCourses || 0)}
                </p>
                <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                  Published courses
                </div>
              </div>
              <div className="rounded-xl bg-amber-500 p-3">
                <Star className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <p className="mt-1 text-3xl font-bold text-gray-900">
                  {loading ? "—" : `₦${(data?.totalRevenue || 0).toLocaleString()}`}
                </p>
                <div className="mt-1 flex items-center gap-1 text-xs text-emerald-600">
                  <ArrowUpRight className="h-3 w-3" />
                  {(data?.revenueGrowth || 0) >= 0 ? "+" : ""}
                  {data?.revenueGrowth || 0}% from last period
                </div>
              </div>
              <div className="rounded-xl bg-rose-500 p-3">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              Engagement Metrics
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {engagementLoading ? (
            <div className="flex justify-center py-8 text-gray-400">Loading engagement data...</div>
          ) : engagement ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <div className="rounded-xl border border-gray-100 p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-emerald-500 p-2">
                    <Target className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Completion Rate</p>
                    <p className="text-xl font-bold text-gray-900">{engagement.avgCompletionRate}%</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-gray-100 p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-500 p-2">
                    <Award className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Avg Quiz Score</p>
                    <p className="text-xl font-bold text-gray-900">{engagement.avgQuizScore}%</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-gray-100 p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-amber-500 p-2">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Avg Time/Lesson</p>
                    <p className="text-xl font-bold text-gray-900">{engagement.avgTimePerLesson}m</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-gray-100 p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-purple-500 p-2">
                    <Activity className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Engagement Score</p>
                    <p className="text-xl font-bold text-gray-900">{engagement.engagementScore}/100</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-gray-100 p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-red-500 p-2">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Drop-off Rate</p>
                    <p className="text-xl font-bold text-gray-900">{engagement.dropOffRate}%</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center py-8 text-gray-400">No engagement data available</div>
          )}
        </CardContent>
      </Card>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              Student Engagement
            </CardTitle>
            <CardDescription>Average daily learning hours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-3 h-48">
              {engagementData.map((day) => (
                <div key={day.day} className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-xs font-medium text-gray-600">{day.hours}h</span>
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-indigo-500 to-indigo-400 transition-all duration-300"
                    style={{ height: `${(day.hours / maxEngagement) * 140}px` }}
                  />
                  <span className="text-xs text-gray-500">{day.day}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-500" />
              Enrollment Trends
            </CardTitle>
            <CardDescription>New enrollments over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-3 h-48">
              {enrollmentData.map((item) => (
                <div key={item.month} className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-xs font-medium text-gray-600">{item.enrollments}</span>
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-emerald-500 to-emerald-400 transition-all duration-300"
                    style={{ height: `${(item.enrollments / maxEnrollments) * 140}px` }}
                  />
                  <span className="text-xs text-gray-500">{item.month}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-purple-500" />
              Revenue Breakdown
            </span>
            {revenueCourses.length > 0 && (
              <div className="flex gap-1">
                <button
                  onClick={handleExportRevenueCSV}
                  className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                >
                  <FileSpreadsheet className="h-3.5 w-3.5" />
                  CSV
                </button>
                <button
                  onClick={handleExportRevenuePDF}
                  className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                >
                  <FileText className="h-3.5 w-3.5" />
                  PDF
                </button>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {revenueLoading ? (
            <div className="flex justify-center py-8 text-gray-400">Loading revenue data...</div>
          ) : revenueCourses.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Course</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-500">Sales</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-500">Revenue</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-500">Avg/Student</th>
                  </tr>
                </thead>
                <tbody>
                  {revenueCourses.map((row) => (
                    <tr key={row.courseId} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{row.courseName}</td>
                      <td className="px-4 py-3 text-right text-gray-700">{row.totalSales}</td>
                      <td className="px-4 py-3 text-right font-medium text-gray-900">
                        ₦{Math.round(row.revenue).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-700">
                        ₦{row.avgRevenuePerStudent.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex justify-center py-8 text-gray-400">No revenue data available</div>
          )}
        </CardContent>
      </Card>

      {/* Completion Rates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-emerald-500" />
            Completion Rates
          </CardTitle>
          <CardDescription>Course completion and certification data</CardDescription>
        </CardHeader>
        <CardContent>
          {completionLoading ? (
            <div className="flex justify-center py-8 text-gray-400">Loading completion data...</div>
          ) : completionByCourse.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Course</th>
                    <th className="px-4 py-3 text-center font-medium text-gray-500">Enrolled</th>
                    <th className="px-4 py-3 text-center font-medium text-gray-500">Completed</th>
                    <th className="px-4 py-3 text-center font-medium text-gray-500">Rate</th>
                    <th className="px-4 py-3 text-center font-medium text-gray-500">Avg Time</th>
                    <th className="px-4 py-3 text-center font-medium text-gray-500">Certificates</th>
                  </tr>
                </thead>
                <tbody>
                  {completionByCourse.map((row) => (
                    <tr key={row.courseId} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{row.courseName}</td>
                      <td className="px-4 py-3 text-center text-gray-700">{row.totalEnrollments}</td>
                      <td className="px-4 py-3 text-center text-gray-700">{row.completedEnrollments}</td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                            row.completionRate >= 70
                              ? "bg-emerald-100 text-emerald-700"
                              : row.completionRate >= 40
                              ? "bg-amber-100 text-amber-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {row.completionRate}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-gray-700">
                        {row.avgTimeToCompleteFormatted}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-sm font-medium text-gray-900">
                          {row.certificatesIssued}
                        </span>
                        <span className="text-xs text-gray-500 ml-1">
                          ({row.certificateIssuanceRate}%)
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex justify-center py-8 text-gray-400">No completion data available</div>
          )}
        </CardContent>
      </Card>

      {/* Student List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              Student List
              <span className="text-sm font-normal text-gray-400">
                ({filteredStudents.length} students)
              </span>
            </span>
            {students.length > 0 && (
              <div className="flex gap-1">
                <button
                  onClick={handleExportStudentsCSV}
                  className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                >
                  <FileSpreadsheet className="h-3.5 w-3.5" />
                  CSV
                </button>
                <button
                  onClick={handleExportStudentsPDF}
                  className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                >
                  <FileText className="h-3.5 w-3.5" />
                  PDF
                </button>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search students by name or email..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {studentsLoading ? (
            <div className="flex justify-center py-8 text-gray-400">Loading student data...</div>
          ) : filteredStudents.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Student</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Course</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Enrolled</th>
                    <th className="px-4 py-3 text-center font-medium text-gray-500">Progress</th>
                    <th className="px-4 py-3 text-center font-medium text-gray-500">Quiz Avg</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Last Accessed</th>
                    <th className="px-4 py-3 text-center font-medium text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr
                      key={student.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-gray-900">{student.name}</p>
                          <p className="text-xs text-gray-500">{student.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{student.courseName}</td>
                      <td className="px-4 py-3 text-gray-700">
                        {new Date(student.enrolledAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-2 flex-1 rounded-full bg-gray-200">
                            <div
                              className="h-full rounded-full bg-indigo-500"
                              style={{ width: `${student.progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-600">{student.progress}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center text-gray-700">
                        {student.avgQuizScore}%
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {student.lastAccessed && student.lastAccessed !== "Never"
                          ? new Date(student.lastAccessed).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })
                          : "Never"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                            student.status === "COMPLETED"
                              ? "bg-emerald-100 text-emerald-700"
                              : student.status === "ACTIVE"
                              ? "bg-blue-100 text-blue-700"
                              : student.status === "EXPIRED"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {student.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex justify-center py-8 text-gray-400">
              {studentSearch
                ? "No students match your search"
                : "No student data available"}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top Performing Courses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-amber-500" />
            Top Performing Courses
          </CardTitle>
          <CardDescription>Your courses ranked by performance</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8 text-gray-400">Loading...</div>
          ) : !data?.topCourses?.length ? (
            <div className="flex justify-center py-8 text-gray-400">No course data</div>
          ) : (
            <div className="space-y-4">
              {data.topCourses.map((course, idx) => (
                <div
                  key={course.id}
                  className="flex items-center gap-4 rounded-lg border border-gray-200 p-4"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                    #{idx + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{course.title}</h3>
                    </div>
                    <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {course.totalStudents || course._count.enrollments}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        {course.rating || "N/A"}
                      </span>
                    </div>
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
