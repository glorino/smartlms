"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Bell,
  Send,
  Users,
  BookOpen,
  UserCheck,
  Clock,
  CheckCircle2,
  Filter,
  ChevronDown,
  AlertCircle,
  MessageSquare,
  GraduationCap,
  Calendar,
  Trash2,
  Eye,
  EyeOff,
  Search,
  Plus,
  X,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  link: string | null;
  createdAt: string;
}

interface CourseOption {
  id: string;
  title: string;
}

const notificationTypeConfig: Record<string, { icon: typeof Bell; color: string; label: string }> = {
  system: { icon: Bell, color: "bg-blue-100 text-blue-600", label: "System" },
  course: { icon: BookOpen, color: "bg-green-100 text-green-600", label: "Course" },
  instructor: { icon: GraduationCap, color: "bg-purple-100 text-purple-600", label: "Instructor" },
  quiz: { icon: AlertCircle, color: "bg-amber-100 text-amber-600", label: "Quiz" },
  certificate: { icon: CheckCircle2, color: "bg-emerald-100 text-emerald-600", label: "Certificate" },
  announcement: { icon: MessageSquare, color: "bg-rose-100 text-rose-600", label: "Announcement" },
};

function ComposeForm({ onClose, onSent }: { onClose: () => void; onSent: () => void }) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("system");
  const [targetAudience, setTargetAudience] = useState("all_students");
  const [targetCourseId, setTargetCourseId] = useState("");
  const [targetUserIds, setTargetUserIds] = useState("");
  const [sending, setSending] = useState(false);
  const [courses, setCourses] = useState<CourseOption[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("/api/courses?limit=100");
        const data = await res.json();
        setCourses(data.courses?.map((c: any) => ({ id: c.id, title: c.title })) || []);
      } catch {}
    };
    fetchCourses();
  }, []);

  const handleSend = async () => {
    if (!title.trim() || !message.trim()) return;
    setSending(true);

    try {
      const payload: any = {
        title: title.trim(),
        message: message.trim(),
        type,
        targetAudience,
      };

      if (targetAudience === "specific_course" && targetCourseId) {
        payload.targetCourseId = targetCourseId;
      } else if (targetAudience === "individual" && targetUserIds.trim()) {
        payload.targetUserIds = targetUserIds.split(",").map((id: string) => id.trim()).filter(Boolean);
      }

      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        onSent();
        onClose();
      }
    } catch {} finally {
      setSending(false);
    }
  };

  return (
    <Card className="border-2 border-indigo-200">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Send className="h-5 w-5 text-indigo-600" />
          Compose Notification
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Title</label>
          <Input
            placeholder="Notification title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Message</label>
          <Textarea
            placeholder="Write your notification message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="system">System</option>
              <option value="course">Course</option>
              <option value="instructor">Instructor</option>
              <option value="quiz">Quiz</option>
              <option value="certificate">Certificate</option>
              <option value="announcement">Announcement</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Target Audience</label>
            <select
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all_students">All Students</option>
              <option value="specific_course">Specific Course</option>
              <option value="individual">Individual Students</option>
            </select>
          </div>
        </div>

        {targetAudience === "specific_course" && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Select Course</label>
            <select
              value={targetCourseId}
              onChange={(e) => setTargetCourseId(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Choose a course</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>
        )}

        {targetAudience === "individual" && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Student IDs (comma separated)</label>
            <Input
              placeholder="e.g. clxyz123, clxyz456"
              value={targetUserIds}
              onChange={(e) => setTargetUserIds(e.target.value)}
            />
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onClose} disabled={sending}>
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            disabled={!title.trim() || !message.trim() || sending}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700"
          >
            {sending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            Send Notification
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function NotificationItem({ notification, onToggleRead }: { notification: Notification; onToggleRead: (id: string) => void }) {
  const config = notificationTypeConfig[notification.type] || notificationTypeConfig.system;
  const Icon = config.icon;

  return (
    <div
      className={`flex items-start gap-4 rounded-xl border p-4 transition-all hover:shadow-sm ${
        notification.read ? "bg-white border-gray-100" : "bg-indigo-50/50 border-indigo-200"
      }`}
    >
      <div className={`shrink-0 rounded-xl p-2.5 ${config.color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className={`text-sm font-semibold ${notification.read ? "text-gray-700" : "text-gray-900"}`}>
              {notification.title}
            </h4>
            <Badge variant="secondary" className="mt-1 text-[10px]">
              {config.label}
            </Badge>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {!notification.read && (
              <div className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
            )}
            <button
              onClick={() => onToggleRead(notification.id)}
              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              title={notification.read ? "Mark as unread" : "Mark as read"}
            >
              {notification.read ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <p className={`mt-2 text-sm leading-relaxed ${notification.read ? "text-gray-500" : "text-gray-700"}`}>
          {notification.message}
        </p>
        <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
          <Clock className="h-3 w-3" />
          {new Date(notification.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
}

export default function NotificationsPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const role = (user as any)?.role || "STUDENT";

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [showCompose, setShowCompose] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/notifications?filter=${filter}`);
      const data = await res.json();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const handleMarkAllRead = async () => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "mark_read" }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch {}
  };

  const handleToggleRead = async (id: string) => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "mark_read", notificationIds: [id] }),
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
      );
      setUnreadCount((prev) => {
        const notif = notifications.find((n) => n.id === id);
        if (notif && !notif.read) return prev - 1;
        if (notif && notif.read) return prev + 1;
        return prev;
      });
    } catch {}
  };

  const canSendNotifications = role === "ADMIN" || role === "INSTRUCTOR";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="mt-1 text-gray-500">
            {canSendNotifications ? "Manage and send notifications" : "Stay updated with your notifications"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Mark all read
            </Button>
          )}
          {canSendNotifications && (
            <Button
              onClick={() => setShowCompose(!showCompose)}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Compose
            </Button>
          )}
        </div>
      </div>

      {showCompose && (
        <ComposeForm
          onClose={() => setShowCompose(false)}
          onSent={() => fetchNotifications()}
        />
      )}

      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-gray-500" />
        {["all", "unread", "system", "course", "instructor", "announcement"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              filter === f
                ? "bg-indigo-100 text-indigo-700"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f === "unread" && unreadCount > 0 && (
              <span className="ml-1.5 rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      <Card>
        <CardContent className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-12 text-center">
              <Bell className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-4 text-gray-500">No notifications found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onToggleRead={handleToggleRead}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
