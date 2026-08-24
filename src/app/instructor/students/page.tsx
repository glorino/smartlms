"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Search,
  Download,
  Users,
  BookOpen,
  Clock,
  Filter,
  Mail,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar } from "@/components/ui/avatar";
import StudyGroups from "@/components/ai/study-groups";

interface StudentData {
  userId: string;
  name: string;
  email: string;
  avatar?: string;
  coursesEnrolled: string[];
  progress: number;
  lastActive: string;
}

interface Enrollment {
  id: string;
  progress: number;
  status: string;
  enrolledAt: string;
  course: { id: string; title: string };
  user: { id: string; name: string; email: string; avatar?: string };
}

export default function InstructorStudentsPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCourse, setFilterCourse] = useState("All Courses");

  useEffect(() => {
    async function fetchStudents() {
      try {
        const res = await fetch("/api/enrollments");
        if (res.ok) {
          const data = await res.json();
          setEnrollments(data.enrollments || []);
        }
      } catch {
        // Use empty state
      } finally {
        setLoading(false);
      }
    }
    fetchStudents();
  }, []);

  const students = useMemo(() => {
    const map = new Map<string, StudentData>();
    for (const e of enrollments) {
      const uid = e.user.id;
      if (!map.has(uid)) {
        map.set(uid, {
          userId: uid,
          name: e.user.name,
          email: e.user.email,
          avatar: e.user.avatar,
          coursesEnrolled: [],
          progress: 0,
          lastActive: e.enrolledAt,
        });
      }
      const s = map.get(uid)!;
      s.coursesEnrolled.push(e.course.title);
      s.progress = Math.max(s.progress, Math.round(e.progress));
      if (new Date(e.enrolledAt) > new Date(s.lastActive)) {
        s.lastActive = e.enrolledAt;
      }
    }
    return Array.from(map.values());
  }, [enrollments]);

  const allCourses = useMemo(() => {
    const titles = new Set(enrollments.map((e) => e.course.title));
    return ["All Courses", ...Array.from(titles)];
  }, [enrollments]);

  const filtered = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCourse =
        filterCourse === "All Courses" || student.coursesEnrolled.includes(filterCourse);
      return matchesSearch && matchesCourse;
    });
  }, [students, searchQuery, filterCourse]);

  const stats = {
    totalStudents: students.length,
    activeStudents: students.filter(
      (s) => new Date(s.lastActive) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    ).length,
    avgProgress: students.length > 0
      ? Math.round(students.reduce((acc, s) => acc + s.progress, 0) / students.length)
      : 0,
    totalEnrollments: enrollments.length,
  };

  const handleExport = () => {
    const csv = [
      "Name,Email,Courses Enrolled,Progress,Last Active",
      ...filtered.map(
        (s) =>
          `"${s.name}","${s.email}","${s.coursesEnrolled.join("; ")}",${s.progress}%,"${new Date(s.lastActive).toLocaleDateString()}"`
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "students-export.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Students</h1>
          <p className="mt-1 text-gray-600">
            View and manage students enrolled in your courses
          </p>
        </div>
        <Button variant="outline" className="gap-2" onClick={handleExport}>
          <Download className="h-4 w-4" />
          Export Students
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Students</p>
                <p className="mt-1 text-3xl font-bold text-gray-900">{loading ? "—" : stats.totalStudents}</p>
              </div>
              <div className="rounded-xl bg-blue-500 p-3">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Active This Month</p>
                <p className="mt-1 text-3xl font-bold text-gray-900">{loading ? "—" : stats.activeStudents}</p>
              </div>
              <div className="rounded-xl bg-emerald-500 p-3">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Avg. Progress</p>
                <p className="mt-1 text-3xl font-bold text-gray-900">{loading ? "—" : `${stats.avgProgress}%`}</p>
              </div>
              <div className="rounded-xl bg-amber-500 p-3">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Enrollments</p>
                <p className="mt-1 text-3xl font-bold text-gray-900">{loading ? "—" : stats.totalEnrollments}</p>
              </div>
              <div className="rounded-xl bg-rose-500 p-3">
                <BookOpen className="h-6 w-6 text-white" />
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
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 rounded-lg border border-gray-200 bg-white pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={filterCourse}
                  onChange={(e) => setFilterCourse(e.target.value)}
                  className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {allCourses.map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <p className="text-sm text-gray-400">Loading students...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Users className="h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No students found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery ? "Try a different search term" : "No students enrolled yet"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((student) => (
                <div
                  key={student.userId}
                  className="flex items-center gap-4 rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-md"
                >
                  <Avatar name={student.name} src={student.avatar} size="lg" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{student.name}</h3>
                        <p className="flex items-center gap-1 text-sm text-gray-500">
                          <Mail className="h-3.5 w-3.5" />
                          {student.email}
                        </p>
                      </div>
                      <Badge
                        variant={
                          student.progress >= 80
                            ? "success"
                            : student.progress >= 50
                            ? "default"
                            : "warning"
                        }
                      >
                        {student.progress}% complete
                      </Badge>
                    </div>
                    <div className="mt-2 flex items-center gap-4">
                      <div className="flex-1">
                        <Progress
                          value={student.progress}
                          className="h-2"
                          color={student.progress >= 80 ? "green" : student.progress >= 50 ? "blue" : "yellow"}
                        />
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                      <span>{student.coursesEnrolled.length} course(s) enrolled</span>
                      <span>Last active: {new Date(student.lastActive).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {!loading && enrollments.length > 0 && (
        <StudyGroups
          courseId={enrollments[0].course.id}
          courseName={enrollments[0].course.title}
        />
      )}
    </div>
  );
}
