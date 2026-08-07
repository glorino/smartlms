"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
} from "lucide-react";
import Sidebar from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import type { Enrollment, LiveClass, ActivityLog } from "@/types";

interface DashboardData {
  enrolledCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  certificates: number;
  enrollments: Enrollment[];
  upcomingClasses: LiveClass[];
  recentActivity: ActivityLog[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const res = await fetch("/api/dashboard");
        if (res.ok) {
          const result = await res.json();
          setData(result);
        }
      } catch {
        // Fallback demo data
        setData({
          enrolledCourses: 12,
          completedCourses: 5,
          inProgressCourses: 7,
          certificates: 5,
          enrollments: [],
          upcomingClasses: [],
          recentActivity: [],
        });
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const stats = [
    {
      title: "Enrolled Courses",
      value: data?.enrolledCourses ?? 0,
      icon: BookOpen,
      color: "bg-blue-500",
      change: "+2 this month",
    },
    {
      title: "Completed",
      value: data?.completedCourses ?? 0,
      icon: Award,
      color: "bg-green-500",
      change: "+1 this week",
    },
    {
      title: "In Progress",
      value: data?.inProgressCourses ?? 0,
      icon: TrendingUp,
      color: "bg-orange-500",
      change: "Keep going!",
    },
    {
      title: "Certificates",
      value: data?.certificates ?? 0,
      icon: FileCheck,
      color: "bg-purple-500",
      change: "View all",
    },
  ];

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-6 pb-20 md:p-8 md:pb-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, Student 👋
          </h1>
          <p className="mt-1 text-gray-600">
            Continue your learning journey. You&apos;re doing great!
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {stat.title}
                    </p>
                    <p className="mt-1 text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">{stat.change}</p>
                  </div>
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}
                  >
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Courses */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                My Courses
              </h2>
              <Link
                href="/dashboard/courses"
                className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                View All
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {data?.enrollments && data.enrollments.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {data.enrollments.slice(0, 4).map((enrollment) => (
                  <Card
                    key={enrollment.id}
                    className="group cursor-pointer transition-shadow hover:shadow-md"
                  >
                    <Link href={`/courses/${enrollment.course.id}/learn`}>
                      <div className="relative h-32 bg-gradient-to-br from-blue-500 to-purple-600">
                        {enrollment.course.thumbnail ? (
                          <img
                            src={enrollment.course.thumbnail}
                            alt={enrollment.course.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <BookOpen className="h-10 w-10 text-white/80" />
                          </div>
                        )}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/30">
                          <Play className="h-12 w-12 text-white opacity-0 transition-opacity group-hover:opacity-100" />
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="line-clamp-1 font-medium text-gray-900">
                          {enrollment.course.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {enrollment.course.instructor?.name}
                        </p>
                        <div className="mt-3">
                          <Progress
                            value={enrollment.progress}
                            showValue
                            color="blue"
                          />
                        </div>
                        <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                          <span>
                            Last accessed:{" "}
                            {new Date(enrollment.enrolledAt).toLocaleDateString()}
                          </span>
                          <Badge
                            variant={
                              enrollment.status === "COMPLETED"
                                ? "success"
                                : "default"
                            }
                          >
                            {enrollment.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Link>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <BookOpen className="h-12 w-12 text-gray-400" />
                  <p className="mt-4 text-gray-500">No courses yet</p>
                  <Link href="/courses">
                    <Button className="mt-4">Browse Courses</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Live Classes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Upcoming Classes</CardTitle>
              </CardHeader>
              <CardContent>
                {data?.upcomingClasses && data.upcomingClasses.length > 0 ? (
                  <div className="space-y-3">
                    {data.upcomingClasses.slice(0, 3).map((cls) => (
                      <div
                        key={cls.id}
                        className="flex items-start gap-3 rounded-lg border border-gray-100 p-3"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                          <Calendar className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-1 text-sm font-medium text-gray-900">
                            {cls.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(cls.scheduledAt).toLocaleDateString()} at{" "}
                            {new Date(cls.scheduledAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <Calendar className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">
                      No upcoming classes
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {data?.recentActivity && data.recentActivity.length > 0 ? (
                  <div className="space-y-3">
                    {data.recentActivity.slice(0, 5).map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3">
                        <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                        <div>
                          <p className="text-sm text-gray-700">
                            {activity.action}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(activity.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <BarChart3 className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">
                      No recent activity
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Link href="/courses">
              <Card className="group cursor-pointer transition-all hover:border-primary hover:shadow-md">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 group-hover:bg-blue-100">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Browse Courses</p>
                    <p className="text-sm text-gray-500">
                      Discover new skills
                    </p>
                  </div>
                  <ArrowUpRight className="ml-auto h-5 w-5 text-gray-400 group-hover:text-primary" />
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/certificates">
              <Card className="group cursor-pointer transition-all hover:border-primary hover:shadow-md">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 group-hover:bg-green-100">
                    <Award className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      View Certificates
                    </p>
                    <p className="text-sm text-gray-500">Your achievements</p>
                  </div>
                  <ArrowUpRight className="ml-auto h-5 w-5 text-gray-400 group-hover:text-primary" />
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/quizzes">
              <Card className="group cursor-pointer transition-all hover:border-primary hover:shadow-md">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 group-hover:bg-purple-100">
                    <FileCheck className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Take Quiz</p>
                    <p className="text-sm text-gray-500">Test your knowledge</p>
                  </div>
                  <ArrowUpRight className="ml-auto h-5 w-5 text-gray-400 group-hover:text-primary" />
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
