"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  BookOpen,
  DollarSign,
  TrendingUp,
  BarChart3,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Settings,
  HeartPulse,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Database,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PlatformStats {
  totalStudents: number;
  totalCourses: number;
  totalRevenue: number;
  totalEnrollments: number;
  userGrowth: number;
  courseGrowth: number;
  revenueGrowth: number;
  enrollmentGrowth: number;
}

interface RecentActivity {
  type: string;
  title: string;
  description: string;
  time: string;
}

const fallbackStats: PlatformStats = {
  totalStudents: 0,
  totalCourses: 0,
  totalRevenue: 0,
  totalEnrollments: 0,
  userGrowth: 0,
  courseGrowth: 0,
  revenueGrowth: 0,
  enrollmentGrowth: 0,
};

function getMonthlyData(data: Record<string, number>, months: number): { labels: string[]; values: number[] } {
  const labels: string[] = [];
  const values: number[] = [];
  const now = new Date();
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = d.toISOString().slice(0, 7);
    const label = d.toLocaleString("default", { month: "short" });
    labels.push(label);
    values.push(data[key] || 0);
  }
  return { labels, values };
}

const statCards = [
  { label: "Total Students", key: "totalStudents" as const, icon: Users, color: "bg-blue-500", growthKey: "userGrowth" as const },
  { label: "Total Courses", key: "totalCourses" as const, icon: BookOpen, color: "bg-emerald-500", growthKey: "courseGrowth" as const },
  { label: "Revenue", key: "totalRevenue" as const, icon: DollarSign, color: "bg-purple-500", growthKey: "revenueGrowth" as const, prefix: "₦" },
  { label: "Enrollments", key: "totalEnrollments" as const, icon: TrendingUp, color: "bg-orange-500", growthKey: "enrollmentGrowth" as const },
];

const quickActions = [
  { label: "Manage Users", href: "/admin/users", icon: Users, color: "bg-blue-500 hover:bg-blue-600" },
  { label: "Manage Courses", href: "/admin/courses", icon: BookOpen, color: "bg-emerald-500 hover:bg-emerald-600" },
  { label: "View Analytics", href: "/admin/analytics", icon: BarChart3, color: "bg-purple-500 hover:bg-purple-600" },
  { label: "System Health", href: "/admin/health", icon: HeartPulse, color: "bg-orange-500 hover:bg-orange-600" },
  { label: "Settings", href: "/admin/settings", icon: Settings, color: "bg-gray-500 hover:bg-gray-600" },
];

const activityIcons: Record<string, { icon: any; color: string }> = {
  enrollment: { icon: Users, color: "bg-blue-100 text-blue-600" },
  course: { icon: BookOpen, color: "bg-emerald-100 text-emerald-600" },
  payment: { icon: DollarSign, color: "bg-purple-100 text-purple-600" },
  user: { icon: Users, color: "bg-orange-100 text-orange-600" },
  review: { icon: CheckCircle2, color: "bg-green-100 text-green-600" },
};

function formatTimeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<PlatformStats>(fallbackStats);
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [monthlyRevenue, setMonthlyRevenue] = useState<Record<string, number>>({});
  const [monthlyEnrollments, setMonthlyEnrollments] = useState<Record<string, number>>({});
  const [seeding, setSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/analytics?range=30d");
        if (res.ok) {
          const data = await res.json();
          setStats({
            totalStudents: data.totalStudents || 0,
            totalCourses: data.totalCourses || 0,
            totalRevenue: data.totalRevenue || 0,
            totalEnrollments: data.totalEnrollments || 0,
            userGrowth: data.userGrowth || 0,
            courseGrowth: 0,
            revenueGrowth: data.revenueGrowth || 0,
            enrollmentGrowth: data.enrollmentGrowth || 0,
          });
          setActivities(data.recentActivity || []);
          setMonthlyRevenue(data.monthlyRevenue || {});
          setMonthlyEnrollments(data.monthlyEnrollments || {});
        }
      } catch {
        // Use fallback data
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  async function handleSeed() {
    setSeeding(true);
    setSeedMessage("");
    try {
      const res = await fetch("/api/admin/seed", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setSeedMessage(data.message);
      } else {
        setSeedMessage(data.error || "Seed failed");
      }
    } catch {
      setSeedMessage("Network error — try again");
    } finally {
      setSeeding(false);
    }
  }

  const revenueData = getMonthlyData(monthlyRevenue, 12);
  const enrollmentData = getMonthlyData(monthlyEnrollments, 12);
  const maxRevenue = Math.max(...revenueData.values, 1);
  const maxEnrollment = Math.max(...enrollmentData.values, 1);

  const formatValue = (value: number, prefix?: string) => {
    if (prefix) return `${prefix}${value.toLocaleString()}`;
    return value.toLocaleString();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-1 text-gray-500">
          Platform overview and management
        </p>
        <Badge className="mt-2" variant="danger">ADMIN</Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const growth = stats[stat.growthKey];
          const isUp = growth >= 0;
          return (
            <Card key={stat.label} className="transition-shadow hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                    <p className="mt-1 text-3xl font-bold text-gray-900">
                      {loading ? "—" : formatValue(stats[stat.key], stat.prefix)}
                    </p>
                    <div className="mt-1 flex items-center gap-1">
                      {isUp ? (
                        <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-500" />
                      )}
                      <span className={`text-sm font-medium ${isUp ? "text-emerald-600" : "text-red-600"}`}>
                        {isUp ? "+" : ""}{growth}%
                      </span>
                    </div>
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

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors ${action.color}`}
              >
                <action.icon className="h-4 w-4" />
                {action.label}
              </Link>
            ))}
            <button
              onClick={handleSeed}
              disabled={seeding}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:opacity-50"
            >
              <Database className="h-4 w-4" />
              {seeding ? "Seeding..." : "Seed Blog & Jobs"}
            </button>
          </div>
          {seedMessage && (
            <p className="mt-3 text-sm text-emerald-600">{seedMessage}</p>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Chart - Real Data */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-48 items-end gap-2">
              {revenueData.values.map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-purple-500 to-purple-400 transition-all hover:from-purple-600 hover:to-purple-500"
                    style={{ height: `${(val / maxRevenue) * 100}%`, minHeight: val > 0 ? "4px" : "0px" }}
                    title={`₦${val.toLocaleString()}`}
                  />
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between text-xs text-gray-500">
              {revenueData.labels.map((m, i) => (
                <span key={i}>{m}</span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Enrollments Chart - Real Data */}
        <Card>
          <CardHeader>
            <CardTitle>Enrollment Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-48 items-end gap-2">
              {enrollmentData.values.map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-blue-500 to-blue-400 transition-all hover:from-blue-600 hover:to-blue-500"
                    style={{ height: `${(val / maxEnrollment) * 100}%`, minHeight: val > 0 ? "4px" : "0px" }}
                    title={`${val} enrollments`}
                  />
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between text-xs text-gray-500">
              {enrollmentData.labels.map((m, i) => (
                <span key={i}>{m}</span>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8 text-gray-400">Loading...</div>
          ) : activities.length === 0 ? (
            <div className="flex justify-center py-8 text-gray-400">No recent activity</div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity, i) => {
                const iconData = activityIcons[activity.type] || { icon: Activity, color: "bg-gray-100 text-gray-600" };
                const Icon = iconData.icon;
                return (
                  <div key={i} className="flex items-start gap-4 rounded-xl border border-gray-100 p-4 transition-colors hover:bg-gray-50">
                    <div className={`rounded-xl p-2.5 ${iconData.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-500">{activity.description}</p>
                      <p className="mt-1 text-xs text-gray-400">{formatTimeAgo(activity.time)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
