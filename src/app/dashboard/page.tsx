"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  BookOpen,
  Award,
  TrendingUp,
  Clock,
  Play,
  Calendar,
  BarChart3,
  ChevronRight,
  FileCheck,
  ArrowUpRight,
  Users,
  DollarSign,
  Package,
  PlusCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function DashboardPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const role = (user as any)?.role || "STUDENT";

  const stats =
    role === "ADMIN"
      ? [
          { label: "Total Users", value: "1,234", icon: Users, color: "bg-blue-500", change: "+12%" },
          { label: "Total Courses", value: "56", icon: BookOpen, color: "bg-emerald-500", change: "+8%" },
          { label: "Revenue", value: "$12,450", icon: DollarSign, color: "bg-amber-500", change: "+23%" },
          { label: "Enrollments", value: "3,456", icon: TrendingUp, color: "bg-rose-500", change: "+15%" },
        ]
      : role === "INSTRUCTOR"
        ? [
            { label: "My Courses", value: "8", icon: Package, color: "bg-blue-500", change: "+2" },
            { label: "Total Students", value: "456", icon: Users, color: "bg-emerald-500", change: "+34" },
            { label: "Earnings", value: "$3,200", icon: DollarSign, color: "bg-amber-500", change: "+$450" },
            { label: "Active Courses", value: "6", icon: BookOpen, color: "bg-rose-500", change: "100%" },
          ]
        : [
            { label: "Enrolled Courses", value: "4", icon: BookOpen, color: "bg-blue-500", change: "+2 this month" },
            { label: "Completed", value: "1", icon: Award, color: "bg-emerald-500", change: "+1 this week" },
            { label: "In Progress", value: "3", icon: TrendingUp, color: "bg-amber-500", change: "Keep going!" },
            { label: "Certificates", value: "1", icon: FileCheck, color: "bg-rose-500", change: "View all" },
          ];

  const recentCourses =
    role === "INSTRUCTOR"
      ? [
          { title: "Complete Web Development", students: 234, status: "Published", progress: 100 },
          { title: "Advanced React Patterns", students: 189, status: "Published", progress: 100 },
          { title: "Node.js Masterclass", students: 0, status: "Draft", progress: 65 },
        ].map((c) => ({ ...c, lastAccessed: "" }))
      : [
          { title: "Complete Web Development Bootcamp", progress: 35, lastAccessed: "2 hours ago", students: 0, status: "" },
          { title: "Machine Learning & AI Masterclass", progress: 12, lastAccessed: "1 day ago", students: 0, status: "" },
          { title: "UI/UX Design Fundamentals", progress: 68, lastAccessed: "3 days ago", students: 0, status: "" },
        ];

  const quickActions =
    role === "ADMIN"
      ? [
          { label: "Manage Users", href: "/admin/users", icon: Users },
          { label: "Manage Courses", href: "/admin/courses", icon: BookOpen },
          { label: "View Analytics", href: "/admin/analytics", icon: BarChart3 },
        ]
      : role === "INSTRUCTOR"
        ? [
            { label: "Create Course", href: "/instructor/courses/new", icon: PlusCircle },
            { label: "View Students", href: "/instructor/students", icon: Users },
            { label: "Analytics", href: "/instructor/analytics", icon: BarChart3 },
          ]
        : [
            { label: "Browse Courses", href: "/courses", icon: BookOpen },
            { label: "Take Quiz", href: "/dashboard/quizzes", icon: FileCheck },
            { label: "View Certificates", href: "/dashboard/certificates", icon: Award },
          ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name || "User"} 👋
        </h1>
        <p className="mt-1 text-gray-500">
          {role === "ADMIN"
            ? "Here's your platform overview."
            : role === "INSTRUCTOR"
              ? "Manage your courses and track performance."
              : "Continue your learning journey. You're doing great!"}
        </p>
        <Badge className="mt-2" variant={role === "ADMIN" ? "danger" : role === "INSTRUCTOR" ? "warning" : "success"}>
          {role}
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  <p className="mt-1 text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className="mt-1 text-xs text-gray-400">{stat.change}</p>
                </div>
                <div className={`rounded-xl p-3 ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Courses */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>
                {role === "INSTRUCTOR" ? "My Courses" : "My Courses"}
              </CardTitle>
              <Link
                href={role === "INSTRUCTOR" ? "/instructor/courses" : "/dashboard/courses"}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
              >
                View All <ChevronRight className="inline h-4 w-4" />
              </Link>
            </CardHeader>
            <CardContent>
              {recentCourses.length > 0 ? (
                <div className="space-y-4">
                  {recentCourses.map((course, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 rounded-xl border border-gray-100 p-4 transition-colors hover:bg-gray-50"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                        <BookOpen className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="truncate font-medium text-gray-900">
                          {course.title}
                        </h4>
                        <div className="mt-2">
                          <Progress value={course.progress} className="h-2" />
                          <p className="mt-1 text-xs text-gray-400">
                            {course.progress}% complete
                            {course.lastAccessed && ` · ${course.lastAccessed}`}
                          </p>
                        </div>
                      </div>
                      <Link
                        href="/courses/1/learn"
                        className="shrink-0 rounded-lg bg-indigo-600 p-2 text-white transition-colors hover:bg-indigo-700"
                      >
                        <Play className="h-4 w-4" />
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <BookOpen className="mx-auto h-12 w-12 text-gray-300" />
                  <p className="mt-4 text-gray-500">No courses yet</p>
                  <Link
                    href="/courses"
                    className="mt-4 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                  >
                    Browse Courses
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Content */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {quickActions.map((action) => (
                  <Link
                    key={action.label}
                    href={action.href}
                    className="flex items-center gap-3 rounded-xl border border-gray-100 p-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    <action.icon className="h-5 w-5 text-indigo-600" />
                    {action.label}
                    <ArrowUpRight className="ml-auto h-4 w-4 text-gray-400" />
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming / Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>
                {role === "INSTRUCTOR" ? "Recent Activity" : "Upcoming Classes"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 rounded-xl border border-gray-100 p-3">
                  <div className="rounded-lg bg-blue-100 p-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Advanced React Patterns
                    </p>
                    <p className="text-xs text-gray-500">Tomorrow, 2:00 PM</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-gray-100 p-3">
                  <div className="rounded-lg bg-green-100 p-2">
                    <Calendar className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      ML Workshop
                    </p>
                    <p className="text-xs text-gray-500">Wednesday, 6:00 PM</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
