"use client";

import { useState } from "react";
import Link from "next/link";
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

interface LiveClass {
  id: string;
  title: string;
  description: string;
  course: string;
  scheduledAt: string;
  duration: string;
  attendees: number;
  status: "upcoming" | "live" | "completed" | "cancelled";
  meetingUrl?: string;
}

interface Recording {
  id: string;
  title: string;
  course: string;
  date: string;
  duration: string;
  views: number;
}

const mockClasses: LiveClass[] = [
  {
    id: "1",
    title: "React Hooks Deep Dive",
    description: "Master useState, useEffect, useContext and custom hooks",
    course: "Advanced React & Next.js Masterclass",
    scheduledAt: "2026-08-10T18:00:00",
    duration: "90 min",
    attendees: 45,
    status: "upcoming",
    meetingUrl: "https://meet.example.com/react-hooks",
  },
  {
    id: "2",
    title: "CSS Grid Workshop",
    description: "Hands-on practice with CSS Grid layout",
    course: "Complete Web Development Bootcamp",
    scheduledAt: "2026-08-08T14:00:00",
    duration: "60 min",
    attendees: 38,
    status: "live",
    meetingUrl: "https://meet.example.com/css-grid",
  },
  {
    id: "3",
    title: "Node.js API Building",
    description: "Build RESTful APIs with Express.js",
    course: "Complete Web Development Bootcamp",
    scheduledAt: "2026-08-05T16:00:00",
    duration: "120 min",
    attendees: 52,
    status: "completed",
  },
  {
    id: "4",
    title: "Git Version Control",
    description: "Learn Git branching, merging, and collaboration",
    course: "DevOps & Cloud Computing",
    scheduledAt: "2026-08-01T10:00:00",
    duration: "45 min",
    attendees: 28,
    status: "completed",
  },
];

const mockRecordings: Recording[] = [
  { id: "1", title: "Node.js API Building", course: "Complete Web Development Bootcamp", date: "2026-08-05", duration: "1:58:23", views: 156 },
  { id: "2", title: "Git Version Control", course: "DevOps & Cloud Computing", date: "2026-08-01", duration: "43:12", views: 89 },
  { id: "3", title: "React State Management", course: "Advanced React & Next.js Masterclass", date: "2026-07-28", duration: "1:15:45", views: 234 },
];

export default function LiveClassesPage() {
  const [classes] = useState<LiveClass[]>(mockClasses);
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCourse, setNewCourse] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [newDuration, setNewDuration] = useState("60");

  const handleSchedule = () => {
    if (newTitle && newDate && newTime) {
      alert(`Class "${newTitle}" scheduled for ${newDate} at ${newTime}`);
      setShowForm(false);
      setNewTitle("");
      setNewDescription("");
      setNewCourse("");
      setNewDate("");
      setNewTime("");
      setNewDuration("60");
    }
  };

  const upcomingClasses = classes.filter((c) => c.status === "upcoming" || c.status === "live");

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
              label="Course"
              placeholder="Which course is this class for?"
              value={newCourse}
              onChange={(e) => setNewCourse(e.target.value)}
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
            <TabsTrigger value="recordings">
              Recordings
              <span className="ml-1.5 rounded-full bg-gray-200 px-1.5 py-0.5 text-xs">
                {mockRecordings.length}
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            <div className="mt-4 space-y-4">
              {upcomingClasses.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <Video className="h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No upcoming classes</h3>
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
                            <Button variant="destructive" size="sm" className="gap-2">
                              <Square className="h-4 w-4" />
                              End Class
                            </Button>
                          ) : (
                            <Button size="sm" className="gap-2">
                              <Play className="h-4 w-4" />
                              Start Class
                            </Button>
                          )}
                          <Button variant="outline" size="sm" className="gap-2">
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

          <TabsContent value="recordings">
            <div className="mt-4 space-y-3">
              {mockRecordings.map((rec) => (
                <Card key={rec.id}>
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="rounded-xl bg-purple-500 p-3">
                      <Video className="h-6 w-6 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-900">{rec.title}</h3>
                      <p className="text-sm text-gray-500">{rec.course}</p>
                      <div className="mt-1 flex items-center gap-4 text-xs text-gray-400">
                        <span>{new Date(rec.date).toLocaleDateString()}</span>
                        <span>Duration: {rec.duration}</span>
                        <span>{rec.views} views</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Play className="h-4 w-4" />
                      Watch
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
