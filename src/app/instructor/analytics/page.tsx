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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

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
  topCourses: Array<{ id: string; title: string; totalStudents: number; rating?: number; price?: number; _count: { enrollments: number } }>;
  engagementMetrics: { avgSessionDuration: string; avgCompletionRate: string; dailyActiveUsers: number };
}

export default function InstructorAnalyticsPage() {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "all">("month");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="mt-1 text-gray-600">Insights into your courses and student engagement</p>
        </div>
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
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Students</p>
                <p className="mt-1 text-3xl font-bold text-gray-900">{loading ? "—" : (data?.totalStudents || 0).toLocaleString()}</p>
                <div className="mt-1 flex items-center gap-1 text-xs text-emerald-600">
                  <ArrowUpRight className="h-3 w-3" />
                  {(data?.enrollmentGrowth || 0) >= 0 ? "+" : ""}{data?.enrollmentGrowth || 0}% from last period
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
                <p className="mt-1 text-3xl font-bold text-gray-900">{loading ? "—" : `${Math.round(data?.completionRate || 0)}%`}</p>
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
                <p className="mt-1 text-3xl font-bold text-gray-900">{loading ? "—" : (data?.totalCourses || 0)}</p>
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
                  {(data?.revenueGrowth || 0) >= 0 ? "+" : ""}{data?.revenueGrowth || 0}% from last period
                </div>
              </div>
              <div className="rounded-xl bg-rose-500 p-3">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
