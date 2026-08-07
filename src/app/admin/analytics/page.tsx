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

interface AnalyticsMetrics {
  revenue: { value: string; change: number; trend: "up" | "down" };
  enrollments: { value: string; change: number; trend: "up" | "down" };
  completions: { value: string; change: number; trend: "up" | "down" };
  activeUsers: { value: string; change: number; trend: "up" | "down" };
}

const fallbackMetrics: AnalyticsMetrics = {
  revenue: { value: "₦80,000,000", change: 23.1, trend: "up" },
  enrollments: { value: "1,234", change: 18.2, trend: "up" },
  completions: { value: "856", change: 12.5, trend: "up" },
  activeUsers: { value: "4,321", change: -3.2, trend: "down" },
};

const topCoursesByRevenue = [
  { title: "Advanced React Patterns", revenue: "₦220,000,000", percentage: 28 },
  { title: "TypeScript Mastery", revenue: "₦140,000,000", percentage: 18 },
  { title: "Node.js Backend Development", revenue: "₦140,000,000", percentage: 17 },
  { title: "Python for Data Science", revenue: "₦128,000,000", percentage: 16 },
  { title: "UI/UX Design Fundamentals", revenue: "₦80,000,000", percentage: 10 },
];

const topCoursesByCompletions = [
  { title: "Advanced React Patterns", completions: 1245, rate: "53%" },
  { title: "TypeScript Mastery", completions: 987, rate: "52%" },
  { title: "Node.js Backend Development", completions: 876, rate: "53%" },
  { title: "Python for Data Science", completions: 765, rate: "53%" },
  { title: "UI/UX Design Fundamentals", completions: 654, rate: "54%" },
];

const geographicData = [
  { region: "North America", users: 4521, percentage: 35 },
  { region: "Europe", users: 3210, percentage: 25 },
  { region: "Asia Pacific", users: 2845, percentage: 22 },
  { region: "Latin America", users: 1284, percentage: 10 },
  { region: "Africa & Middle East", users: 985, percentage: 8 },
];

const engagementMetrics = [
  { label: "Avg. Session Duration", value: "24m 32s", icon: Clock, color: "bg-blue-500" },
  { label: "Avg. Completion Rate", value: "67%", icon: Target, color: "bg-emerald-500" },
  { label: "Avg. Quiz Score", value: "78%", icon: Award, color: "bg-purple-500" },
  { label: "Daily Active Users", value: "2,341", icon: Activity, color: "bg-orange-500" },
];

const metricCards = [
  { label: "Revenue", dataKey: "revenue" as const, icon: DollarSign, color: "bg-purple-500", prefix: "" },
  { label: "Enrollments", dataKey: "enrollments" as const, icon: Users, color: "bg-blue-500", prefix: "" },
  { label: "Completions", dataKey: "completions" as const, icon: Award, color: "bg-emerald-500", prefix: "" },
  { label: "Active Users", dataKey: "activeUsers" as const, icon: TrendingUp, color: "bg-orange-500", prefix: "" },
];

export default function AdminAnalyticsPage() {
  const [dateRange, setDateRange] = useState("30d");
  const [metrics, setMetrics] = useState<AnalyticsMetrics>(fallbackMetrics);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch(`/api/analytics/platform?range=${dateRange}`);
        if (res.ok) {
          const data = await res.json();
          setMetrics(data);
        }
      } catch {
        // Use fallback
      }
    }
    fetchAnalytics();
  }, [dateRange]);

  const handleExport = () => {
    console.log("Export analytics report");
  };

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
          const data = metrics[mc.dataKey];
          const isUp = data.trend === "up";
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
                  <span className="text-2xl font-bold text-gray-900">{data.value}</span>
                  <span className={`ml-2 inline-flex items-center text-sm font-medium ${
                    isUp ? "text-emerald-600" : "text-red-600"
                  }`}>
                    {isUp ? <ArrowUpRight className="mr-0.5 h-4 w-4" /> : <ArrowDownRight className="mr-0.5 h-4 w-4" />}
                    {isUp ? "+" : ""}{data.change}%
                  </span>
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
              {[30, 45, 35, 60, 50, 75, 55, 80, 65, 90, 70, 95].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-purple-500 to-purple-400 transition-all hover:from-purple-600 hover:to-purple-500"
                    style={{ height: `${h}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between text-xs text-gray-500">
              {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m) => (
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
              {[20, 35, 25, 50, 40, 65, 45, 70, 55, 80, 60, 85].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-blue-500 to-blue-400 transition-all hover:from-blue-600 hover:to-blue-500"
                    style={{ height: `${h}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between text-xs text-gray-500">
              {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m) => (
                <span key={m}>{m}</span>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Growth & Course Performance */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-48 items-end gap-2">
              {[10, 25, 20, 40, 35, 55, 45, 65, 50, 75, 60, 80].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-emerald-500 to-emerald-400 transition-all hover:from-emerald-600 hover:to-emerald-500"
                    style={{ height: `${h}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between text-xs text-gray-500">
              {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m) => (
                <span key={m}>{m}</span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Courses by Completions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCoursesByCompletions.map((course, index) => (
                <div key={course.title} className="flex items-center gap-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-600">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900">{course.title}</p>
                    <p className="text-xs text-gray-500">{course.completions.toLocaleString()} completions</p>
                  </div>
                  <span className="text-sm font-semibold text-emerald-600">{course.rate}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Geographic Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Geographic Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {geographicData.map((region) => (
              <div key={region.region} className="flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">{region.region}</p>
                    <span className="text-sm text-gray-600">{region.users.toLocaleString()} users</span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                      style={{ width: `${region.percentage}%` }}
                    />
                  </div>
                </div>
                <span className="w-12 text-right text-sm font-semibold text-gray-900">{region.percentage}%</span>
              </div>
            ))}
          </div>
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
                    <p className="text-xl font-bold text-gray-900">{metric.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Courses by Revenue */}
      <Card>
        <CardHeader>
          <CardTitle>Top Courses by Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topCoursesByRevenue.map((course, index) => (
              <div key={course.title} className="flex items-center gap-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-sm font-bold text-purple-600">
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="truncate text-sm font-medium text-gray-900">{course.title}</p>
                    <span className="ml-4 text-sm font-semibold text-gray-900">{course.revenue}</span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 to-purple-400"
                      style={{ width: `${course.percentage}%` }}
                    />
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
