"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen,
  Users,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Video,
  FileCheck,
  Star,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface InstructorStats {
  totalCourses: number;
  totalStudents: number;
  totalRevenue: number;
  averageRating: number;
  courseGrowth: number;
  studentGrowth: number;
  revenueGrowth: number;
}

function getMonthlyData(monthlyObj: Record<string, number>, months: number): { labels: string[]; values: number[] } {
  const labels: string[] = [];
  const values: number[] = [];
  const now = new Date();
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = d.toISOString().slice(0, 7);
    const label = d.toLocaleString("default", { month: "short" });
    labels.push(label);
    values.push(monthlyObj[key] || 0);
  }
  return { labels, values };
}

export default function InstructorDashboardPage() {
  const [stats, setStats] = useState<InstructorStats>({
    totalCourses: 0,
    totalStudents: 0,
    totalRevenue: 0,
    averageRating: 0,
    courseGrowth: 0,
    studentGrowth: 0,
    revenueGrowth: 0,
  });
  const [loading, setLoading] = useState(true);
  const [monthlyRevenue, setMonthlyRevenue] = useState<Record<string, number>>({});

  useEffect(() => {
    async function fetchData() {
      try {
        const [analyticsRes, earningsRes] = await Promise.allSettled([
          fetch("/api/analytics?range=30d"),
          fetch("/api/instructor/earnings"),
        ]);

        if (analyticsRes.status === "fulfilled" && analyticsRes.value.ok) {
          const data = await analyticsRes.value.json();
          setStats({
            totalCourses: data.totalCourses || 0,
            totalStudents: data.totalStudents || 0,
            totalRevenue: data.totalRevenue || 0,
            averageRating: data.averageRating || 0,
            courseGrowth: data.courseGrowth || 0,
            studentGrowth: data.enrollmentGrowth || 0,
            revenueGrowth: data.revenueGrowth || 0,
          });
          setMonthlyRevenue(data.monthlyRevenue || {});
        }

        // Fallback: if analytics fails, compute from earnings endpoint
        if (analyticsRes.status === "rejected" || (analyticsRes.status === "fulfilled" && !analyticsRes.value.ok)) {
          if (earningsRes.status === "fulfilled" && earningsRes.value.ok) {
            const earnings = await earningsRes.value.json();
            const earningsData = earnings.earnings || {};
            setStats({
              totalCourses: earningsData.courses?.length || 0,
              totalStudents: 0,
              totalRevenue: earningsData.totalEarnings || 0,
              averageRating: 0,
              courseGrowth: 0,
              studentGrowth: 0,
              revenueGrowth: 0,
            });
            if (earningsData.monthlyData) {
              const revMap: Record<string, number> = {};
              const now = new Date();
              for (const item of earningsData.monthlyData) {
                const monthIndex = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].indexOf(item.month);
                if (monthIndex >= 0) {
                  const d = new Date(now.getFullYear(), monthIndex, 1);
                  revMap[d.toISOString().slice(0, 7)] = item.amount;
                }
              }
              setMonthlyRevenue(revMap);
            }
          }
        }
      } catch {
        // Use fallback
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const revenueData = getMonthlyData(monthlyRevenue, 12);
  const maxRevenue = Math.max(...revenueData.values, 1);

  const statCards = [
    { label: "My Courses", value: stats.totalCourses, icon: BookOpen, color: "bg-blue-500", growth: stats.courseGrowth },
    { label: "Total Students", value: stats.totalStudents, icon: Users, color: "bg-emerald-500", growth: stats.studentGrowth },
    { label: "Revenue", value: stats.totalRevenue, icon: DollarSign, color: "bg-purple-500", growth: stats.revenueGrowth, prefix: "₦" },
    { label: "Avg Rating", value: stats.averageRating, icon: Star, color: "bg-amber-500", growth: 0 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Instructor Dashboard</h1>
          <p className="mt-1 text-gray-500">Manage your courses and track performance</p>
          <Badge className="mt-2" variant="warning">INSTRUCTOR</Badge>
        </div>
        <Link href="/instructor/courses/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Course
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const isUp = stat.growth >= 0;
          return (
            <Card key={stat.label} className="transition-shadow hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                    <p className="mt-1 text-3xl font-bold text-gray-900">
                      {loading ? "—" : `${stat.prefix || ""}${typeof stat.value === 'number' && stat.value % 1 !== 0 ? stat.value.toFixed(1) : stat.value.toLocaleString()}`}
                    </p>
                    {stat.growth !== 0 && (
                      <div className="mt-1 flex items-center gap-1">
                        {isUp ? (
                          <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-red-500" />
                        )}
                        <span className={`text-sm font-medium ${isUp ? "text-emerald-600" : "text-red-600"}`}>
                          {isUp ? "+" : ""}{stat.growth}%
                        </span>
                      </div>
                    )}
                  </div>
                  <div className={`rounded-xl p-3 ${stat.color}`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5 text-blue-500" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link href="/instructor/courses/new" className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50">
                <div className="rounded-lg bg-blue-500 p-2"><BookOpen className="h-5 w-5 text-white" /></div>
                <div>
                  <p className="font-medium text-gray-900">Create New Course</p>
                  <p className="text-sm text-gray-500">Add a new course to the platform</p>
                </div>
              </Link>
              <Link href="/instructor/quizzes" className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50">
                <div className="rounded-lg bg-purple-500 p-2"><FileCheck className="h-5 w-5 text-white" /></div>
                <div>
                  <p className="font-medium text-gray-900">Manage Quizzes</p>
                  <p className="text-sm text-gray-500">Create and edit quizzes for your courses</p>
                </div>
              </Link>
              <Link href="/instructor/live-classes" className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50">
                <div className="rounded-lg bg-emerald-500 p-2"><Video className="h-5 w-5 text-white" /></div>
                <div>
                  <p className="font-medium text-gray-900">Schedule Live Class</p>
                  <p className="text-sm text-gray-500">Set up a live session for your students</p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-500" />
              Revenue (12 months)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-48 items-end gap-2">
              {revenueData.values.map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-indigo-500 to-indigo-400 transition-all hover:from-indigo-600 hover:to-indigo-500"
                    style={{ height: `${(val / maxRevenue) * 100}%`, minHeight: val > 0 ? "4px" : "0px" }}
                    title={`₦${val.toLocaleString()}`}
                  />
                  <span className="mt-2 text-[10px] text-gray-400">{revenueData.labels[i]}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
