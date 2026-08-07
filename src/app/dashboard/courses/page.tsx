"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Grid,
  List,
  Search,
  Filter,
  Play,
  Check,
  Clock,
  X,
  BookOpen,
} from "lucide-react";
import Sidebar from "@/components/layout/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Spinner } from "@/components/ui/spinner";
import type { Enrollment } from "@/types";

export default function MyCoursesPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    async function loadCourses() {
      try {
        const res = await fetch("/api/enrollments");
        if (res.ok) {
          const data = await res.json();
          setEnrollments(data.enrollments || data || []);
        }
      } catch {
        setEnrollments([]);
      } finally {
        setLoading(false);
      }
    }
    loadCourses();
  }, []);

  const filtered = useMemo(() => {
    return enrollments.filter((e) => {
      const matchesSearch =
        !searchQuery ||
        e.course.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab =
        activeTab === "all" ||
        (activeTab === "in-progress" && e.status === "ACTIVE") ||
        (activeTab === "completed" && e.status === "COMPLETED") ||
        (activeTab === "expired" && e.status === "EXPIRED");
      return matchesSearch && matchesTab;
    });
  }, [enrollments, searchQuery, activeTab]);

  const tabs = [
    { value: "all", label: "All", count: enrollments.length },
    {
      value: "in-progress",
      label: "In Progress",
      count: enrollments.filter((e) => e.status === "ACTIVE").length,
    },
    {
      value: "completed",
      label: "Completed",
      count: enrollments.filter((e) => e.status === "COMPLETED").length,
    },
    {
      value: "expired",
      label: "Expired",
      count: enrollments.filter((e) => e.status === "EXPIRED").length,
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex flex-1 items-center justify-center">
          <Spinner size="lg" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-6 pb-20 md:p-8 md:pb-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
          <p className="mt-1 text-gray-600">
            Manage and track your enrolled courses
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" onValueChange={setActiveTab}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <TabsList>
              {tabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.label}
                  <span className="ml-1.5 rounded-full bg-gray-200 px-1.5 py-0.5 text-xs">
                    {tab.count}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="flex items-center gap-3">
              {/* Search */}
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

              {/* View Toggle */}
              <div className="flex rounded-lg border border-gray-200 bg-white">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`flex h-10 w-10 items-center justify-center rounded-l-lg ${
                    viewMode === "grid"
                      ? "bg-primary text-white"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`flex h-10 w-10 items-center justify-center rounded-r-lg ${
                    viewMode === "list"
                      ? "bg-primary text-white"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <TabsContent value={activeTab}>
            {filtered.length === 0 ? (
              <Card className="mt-6">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <BookOpen className="h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">
                    No courses found
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchQuery
                      ? "Try a different search term"
                      : "You haven't enrolled in any courses yet"}
                  </p>
                  <Link href="/courses">
                    <Button className="mt-4">Browse Courses</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : viewMode === "grid" ? (
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((enrollment) => (
                  <Link
                    key={enrollment.id}
                    href={`/courses/${enrollment.course.id}/learn`}
                  >
                    <Card className="group h-full overflow-hidden transition-shadow hover:shadow-md">
                      <div className="relative h-40 bg-gradient-to-br from-blue-500 to-purple-600">
                        {enrollment.course.thumbnail ? (
                          <img
                            src={enrollment.course.thumbnail}
                            alt={enrollment.course.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <BookOpen className="h-10 w-10 text-white/80" />
                          </div>
                        )}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/30">
                          <Play className="h-12 w-12 text-white opacity-0 transition-opacity group-hover:opacity-100" />
                        </div>
                        <Badge
                          variant={
                            enrollment.status === "COMPLETED"
                              ? "success"
                              : enrollment.status === "EXPIRED"
                              ? "danger"
                              : "default"
                          }
                          className="absolute right-3 top-3"
                        >
                          {enrollment.status}
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="line-clamp-1 font-semibold text-gray-900">
                          {enrollment.course.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {enrollment.course.instructor?.name}
                        </p>
                        <div className="mt-3">
                          <Progress
                            value={enrollment.progress}
                            showValue
                            color={
                              enrollment.status === "COMPLETED"
                                ? "green"
                                : "blue"
                            }
                          />
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            Last:{" "}
                            {new Date(
                              enrollment.completedAt || enrollment.enrolledAt
                            ).toLocaleDateString()}
                          </span>
                          <Button size="sm">
                            {enrollment.progress > 0 ? "Continue" : "Start"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                {filtered.map((enrollment) => (
                  <Link
                    key={enrollment.id}
                    href={`/courses/${enrollment.course.id}/learn`}
                  >
                    <Card className="group transition-shadow hover:shadow-md">
                      <CardContent className="flex items-center gap-4 p-4">
                        <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                          {enrollment.course.thumbnail ? (
                            <img
                              src={enrollment.course.thumbnail}
                              alt={enrollment.course.title}
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
                              <h3 className="font-semibold text-gray-900">
                                {enrollment.course.title}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {enrollment.course.instructor?.name}
                              </p>
                            </div>
                            <Badge
                              variant={
                                enrollment.status === "COMPLETED"
                                  ? "success"
                                  : enrollment.status === "EXPIRED"
                                  ? "danger"
                                  : "default"
                              }
                            >
                              {enrollment.status}
                            </Badge>
                          </div>
                          <div className="mt-2 flex items-center gap-4">
                            <div className="flex-1">
                              <Progress
                                value={enrollment.progress}
                                showValue
                                color={
                                  enrollment.status === "COMPLETED"
                                    ? "green"
                                    : "blue"
                                }
                              />
                            </div>
                            <Button size="sm">
                              {enrollment.progress > 0 ? "Continue" : "Start"}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
