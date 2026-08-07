"use client";

import { useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Archive,
  Search,
  Filter,
  MoreVertical,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import Sidebar from "@/components/layout/sidebar";

type Course = {
  id: string;
  title: string;
  instructor: string;
  status: "Published" | "Draft" | "Archived";
  students: number;
  revenue: string;
  thumbnail: string;
};

const mockCourses: Course[] = [
  { id: "1", title: "Advanced React Patterns", instructor: "Sarah Johnson", status: "Published", students: 2341, revenue: "$231,759", thumbnail: "" },
  { id: "2", title: "TypeScript Mastery", instructor: "Mike Chen", status: "Published", students: 1876, revenue: "$148,204", thumbnail: "" },
  { id: "3", title: "Node.js Backend Development", instructor: "Emily Davis", status: "Published", students: 1654, revenue: "$147,206", thumbnail: "" },
  { id: "4", title: "Python for Data Science", instructor: "Alex Wilson", status: "Draft", students: 0, revenue: "$0", thumbnail: "" },
  { id: "5", title: "UI/UX Design Fundamentals", instructor: "Jordan Lee", status: "Published", students: 1210, revenue: "$83,490", thumbnail: "" },
  { id: "6", title: "DevOps Essentials", instructor: "Chris Brown", status: "Archived", students: 890, revenue: "$71,200", thumbnail: "" },
  { id: "7", title: "Machine Learning Basics", instructor: "Dr. Lisa Wang", status: "Draft", students: 0, revenue: "$0", thumbnail: "" },
  { id: "8", title: "Mobile App Development", instructor: "Tom Anderson", status: "Published", students: 1543, revenue: "$118,897", thumbnail: "" },
];

const statusColors = {
  Published: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  Draft: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  Archived: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
};

export default function AdminCoursesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const filteredCourses = mockCourses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || course.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this course?")) {
      console.log("Delete course:", id);
    }
  };

  const handleArchive = (id: string) => {
    console.log("Archive course:", id);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-800">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Course Management</h1>
          <Link
            href="/admin/courses/new"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
          >
            <Plus className="h-4 w-4" />
            Create Course
          </Link>
        </div>

        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="all">All Status</option>
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Courses Table */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Course</th>
                      <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Instructor</th>
                      <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Status</th>
                      <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Students</th>
                      <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Revenue</th>
                      <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {filteredCourses.map((course) => (
                      <tr key={course.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600" />
                            <span className="font-medium text-gray-900 dark:text-white">{course.title}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{course.instructor}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[course.status]}`}>
                            {course.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                          {course.students.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{course.revenue}</td>
                        <td className="px-6 py-4">
                          <div className="relative">
                            <button
                              onClick={() => setOpenMenuId(openMenuId === course.id ? null : course.id)}
                              className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </button>
                            {openMenuId === course.id && (
                              <div className="absolute right-0 top-full z-10 mt-1 w-40 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                                <Link
                                  href={`/courses/${course.id}`}
                                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                >
                                  <Eye className="h-4 w-4" />
                                  View
                                </Link>
                                <Link
                                  href={`/admin/courses/${course.id}/edit`}
                                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                >
                                  <Edit className="h-4 w-4" />
                                  Edit
                                </Link>
                                <button
                                  onClick={() => handleArchive(course.id)}
                                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                >
                                  <Archive className="h-4 w-4" />
                                  Archive
                                </button>
                                <button
                                  onClick={() => handleDelete(course.id)}
                                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
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
                <div className="py-12 text-center text-gray-500 dark:text-gray-400">
                  No courses found matching your criteria.
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
