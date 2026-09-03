"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Plus,
  Search,
  Edit,
  Eye,
  Trash2,
  BookOpen,
  Users,
  Star,
  DollarSign,
  MoreVertical,
  Filter,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface InstructorCourse {
  id: string;
  title: string;
  status: "PUBLISHED" | "DRAFT";
  totalStudents: number;
  rating: number;
  price: number;
  thumbnail?: string;
  category: string;
  updatedAt: string;
  _count: { enrollments: number; reviews: number };
}

export default function InstructorCoursesPage() {
  const { data: session } = useSession();
  const [courses, setCourses] = useState<InstructorCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "PUBLISHED" | "DRAFT">("all");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [uniqueStudentCount, setUniqueStudentCount] = useState<number | null>(null);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch("/api/courses?allStatus=true&limit=50");
        if (res.ok) {
          const data = await res.json();
          setCourses(data.courses || []);
        }
      } catch {
        // Use empty state
      } finally {
        setLoading(false);
      }
    }
    async function fetchStudentCount() {
      try {
        const res = await fetch("/api/analytics?range=all");
        if (res.ok) {
          const data = await res.json();
          setUniqueStudentCount(data.totalStudents || 0);
        }
      } catch {
        // Fallback to per-course sum
      }
    }
    fetchCourses();
    fetchStudentCount();
  }, []);

  const filtered = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || course.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    totalCourses: courses.length,
    totalStudents: uniqueStudentCount ?? courses.reduce((acc, c) => acc + ((c as any)._count?.enrollments || 0), 0),
    averageRating: Number(
      (courses.filter((c) => c.rating > 0).reduce((acc, c) => acc + c.rating, 0) /
        (courses.filter((c) => c.rating > 0).length || 1)).toFixed(1)
    ),
    publishedCourses: courses.filter((c) => c.status === "PUBLISHED").length,
  };

  const handleDelete = async (courseId: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return;
    setDeleting(courseId);
    try {
      const res = await fetch(`/api/courses/${courseId}`, { method: "DELETE" });
      if (res.ok) {
        setCourses(courses.filter((c) => c.id !== courseId));
      }
    } catch {
      // Handle error
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
          <p className="mt-1 text-gray-600">Manage and monitor your courses</p>
        </div>
        <Link href="/instructor/courses/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create New Course
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Courses</p>
                <p className="mt-1 text-3xl font-bold text-gray-900">{loading ? "—" : stats.totalCourses}</p>
              </div>
              <div className="rounded-xl bg-blue-500 p-3">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Students</p>
                <p className="mt-1 text-3xl font-bold text-gray-900">{loading ? "—" : stats.totalStudents.toLocaleString()}</p>
              </div>
              <div className="rounded-xl bg-emerald-500 p-3">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Average Rating</p>
                <p className="mt-1 text-3xl font-bold text-gray-900">{loading ? "—" : stats.averageRating}</p>
              </div>
              <div className="rounded-xl bg-amber-500 p-3">
                <Star className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Published</p>
                <p className="mt-1 text-3xl font-bold text-gray-900">{loading ? "—" : stats.publishedCourses}</p>
              </div>
              <div className="rounded-xl bg-rose-500 p-3">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 rounded-lg border border-gray-200 bg-white pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
                  className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="all">All Status</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="DRAFT">Draft</option>
                </select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <p className="text-sm text-gray-400">Loading courses...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <BookOpen className="h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No courses found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery ? "Try a different search term" : "Create your first course to get started"}
              </p>
              <Link href="/instructor/courses/new">
                <Button className="mt-4 gap-2">
                  <Plus className="h-4 w-4" />
                  Create Course
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((course) => (
                <div
                  key={course.id}
                  className="flex items-center gap-4 rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-md"
                >
                  <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                    {course.thumbnail ? (
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <BookOpen className="h-6 w-6 text-white/80" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{course.title}</h3>
                        <p className="text-sm text-gray-500">{course.category}</p>
                      </div>
                      <Badge variant={course.status === "PUBLISHED" ? "success" : "secondary"}>
                        {course.status === "PUBLISHED" ? "Published" : "Draft"}
                      </Badge>
                    </div>
                    <div className="mt-2 flex items-center gap-6 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {course.totalStudents || course._count?.enrollments || 0} students
                      </span>
                      {course.rating > 0 && (
                        <span className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          {course.rating}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/instructor/courses/${course.id}/edit`}>
                      <Button variant="ghost" size="icon" title="Edit">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/courses/${course.id}`}>
                      <Button variant="ghost" size="icon" title="Preview">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Delete"
                      onClick={() => handleDelete(course.id)}
                      disabled={deleting === course.id}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
