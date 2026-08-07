"use client";

import { useState, useMemo } from "react";
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

interface Student {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  coursesEnrolled: string[];
  progress: number;
  lastActive: string;
  enrolledAt: string;
}

const mockStudents: Student[] = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice@example.com",
    coursesEnrolled: ["Complete Web Development Bootcamp", "UI/UX Design Fundamentals"],
    progress: 78,
    lastActive: "2026-08-06",
    enrolledAt: "2026-06-15",
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob@example.com",
    coursesEnrolled: ["Advanced React & Next.js Masterclass"],
    progress: 45,
    lastActive: "2026-08-05",
    enrolledAt: "2026-07-01",
  },
  {
    id: "3",
    name: "Carol Williams",
    email: "carol@example.com",
    coursesEnrolled: ["Complete Web Development Bootcamp", "DevOps & Cloud Computing"],
    progress: 92,
    lastActive: "2026-08-07",
    enrolledAt: "2026-05-20",
  },
  {
    id: "4",
    name: "David Brown",
    email: "david@example.com",
    coursesEnrolled: ["UI/UX Design Fundamentals"],
    progress: 60,
    lastActive: "2026-08-03",
    enrolledAt: "2026-07-10",
  },
  {
    id: "5",
    name: "Emma Davis",
    email: "emma@example.com",
    coursesEnrolled: ["Advanced React & Next.js Masterclass", "DevOps & Cloud Computing"],
    progress: 35,
    lastActive: "2026-08-04",
    enrolledAt: "2026-07-20",
  },
  {
    id: "6",
    name: "Frank Miller",
    email: "frank@example.com",
    coursesEnrolled: ["Complete Web Development Bootcamp"],
    progress: 88,
    lastActive: "2026-08-07",
    enrolledAt: "2026-06-01",
  },
  {
    id: "7",
    name: "Grace Wilson",
    email: "grace@example.com",
    coursesEnrolled: ["UI/UX Design Fundamentals", "Advanced React & Next.js Masterclass"],
    progress: 52,
    lastActive: "2026-08-02",
    enrolledAt: "2026-07-05",
  },
  {
    id: "8",
    name: "Henry Taylor",
    email: "henry@example.com",
    coursesEnrolled: ["DevOps & Cloud Computing"],
    progress: 15,
    lastActive: "2026-07-28",
    enrolledAt: "2026-07-25",
  },
];

const allCourses = [
  "All Courses",
  "Complete Web Development Bootcamp",
  "Advanced React & Next.js Masterclass",
  "UI/UX Design Fundamentals",
  "DevOps & Cloud Computing",
];

export default function InstructorStudentsPage() {
  const [students] = useState<Student[]>(mockStudents);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCourse, setFilterCourse] = useState("All Courses");

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
      (s) => new Date(s.lastActive) >= new Date("2026-08-01")
    ).length,
    avgProgress: Math.round(
      students.reduce((acc, s) => acc + s.progress, 0) / students.length
    ),
    totalEnrollments: students.reduce((acc, s) => acc + s.coursesEnrolled.length, 0),
  };

  const handleExport = () => {
    const csv = [
      "Name,Email,Courses Enrolled,Progress,Last Active,Enrolled At",
      ...filtered.map(
        (s) =>
          `"${s.name}","${s.email}","${s.coursesEnrolled.join("; ")}",${s.progress}%,"${s.lastActive}","${s.enrolledAt}"`
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
                <p className="mt-1 text-3xl font-bold text-gray-900">{stats.totalStudents}</p>
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
                <p className="mt-1 text-3xl font-bold text-gray-900">{stats.activeStudents}</p>
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
                <p className="mt-1 text-3xl font-bold text-gray-900">{stats.avgProgress}%</p>
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
                <p className="mt-1 text-3xl font-bold text-gray-900">{stats.totalEnrollments}</p>
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
          {filtered.length === 0 ? (
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
                  key={student.id}
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
    </div>
  );
}
