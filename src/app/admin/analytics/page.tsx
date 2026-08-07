"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  TrendingUp,
  DollarSign,
  Users,
  Award,
  Download,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Globe,
  Activity,
  Clock,
  Target,
  FileText,
  FileSpreadsheet,
  Filter,
  Search,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

interface MonthlyRevenueRow {
  month: string;
  revenue: number;
  enrollments: number;
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
    _count: { enrollments: number };
  }>;
  recentActivity: Array<{
    type: string;
    title: string;
    description: string;
    time: string;
  }>;
  engagementMetrics: {
    avgSessionDuration: string;
    avgCompletionRate: string;
    dailyActiveUsers: number;
  };
}

export default function AdminAnalyticsPage() {
  const [dateRange, setDateRange] = useState("30d");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("all");
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [engagement, setEngagement] = useState<EngagementSummary | null>(null);
  const [engagementLoading, setEngagementLoading] = useState(false);
  const [revenueCourses, setRevenueCourses] = useState<RevenueCourseRow[]>([]);
  const [revenueMonthly, setRevenueMonthly] = useState<MonthlyRevenueRow[]>([]);
  const [revenueLoading, setRevenueLoading] = useState(false);
  const [studentSearch, setStudentSearch] = useState("");

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true);
      try {
        const res = await fetch(`/api/analytics?range=${dateRange}`);
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
  }, [dateRange]);

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

      try {
        const [studentsRes, engagementRes, revenueRes] = await Promise.all([
          fetch(`/api/analytics/detailed?${params}&type=students`),
          fetch(`/api/analytics/detailed?${params}&type=engagement`),
          fetch(`/api/analytics/detailed?${params}&type=revenue`),
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
      } catch {
        // ignore
      } finally {
        setStudentsLoading(false);
        setEngagementLoading(false);
        setRevenueLoading(false);
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
    };
    const content = JSON.stringify(allData, null, 2);
    const blob = new Blob([content], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `analytics-report-${new Date().toISOString().slice(0, 10)}.json`;
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
      {
        key: "lastAccessed",
        label: "Last Accessed",
        format: (v) =>
          v && v !== "Never"
            ? new Date(v).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "Never",
      },
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

  const handleExportEngagementCSV = () => {
    if (!engagement) return;
    const data = [
      {
        metric: "Avg Completion Rate",
        value: `${engagement.avgCompletionRate}%`,
      },
      {
        metric: "Avg Quiz Score",
        value: `${engagement.avgQuizScore}%`,
      },
      {
        metric: "Avg Time Per Lesson",
        value: `${engagement.avgTimePerLesson} min`,
      },
      { metric: "Engagement Score", value: `${engagement.engagementScore}/100` },
      { metric: "Drop-off Rate", value: `${engagement.dropOffRate}%` },
    ];
    const columns: Column<(typeof data)[0]>[] = [
      { key: "metric", label: "Metric" },
      { key: "value", label: "Value" },
    ];
    exportToCSV(data, columns, `engagement-report-${Date.now()}`);
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

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  const revenueData = months.map((m, i) => {
    const key = `2026-${String(i + 1).padStart(2, "0")}`;
    return data?.monthlyRevenue?.[key] || 0;
  });

  const enrollmentData = months.map((m, i) => {
    const key = `2026-${String(i + 1).padStart(2, "0")}`;
    return data?.monthlyEnrollments?.[key] || 0;
  });

  const maxRevenue = Math.max(...revenueData, 1);
  const maxEnrollments = Math.max(...enrollmentData, 1);

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.email.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const metricCards = [
    {
      label: "Revenue",
      value: data ? `₦${data.totalRevenue.toLocaleString()}` : "—",
      change: data?.revenueGrowth || 0,
      trend: (data?.revenueGrowth || 0) >= 0 ? ("up" as const) : ("down" as const),
      icon: DollarSign,
      color: "bg-purple-500",
    },
    {
      label: "Enrollments",
      value: data?.totalEnrollments?.toLocaleString() || "—",
      change: data?.enrollmentGrowth || 0,
      trend: (data?.enrollmentGrowth || 0) >= 0 ? ("up" as const) : ("down" as const),
      icon: Users,
      color: "bg-blue-500",
    },
    {
      label: "Completion Rate",
      value: data ? `${Math.round(data.completionRate)}%` : "—",
      change: 0,
      trend: "up" as const,
      icon: Award,
      color: "bg-emerald-500",
    },
    {
      label: "Active Students",
      value: data?.activeUsers?.toLocaleString() || "—",
      change: data?.userGrowth || 0,
      trend: (data?.userGrowth || 0) >= 0 ? ("up" as const) : ("down" as const),
      icon: TrendingUp,
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="mt-1 text-gray-500">Platform performance and insights</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportAll}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Download className="h-4 w-4" />
            Export All
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">Date Range:</span>
        </div>
        <div className="flex rounded-lg border border-gray-300">
          {[
            { value: "7d", label: "7 Days" },
            { value: "30d", label: "30 Days" },
            { value: "90d", label: "90 Days" },
            { value: "1y", label: "1 Year" },
          ].map((range) => (
            <button
              key={range.value}
              onClick={() => setDateRange(range.value)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                dateRange === range.value
                  ? "bg-indigo-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>

        <div className="h-6 w-px bg-gray-300" />

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">Course:</span>
        </div>
        <select
          value={selectedCourseId}
          onChange={(e) => setSelectedCourseId(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value="all">All Courses</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metricCards.map((mc) => {
          const isUp = mc.trend === "up";
          return (
            <Card key={mc.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">
                    {mc.label}
                  </span>
                  <div className={`rounded-lg p-2 ${mc.color}`}>
                    <mc.icon className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-2xl font-bold text-gray-900">
                    {loading ? "—" : mc.value}
                  </span>
                  {!loading && mc.change !== 0 && (
                    <span
                      className={`ml-2 inline-flex items-center text-sm font-medium ${
                        isUp ? "text-emerald-600" : "text-red-600"
                      }`}
                    >
                      {isUp ? (
                        <ArrowUpRight className="mr-0.5 h-4 w-4" />
                      ) : (
                        <ArrowDownRight className="mr-0.5 h-4 w-4" />
                      )}
                      {isUp ? "+" : ""}
                      {mc.change}%
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Engagement Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              Engagement Metrics
            </span>
            {engagement && (
              <button
                onClick={handleExportEngagementCSV}
                className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
              >
                <FileSpreadsheet className="h-3.5 w-3.5" />
                Export CSV
              </button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {engagementLoading ? (
            <div className="flex justify-center py-8 text-gray-400">
              Loading engagement data...
            </div>
          ) : engagement ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <div className="rounded-xl border border-gray-100 p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-emerald-500 p-2">
                    <Target className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Completion Rate</p>
                    <p className="text-xl font-bold text-gray-900">
                      {engagement.avgCompletionRate}%
                    </p>
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
                    <p className="text-xl font-bold text-gray-900">
                      {engagement.avgQuizScore}%
                    </p>
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
                    <p className="text-xl font-bold text-gray-900">
                      {engagement.avgTimePerLesson}m
                    </p>
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
                    <p className="text-xl font-bold text-gray-900">
                      {engagement.engagementScore}/100
                    </p>
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
                    <p className="text-xl font-bold text-gray-900">
                      {engagement.dropOffRate}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center py-8 text-gray-400">
              No engagement data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-48 items-end gap-2">
              {revenueData.map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-purple-500 to-purple-400 transition-all hover:from-purple-600 hover:to-purple-500"
                    style={{
                      height: `${
                        maxRevenue > 0 ? (val / maxRevenue) * 100 : 0
                      }%`,
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between text-xs text-gray-500">
              {months.map((m) => (
                <span key={m}>{m}</span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Enrollment Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-48 items-end gap-2">
              {enrollmentData.map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-blue-500 to-blue-400 transition-all hover:from-blue-600 hover:to-blue-500"
                    style={{
                      height: `${
                        maxEnrollments > 0
                          ? (val / maxEnrollments) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between text-xs text-gray-500">
              {months.map((m) => (
                <span key={m}>{m}</span>
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
            <div className="flex justify-center py-8 text-gray-400">
              Loading revenue data...
            </div>
          ) : revenueCourses.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left font-medium text-gray-500">
                      Course
                    </th>
                    <th className="px-4 py-3 text-right font-medium text-gray-500">
                      Sales
                    </th>
                    <th className="px-4 py-3 text-right font-medium text-gray-500">
                      Revenue
                    </th>
                    <th className="px-4 py-3 text-right font-medium text-gray-500">
                      Avg/Student
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {revenueCourses.map((row) => (
                    <tr
                      key={row.courseId}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {row.courseName}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-700">
                        {row.totalSales}
                      </td>
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
            <div className="flex justify-center py-8 text-gray-400">
              No revenue data available
            </div>
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
            <div className="flex justify-center py-8 text-gray-400">
              Loading student data...
            </div>
          ) : filteredStudents.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left font-medium text-gray-500">
                      Student
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">
                      Course
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">
                      Enrolled
                    </th>
                    <th className="px-4 py-3 text-center font-medium text-gray-500">
                      Progress
                    </th>
                    <th className="px-4 py-3 text-center font-medium text-gray-500">
                      Quiz Avg
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">
                      Last Accessed
                    </th>
                    <th className="px-4 py-3 text-center font-medium text-gray-500">
                      Status
                    </th>
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
                          <p className="font-medium text-gray-900">
                            {student.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {student.email}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {student.courseName}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {new Date(student.enrolledAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-2 flex-1 rounded-full bg-gray-200">
                            <div
                              className="h-full rounded-full bg-indigo-500"
                              style={{ width: `${student.progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-600">
                            {student.progress}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center text-gray-700">
                        {student.avgQuizScore}%
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {student.lastAccessed &&
                        student.lastAccessed !== "Never"
                          ? new Date(
                              student.lastAccessed
                            ).toLocaleDateString("en-US", {
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

      {/* Top Courses */}
      <Card>
        <CardHeader>
          <CardTitle>Top Courses by Enrollments</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8 text-gray-400">
              Loading...
            </div>
          ) : !data?.topCourses?.length ? (
            <div className="flex justify-center py-8 text-gray-400">
              No course data
            </div>
          ) : (
            <div className="space-y-4">
              {data.topCourses.map((course, index) => (
                <div key={course.id} className="flex items-center gap-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-600">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {course.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {course._count.enrollments} enrollments
                    </p>
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
