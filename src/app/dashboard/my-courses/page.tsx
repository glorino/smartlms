"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, Clock, Play, ArrowRight, Search } from "lucide-react";

interface EnrolledItem {
  id: string;
  enrolledAt: string;
  progress: number;
  status: string;
  course: {
    id: string;
    title: string;
    slug: string;
    thumbnail: string | null;
    level: string;
    category: string | null;
    instructor: { name: string } | null;
  };
}

export default function MyCoursesPage() {
  const [enrollments, setEnrollments] = useState<EnrolledItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchEnrolled() {
      try {
        const res = await fetch("/api/enrollments");
        if (res.ok) {
          const data = await res.json();
          setEnrollments(data.enrollments || []);
        }
      } catch {
        setEnrollments([]);
      } finally {
        setLoading(false);
      }
    }
    fetchEnrolled();
  }, []);

  const filtered = enrollments.filter((e) =>
    e.course.title.toLowerCase().includes(search.toLowerCase()) ||
    (e.course.category && e.course.category.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
        <p className="mt-1 text-gray-600">Continue learning from where you left off</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search your courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-gray-100 bg-white p-12 text-center shadow-sm">
          <BookOpen className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            {enrollments.length === 0 ? "No courses yet" : "No courses match your search"}
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            {enrollments.length === 0
              ? "Enroll in a course to start learning"
              : "Try a different search term"}
          </p>
          {enrollments.length === 0 && (
            <Link
              href="/courses"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Browse Courses
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((enrollment) => (
            <Link
              key={enrollment.id}
              href={`/courses/${enrollment.course.id}/learn`}
              className="group overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md"
            >
              <div className="relative aspect-video bg-gray-100">
                {enrollment.course.thumbnail ? (
                  <img
                    src={enrollment.course.thumbnail}
                    alt={enrollment.course.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
                    <Play className="h-12 w-12 text-white/80" fill="white" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="h-2 rounded-full bg-black/30">
                    <div
                      className="h-full rounded-full bg-indigo-500 transition-all"
                      style={{ width: `${enrollment.progress || 0}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs font-medium text-white drop-shadow">
                    {enrollment.progress || 0}% complete
                  </p>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  {enrollment.course.category && (
                    <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-indigo-600">
                      {enrollment.course.category}
                    </span>
                  )}
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-gray-600">
                    {enrollment.course.level}
                  </span>
                </div>
                <h3 className="mt-2 line-clamp-2 text-sm font-semibold text-gray-900 group-hover:text-indigo-600">
                  {enrollment.course.title}
                </h3>
                {enrollment.course.instructor && (
                  <p className="mt-1 text-xs text-gray-500">
                    by {enrollment.course.instructor.name}
                  </p>
                )}
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    Enrolled {new Date(enrollment.enrolledAt).toLocaleDateString()}
                  </span>
                  <span className="text-xs font-medium text-indigo-600 group-hover:underline">
                    Continue
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
