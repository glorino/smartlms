"use client";

import { useState } from "react";
import {
  Calendar,
  TrendingUp,
  DollarSign,
  Users,
  Award,
  Download,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import Sidebar from "@/components/layout/sidebar";

const metrics = [
  {
    title: "Revenue",
    value: "$84,254",
    change: "+23.1%",
    trend: "up" as const,
    icon: DollarSign,
    color: "bg-purple-500",
  },
  {
    title: "Enrollments",
    value: "1,234",
    change: "+18.2%",
    trend: "up" as const,
    icon: Users,
    color: "bg-blue-500",
  },
  {
    title: "Completions",
    value: "856",
    change: "+12.5%",
    trend: "up" as const,
    icon: Award,
    color: "bg-emerald-500",
  },
  {
    title: "Active Users",
    value: "4,321",
    change: "-3.2%",
    trend: "down" as const,
    icon: TrendingUp,
    color: "bg-orange-500",
  },
];

const topCoursesByRevenue = [
  { title: "Advanced React Patterns", revenue: "$231,759", percentage: 28 },
  { title: "TypeScript Mastery", revenue: "$148,204", percentage: 18 },
  { title: "Node.js Backend Development", revenue: "$147,206", percentage: 17 },
  { title: "Python for Data Science", revenue: "$134,608", percentage: 16 },
  { title: "UI/UX Design Fundamentals", revenue: "$83,490", percentage: 10 },
];

const topCoursesByCompletions = [
  { title: "Advanced React Patterns", completions: 1245, rate: "53%" },
  { title: "TypeScript Mastery", completions: 987, rate: "52%" },
  { title: "Node.js Backend Development", completions: 876, rate: "53%" },
  { title: "Python for Data Science", completions: 765, rate: "53%" },
  { title: "UI/UX Design Fundamentals", completions: 654, rate: "54%" },
];

export default function AdminAnalyticsPage() {
  const [dateRange, setDateRange] = useState("30d");

  const handleExport = () => {
    console.log("Export analytics report");
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-800">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Analytics</h1>
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            <Download className="h-4 w-4" />
            Export Report
          </button>
        </div>

        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Date Range Picker */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Date Range:</span>
              </div>
              <div className="flex rounded-lg border border-gray-300 dark:border-gray-600">
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
                        ? "bg-blue-500 text-white"
                        : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {metrics.map((metric) => (
                <div
                  key={metric.title}
                  className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {metric.title}
                    </span>
                    <div className={`rounded-lg p-2 ${metric.color} bg-opacity-10`}>
                      <metric.icon className={`h-5 w-5 ${metric.color.replace("bg-", "text-")}`} />
                    </div>
                  </div>
                  <div className="mt-3">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {metric.value}
                    </span>
                    <span
                      className={`ml-2 inline-flex items-center text-sm font-medium ${
                        metric.trend === "up" ? "text-emerald-600" : "text-red-600"
                      }`}
                    >
                      {metric.trend === "up" ? (
                        <ArrowUpRight className="mr-0.5 h-4 w-4" />
                      ) : (
                        <ArrowDownRight className="mr-0.5 h-4 w-4" />
                      )}
                      {metric.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Revenue Trend Chart */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                  Revenue Trend
                </h2>
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
                <div className="mt-4 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m) => (
                    <span key={m}>{m}</span>
                  ))}
                </div>
              </div>

              {/* Enrollment Trend Chart */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                  Enrollment Trend
                </h2>
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
                <div className="mt-4 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m) => (
                    <span key={m}>{m}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* User Growth Chart */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                  User Growth
                </h2>
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
                <div className="mt-4 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m) => (
                    <span key={m}>{m}</span>
                  ))}
                </div>
              </div>

              {/* Top Courses by Completions */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                  Top Courses by Completions
                </h2>
                <div className="space-y-4">
                  {topCoursesByCompletions.map((course, index) => (
                    <div key={course.title} className="flex items-center gap-4">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-600 dark:bg-emerald-900 dark:text-emerald-400">
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                          {course.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {course.completions.toLocaleString()} completions
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                        {course.rate}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Courses by Revenue */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Top Courses by Revenue
              </h2>
              <div className="space-y-4">
                {topCoursesByRevenue.map((course, index) => (
                  <div key={course.title} className="flex items-center gap-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-sm font-bold text-purple-600 dark:bg-purple-900 dark:text-purple-400">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                          {course.title}
                        </p>
                        <span className="ml-4 text-sm font-semibold text-gray-900 dark:text-white">
                          {course.revenue}
                        </span>
                      </div>
                      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-purple-500 to-purple-400"
                          style={{ width: `${course.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
