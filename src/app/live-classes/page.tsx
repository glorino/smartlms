"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Video,
  Calendar,
  Clock,
  Users,
  Play,
  ExternalLink,
  Search,
  Filter,
} from "lucide-react";
import Navbar from "@/components/layout/navbar";

const upcomingClasses = [
  {
    id: "1",
    title: "Advanced React Patterns",
    instructor: "Dr. Sarah Johnson",
    platform: "Zoom",
    scheduledAt: "2026-08-10T14:00:00Z",
    duration: 60,
    enrolled: 45,
    course: "Complete Web Development Bootcamp",
  },
  {
    id: "2",
    title: "Machine Learning Workshop",
    instructor: "Prof. Michael Chen",
    platform: "Google Meet",
    scheduledAt: "2026-08-11T18:00:00Z",
    duration: 90,
    enrolled: 32,
    course: "Machine Learning & AI Masterclass",
  },
  {
    id: "3",
    title: "UI Design Principles",
    instructor: "Emily Rodriguez",
    platform: "Jitsi",
    scheduledAt: "2026-08-12T10:00:00Z",
    duration: 45,
    enrolled: 28,
    course: "UI/UX Design Fundamentals",
  },
  {
    id: "4",
    title: "Python for Data Science",
    instructor: "Dr. Alex Kim",
    platform: "Zoom",
    scheduledAt: "2026-08-13T16:00:00Z",
    duration: 75,
    enrolled: 56,
    course: "Advanced Python Programming",
  },
];

const pastClasses = [
  {
    id: "5",
    title: "Introduction to Web Development",
    instructor: "Dr. Sarah Johnson",
    platform: "Zoom",
    recordedAt: "2026-08-01T14:00:00Z",
    duration: 60,
    viewers: 120,
    recordingUrl: "#",
  },
  {
    id: "6",
    title: "Data Structures Deep Dive",
    instructor: "Prof. Michael Chen",
    platform: "Google Meet",
    recordedAt: "2026-07-28T18:00:00Z",
    duration: 90,
    viewers: 89,
    recordingUrl: "#",
  },
];

const platformColors: Record<string, string> = {
  Zoom: "bg-blue-100 text-blue-700",
  "Google Meet": "bg-green-100 text-green-700",
  Jitsi: "bg-purple-100 text-purple-700",
  "YouTube Live": "bg-red-100 text-red-700",
};

export default function LiveClassesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <div className="gradient-primary py-16">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h1 className="text-4xl font-bold text-white">Live Classes</h1>
          <p className="mt-4 text-lg text-white/80">
            Join live interactive sessions with expert instructors
          </p>
          <div className="mt-6 flex items-center justify-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search live classes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-80 rounded-full border border-white/20 bg-white/10 py-3 pl-10 pr-4 text-white placeholder-white/60 backdrop-blur-sm focus:border-white focus:bg-white/20 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12">
        {/* Upcoming Classes */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Upcoming Live Classes
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {upcomingClasses.map((cls) => (
              <div
                key={cls.id}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {cls.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {cls.course}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${platformColors[cls.platform]}`}
                  >
                    {cls.platform}
                  </span>
                </div>
                <div className="mb-4 flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(cls.scheduledAt)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {cls.duration} min
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {cls.enrolled} enrolled
                  </div>
                </div>
                <p className="mb-4 text-sm text-gray-600">
                  Instructor: {cls.instructor}
                </p>
                <button className="w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700">
                  <Video className="mr-2 inline h-4 w-4" />
                  Join Class
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Past Classes */}
        <section>
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Past Recordings
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {pastClasses.map((cls) => (
              <div
                key={cls.id}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {cls.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {cls.instructor}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${platformColors[cls.platform]}`}
                  >
                    {cls.platform}
                  </span>
                </div>
                <div className="mb-4 flex gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {cls.duration} min
                  </div>
                  <div className="flex items-center gap-1">
                    <Play className="h-4 w-4" />
                    {cls.viewers} views
                  </div>
                </div>
                <button className="w-full rounded-xl border border-gray-300 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50">
                  <Play className="mr-2 inline h-4 w-4" />
                  Watch Recording
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
