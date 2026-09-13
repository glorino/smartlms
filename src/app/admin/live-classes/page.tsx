"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  Video,
  Plus,
  Calendar,
  Clock,
  Users,
  Play,
  Trash2,
  ExternalLink,
  X,
  Search,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";

interface LiveClass {
  id: string;
  title: string;
  description: string;
  course: string;
  courseId: string;
  instructor: string;
  scheduledAt: string;
  duration: string;
  attendees: number;
  status: "upcoming" | "live" | "completed" | "cancelled";
  meetingUrl?: string;
  platform?: string;
}

interface CourseOption {
  id: string;
  title: string;
}

const platforms = [
  { value: "ZOOM", label: "Zoom" },
  { value: "GOOGLE_MEET", label: "Google Meet" },
  { value: "JITSI", label: "Jitsi" },
  { value: "YOUTUBE_LIVE", label: "YouTube Live" },
];

export default function AdminLiveClassesPage() {
  const [classes, setClasses] = useState<LiveClass[]>([]);
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCourse, setFilterCourse] = useState("all");
  const [upcomingPage, setUpcomingPage] = useState(1);
  const [pastPage, setPastPage] = useState(1);
  const CLASS_PER_PAGE = 10;
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCourseId, setNewCourseId] = useState("");
  const [newPlatform, setNewPlatform] = useState("GOOGLE_MEET");
  const [newMeetingUrl, setNewMeetingUrl] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [newDuration, setNewDuration] = useState("60");

  useEffect(() => {
    async function fetchData() {
      try {
        const [classesRes, coursesRes] = await Promise.all([
          fetch("/api/live-classes"),
          fetch("/api/courses?allStatus=true&limit=100"),
        ]);
        if (classesRes.ok) {
          const data = await classesRes.json();
          const now = new Date();
          setClasses(
            (data.classes || []).map((c: any) => ({
              id: c.id,
              title: c.title,
              description: c.description || "",
              course: c.course?.title || "",
              courseId: c.courseId,
              instructor: c.instructor?.name || "Unknown",
              scheduledAt: c.scheduledAt,
              duration: `${c.duration} min`,
              attendees: c._count?.attendees || 0,
              status: (new Date(c.scheduledAt) < now ? "completed" : "upcoming") as "completed" | "upcoming",
              meetingUrl: c.meetingUrl,
              platform: c.platform,
            }))
          );
        }
        if (coursesRes.ok) {
          const data = await coursesRes.json();
          setCourses(data.courses || []);
        }
      } catch {
        setClasses([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filtered = classes.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.course.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = filterCourse === "all" || c.courseId === filterCourse;
    return matchesSearch && matchesCourse;
  });

  const resetForm = () => {
    setNewTitle("");
    setNewDescription("");
    setNewCourseId("");
    setNewPlatform("GOOGLE_MEET");
    setNewMeetingUrl("");
    setNewDate("");
    setNewTime("");
    setNewDuration("60");
  };

  const handleSchedule = async () => {
    if (!newTitle || !newDate || !newTime || !newCourseId) {
      toast.error("Title, course, date and time are required");
      return;
    }
    setSaving(true);
    try {
      const scheduledAt = new Date(`${newDate}T${newTime}`).toISOString();
      const res = await fetch("/api/live-classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          description: newDescription,
          courseId: newCourseId,
          platform: newPlatform,
          meetingUrl: newMeetingUrl || undefined,
          scheduledAt,
          duration: Number(newDuration),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const lc = data.liveClass;
        setClasses((prev) => [
          {
            id: lc.id,
            title: lc.title,
            description: lc.description || "",
            course: lc.course?.title || "",
            courseId: lc.courseId,
            instructor: lc.instructor?.name || "Admin",
            scheduledAt: lc.scheduledAt,
            duration: `${lc.duration} min`,
            attendees: 0,
            status: "upcoming",
            meetingUrl: lc.meetingUrl,
            platform: lc.platform,
          },
          ...prev,
        ]);
        setShowForm(false);
        resetForm();
        toast.success("Live class scheduled!");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to schedule class");
      }
    } catch {
      toast.error("Failed to schedule class");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (classId: string) => {
    if (!confirm("Are you sure you want to delete this live class?")) return;
    try {
      const res = await fetch(`/api/live-classes/${classId}`, { method: "DELETE" });
      if (res.ok) {
        setClasses((prev) => prev.filter((c) => c.id !== classId));
        toast.success("Live class deleted");
      } else {
        toast.error("Failed to delete class");
      }
    } catch {
      toast.error("Failed to delete class");
    }
  };

  const upcomingClasses = filtered.filter((c) => c.status === "upcoming" || c.status === "live");
  const pastClasses = filtered.filter((c) => c.status === "completed");

  const upcomingTotalPages = Math.ceil(upcomingClasses.length / CLASS_PER_PAGE);
  const paginatedUpcoming = upcomingClasses.slice(
    (upcomingPage - 1) * CLASS_PER_PAGE,
    upcomingPage * CLASS_PER_PAGE
  );
  const upcomingStartItem = (upcomingPage - 1) * CLASS_PER_PAGE + 1;
  const upcomingEndItem = Math.min(upcomingPage * CLASS_PER_PAGE, upcomingClasses.length);

  const pastTotalPages = Math.ceil(pastClasses.length / CLASS_PER_PAGE);
  const paginatedPast = pastClasses.slice(
    (pastPage - 1) * CLASS_PER_PAGE,
    pastPage * CLASS_PER_PAGE
  );
  const pastStartItem = (pastPage - 1) * CLASS_PER_PAGE + 1;
  const pastEndItem = Math.min(pastPage * CLASS_PER_PAGE, pastClasses.length);

  useEffect(() => {
    setUpcomingPage(1);
    setPastPage(1);
  }, [searchQuery, filterCourse]);

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
          <h1 className="text-2xl font-bold text-gray-900">Live Classes</h1>
          <p className="mt-1 text-gray-600">Manage all live sessions across the platform</p>
        </div>
        <Button className="gap-2" onClick={() => { setShowForm(!showForm); if (showForm) resetForm(); }}>
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? "Cancel" : "Schedule New Class"}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Schedule New Live Class</CardTitle>
            <CardDescription>Set up a new live session for any course</CardDescription>
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
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Course</label>
                <select
                  value={newCourseId}
                  onChange={(e) => setNewCourseId(e.target.value)}
                  className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">Select a course</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Platform</label>
                <select
                  value={newPlatform}
                  onChange={(e) => setNewPlatform(e.target.value)}
                  className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {platforms.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <Input
              label="Meeting URL"
              placeholder="https://meet.google.com/xxx-xxxx-xxx"
              value={newMeetingUrl}
              onChange={(e) => setNewMeetingUrl(e.target.value)}
            />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Input label="Date" type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
              <Input label="Time" type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} />
              <Input label="Duration (min)" type="number" value={newDuration} onChange={(e) => setNewDuration(e.target.value)} />
            </div>
            <div className="flex gap-3">
              <Button className="gap-2" onClick={handleSchedule} disabled={saving}>
                {saving ? <Spinner size="sm" /> : <Calendar className="h-4 w-4" />}
                Schedule Class
              </Button>
              <Button variant="outline" onClick={() => { setShowForm(false); resetForm(); }}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by title, instructor, or course..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 rounded-lg border border-gray-200 bg-white pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <select
                value={filterCourse}
                onChange={(e) => setFilterCourse(e.target.value)}
                className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="all">All Courses</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Video className="h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No live classes found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery ? "Try a different search" : "Schedule a new live class to get started"}
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {upcomingClasses.length > 0 && (
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-gray-500 uppercase tracking-wider">Upcoming</h3>
                  <div className="space-y-3">
                    {paginatedUpcoming.map((cls) => (
                      <Card key={cls.id} className={cls.status === "live" ? "border-green-200 bg-green-50/30" : ""}>
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between">
                            <div className="flex gap-4">
                              <div className={`rounded-xl p-3 ${cls.status === "live" ? "bg-green-500" : "bg-blue-500"}`}>
                                <Video className="h-6 w-6 text-white" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold text-gray-900">{cls.title}</h3>
                                  {cls.status === "live" && <Badge variant="success" className="animate-pulse">LIVE</Badge>}
                                  {cls.status === "upcoming" && <Badge variant="default">Upcoming</Badge>}
                                  {cls.platform && <Badge variant="outline">{cls.platform.replace("_", " ")}</Badge>}
                                </div>
                                <p className="mt-1 text-sm text-gray-500">{cls.description}</p>
                                <p className="mt-1 text-xs text-gray-400">
                                  {cls.course} &middot; {cls.instructor}
                                </p>
                                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3.5 w-3.5" />
                                    {new Date(cls.scheduledAt).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3.5 w-3.5" />
                                    {new Date(cls.scheduledAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Users className="h-3.5 w-3.5" />
                                    {cls.attendees} registered
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {cls.meetingUrl && (
                                <Button
                                  size="sm"
                                  className="gap-2"
                                  onClick={() => {
                                    window.open(cls.meetingUrl, "_blank");
                                    toast.success("Opening meeting link");
                                  }}
                                >
                                  <Play className="h-4 w-4" /> Open
                                </Button>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-2"
                                onClick={async () => {
                                  if (cls.meetingUrl) {
                                    await navigator.clipboard.writeText(cls.meetingUrl);
                                    toast.success("Link copied to clipboard");
                                  }
                                }}
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Delete"
                                onClick={() => handleDelete(cls.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  {pastTotalPages > 1 && (
                    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
                      <div className="flex flex-1 justify-between sm:hidden">
                        <button onClick={() => setPastPage(p => Math.max(1, p - 1))} disabled={pastPage === 1} className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">Previous</button>
                        <button onClick={() => setPastPage(p => Math.min(pastTotalPages, p + 1))} disabled={pastPage === pastTotalPages} className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">Next</button>
                      </div>
                      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                        <p className="text-sm text-gray-700">Showing <span className="font-medium">{pastStartItem}</span> to <span className="font-medium">{pastEndItem}</span> of <span className="font-medium">{pastClasses.length}</span></p>
                        <div className="flex gap-1">
                          <button onClick={() => setPastPage(p => Math.max(1, p - 1))} disabled={pastPage === 1} className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">Previous</button>
                          {Array.from({length: Math.min(5, pastTotalPages)}, (_, i) => {
                            const start = Math.max(1, Math.min(pastPage - 2, pastTotalPages - 4));
                            const p = start + i;
                            if (p > pastTotalPages) return null;
                            return <button key={p} onClick={() => setPastPage(p)} className={`relative inline-flex items-center rounded-md border px-3 py-2 text-sm font-medium ${p === pastPage ? 'border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`}>{p}</button>;
                          })}
                          <button onClick={() => setPastPage(p => Math.min(pastTotalPages, p + 1))} disabled={pastPage === pastTotalPages} className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">Next</button>
                        </div>
                      </div>
                    </div>
                  )}
                  {upcomingTotalPages > 1 && (
                    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
                      <div className="flex flex-1 justify-between sm:hidden">
                        <button onClick={() => setUpcomingPage(p => Math.max(1, p - 1))} disabled={upcomingPage === 1} className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">Previous</button>
                        <button onClick={() => setUpcomingPage(p => Math.min(upcomingTotalPages, p + 1))} disabled={upcomingPage === upcomingTotalPages} className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">Next</button>
                      </div>
                      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                        <p className="text-sm text-gray-700">Showing <span className="font-medium">{upcomingStartItem}</span> to <span className="font-medium">{upcomingEndItem}</span> of <span className="font-medium">{upcomingClasses.length}</span></p>
                        <div className="flex gap-1">
                          <button onClick={() => setUpcomingPage(p => Math.max(1, p - 1))} disabled={upcomingPage === 1} className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">Previous</button>
                          {Array.from({length: Math.min(5, upcomingTotalPages)}, (_, i) => {
                            const start = Math.max(1, Math.min(upcomingPage - 2, upcomingTotalPages - 4));
                            const p = start + i;
                            if (p > upcomingTotalPages) return null;
                            return <button key={p} onClick={() => setUpcomingPage(p)} className={`relative inline-flex items-center rounded-md border px-3 py-2 text-sm font-medium ${p === upcomingPage ? 'border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`}>{p}</button>;
                          })}
                          <button onClick={() => setUpcomingPage(p => Math.min(upcomingTotalPages, p + 1))} disabled={upcomingPage === upcomingTotalPages} className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">Next</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {pastClasses.length > 0 && (
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-gray-500 uppercase tracking-wider">Past</h3>
                  <div className="space-y-3">
                    {paginatedPast.map((cls) => (
                      <Card key={cls.id} className="opacity-75">
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between">
                            <div className="flex gap-4">
                              <div className="rounded-xl bg-gray-400 p-3">
                                <Video className="h-6 w-6 text-white" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold text-gray-900">{cls.title}</h3>
                                  <Badge variant="secondary">Completed</Badge>
                                </div>
                                <p className="mt-1 text-xs text-gray-400">
                                  {cls.course} &middot; {cls.instructor}
                                </p>
                                <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3.5 w-3.5" />
                                    {new Date(cls.scheduledAt).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Users className="h-3.5 w-3.5" />
                                    {cls.attendees} attended
                                  </span>
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Delete"
                              onClick={() => handleDelete(cls.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  {pastTotalPages > 1 && (
                    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
                      <div className="flex flex-1 justify-between sm:hidden">
                        <button onClick={() => setPastPage(p => Math.max(1, p - 1))} disabled={pastPage === 1} className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">Previous</button>
                        <button onClick={() => setPastPage(p => Math.min(pastTotalPages, p + 1))} disabled={pastPage === pastTotalPages} className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">Next</button>
                      </div>
                      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                        <p className="text-sm text-gray-700">Showing <span className="font-medium">{pastStartItem}</span> to <span className="font-medium">{pastEndItem}</span> of <span className="font-medium">{pastClasses.length}</span></p>
                        <div className="flex gap-1">
                          <button onClick={() => setPastPage(p => Math.max(1, p - 1))} disabled={pastPage === 1} className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">Previous</button>
                          {Array.from({length: Math.min(5, pastTotalPages)}, (_, i) => {
                            const start = Math.max(1, Math.min(pastPage - 2, pastTotalPages - 4));
                            const p = start + i;
                            if (p > pastTotalPages) return null;
                            return <button key={p} onClick={() => setPastPage(p)} className={`relative inline-flex items-center rounded-md border px-3 py-2 text-sm font-medium ${p === pastPage ? 'border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`}>{p}</button>;
                          })}
                          <button onClick={() => setPastPage(p => Math.min(pastTotalPages, p + 1))} disabled={pastPage === pastTotalPages} className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">Next</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
