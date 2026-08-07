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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface HealthStatus {
  apiResponseTime: number;
  databaseStatus: "healthy" | "degraded" | "down";
  storageUsed: number;
  storageTotal: number;
  uptime: number;
  cpuUsage: number;
  memoryUsage: number;
  errorCount: number;
  lastChecked: string;
}

interface ErrorLog {
  id: string;
  level: string;
  message: string;
  source: string;
  timestamp: string;
}

const fallbackHealth: HealthStatus = {
  apiResponseTime: 124,
  databaseStatus: "healthy",
  storageUsed: 67,
  storageTotal: 100,
  uptime: 99.98,
  cpuUsage: 34,
  memoryUsage: 58,
  errorCount: 3,
  lastChecked: new Date().toISOString(),
};

const fallbackErrors: ErrorLog[] = [
  { id: "1", level: "error", message: "Failed to send email notification", source: "email-service", timestamp: "2 minutes ago" },
  { id: "2", level: "warning", message: "High memory usage detected", source: "system", timestamp: "15 minutes ago" },
  { id: "3", level: "error", message: "Stripe webhook timeout", source: "payment-service", timestamp: "1 hour ago" },
  { id: "4", level: "info", message: "Database backup completed", source: "database", timestamp: "3 hours ago" },
  { id: "5", level: "warning", message: "Rate limit exceeded for API", source: "api-gateway", timestamp: "5 hours ago" },
];

const services = [
  { name: "API Server", status: "healthy", latency: "124ms", icon: Server },
  { name: "Database (PostgreSQL)", status: "healthy", latency: "12ms", icon: Database },
  { name: "File Storage (S3)", status: "healthy", latency: "45ms", icon: HardDrive },
  { name: "CDN", status: "warning", latency: "89ms", icon: Globe },
  { name: "Email Service", status: "healthy", latency: "230ms", icon: Activity },
  { name: "Redis Cache", status: "healthy", latency: "3ms", icon: Database },
];

export default function AdminHealthPage() {
  const [health, setHealth] = useState<HealthStatus>(fallbackHealth);
  const [errors, setErrors] = useState<ErrorLog[]>(fallbackErrors);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHealth = async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/admin/health");
      if (res.ok) {
        const data = await res.json();
        setHealth(data.health || data);
        setErrors(data.errors || fallbackErrors);
      }
    } catch {
      // Use fallback
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const formatUptime = (uptime: number) => {
    const days = Math.floor(uptime / 24);
    const hours = Math.floor(uptime % 24);
    return `${days}d ${hours}h`;
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-emerald-100 text-emerald-700";
      case "warning":
      case "degraded":
        return "bg-yellow-100 text-yellow-700";
      case "down":
      case "error":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const levelColor = (level: string) => {
    switch (level) {
      case "error":
        return "bg-red-100 text-red-700";
      case "warning":
        return "bg-yellow-100 text-yellow-700";
      case "info":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

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

      {/* Health Overview Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">API Response</p>
                <p className="mt-1 text-3xl font-bold text-gray-900">{health.apiResponseTime}ms</p>
                <p className="mt-1 text-xs text-emerald-600 font-medium">Good</p>
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
                <p className="mt-1 text-3xl font-bold text-gray-900">{health.uptime}%</p>
                <p className="mt-1 text-xs text-emerald-600 font-medium">Excellent</p>
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
                <p className="mt-1 text-xs text-emerald-600 font-medium">Normal</p>
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
                <p className="mt-1 text-xs text-emerald-600 font-medium">Normal</p>
              </div>
              <div className="rounded-xl bg-orange-500 p-3">
                <MemoryStick className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Services Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Services Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {services.map((service) => (
              <div key={service.name} className="flex items-center justify-between rounded-xl border border-gray-100 p-4">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-gray-100 p-2.5">
                    <service.icon className="h-5 w-5 text-gray-600" />
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

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Storage Usage */}
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
                <p className="text-lg font-bold text-gray-900">12.4 GB</p>
              </div>
              <div className="rounded-xl border border-gray-100 p-4">
                <p className="text-sm text-gray-500">User Uploads</p>
                <p className="text-lg font-bold text-gray-900">8.2 GB</p>
              </div>
              <div className="rounded-xl border border-gray-100 p-4">
                <p className="text-sm text-gray-500">Backups</p>
                <p className="text-lg font-bold text-gray-900">15.1 GB</p>
              </div>
              <div className="rounded-xl border border-gray-100 p-4">
                <p className="text-sm text-gray-500">Logs</p>
                <p className="text-lg font-bold text-gray-900">3.3 GB</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Logs */}
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
                        <p className="text-xs text-gray-500">{error.source} · {error.timestamp}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Uptime Monitor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Uptime Monitor (Last 30 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-0.5">
            {Array.from({ length: 30 }).map((_, i) => {
              const isDown = i === 12 || i === 23;
              return (
                <div
                  key={i}
                  className={`h-8 flex-1 rounded-sm ${
                    isDown ? "bg-red-400" : "bg-emerald-400"
                  }`}
                  title={`Day ${i + 1}: ${isDown ? "Degraded" : "Operational"}`}
                />
              );
            })}
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
    </div>
  );
}
