"use client";

import { useState } from "react";
import {
  Video,
  Calendar,
  Clock,
  Users,
  Play,
  Search,
  ExternalLink,
  X,
  Radio,
  History,
  ChevronRight,
  BookOpen,
  User,
  Timer,
} from "lucide-react";
import Link from "next/link";

interface LiveClassData {
  id: string;
  title: string;
  description: string | null;
  platform: string;
  scheduledAt: string;
  duration: number;
  meetingUrl: string | null;
  recordingUrl: string | null;
  isRecorded: boolean;
  instructor: { id: string; name: string; avatar: string | null };
  course: { id: string; title: string; slug: string };
  attendeeCount: number;
  isPast: boolean;
}

const platformConfig: Record<string, { bg: string; text: string; dot: string }> = {
  ZOOM: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  GOOGLE_MEET: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  JITSI: { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500" },
  YOUTUBE_LIVE: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
};

function getTimeUntil(dateStr: string) {
  const now = new Date();
  const target = new Date(dateStr);
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) return null;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

function formatDateTime(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const isTomorrow = d.toDateString() === tomorrow.toDateString();

  const time = d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  if (isToday) return `Today at ${time}`;
  if (isTomorrow) return `Tomorrow at ${time}`;

  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateFull(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function LiveClassesClient({
  initialClasses,
}: {
  initialClasses: LiveClassData[];
}) {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const upcoming = initialClasses.filter((c) => !c.isPast);
  const past = initialClasses.filter((c) => c.isPast);

  const filteredUpcoming = upcoming.filter(
    (cls) =>
      cls.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.instructor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPast = past.filter(
    (cls) =>
      cls.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.instructor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleJoinClass = (meetingUrl: string | null) => {
    if (meetingUrl) {
      window.open(meetingUrl, "_blank", "noopener,noreferrer");
    } else {
      setModalMessage("Meeting link will be available shortly before the class starts.");
      setModalOpen(true);
    }
  };

  const handleWatchRecording = (recordingUrl: string | null, title: string) => {
    if (recordingUrl) {
      window.open(recordingUrl, "_blank", "noopener,noreferrer");
    } else {
      setModalMessage(
        `The recording for "${title}" is being processed and will be available soon. Please check back later.`
      );
      setModalOpen(true);
    }
  };

  const activeClasses = activeTab === "upcoming" ? filteredUpcoming : filteredPast;

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
              <Radio className="h-4 w-4 animate-pulse" />
              Live & Interactive
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              Live Classes
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
              Join live interactive sessions with expert instructors. Ask questions in real-time, collaborate with peers, and master new skills.
            </p>

            {/* Stats */}
            <div className="mt-8 flex items-center justify-center gap-8">
              <div className="text-center">
                <p className="text-3xl font-bold text-white">{upcoming.length}</p>
                <p className="text-sm text-white/60">Upcoming</p>
              </div>
              <div className="h-10 w-px bg-white/20" />
              <div className="text-center">
                <p className="text-3xl font-bold text-white">{past.length}</p>
                <p className="text-sm text-white/60">Recordings</p>
              </div>
              <div className="h-10 w-px bg-white/20" />
              <div className="text-center">
                <p className="text-3xl font-bold text-white">
                  {initialClasses.reduce((acc, c) => acc + c.attendeeCount, 0)}
                </p>
                <p className="text-sm text-white/60">Total Attendees</p>
              </div>
            </div>

            {/* Search */}
            <div className="mt-8 flex justify-center">
              <div className="relative w-full max-w-lg">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search classes, instructors, courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-2xl border border-white/20 bg-white/10 py-3.5 pl-12 pr-4 text-white placeholder-white/50 backdrop-blur-sm transition-all focus:border-white focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="mb-8 flex items-center gap-1 rounded-xl bg-gray-100 p-1">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-all ${
              activeTab === "upcoming"
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Radio className="h-4 w-4" />
            Upcoming Classes
            {upcoming.length > 0 && (
              <span className={`ml-1 rounded-full px-2 py-0.5 text-xs font-bold ${
                activeTab === "upcoming" ? "bg-indigo-100 text-indigo-700" : "bg-gray-200 text-gray-600"
              }`}>
                {upcoming.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-all ${
              activeTab === "past"
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <History className="h-4 w-4" />
            Past Recordings
            {past.length > 0 && (
              <span className={`ml-1 rounded-full px-2 py-0.5 text-xs font-bold ${
                activeTab === "past" ? "bg-indigo-100 text-indigo-700" : "bg-gray-200 text-gray-600"
              }`}>
                {past.length}
              </span>
            )}
          </button>
        </div>

        {/* Class Cards */}
        {activeTab === "upcoming" ? (
          filteredUpcoming.length === 0 ? (
            <EmptyState
              icon={<Radio className="h-10 w-10" />}
              title="No upcoming classes"
              description="Check back later for new live sessions. Instructors regularly schedule new classes."
            />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredUpcoming.map((cls) => (
                <UpcomingCard key={cls.id} cls={cls} onJoin={handleJoinClass} />
              ))}
            </div>
          )
        ) : filteredPast.length === 0 ? (
          <EmptyState
            icon={<History className="h-10 w-10" />}
            title="No past recordings"
            description="Recordings from completed live classes will appear here."
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPast.map((cls) => (
              <PastCard key={cls.id} cls={cls} onWatch={handleWatchRecording} />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Notice</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm leading-relaxed text-gray-600">{modalMessage}</p>
            <button
              onClick={() => setModalOpen(false)}
              className="mt-6 w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function UpcomingCard({
  cls,
  onJoin,
}: {
  cls: LiveClassData;
  onJoin: (url: string | null) => void;
}) {
  const platform = platformConfig[cls.platform] || { bg: "bg-gray-50", text: "text-gray-700", dot: "bg-gray-500" };
  const timeUntil = getTimeUntil(cls.scheduledAt);

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg">
      {/* Top accent bar */}
      <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500" />

      <div className="p-5">
        {/* Header */}
        <div className="mb-3 flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${platform.bg} ${platform.text}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${platform.dot}`} />
              {cls.platform.replace("_", " ")}
            </span>
            {timeUntil && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                <Timer className="h-3 w-3" />
                {timeUntil}
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="mb-1 text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
          {cls.title}
        </h3>

        {/* Course */}
        <Link
          href={`/courses/${cls.course.id}`}
          className="mb-3 inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 hover:underline"
        >
          <BookOpen className="h-3.5 w-3.5" />
          {cls.course.title}
        </Link>

        {/* Description */}
        {cls.description && (
          <p className="mb-4 text-sm text-gray-500 line-clamp-2">{cls.description}</p>
        )}

        {/* Meta */}
        <div className="mb-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4 text-gray-400" />
            {formatDateTime(cls.scheduledAt)}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4 text-gray-400" />
            {cls.duration} minutes
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="h-4 w-4 text-gray-400" />
            {cls.instructor.name}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="h-4 w-4 text-gray-400" />
            {cls.attendeeCount} {cls.attendeeCount === 1 ? "attendee" : "attendees"}
          </div>
        </div>

        {/* Action */}
        <button
          onClick={() => onJoin(cls.meetingUrl)}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white transition-all hover:bg-indigo-700 hover:shadow-md"
        >
          <Video className="h-4 w-4" />
          Join Live Session
          <ExternalLink className="h-3.5 w-3.5 opacity-60" />
        </button>
      </div>
    </div>
  );
}

function PastCard({
  cls,
  onWatch,
}: {
  cls: LiveClassData;
  onWatch: (url: string | null, title: string) => void;
}) {
  const platform = platformConfig[cls.platform] || { bg: "bg-gray-50", text: "text-gray-700", dot: "bg-gray-500" };

  return (
    <div className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg">
      {/* Top accent bar */}
      <div className="h-1.5 bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400" />

      <div className="p-5">
        {/* Header */}
        <div className="mb-3 flex items-start justify-between">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${platform.bg} ${platform.text}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${platform.dot}`} />
            {cls.platform.replace("_", " ")}
          </span>
          {cls.recordingUrl ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
              <Play className="h-3 w-3" fill="currentColor" />
              Recording Ready
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
              <Timer className="h-3 w-3" />
              Processing
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="mb-1 text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
          {cls.title}
        </h3>

        {/* Course */}
        <Link
          href={`/courses/${cls.course.id}`}
          className="mb-3 inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 hover:underline"
        >
          <BookOpen className="h-3.5 w-3.5" />
          {cls.course.title}
        </Link>

        {/* Meta */}
        <div className="mb-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4 text-gray-400" />
            {formatDateFull(cls.scheduledAt)}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4 text-gray-400" />
            {cls.duration} minutes
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="h-4 w-4 text-gray-400" />
            {cls.instructor.name}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="h-4 w-4 text-gray-400" />
            {cls.attendeeCount} attended
          </div>
        </div>

        {/* Action */}
        <button
          onClick={() => onWatch(cls.recordingUrl, cls.title)}
          className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all ${
            cls.recordingUrl
              ? "bg-gray-900 text-white hover:bg-gray-800 hover:shadow-md"
              : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          <Play className="h-4 w-4" fill={cls.recordingUrl ? "currentColor" : "none"} />
          {cls.recordingUrl ? "Watch Recording" : "Recording Pending"}
          {cls.recordingUrl && <ExternalLink className="h-3.5 w-3.5 opacity-60" />}
        </button>
      </div>
    </div>
  );
}

function EmptyState({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-16 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-500">{description}</p>
    </div>
  );
}
