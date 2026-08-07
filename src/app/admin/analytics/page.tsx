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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  topCourses: Array<{ id: string; title: string; totalStudents: number; _count: { enrollments: number } }>;
  recentActivity: Array<{ type: string; title: string; description: string; time: string }>;
  engagementMetrics: { avgSessionDuration: string; avgCompletionRate: string; dailyActiveUsers: number };
}

export default function AdminAnalyticsPage() {
  const [dateRange, setDateRange] = useState("30d");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

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

  const handleExport = () => {
    console.log("Export analytics report");
  };

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

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

  const metricCards = [
    { label: "Revenue", value: data ? `₦${data.totalRevenue.toLocaleString()}` : "—", change: data?.revenueGrowth || 0, trend: (data?.revenueGrowth || 0) >= 0 ? "up" as const : "down" as const, icon: DollarSign, color: "bg-purple-500" },
    { label: "Enrollments", value: data?.totalEnrollments?.toLocaleString() || "—", change: data?.enrollmentGrowth || 0, trend: (data?.enrollmentGrowth || 0) >= 0 ? "up" as const : "down" as const, icon: Users, color: "bg-blue-500" },
    { label: "Completion Rate", value: data ? `${Math.round(data.completionRate)}%` : "—", change: 0, trend: "up" as const, icon: Award, color: "bg-emerald-500" },
    { label: "Active Students", value: data?.activeUsers?.toLocaleString() || "—", change: data?.userGrowth || 0, trend: (data?.userGrowth || 0) >= 0 ? "up" as const : "down" as const, icon: TrendingUp, color: "bg-orange-500" },
  ];

  const engagementMetrics = [
    { label: "Avg. Session Duration", value: data?.engagementMetrics?.avgSessionDuration || "—", icon: Clock, color: "bg-blue-500" },
    { label: "Avg. Completion Rate", value: data?.engagementMetrics?.avgCompletionRate || "—", icon: Target, color: "bg-emerald-500" },
    { label: "Total Courses", value: data?.totalCourses?.toLocaleString() || "—", icon: Award, color: "bg-purple-500" },
    { label: "Daily Active Users", value: data?.engagementMetrics?.dailyActiveUsers?.toLocaleString() || "—", icon: Activity, color: "bg-orange-500" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="mt-1 text-gray-500">Platform performance and insights</p>
        </div>
        <button
          onClick={handleExport}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <Download className="h-4 w-4" />
          Export Report
        </button>
      </div>

      {/* Date Range Picker */}
      <div className="flex items-center gap-4">
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
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metricCards.map((mc) => {
          const isUp = mc.trend === "up";
          return (
            <Card key={mc.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">{mc.label}</span>
                  <div className={`rounded-lg p-2 ${mc.color}`}>
                    <mc.icon className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-2xl font-bold text-gray-900">{loading ? "—" : mc.value}</span>
                  {!loading && mc.change !== 0 && (
                    <span className={`ml-2 inline-flex items-center text-sm font-medium ${
                      isUp ? "text-emerald-600" : "text-red-600"
                    }`}>
                      {isUp ? <ArrowUpRight className="mr-0.5 h-4 w-4" /> : <ArrowDownRight className="mr-0.5 h-4 w-4" />}
                      {isUp ? "+" : ""}{mc.change}%
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

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
                    style={{ height: `${maxRevenue > 0 ? (val / maxRevenue) * 100 : 0}%` }}
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
                    style={{ height: `${maxEnrollments > 0 ? (val / maxEnrollments) * 100 : 0}%` }}
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

      {/* Top Courses */}
      <Card>
        <CardHeader>
          <CardTitle>Top Courses by Enrollments</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8 text-gray-400">Loading...</div>
          ) : !data?.topCourses?.length ? (
            <div className="flex justify-center py-8 text-gray-400">No course data</div>
          ) : (
            <div className="space-y-4">
              {data.topCourses.map((course, index) => (
                <div key={course.id} className="flex items-center gap-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-600">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900">{course.title}</p>
                    <p className="text-xs text-gray-500">{course._count.enrollments} enrollments</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Engagement Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Engagement Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {engagementMetrics.map((metric) => (
              <div key={metric.label} className="rounded-xl border border-gray-100 p-4">
                <div className="flex items-center gap-3">
                  <div className={`rounded-lg p-2 ${metric.color}`}>
                    <metric.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{metric.label}</p>
                    <p className="text-xl font-bold text-gray-900">{loading ? "—" : metric.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
