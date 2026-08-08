"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  Video,
  Plus,
  Calendar,
  Clock,
  Users,
  Play,
  Square,
  ArrowLeft,
  ExternalLink,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Spinner } from "@/components/ui/spinner";

interface LiveClass {
  id: string;
  title: string;
  description: string;
  course: string;
  courseId: string;
  scheduledAt: string;
  duration: string;
  attendees: number;
  status: "upcoming" | "live" | "completed" | "cancelled";
  meetingUrl?: string;
  platform?: string;
}

interface Recording {
  id: string;
  title: string;
  course: string;
  date: string;
  duration: string;
  views: number;
}

export default function LiveClassesPage() {
  const [classes, setClasses] = useState<LiveClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCourseId, setNewCourseId] = useState("");
  newCourseId; // suppress unused warning
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [newDuration, setNewDuration] = useState("60");

  useEffect(() => {
    async function fetchClasses() {
      try {
        const res = await fetch("/api/live-classes");
        if (res.ok) {
          const data = await res.json();
          const now = new Date();
          const mapped: LiveClass[] = (data.classes || []).map((c: any) => ({
            id: c.id,
            title: c.title,
            description: c.description || "",
            course: c.course?.title || "",
            courseId: c.courseId,
            scheduledAt: c.scheduledAt,
            duration: `${c.duration} min`,
            attendees: c._count?.attendees || 0,
            status: new Date(c.scheduledAt) < now ? "completed" : "upcoming",
            meetingUrl: c.meetingUrl,
            platform: c.platform,
          }));
          setClasses(mapped);
        }
      } catch {
        setClasses([]);
      } finally {
        setLoading(false);
      }
    }
    fetchClasses();
  }, []);

  const handleSchedule = async () => {
    if (newTitle && newDate && newTime) {
      try {
        const scheduledAt = new Date(`${newDate}T${newTime}`).toISOString();
        const res = await fetch("/api/live-classes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: newTitle,
            description: newDescription,
            courseId: newCourseId || undefined,
            scheduledAt,
            duration: Number(newDuration),
          }),
        });
        if (res.ok) {
          const data = await res.json();
          setClasses((prev) => [
            {
              id: data.liveClass.id,
              title: data.liveClass.title,
              description: data.liveClass.description || "",
              course: data.liveClass.course?.title || "",
              courseId: data.liveClass.courseId,
              scheduledAt: data.liveClass.scheduledAt,
              duration: `${data.liveClass.duration} min`,
              attendees: 0,
              status: "upcoming",
              meetingUrl: data.liveClass.meetingUrl,
              platform: data.liveClass.platform,
            },
            ...prev,
          ]);
        }
      } catch {
        // handle error
      }
      setShowForm(false);
      setNewTitle("");
      setNewDescription("");
      setNewCourseId("");
      setNewDate("");
      setNewTime("");
      setNewDuration("60");
    }
  };

  const upcomingClasses = classes.filter((c) => c.status === "upcoming" || c.status === "live");

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Live Classes</h1>
          <p className="mt-1 text-gray-600">Schedule and manage your live sessions</p>
        </div>
        <Button className="gap-2" onClick={() => setShowForm(!showForm)}>
          {showForm ? <ArrowLeft className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? "Back to Classes" : "Schedule New Class"}
        </Button>
      </div>

      {showForm ? (
        <Card>
          <CardHeader>
            <CardTitle>Schedule New Live Class</CardTitle>
            <CardDescription>Set up a new live session for your students</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Class Title"
              placeholder="e.g. React Hooks Workshop"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <Textarea
              label="Description"
              placeholder="What will you cover in this class?"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="min-h-[80px]"
            />
            <Input
              label="Course ID"
              placeholder="Enter course ID"
              value={newCourseId}
              onChange={(e) => setNewCourseId(e.target.value)}
            />
            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Date"
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
              />
              <Input
                label="Time"
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
              />
              <Input
                label="Duration (min)"
                type="number"
                value={newDuration}
                onChange={(e) => setNewDuration(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <Button className="gap-2" onClick={handleSchedule}>
                <Calendar className="h-4 w-4" />
                Schedule Class
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="upcoming">
          <TabsList>
            <TabsTrigger value="upcoming">
              Upcoming & Live
              <span className="ml-1.5 rounded-full bg-gray-200 px-1.5 py-0.5 text-xs">
                {upcomingClasses.length}
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            <div className="mt-4 space-y-4">
              {upcomingClasses.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <Video className="h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No live classes scheduled</h3>
                    <p className="mt-1 text-sm text-gray-500">Schedule a new live class to get started</p>
                  </CardContent>
                </Card>
              ) : (
                upcomingClasses.map((cls) => (
                  <Card key={cls.id} className={cls.status === "live" ? "border-green-200 bg-green-50/30" : ""}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-4">
                          <div
                            className={`rounded-xl p-3 ${
                              cls.status === "live"
                                ? "bg-green-500"
                                : "bg-blue-500"
                            }`}
                          >
                            <Video className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-gray-900">{cls.title}</h3>
                              {cls.status === "live" && (
                                <Badge variant="success" className="animate-pulse">
                                  LIVE
                                </Badge>
                              )}
                              {cls.status === "upcoming" && (
                                <Badge variant="default">Upcoming</Badge>
                              )}
                            </div>
                            <p className="mt-1 text-sm text-gray-500">{cls.description}</p>
                            <p className="mt-1 text-xs text-gray-400">{cls.course}</p>
                            <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                {new Date(cls.scheduledAt).toLocaleDateString("en-US", {
                                  weekday: "short",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                {new Date(cls.scheduledAt).toLocaleTimeString("en-US", {
                                  hour: "numeric",
                                  minute: "2-digit",
                                })}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="h-3.5 w-3.5" />
                                {cls.attendees} registered
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {cls.status === "live" ? (
                            <Button
                              variant="destructive"
                              size="sm"
                              className="gap-2"
                              onClick={async () => {
                                try {
                                  const res = await fetch(`/api/live-classes/${cls.id}`, {
                                    method: "PATCH",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ status: "completed" }),
                                  });
                                  if (res.ok) {
                                    setClasses((prev) =>
                                      prev.map((c) =>
                                        c.id === cls.id ? { ...c, status: "completed" as const } : c
                                      )
                                    );
                                    toast.success("Class ended successfully");
                                  } else {
                                    toast.error("Failed to end class");
                                  }
                                } catch {
                                  toast.error("Failed to end class");
                                }
                              }}
                            >
                              <Square className="h-4 w-4" />
                              End Class
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              className="gap-2"
                              onClick={() => {
                                if (cls.meetingUrl) {
                                  window.open(cls.meetingUrl, "_blank");
                                  toast.success("Opening meeting link");
                                } else {
                                  toast.error("No meeting URL available");
                                }
                              }}
                            >
                              <Play className="h-4 w-4" />
                              Start Class
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={async () => {
                              if (cls.meetingUrl) {
                                try {
                                  await navigator.clipboard.writeText(cls.meetingUrl);
                                  toast.success("Link copied to clipboard");
                                } catch {
                                  toast.error("Failed to copy link");
                                }
                              } else {
                                toast.error("No meeting URL available");
                              }
                            }}
                          >
                            <ExternalLink className="h-4 w-4" />
                            Copy Link
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
