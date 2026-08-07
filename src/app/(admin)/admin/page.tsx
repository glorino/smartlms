"use client";

import {
  Users,
  BookOpen,
  DollarSign,
  TrendingUp,
  BarChart3,
  Activity,
  Plus,
  Settings,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Award,
} from "lucide-react";
import Link from "next/link";
import Sidebar from "@/components/layout/sidebar";

const stats = [
  {
    title: "Total Users",
    value: "12,845",
    change: "+12.5%",
    trend: "up" as const,
    icon: Users,
    color: "bg-blue-500",
  },
  {
    title: "Total Courses",
    value: "324",
    change: "+8.2%",
    trend: "up" as const,
    icon: BookOpen,
    color: "bg-emerald-500",
  },
  {
    title: "Total Revenue",
    value: "$84,254",
    change: "+23.1%",
    trend: "up" as const,
    icon: DollarSign,
    color: "bg-purple-500",
  },
  {
    title: "Active Enrollments",
    value: "8,432",
    change: "-2.4%",
    trend: "down" as const,
    icon: TrendingUp,
    color: "bg-orange-500",
  },
];

const recentEnrollments = [
  { id: 1, student: "Sarah Johnson", course: "Advanced React Patterns", date: "2026-08-05", amount: "$99" },
  { id: 2, student: "Mike Chen", course: "TypeScript Mastery", date: "2026-08-04", amount: "$79" },
  { id: 3, student: "Emily Davis", course: "Node.js Backend", date: "2026-08-04", amount: "$89" },
  { id: 4, student: "Alex Wilson", course: "UI/UX Design Fundamentals", date: "2026-08-03", amount: "$69" },
  { id: 5, student: "Jordan Lee", course: "Python for Data Science", date: "2026-08-03", amount: "$94" },
];

const topCourses = [
  { title: "Advanced React Patterns", students: 2341, revenue: "$231,759" },
  { title: "TypeScript Mastery", students: 1876, revenue: "$148,204" },
  { title: "Node.js Backend Development", students: 1654, revenue: "$147,206" },
  { title: "Python for Data Science", students: 1432, revenue: "$134,608" },
  { title: "UI/UX Design Fundamentals", students: 1210, revenue: "$83,490" },
];

const healthIndicators = [
  { name: "Server Uptime", status: "healthy", value: "99.98%" },
  { name: "API Response Time", status: "healthy", value: "124ms" },
  { name: "Database", status: "healthy", value: "Connected" },
  { name: "CDN", status: "warning", value: "High Load" },
  { name: "Storage", status: "healthy", value: "67% Used" },
];

const quickActions = [
  { label: "Create Course", href: "/admin/courses/new", icon: Plus, color: "bg-blue-500 hover:bg-blue-600" },
  { label: "Manage Users", href: "/admin/users", icon: Settings, color: "bg-purple-500 hover:bg-purple-600" },
  { label: "View Reports", href: "/admin/analytics", icon: BarChart3, color: "bg-emerald-500 hover:bg-emerald-600" },
];

export default function AdminDashboard() {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-800">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <div className="w-10" />
        </div>

        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Stats Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.title}
                  className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {stat.title}
                    </span>
                    <div className={`rounded-lg p-2 ${stat.color} bg-opacity-10`}>
                      <stat.icon className={`h-5 w-5 ${stat.color.replace("bg-", "text-")}`} />
                    </div>
                  </div>
                  <div className="mt-3">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </span>
                    <span
                      className={`ml-2 inline-flex items-center text-sm font-medium ${
                        stat.trend === "up" ? "text-emerald-600" : "text-red-600"
                      }`}
                    >
                      {stat.trend === "up" ? (
                        <ArrowUpRight className="mr-0.5 h-4 w-4" />
                      ) : (
                        <ArrowDownRight className="mr-0.5 h-4 w-4" />
                      )}
                      {stat.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors ${action.color}`}
                >
                  <action.icon className="h-4 w-4" />
                  {action.label}
                </Link>
              ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Revenue Chart Placeholder */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                  Revenue Overview
                </h2>
                <div className="flex h-48 items-end gap-2">
                  {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 100].map((h, i) => (
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

              {/* System Health */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                  System Health
                </h2>
                <div className="space-y-4">
                  {healthIndicators.map((indicator) => (
                    <div key={indicator.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-2.5 w-2.5 rounded-full ${
                            indicator.status === "healthy" ? "bg-emerald-500" : "bg-yellow-500"
                          }`}
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {indicator.name}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {indicator.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Recent Enrollments */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                  Recent Enrollments
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="pb-3 font-medium text-gray-500 dark:text-gray-400">Student</th>
                        <th className="pb-3 font-medium text-gray-500 dark:text-gray-400">Course</th>
                        <th className="pb-3 font-medium text-gray-500 dark:text-gray-400">Date</th>
                        <th className="pb-3 font-medium text-gray-500 dark:text-gray-400">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                      {recentEnrollments.map((enrollment) => (
                        <tr key={enrollment.id}>
                          <td className="py-3 text-gray-900 dark:text-white">{enrollment.student}</td>
                          <td className="py-3 text-gray-600 dark:text-gray-400">{enrollment.course}</td>
                          <td className="py-3 text-gray-600 dark:text-gray-400">{enrollment.date}</td>
                          <td className="py-3 font-medium text-gray-900 dark:text-white">{enrollment.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Top Courses */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                  Top Courses
                </h2>
                <div className="space-y-4">
                  {topCourses.map((course, index) => (
                    <div key={course.title} className="flex items-center gap-4">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                          {course.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {course.students.toLocaleString()} students
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {course.revenue}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
