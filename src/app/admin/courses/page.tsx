"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  MoreVertical,
  BookOpen,
  CheckCircle2,
  XCircle,
  Star,
  Users as UsersIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CourseItem {
  id: string;
  title: string;
  instructor: string;
  status: string;
  students: number;
  rating: number;
  price: number;
}

const statusColors: Record<string, string> = {
  PUBLISHED: "bg-emerald-100 text-emerald-700",
  DRAFT: "bg-yellow-100 text-yellow-700",
  ARCHIVED: "bg-gray-100 text-gray-700",
};

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch("/api/courses");
        if (res.ok) {
          const data = await res.json();
          setCourses(data.courses || data || []);
        }
      } catch {
        setCourses([]);
      }
    }
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || course.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPublished = courses.filter((c) => c.status === "PUBLISHED").length;
  const totalDraft = courses.filter((c) => c.status === "DRAFT").length;
  const totalArchived = courses.filter((c) => c.status === "ARCHIVED").length;

  const courseStats = [
    { label: "Total Courses", value: courses.length, icon: BookOpen, color: "bg-blue-500" },
    { label: "Published", value: totalPublished, icon: CheckCircle2, color: "bg-emerald-500" },
    { label: "Draft", value: totalDraft, icon: Edit, color: "bg-yellow-500" },
    { label: "Archived", value: totalArchived, icon: XCircle, color: "bg-gray-500" },
  ];

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`/api/courses/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "PUBLISHED" }),
      });
      if (res.ok) {
        setCourses(courses.map((c) => c.id === id ? { ...c, status: "PUBLISHED" } : c));
        toast.success("Course approved");
      } else {
        toast.error("Failed to approve course");
      }
    } catch {
      toast.error("Failed to approve course");
    }
  };

  const handleReject = async (id: string) => {
    try {
      const res = await fetch(`/api/courses/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "DRAFT" }),
      });
      if (res.ok) {
        setCourses(courses.map((c) => c.id === id ? { ...c, status: "DRAFT" } : c));
        toast.success("Course moved to draft");
      } else {
        toast.error("Failed to update course");
      }
    } catch {
      toast.error("Failed to update course");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this course?")) {
      try {
        const res = await fetch(`/api/courses/${id}`, { method: "DELETE" });
        if (res.ok) {
          setCourses(courses.filter((c) => c.id !== id));
          toast.success("Course deleted");
        } else {
          toast.error("Failed to delete course");
        }
      } catch {
        toast.error("Failed to delete course");
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Courses</h1>
          <p className="mt-1 text-gray-500">View and manage all platform courses</p>
        </div>
        <Link href="/instructor/courses/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Course
          </Button>
        </Link>
      </div>

      {/* Course Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {courseStats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  <p className="mt-1 text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`rounded-xl p-3 ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div className="flex items-center gap-3">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              >
                <option value="all">All Status</option>
                <option value="PUBLISHED">Published</option>
                <option value="DRAFT">Draft</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Courses Table */}
      {courses.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-4 text-lg font-medium text-gray-900">No courses found</p>
            <p className="mt-1 text-sm text-gray-500">No courses have been created yet.</p>
          </CardContent>
        </Card>
      ) : (
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-4 font-medium text-gray-500">Course</th>
                  <th className="px-6 py-4 font-medium text-gray-500">Instructor</th>
                  <th className="px-6 py-4 font-medium text-gray-500">Status</th>
                  <th className="px-6 py-4 font-medium text-gray-500">Students</th>
                  <th className="px-6 py-4 font-medium text-gray-500">Rating</th>
                  <th className="px-6 py-4 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCourses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                          <BookOpen className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{course.title}</p>
                          <p className="text-xs text-gray-500">₦{course.price}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{course.instructor}</td>
                    <td className="px-6 py-4">
                      <Badge className={statusColors[course.status] || ""} variant="outline">
                        {course.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-gray-600">
                        <UsersIcon className="h-4 w-4" />
                        {course.students.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {course.rating > 0 ? (
                        <div className="flex items-center gap-1 text-gray-600">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          {course.rating}
                        </div>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === course.id ? null : course.id)}
                          className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        {openMenuId === course.id && (
                          <div className="absolute right-0 top-full z-10 mt-1 w-44 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                            <Link
                              href={`/courses/${course.id}`}
                              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Eye className="h-4 w-4" />
                              View
                            </Link>
                            <Link
                              href={`/instructor/courses/${course.id}/edit`}
                              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Edit className="h-4 w-4" />
                              Edit
                            </Link>
                            {course.status !== "PUBLISHED" && (
                              <button
                                onClick={() => handleApprove(course.id)}
                                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-emerald-600 hover:bg-emerald-50"
                              >
                                <CheckCircle2 className="h-4 w-4" />
                                Approve
                              </button>
                            )}
                            {course.status === "PUBLISHED" && (
                              <button
                                onClick={() => handleReject(course.id)}
                                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-orange-600 hover:bg-orange-50"
                              >
                                <XCircle className="h-4 w-4" />
                                Reject
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(course.id)}
                              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredCourses.length === 0 && (
            <div className="py-12 text-center text-gray-500">
              No courses found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>
      )}
    </div>
  );
}
