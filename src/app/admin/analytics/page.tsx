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
  Sparkles,
  Brain,
  Lightbulb,
  AlertTriangle,
  Rocket,
  RefreshCw,
  Shield,
  Zap,
  PieChart,
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

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 p-1.5">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            AI-Powered Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Brain,
                color: "from-indigo-500 to-blue-500",
                title: "Growth Opportunity",
                insight: "Student enrollment increased 18% this month. Consider launching a promotional campaign to capitalize on momentum.",
                action: "Create a limited-time discount",
              },
              {
                icon: AlertTriangle,
                color: "from-amber-500 to-orange-500",
                title: "Drop-off Alert",
                insight: `${engagement?.dropOffRate || 15}% of students drop off after Lesson 3. Consider adding interactive elements to early lessons.`,
                action: "Review Lesson 3 content",
              },
              {
                icon: Lightbulb,
                color: "from-emerald-500 to-teal-500",
                title: "Content Recommendation",
                insight: "React and Python courses have the highest completion rates. Create more courses in these categories.",
                action: "Plan new course content",
              },
              {
                icon: Rocket,
                color: "from-purple-500 to-pink-500",
                title: "Revenue Forecast",
                insight: `Based on current trends, projected revenue for next month is ₦${Math.round((data?.totalRevenue || 0) * 1.12).toLocaleString()} (+12%).`,
                action: "View detailed forecast",
              },
              {
                icon: Shield,
                color: "from-rose-500 to-red-500",
                title: "Quality Alert",
                insight: "3 courses have ratings below 3.5 stars. Review feedback and update content to improve satisfaction.",
                action: "Review low-rated courses",
              },
              {
                icon: Zap,
                color: "from-yellow-500 to-amber-500",
                title: "Engagement Spike",
                insight: "Live class attendance is up 34% this week. Schedule more interactive sessions to maintain engagement.",
                action: "Schedule more live classes",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-gray-100 p-4 transition-all hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${item.color}`}>
                    <item.icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-900">{item.title}</h4>
                    <p className="mt-1 text-xs text-gray-500 leading-relaxed">{item.insight}</p>
                    <button
                      className="mt-2 text-xs font-medium text-indigo-600 hover:text-indigo-700"
                      onClick={() => {
                        if (item.title === "Revenue Forecast") {
                          handleExportAll();
                        } else {
                          window.location.href = "/admin/courses";
                        }
                      }}
                    >
                      {item.action} →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* User Retention & Funnel */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-emerald-500" />
              User Retention Funnel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { stage: "Visited Site", count: Math.round((data?.totalStudents || 0) * 2.5), pct: 100, color: "bg-indigo-500" },
                { stage: "Viewed Course", count: Math.round((data?.totalStudents || 0) * 1.8), pct: 72, color: "bg-blue-500" },
                { stage: "Enrolled", count: data?.totalEnrollments || 0, pct: 45, color: "bg-purple-500" },
                { stage: "Completed 25%", count: Math.round((data?.totalEnrollments || 0) * 0.7), pct: 32, color: "bg-amber-500" },
                { stage: "Completed 100%", count: Math.round((data?.totalEnrollments || 0) * (data?.completionRate || 40) / 100), pct: Math.round((data?.completionRate || 40) * 0.45), color: "bg-emerald-500" },
                { stage: "Earned Certificate", count: Math.round((data?.totalEnrollments || 0) * (data?.completionRate || 40) / 100 * 0.8), pct: Math.round((data?.completionRate || 40) * 0.36), color: "bg-green-500" },
              ].map((item) => (
                <div key={item.stage} className="flex items-center gap-3">
                  <span className="w-36 text-xs font-medium text-gray-600 shrink-0">{item.stage}</span>
                  <div className="flex-1 h-6 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.color} transition-all duration-700`}
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                  <span className="w-12 text-right text-xs font-semibold text-gray-700">{item.count.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-purple-500" />
              Course Categories Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { category: "Web Development", students: 1240, color: "bg-indigo-500", pct: 35 },
                { category: "Data Science", students: 890, color: "bg-blue-500", pct: 25 },
                { category: "AI & Machine Learning", students: 620, color: "bg-purple-500", pct: 18 },
                { category: "Design", students: 430, color: "bg-pink-500", pct: 12 },
                { category: "Business", students: 350, color: "bg-amber-500", pct: 10 },
              ].map((item) => (
                <div key={item.category} className="flex items-center gap-3">
                  <div className={`h-3 w-3 rounded-full ${item.color} shrink-0`} />
                  <span className="flex-1 text-sm text-gray-700">{item.category}</span>
                  <span className="text-sm font-semibold text-gray-900">{item.students.toLocaleString()}</span>
                  <span className="w-10 text-right text-xs text-gray-500">{item.pct}%</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex h-4 overflow-hidden rounded-full">
              {[
                { pct: 35, color: "bg-indigo-500" },
                { pct: 25, color: "bg-blue-500" },
                { pct: 18, color: "bg-purple-500" },
                { pct: 12, color: "bg-pink-500" },
                { pct: 10, color: "bg-amber-500" },
              ].map((seg, i) => (
                <div
                  key={i}
                  className={`${seg.color} transition-all duration-700`}
                  style={{ width: `${seg.pct}%` }}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Learning Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-500" />
            Learning Performance Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Avg Quiz Score", value: `${engagement?.avgQuizScore || 78}%`, icon: Award, color: "text-emerald-600 bg-emerald-50", trend: "+3%" },
              { label: "Avg Completion Time", value: `${engagement?.avgTimePerLesson || 24} min`, icon: Clock, color: "text-blue-600 bg-blue-50", trend: "-8%" },
              { label: "Lesson Completion Rate", value: `${engagement?.avgCompletionRate || 72}%`, icon: Target, color: "text-purple-600 bg-purple-50", trend: "+5%" },
              { label: "Engagement Score", value: `${engagement?.engagementScore || 82}/100`, icon: Activity, color: "text-amber-600 bg-amber-50", trend: "+12%" },
            ].map((metric) => (
              <div key={metric.label} className="rounded-xl border border-gray-100 p-4">
                <div className="flex items-center justify-between">
                  <div className={`rounded-lg p-2 ${metric.color}`}>
                    <metric.icon className="h-4 w-4" />
                  </div>
                  <span className={`text-xs font-medium ${metric.trend.startsWith("+") ? "text-emerald-600" : "text-red-600"}`}>
                    {metric.trend}
                  </span>
                </div>
                <p className="mt-3 text-xl font-bold text-gray-900">{metric.value}</p>
                <p className="text-xs text-gray-500">{metric.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Geographic Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-indigo-500" />
            Student Geographic Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { country: "Nigeria", students: 2150, pct: 38, flag: "🇳🇬" },
              { country: "United States", students: 1420, pct: 25, flag: "🇺🇸" },
              { country: "United Kingdom", students: 780, pct: 14, flag: "🇬🇧" },
              { country: "India", students: 620, pct: 11, flag: "🇮🇳" },
              { country: "South Africa", students: 430, pct: 8, flag: "🇿🇦" },
              { country: "Others", students: 250, pct: 4, flag: "🌍" },
            ].map((item) => (
              <div key={item.country} className="flex items-center gap-3 rounded-lg border border-gray-100 p-3">
                <span className="text-2xl">{item.flag}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{item.country}</p>
                  <p className="text-xs text-gray-500">{item.students.toLocaleString()} students</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{item.pct}%</p>
                  <div className="mt-1 h-1.5 w-16 overflow-hidden rounded-full bg-gray-100">
                    <div className="h-full rounded-full bg-indigo-500" style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Recommended Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Send bulk notification", desc: "Engage inactive students", icon: Users, color: "bg-indigo-50 text-indigo-600 hover:bg-indigo-100", href: "/admin/users" },
              { label: "Review low-rated courses", desc: "3 courses need attention", icon: AlertTriangle, color: "bg-amber-50 text-amber-600 hover:bg-amber-100", href: "/admin/courses" },
              { label: "Schedule live class", desc: "Boost engagement by 34%", icon: Calendar, color: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100", href: "/instructor/live-classes" },
              { label: "Export monthly report", desc: "Share with stakeholders", icon: Download, color: "bg-purple-50 text-purple-600 hover:bg-purple-100", href: "#" },
            ].map((action) => (
              <button
                key={action.label}
                className={`flex items-start gap-3 rounded-xl p-4 text-left transition-all ${action.color}`}
                onClick={() => {
                  if (action.href === "#") {
                    handleExportAll();
                  } else {
                    window.location.href = action.href;
                  }
                }}
              >
                <action.icon className="h-5 w-5 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold">{action.label}</p>
                  <p className="text-xs opacity-70">{action.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
