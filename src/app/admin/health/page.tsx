"use client";

import { useState, useEffect } from "react";
import {
  Activity,
  Database,
  HardDrive,
  Server,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Wifi,
  Cpu,
  MemoryStick,
  Globe,
  Shield,
  Mail,
  CreditCard,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ServiceStatus {
  name: string;
  status: "healthy" | "warning" | "down";
  latency: string;
}

interface StorageBreakdown {
  courseFiles: number;
  userUploads: number;
  backups: number;
  logs: number;
}

interface UptimeDay {
  day: number;
  date: string;
  status: "operational" | "degraded";
}

interface HealthStatus {
  apiResponseTime: number;
  databaseStatus: string;
  storageUsed: number;
  storageTotal: number;
  uptime: number;
  cpuUsage: number;
  memoryUsage: number;
  errorCount: number;
  lastChecked: string;
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  activeUsers: number;
  uptimeDays: number;
  services: ServiceStatus[];
  storageBreakdown: StorageBreakdown;
  uptimeHistory: UptimeDay[];
  totalRevenue: number;
  recentRevenue: number;
  recentEnrollments: number;
  totalReviews: number;
  avgRating: number;
  totalErrors30d: number;
}

interface ErrorLog {
  id: string;
  level: string;
  message: string;
  source: string;
  timestamp: string;
}

const serviceIcons: Record<string, any> = {
  "API Server": Server,
  "Database (PostgreSQL)": Database,
  "Authentication": Shield,
  "File Storage": HardDrive,
  "Email Service": Mail,
  "Payment Gateway": CreditCard,
  "CDN": Globe,
  "Redis Cache": Database,
};

const statusColor = (status: string) => {
  switch (status) {
    case "healthy": return "bg-emerald-100 text-emerald-700";
    case "warning": case "degraded": return "bg-yellow-100 text-yellow-700";
    case "down": case "error": return "bg-red-100 text-red-700";
    default: return "bg-gray-100 text-gray-700";
  }
};

const levelColor = (level: string) => {
  switch (level) {
    case "error": return "bg-red-100 text-red-700";
    case "warning": return "bg-yellow-100 text-yellow-700";
    case "info": return "bg-blue-100 text-blue-700";
    default: return "bg-gray-100 text-gray-700";
  }
};

function getResponseLabel(ms: number) {
  if (ms < 50) return { text: "Excellent", color: "text-emerald-600" };
  if (ms < 150) return { text: "Good", color: "text-emerald-600" };
  if (ms < 300) return { text: "Fair", color: "text-yellow-600" };
  return { text: "Slow", color: "text-red-600" };
}

function getUptimeLabel(pct: number) {
  if (pct >= 99.9) return { text: "Excellent", color: "text-emerald-600" };
  if (pct >= 99.0) return { text: "Good", color: "text-emerald-600" };
  if (pct >= 95.0) return { text: "Fair", color: "text-yellow-600" };
  return { text: "Poor", color: "text-red-600" };
}

function getCpuLabel(pct: number) {
  if (pct < 30) return { text: "Idle", color: "text-emerald-600" };
  if (pct < 60) return { text: "Normal", color: "text-emerald-600" };
  if (pct < 80) return { text: "High", color: "text-yellow-600" };
  return { text: "Critical", color: "text-red-600" };
}

function getMemoryLabel(pct: number) {
  if (pct < 50) return { text: "Normal", color: "text-emerald-600" };
  if (pct < 75) return { text: "Moderate", color: "text-yellow-600" };
  return { text: "High", color: "text-red-600" };
}

export default function AdminHealthPage() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [errors, setErrors] = useState<ErrorLog[]>([]);
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
        setErrors(data.errors || []);
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

  const responseLabel = health ? getResponseLabel(health.apiResponseTime) : null;
  const uptimeLabel = health ? getUptimeLabel(health.uptime) : null;
  const cpuLabel = health ? getCpuLabel(health.cpuUsage) : null;
  const memoryLabel = health ? getMemoryLabel(health.memoryUsage) : null;

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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">API Response</p>
                    <p className="mt-1 text-3xl font-bold text-gray-900">{health.apiResponseTime}ms</p>
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
                    <p className="text-sm font-medium text-gray-500">Uptime</p>
                    <p className="mt-1 text-3xl font-bold text-gray-900">{health.uptime.toFixed(2)}%</p>
                    <p className={`mt-1 text-xs font-medium ${uptimeLabel?.color}`}>{uptimeLabel?.text}</p>
                  </div>
                  <div className="rounded-xl bg-emerald-500 p-3">
                    <CheckCircle2 className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">CPU Usage</p>
                    <p className="mt-1 text-3xl font-bold text-gray-900">{health.cpuUsage}%</p>
                    <p className={`mt-1 text-xs font-medium ${cpuLabel?.color}`}>{cpuLabel?.text}</p>
                  </div>
                  <div className="rounded-xl bg-purple-500 p-3">
                    <Cpu className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Memory</p>
                    <p className="mt-1 text-3xl font-bold text-gray-900">{health.memoryUsage}%</p>
                    <p className={`mt-1 text-xs font-medium ${memoryLabel?.color}`}>{memoryLabel?.text}</p>
                  </div>
                  <div className="rounded-xl bg-orange-500 p-3">
                    <MemoryStick className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
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
                <p className="text-xs text-gray-500">New Today</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                Services Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {health.services.map((service) => {
                  const Icon = serviceIcons[service.name] || Server;
                  return (
                    <div key={service.name} className="flex items-center justify-between rounded-xl border border-gray-100 p-4">
                      <div className="flex items-center gap-4">
                        <div className="rounded-lg bg-gray-100 p-2.5">
                          <Icon className="h-5 w-5 text-gray-600" />
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
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HardDrive className="h-5 w-5" />
                  Storage Usage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Used</span>
                    <span className="text-sm font-medium text-gray-900">{health.storageUsed}% of {health.storageTotal}GB</span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className={`h-full rounded-full transition-all ${
                        health.storageUsed > 80 ? "bg-red-500" : health.storageUsed > 60 ? "bg-yellow-500" : "bg-emerald-500"
                      }`}
                      style={{ width: `${health.storageUsed}%` }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl border border-gray-100 p-4">
                    <p className="text-sm text-gray-500">Course Files</p>
                    <p className="text-lg font-bold text-gray-900">{health.storageBreakdown.courseFiles} GB</p>
                  </div>
                  <div className="rounded-xl border border-gray-100 p-4">
                    <p className="text-sm text-gray-500">User Uploads</p>
                    <p className="text-lg font-bold text-gray-900">{health.storageBreakdown.userUploads} GB</p>
                  </div>
                  <div className="rounded-xl border border-gray-100 p-4">
                    <p className="text-sm text-gray-500">Backups</p>
                    <p className="text-lg font-bold text-gray-900">{health.storageBreakdown.backups} GB</p>
                  </div>
                  <div className="rounded-xl border border-gray-100 p-4">
                    <p className="text-sm text-gray-500">Logs</p>
                    <p className="text-lg font-bold text-gray-900">{health.storageBreakdown.logs} GB</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Recent Errors ({health.errorCount})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {errors.map((error) => (
                    <div key={error.id} className="rounded-xl border border-gray-100 p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-2">
                          <Badge className={levelColor(error.level)} variant="outline">
                            {error.level}
                          </Badge>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{error.message}</p>
                            <p className="text-xs text-gray-500">{error.source} · {new Date(error.timestamp).toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Uptime Monitor (Last 30 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-0.5">
                {health.uptimeHistory.map((day) => (
                  <div
                    key={day.day}
                    className={`h-8 flex-1 rounded-sm ${
                      day.status === "degraded" ? "bg-red-400" : "bg-emerald-400"
                    }`}
                    title={`Day ${day.day} (${day.date}): ${day.status === "degraded" ? "Degraded" : "Operational"}`}
                  />
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                <span>30 days ago</span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <div className="h-3 w-3 rounded-sm bg-emerald-400" />
                    <span>Operational</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-3 w-3 rounded-sm bg-red-400" />
                    <span>Degraded</span>
                  </div>
                </div>
                <span>Today</span>
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
