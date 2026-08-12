"use client";

import { useState, useEffect } from "react";
import {
  Video,
  Calendar,
  Clock,
  Users,
  Play,
  Search,
  ExternalLink,
  X,
} from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

interface LiveClass {
  id: string;
  title: string;
  instructor: string;
  platform: string;
  scheduledAt: string;
  duration: number;
  enrolled: number;
  course: string;
  meetingUrl: string;
  meetingId: string;
}

const platformColors: Record<string, string> = {
  ZOOM: "bg-blue-100 text-blue-700",
  GOOGLE_MEET: "bg-green-100 text-green-700",
  JITSI: "bg-purple-100 text-purple-700",
  Zoom: "bg-blue-100 text-blue-700",
  "Google Meet": "bg-green-100 text-green-700",
  Jitsi: "bg-purple-100 text-purple-700",
};

export default function LiveClassesPage() {
  const [upcomingClasses, setUpcomingClasses] = useState<LiveClass[]>([]);
  const [pastClasses, setPastClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    async function fetchClasses() {
      try {
        const res = await fetch("/api/live-classes");
        if (res.ok) {
          const data = await res.json();
          const now = new Date();
          const upcoming: LiveClass[] = [];
          const past: any[] = [];

          (data.classes || []).forEach((c: any) => {
            const item = {
              id: c.id,
              title: c.title,
              instructor: c.instructor?.name || "Instructor",
              platform: c.platform || "Zoom",
              scheduledAt: c.scheduledAt,
              duration: c.duration,
              enrolled: c._count?.attendees || 0,
              course: c.course?.title || "",
              meetingUrl: c.meetingUrl || "",
              meetingId: c.meetingUrl || "",
            };

            if (new Date(c.scheduledAt) >= now) {
              upcoming.push(item);
            } else {
              past.push(item);
            }
          });

          setUpcomingClasses(upcoming);
          setPastClasses(past);
        }
      } catch {
        setUpcomingClasses([]);
        setPastClasses([]);
      } finally {
        setLoading(false);
      }
    }
    fetchClasses();
  }, []);

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

  const handleJoinClass = (meetingUrl: string) => {
    if (meetingUrl) {
      window.open(meetingUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleWatchRecording = (recordingUrl: string, title: string) => {
    if (recordingUrl) {
      window.open(recordingUrl, "_blank", "noopener,noreferrer");
    } else {
      setModalMessage(
        `The recording for "${title}" is being processed and will be available soon. Please check back later.`
      );
      setModalOpen(true);
    }
  };

  const filteredUpcoming = upcomingClasses.filter(
    (cls) =>
      cls.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.course.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPast = pastClasses.filter(
    (cls) =>
      cls.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.instructor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="gradient-primary py-16">
          <div className="mx-auto max-w-7xl px-4 text-center">
            <h1 className="text-4xl font-bold text-white">Live Classes</h1>
            <p className="mt-4 text-lg text-white/80">
              Join live interactive sessions with expert instructors
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <>
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
          {filteredUpcoming.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
              <Video className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No upcoming classes</h3>
              <p className="mt-1 text-sm text-gray-500">Check back later for new live sessions</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {filteredUpcoming.map((cls) => (
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
                      className={`rounded-full px-3 py-1 text-xs font-medium ${platformColors[cls.platform] || "bg-gray-100 text-gray-700"}`}
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
                  <button
                    onClick={() => handleJoinClass(cls.meetingUrl)}
                    className="w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
                  >
                    <Video className="mr-2 inline h-4 w-4" />
                    Join Class
                    <ExternalLink className="ml-2 inline h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Past Classes */}
        {filteredPast.length > 0 && (
          <section>
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              Past Recordings
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {filteredPast.map((cls) => (
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
                      className={`rounded-full px-3 py-1 text-xs font-medium ${platformColors[cls.platform] || "bg-gray-100 text-gray-700"}`}
                    >
                      {cls.platform}
                    </span>
                  </div>
                  <div className="mb-4 flex gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {cls.duration} min
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      handleWatchRecording(cls.meetingUrl, cls.title)
                    }
                    className="w-full rounded-xl border border-gray-300 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    <Play className="mr-2 inline h-4 w-4" />
                    Watch Recording
                    {cls.meetingUrl && (
                      <ExternalLink className="ml-2 inline h-3 w-3" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Recording Unavailable
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600">{modalMessage}</p>
            <button
              onClick={() => setModalOpen(false)}
              className="mt-6 w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
    <Footer />
  </>
  );
}
