"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Clock,
  BookOpen,
  Award,
  MessageSquare,
  FileText,
  TrendingUp,
  ArrowLeft,
  Filter,
} from "lucide-react";

interface ActivityItem {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  icon: string;
  color: string;
}


export default function DashboardActivityPage() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    async function fetchActivity() {
      try {
        const res = await fetch("/api/activity");
        if (res.ok) {
          const data = await res.json();
          setActivities(data.activities || []);
        }
      } catch {
        setActivities([]);
      }
    }
    fetchActivity();
  }, []);

  const getIcon = (icon: string) => {
    switch (icon) {
      case "book":
        return <BookOpen className="h-4 w-4 text-white" />;
      case "award":
        return <Award className="h-4 w-4 text-white" />;
      case "file":
        return <FileText className="h-4 w-4 text-white" />;
      case "trending":
        return <TrendingUp className="h-4 w-4 text-white" />;
      case "message":
        return <MessageSquare className="h-4 w-4 text-white" />;
      default:
        return <Clock className="h-4 w-4 text-white" />;
    }
  };

  const formatTime = (ts: string) => {
    const diff = Date.now() - new Date(ts).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return "Yesterday";
    return `${days}d ago`;
  };

  const filtered =
    filter === "all"
      ? activities
      : activities.filter((a) => a.type === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Dashboard
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Activity Feed</h1>
        <p className="text-gray-500">Your recent learning activity</p>
      </div>

      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-gray-500" />
        {["all", "course_progress", "certificate", "quiz", "enrollment", "message"].map(
          (f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                filter === f
                  ? "bg-indigo-100 text-indigo-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {f === "all" ? "All" : f.replace("_", " ")}
            </button>
          )
        )}
      </div>

      <div className="space-y-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="flex gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:shadow-md"
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${item.color}`}
            >
              {getIcon(item.icon)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900">{item.title}</h3>
              <p className="mt-0.5 text-sm text-gray-500">{item.description}</p>
            </div>
            <span className="shrink-0 text-xs text-gray-400">
              {formatTime(item.timestamp)}
            </span>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="py-12 text-center text-gray-400">
            No activity found for this filter.
          </p>
        )}
      </div>
    </div>
  );
}
