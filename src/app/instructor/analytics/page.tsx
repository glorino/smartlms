"use client";

import { useState } from "react";
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const coursePerformance = [
  { name: "Web Development Bootcamp", students: 342, rating: 4.8, completion: 72, revenue: 12450, trend: "up" as const },
  { name: "React Masterclass", students: 189, rating: 4.7, completion: 65, revenue: 8920, trend: "up" as const },
  { name: "UI/UX Design", students: 256, rating: 4.9, completion: 81, revenue: 15200, trend: "up" as const },
  { name: "DevOps & Cloud", students: 128, rating: 4.6, completion: 58, revenue: 6340, trend: "down" as const },
];

const engagementData = [
  { day: "Mon", hours: 42 },
  { day: "Tue", hours: 38 },
  { day: "Wed", hours: 55 },
  { day: "Thu", hours: 31 },
  { day: "Fri", hours: 48 },
  { day: "Sat", hours: 62 },
  { day: "Sun", hours: 35 },
];

const enrollmentTrends = [
  { month: "Mar", enrollments: 85 },
  { month: "Apr", enrollments: 112 },
  { month: "May", enrollments: 98 },
  { month: "Jun", enrollments: 145 },
  { month: "Jul", enrollments: 167 },
  { month: "Aug", enrollments: 89 },
];

const demographics = [
  { label: "18-24", percentage: 32 },
  { label: "25-34", percentage: 41 },
  { label: "35-44", percentage: 18 },
  { label: "45+", percentage: 9 },
];

const maxEngagement = Math.max(...engagementData.map((d) => d.hours));
const maxEnrollments = Math.max(...enrollmentTrends.map((e) => e.enrollments));

export default function InstructorAnalyticsPage() {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "all">("month");

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
                <p className="mt-1 text-3xl font-bold text-gray-900">915</p>
                <div className="mt-1 flex items-center gap-1 text-xs text-emerald-600">
                  <ArrowUpRight className="h-3 w-3" />
                  +18% from last month
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
                <p className="mt-1 text-3xl font-bold text-gray-900">69%</p>
                <div className="mt-1 flex items-center gap-1 text-xs text-emerald-600">
                  <ArrowUpRight className="h-3 w-3" />
                  +5% from last month
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
                <p className="text-sm font-medium text-gray-500">Avg. Rating</p>
                <p className="mt-1 text-3xl font-bold text-gray-900">4.75</p>
                <div className="mt-1 flex items-center gap-1 text-xs text-emerald-600">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  Excellent
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
                <p className="mt-1 text-3xl font-bold text-gray-900">$42.9K</p>
                <div className="mt-1 flex items-center gap-1 text-xs text-emerald-600">
                  <ArrowUpRight className="h-3 w-3" />
                  +12% from last month
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
              {enrollmentTrends.map((item) => (
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
          <div className="space-y-4">
            {coursePerformance.map((course, idx) => (
              <div
                key={course.name}
                className="flex items-center gap-4 rounded-lg border border-gray-200 p-4"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                  #{idx + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{course.name}</h3>
                    {course.trend === "up" ? (
                      <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {course.students}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      {course.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-3.5 w-3.5" />
                      ${course.revenue.toLocaleString()}
                    </span>
                  </div>
                  <div className="mt-2 max-w-md">
                    <Progress value={course.completion} className="h-2" color="blue" showValue />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-purple-500" />
              Student Demographics
            </CardTitle>
            <CardDescription>Age distribution of your students</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {demographics.map((demo) => (
                <div key={demo.label} className="flex items-center gap-4">
                  <span className="w-12 text-sm font-medium text-gray-700">{demo.label}</span>
                  <div className="flex-1">
                    <div className="h-6 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500"
                        style={{ width: `${demo.percentage}%` }}
                      />
                    </div>
                  </div>
                  <span className="w-12 text-right text-sm font-semibold text-gray-900">
                    {demo.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-rose-500" />
              Revenue by Course
            </CardTitle>
            <CardDescription>Revenue breakdown across courses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {coursePerformance.map((course) => {
                const maxRev = Math.max(...coursePerformance.map((c) => c.revenue));
                return (
                  <div key={course.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700 truncate max-w-[200px]">
                        {course.name}
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        ${course.revenue.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-500"
                        style={{ width: `${(course.revenue / maxRev) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
