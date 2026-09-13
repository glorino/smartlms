"use client";

import { useState, useEffect } from "react";
import {
  Activity,
  Database,
  Server,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Users,
  BookOpen,
  GraduationCap,
  Star,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ServiceStatus {
  name: string;
  status: "healthy" | "warning" | "down";
  latency: string;
}

interface HealthStatus {
  databaseStatus: string;
  dbResponseTime: number;
  lastChecked: string;
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  activeUsers: number;
  uptimeDays: number;
  services: ServiceStatus[];
  totalRevenue: number;
  recentRevenue: number;
  recentEnrollments: number;
  totalReviews: number;
  avgRating: number;
}

const statusColor = (status: string) => {
  switch (status) {
    case "healthy": return "bg-emerald-100 text-emerald-700";
    case "warning": return "bg-yellow-100 text-yellow-700";
    case "down": return "bg-red-100 text-red-700";
    default: return "bg-gray-100 text-gray-700";
  }
};

function getResponseLabel(ms: number) {
  if (ms < 50) return { text: "Excellent", color: "text-emerald-600" };
  if (ms < 150) return { text: "Good", color: "text-emerald-600" };
  if (ms < 300) return { text: "Fair", color: "text-yellow-600" };
  return { text: "Slow", color: "text-red-600" };
}

function getDbStatusDisplay(status: string) {
  switch (status) {
    case "healthy": return { text: "Healthy", color: "text-emerald-600", icon: CheckCircle2 };
    case "degraded": return { text: "Degraded", color: "text-yellow-600", icon: AlertTriangle };
    case "down": return { text: "Down", color: "text-red-600", icon: XCircle };
    default: return { text: status, color: "text-gray-600", icon: AlertTriangle };
  }
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

export default function AdminHealthPage() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchHealth = async () => {
    setRefreshing(true);
    setFetchError(null);
    try {
      const res = await fetch("/api/admin/health");
      if (res.ok) {
        const data = await res.json();
        setHealth(data.health || data);
      } else {
        setFetchError("Unable to fetch health data");
      }
    } catch {
      setFetchError("Unable to fetch health data");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const responseLabel = health ? getResponseLabel(health.dbResponseTime) : null;
  const dbStatusDisplay = health ? getDbStatusDisplay(health.databaseStatus) : null;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Health</h1>
          <p className="mt-1 text-gray-500">Monitor platform performance and status</p>
        </div>
        <Button onClick={fetchHealth} disabled={refreshing} variant="outline">
          <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {fetchError && !health ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-gray-50 py-16 text-center">
          <AlertTriangle className="mb-4 h-10 w-10 text-red-500" />
          <p className="text-lg font-medium text-gray-900">{fetchError}</p>
          <Button onClick={fetchHealth} disabled={refreshing} variant="outline" className="mt-4">
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Retry
          </Button>
        </div>
      ) : health ? (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">DB Response Time</p>
                    <p className="mt-1 text-3xl font-bold text-gray-900">{health.dbResponseTime}ms</p>
                    <p className={`mt-1 text-xs font-medium ${responseLabel?.color}`}>{responseLabel?.text}</p>
                  </div>
                  <div className="rounded-xl bg-blue-500 p-3">
                    <Activity className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Database Status</p>
                    <p className={`mt-1 text-3xl font-bold ${dbStatusDisplay?.color}`}>
                      {dbStatusDisplay?.text}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">PostgreSQL</p>
                  </div>
                  <div className={`rounded-xl p-3 ${
                    health.databaseStatus === "healthy" ? "bg-emerald-500" : health.databaseStatus === "degraded" ? "bg-yellow-500" : "bg-red-500"
                  }`}>
                    <Database className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Active Users (1h)</p>
                    <p className="mt-1 text-3xl font-bold text-gray-900">{health.activeUsers.toLocaleString()}</p>
                    <p className="mt-1 text-xs text-gray-500">Currently active</p>
                  </div>
                  <div className="rounded-xl bg-purple-500 p-3">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">{health.totalUsers.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Total Users</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">{health.totalCourses}</p>
                <p className="text-xs text-gray-500">Courses</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">{health.totalEnrollments.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Enrollments</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">{health.recentEnrollments}</p>
                <p className="text-xs text-gray-500">New (24h)</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">{health.uptimeDays}</p>
                <p className="text-xs text-gray-500">Uptime (Days)</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  Services Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {health.services.map((service) => (
                    <div key={service.name} className="flex items-center justify-between rounded-xl border border-gray-100 p-4">
                      <div className="flex items-center gap-4">
                        <div className="rounded-lg bg-gray-100 p-2.5">
                          <Database className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{service.name}</p>
                          <p className="text-sm text-gray-500">Latency: {service.latency}</p>
                        </div>
                      </div>
                      <Badge className={statusColor(service.status)} variant="outline">
                        {service.status === "healthy" && <CheckCircle2 className="mr-1 h-3 w-3" />}
                        {service.status === "warning" && <AlertTriangle className="mr-1 h-3 w-3" />}
                        {service.status === "down" && <XCircle className="mr-1 h-3 w-3" />}
                        {service.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Revenue
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-xl border border-gray-100 p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-emerald-100 p-2.5">
                      <DollarSign className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Revenue</p>
                      <p className="text-lg font-bold text-gray-900">{formatCurrency(health.totalRevenue)}</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border border-gray-100 p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-100 p-2.5">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Revenue (24h)</p>
                      <p className="text-lg font-bold text-gray-900">{formatCurrency(health.recentRevenue)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Reviews & Ratings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-gray-100 p-4 text-center">
                  <p className="text-3xl font-bold text-gray-900">{health.avgRating}</p>
                  <div className="mt-1 flex items-center justify-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-gray-500">Average Rating</span>
                  </div>
                </div>
                <div className="rounded-xl border border-gray-100 p-4 text-center">
                  <p className="text-3xl font-bold text-gray-900">{health.totalReviews.toLocaleString()}</p>
                  <p className="mt-1 text-sm text-gray-500">Total Reviews</p>
                </div>
                <div className="rounded-xl border border-gray-100 p-4 text-center">
                  <p className="text-3xl font-bold text-gray-900">{health.uptimeDays}</p>
                  <p className="mt-1 text-sm text-gray-500">Days Uptime</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <p className="text-xs text-gray-400 text-right">
            Last checked: {new Date(health.lastChecked).toLocaleString()}
          </p>
        </>
      ) : null}
    </div>
  );
}
