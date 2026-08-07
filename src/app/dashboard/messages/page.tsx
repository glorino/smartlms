"use client";

import { useState } from "react";
import {
  MessageSquare,
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Filter,
  Search,
  Inbox,
  BookOpen,
  Award,
  AlertCircle,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "course" | "quiz" | "certificate" | "system" | "reminder";
  read: boolean;
  createdAt: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "New Course Available",
    message: "TypeScript Mastery has been added to the catalog. Check it out!",
    type: "course",
    read: false,
    createdAt: "2 hours ago",
    icon: BookOpen,
    color: "bg-blue-100 text-blue-600",
  },
  {
    id: "2",
    title: "Quiz Score Available",
    message: "Your score for React Hooks Quiz is ready: 92%",
    type: "quiz",
    read: false,
    createdAt: "5 hours ago",
    icon: Bell,
    color: "bg-purple-100 text-purple-600",
  },
  {
    id: "3",
    title: "Certificate Earned",
    message: "Congratulations! You earned a certificate for UI/UX Design Fundamentals.",
    type: "certificate",
    read: false,
    createdAt: "2 days ago",
    icon: Award,
    color: "bg-amber-100 text-amber-600",
  },
  {
    id: "4",
    title: "Assignment Reminder",
    message: "ML Model Assignment is due in 3 days. Don't forget to submit!",
    type: "reminder",
    read: true,
    createdAt: "3 days ago",
    icon: Clock,
    color: "bg-rose-100 text-rose-600",
  },
  {
    id: "5",
    title: "System Maintenance",
    message: "Scheduled maintenance on Aug 10 from 2:00 AM to 4:00 AM UTC.",
    type: "system",
    read: true,
    createdAt: "5 days ago",
    icon: AlertCircle,
    color: "bg-gray-100 text-gray-600",
  },
  {
    id: "6",
    title: "Course Progress Update",
    message: "You've completed 50% of Complete Web Development Bootcamp. Keep going!",
    type: "course",
    read: true,
    createdAt: "1 week ago",
    icon: BookOpen,
    color: "bg-blue-100 text-blue-600",
  },
  {
    id: "7",
    title: "Welcome to SmartLMS",
    message: "Welcome aboard! Complete your onboarding to get started.",
    type: "system",
    read: true,
    createdAt: "2 weeks ago",
    icon: Bell,
    color: "bg-indigo-100 text-indigo-600",
  },
];

export default function MessagesPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    if (filter === "read") return n.read;
    return true;
  }).filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="mt-1 text-gray-600">
            Your notifications and updates
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            <CheckCheck className="mr-1.5 h-4 w-4" />
            Mark all as read ({unreadCount})
          </Button>
        )}
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <div className="flex gap-1 rounded-lg border border-gray-200 bg-white p-1">
          {(["all", "unread", "read"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
                filter === f
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {f}
              {f === "unread" && unreadCount > 0 && (
                <span className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] text-white">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Inbox className="h-12 w-12 text-gray-300" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              {searchQuery || filter !== "all"
                ? "No messages found"
                : "No messages yet"}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery
                ? "Try a different search term"
                : filter === "unread"
                  ? "All caught up! No unread messages."
                  : "You'll see notifications and updates here."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filtered.map((notification) => (
            <Card
              key={notification.id}
              className={`transition-colors hover:bg-gray-50 ${
                !notification.read ? "border-indigo-200 bg-indigo-50/30" : ""
              }`}
            >
              <CardContent className="flex items-start gap-4 p-4">
                <div className={`mt-0.5 shrink-0 rounded-lg p-2.5 ${notification.color}`}>
                  <notification.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className={`text-sm font-semibold ${
                          !notification.read ? "text-gray-900" : "text-gray-700"
                        }`}>
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <span className="h-2 w-2 shrink-0 rounded-full bg-indigo-500" />
                        )}
                      </div>
                      <p className="mt-0.5 text-sm text-gray-600">
                        {notification.message}
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        {notification.createdAt}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                          title="Mark as read"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
