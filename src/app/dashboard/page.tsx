"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  BookOpen,
  Award,
  TrendingUp,
  Clock,
  Play,
  Calendar,
  BarChart3,
  ChevronRight,
  FileCheck,
  ArrowUpRight,
  Users,
  DollarSign,
  Package,
  PlusCircle,
  Flame,
  Target,
  Zap,
  BookMarked,
  Trophy,
  Star,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  GraduationCap,
  Timer,
  Medal,
  Brain,
  Lightbulb,
  TrendingDown,
  RefreshCw,
  Shield,
  Activity,
  BarChart,
  PieChart,
  Rocket,
  AlertTriangle,
  ThumbsUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const motivationalQuotes = [
  "The expert in anything was once a beginner.",
  "Success is the sum of small efforts, repeated day in and day out.",
  "The only way to do great work is to love what you do.",
  "Learning never exhausts the mind.",
  "Education is the passport to the future.",
];

interface Enrollment {
  id: string;
  courseId: string;
  progress: number;
  status: string;
  enrolledAt: string;
  course: { id: string; title: string; slug: string; thumbnail?: string; category?: string; price?: number; level?: string; instructor?: { id: string; name: string; avatar?: string } };
  user?: { id: string; name: string; email: string; avatar?: string };
}

interface QuizAttempt {
  id: string;
  quizTitle: string;
  courseName: string;
  score: number;
  totalPoints: number;
  passed: boolean;
  completedAt: string;
}

interface Certificate {
  id: string;
  title: string;
  certificateId: string;
  issuedAt: string;
  course: { id: string; title: string; slug: string };
}

interface Course {
  id: string;
  title: string;
  slug: string;
  category?: string;
  rating?: number;
  totalStudents: number;
  price: number;
  thumbnail?: string;
  status: string;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const role = (user as any)?.role || "STUDENT";
  const userId = (user as any)?.id;

  const [quote] = useState(
    () => motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
  );

  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([]);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [learningStreak, setLearningStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      try {
        const fetches: Promise<any>[] = [
          fetch("/api/enrollments"),
          fetch("/api/quizzes/attempts"),
          fetch("/api/certificates"),
          fetch("/api/courses?limit=6"),
          fetch("/api/lesson-progress"),
        ];
        if (role === "ADMIN" || role === "INSTRUCTOR") {
          fetches.push(fetch("/api/analytics"));
        }
        const results = await Promise.allSettled(fetches);
        const [enrollRes, quizRes, certRes, courseRes, progressRes] = results;

        if (enrollRes.status === "fulfilled" && enrollRes.value.ok) {
          const data = await enrollRes.value.json();
          setEnrollments(data.enrollments || []);
        }
        if (quizRes.status === "fulfilled" && quizRes.value.ok) {
          const data = await quizRes.value.json();
          setQuizAttempts(data.attempts || []);
        }
        if (certRes.status === "fulfilled" && certRes.value.ok) {
          const data = await certRes.value.json();
          setCertificates(data.certificates || []);
        }
        if (courseRes.status === "fulfilled" && courseRes.value.ok) {
          const data = await courseRes.value.json();
          setRecommendedCourses(data.courses || []);
        }
        if (progressRes.status === "fulfilled" && progressRes.value.ok) {
          const data = await progressRes.value.json();
          const records = data.progress || data || [];
          const activeDates = new Set<string>();
          for (const r of records) {
            const d = r.completedAt;
            if (d) {
              const dateStr = new Date(d).toISOString().slice(0, 10);
              activeDates.add(dateStr);
            }
          }
          let streak = 0;
          const now = new Date();
          for (let i = 0; i < 365; i++) {
            const checkDate = new Date(now);
            checkDate.setDate(checkDate.getDate() - i);
            const dateStr = checkDate.toISOString().slice(0, 10);
            if (activeDates.has(dateStr)) {
              streak++;
            } else if (i > 0) {
              break;
            }
          }
          setLearningStreak(streak);
        }
        const analyticsIdx = role === "ADMIN" || role === "INSTRUCTOR" ? 5 : -1;
        if (analyticsIdx >= 0 && results[analyticsIdx]?.status === "fulfilled" && results[analyticsIdx].value.ok) {
          const data = await results[analyticsIdx].value.json();
          setAnalyticsData(data);
        }
      } catch {
        setLearningStreak(0);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, [role]);

  const completedEnrollments = enrollments.filter((e) => e.status === "COMPLETED");
  const activeEnrollments = enrollments.filter((e) => e.status === "ACTIVE");
  const avgScore = quizAttempts.length > 0
    ? Math.round(quizAttempts.reduce((acc, a) => acc + a.score, 0) / quizAttempts.length)
    : 0;

  const stats =
    role === "ADMIN"
      ? [
          { label: "Total Users", value: analyticsData?.totalStudents ?? "—", icon: Users, color: "bg-blue-500", change: analyticsData?.userGrowth ? `${analyticsData.userGrowth}%` : "", trend: "up" as const, subtitle: "users" },
          { label: "Total Courses", value: analyticsData?.totalCourses ?? "—", icon: BookOpen, color: "bg-emerald-500", change: "", trend: "up" as const, subtitle: "courses" },
          { label: "Revenue", value: analyticsData?.totalRevenue != null ? `₦${Number(analyticsData.totalRevenue).toLocaleString()}` : "—", icon: DollarSign, color: "bg-amber-500", change: analyticsData?.revenueGrowth ? `${analyticsData.revenueGrowth}%` : "", trend: "up" as const, subtitle: "revenue" },
          { label: "Enrollments", value: analyticsData?.totalEnrollments ?? "—", icon: TrendingUp, color: "bg-rose-500", change: analyticsData?.enrollmentGrowth ? `${analyticsData.enrollmentGrowth}%` : "", trend: "up" as const, subtitle: "enrollments" },
        ]
      : role === "INSTRUCTOR"
        ? [
            { label: "My Courses", value: analyticsData?.totalCourses ?? "—", icon: Package, color: "bg-blue-500", change: "", trend: "up" as const, subtitle: "courses" },
            { label: "Total Students", value: analyticsData?.totalStudents ?? "—", icon: Users, color: "bg-emerald-500", change: analyticsData?.userGrowth ? `${analyticsData.userGrowth}%` : "", trend: "up" as const, subtitle: "students" },
            { label: "Earnings", value: analyticsData?.totalRevenue != null ? `₦${Number(analyticsData.totalRevenue).toLocaleString()}` : "—", icon: DollarSign, color: "bg-amber-500", change: analyticsData?.revenueGrowth ? `${analyticsData.revenueGrowth}%` : "", trend: "up" as const, subtitle: "earnings" },
            { label: "Active Courses", value: analyticsData?.totalEnrollments ?? "—", icon: BookOpen, color: "bg-rose-500", change: analyticsData?.enrollmentGrowth ? `${analyticsData.enrollmentGrowth}%` : "", trend: "up" as const, subtitle: "active" },
          ]
        : [
            { label: "Enrolled Courses", value: enrollments.length || 0, icon: BookOpen, color: "bg-blue-500", change: `${activeEnrollments.length} active`, trend: "up" as const, subtitle: "courses" },
            { label: "Completed Courses", value: completedEnrollments.length || 0, icon: Award, color: "bg-emerald-500", change: enrollments.length > 0 ? `${Math.round((completedEnrollments.length / enrollments.length) * 100)}%` : "0%", trend: "up" as const, subtitle: "completed" },
            { label: "Quiz Scores", value: `${avgScore}%`, icon: Target, color: "bg-amber-500", change: quizAttempts.length > 0 ? `${quizAttempts.length} quizzes` : "No quizzes", trend: "up" as const, subtitle: "average" },
            { label: "Certificates", value: certificates.length || 0, icon: Trophy, color: "bg-rose-500", change: certificates.length > 0 ? `Latest: ${new Date(certificates[0].issuedAt).toLocaleDateString()}` : "None yet", trend: "neutral" as const, subtitle: "earned" },
          ];

  const recentActivityData = [
    ...quizAttempts.slice(0, 2).map((a) => ({
      id: a.id,
      type: "quiz" as const,
      title: `Quiz: ${a.quizTitle}`,
      course: a.courseName,
      time: a.completedAt,
      score: Math.round(a.score),
      icon: FileCheck,
      color: "bg-blue-100 text-blue-600",
    })),
    ...certificates.slice(0, 2).map((c) => ({
      id: c.id,
      type: "certificate" as const,
      title: "Earned Certificate",
      course: c.course.title,
      time: c.issuedAt,
      icon: Award,
      color: "bg-amber-100 text-amber-600",
    })),
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 4);

  const recentCourses = role === "INSTRUCTOR"
    ? enrollments.slice(0, 3).map((e) => ({
        id: e.courseId,
        title: e.course.title,
        students: 0,
        status: "Published",
        progress: Math.round(e.progress),
        lastAccessed: "",
        lastLesson: "",
      }))
    : activeEnrollments.slice(0, 3).map((e) => ({
        id: e.courseId,
        title: e.course.title,
        progress: Math.round(e.progress),
        lastAccessed: e.enrolledAt,
        lastLesson: "Continue learning",
        students: 0,
        status: "",
      }));

  const quickActions =
    role === "ADMIN"
      ? [
          { label: "Manage Users", href: "/admin/users", icon: Users, color: "bg-blue-500" },
          { label: "Manage Courses", href: "/admin/courses", icon: BookOpen, color: "bg-emerald-500" },
          { label: "View Analytics", href: "/admin/analytics", icon: BarChart3, color: "bg-amber-500" },
        ]
      : role === "INSTRUCTOR"
        ? [
            { label: "Create Course", href: "/instructor/courses/new", icon: PlusCircle, color: "bg-indigo-500" },
            { label: "View Students", href: "/instructor/students", icon: Users, color: "bg-emerald-500" },
            { label: "Analytics", href: "/instructor/analytics", icon: BarChart3, color: "bg-amber-500" },
          ]
        : [
            { label: "Browse Courses", href: "/courses", icon: BookOpen, color: "bg-indigo-500" },
            { label: "Take Quiz", href: "/dashboard/quizzes", icon: FileCheck, color: "bg-emerald-500" },
            { label: "View Certificates", href: "/dashboard/certificates", icon: Award, color: "bg-amber-500" },
            { label: "Join Live Class", href: "/live-classes", icon: GraduationCap, color: "bg-rose-500" },
          ];

  function formatTimeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  }

  if (role === "ADMIN" || role === "INSTRUCTOR") {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name || "User"} 👋
          </h1>
          <p className="mt-1 text-gray-500">
            {role === "ADMIN"
              ? "Here's your platform overview."
              : "Manage your courses and track performance."}
          </p>
          <Badge className="mt-2" variant={role === "ADMIN" ? "danger" : "warning"}>
            {role}
          </Badge>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const gradients = [
              "from-blue-500 to-blue-600",
              "from-emerald-500 to-emerald-600",
              "from-amber-500 to-orange-500",
              "from-rose-500 to-pink-500",
            ];
            const bgGradients = [
              "from-blue-50 to-blue-100/50",
              "from-emerald-50 to-green-100/50",
              "from-amber-50 to-orange-100/50",
              "from-rose-50 to-pink-100/50",
            ];
            return (
              <Card
                key={stat.label}
                className={`relative overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br ${bgGradients[index] || bgGradients[0]}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                      <p className="text-4xl font-extrabold tracking-tight text-gray-900">
                        {loading ? "—" : stat.value}
                      </p>
                      <div className="flex items-center gap-1.5 pt-1">
                        {stat.trend === "up" ? (
                          <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                            <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none"><path d="M6 2v8M3 5l3-3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            {stat.change}
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600">
                            {stat.change}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className={`rounded-2xl bg-gradient-to-br ${gradients[index] || gradients[0]} p-3.5 shadow-lg`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-end gap-0.5 h-8">
                    {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                      <div
                        key={i}
                        className={`flex-1 rounded-sm bg-gradient-to-t ${gradients[index] || gradients[0]} opacity-30`}
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>My Courses</CardTitle>
                <Link
                  href={role === "INSTRUCTOR" ? "/instructor/courses" : "/courses"}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                >
                  View All <ChevronRight className="inline h-4 w-4" />
                </Link>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="py-12 text-center text-gray-400">Loading...</div>
                ) : recentCourses.length > 0 ? (
                  <div className="space-y-4">
                    {recentCourses.map((course, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-4 rounded-xl border border-gray-100 p-4 transition-colors hover:bg-gray-50"
                      >
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                          <BookOpen className="h-6 w-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="truncate font-medium text-gray-900">
                            {course.title}
                          </h4>
                          <div className="mt-2">
                            <Progress value={course.progress} className="h-2" />
                            <p className="mt-1 text-xs text-gray-400">
                              {course.progress}% complete
                              {course.lastAccessed && ` · ${formatTimeAgo(course.lastAccessed)}`}
                            </p>
                          </div>
                        </div>
                        <Link
                          href={`/courses/${course.id}/learn`}
                          className="shrink-0 rounded-lg bg-indigo-600 p-2 text-white transition-colors hover:bg-indigo-700"
                        >
                          <Play className="h-4 w-4" />
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <BookOpen className="mx-auto h-12 w-12 text-gray-300" />
                    <p className="mt-4 text-gray-500">No courses yet</p>
                    <Link
                      href="/courses"
                      className="mt-4 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                    >
                      Browse Courses
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {quickActions.map((action) => (
                    <Link
                      key={action.label}
                      href={action.href}
                      className="flex items-center gap-3 rounded-xl border border-gray-100 p-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      <action.icon className="h-5 w-5 text-indigo-600" />
                      {action.label}
                      <ArrowUpRight className="ml-auto h-4 w-4 text-gray-400" />
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {loading ? (
                    <div className="py-4 text-center text-gray-400">Loading...</div>
                  ) : recentActivityData.length > 0 ? (
                    recentActivityData.slice(0, 3).map((activity) => (
                      <div key={activity.id} className="flex items-center gap-3 rounded-xl border border-gray-100 p-3">
                        <div className={`rounded-lg p-2 ${activity.color}`}>
                          <activity.icon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                          <p className="text-xs text-gray-500">{formatTimeAgo(activity.time)}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-4 text-center text-gray-400 text-sm">No recent activity</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Student view
  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-8 text-white shadow-xl">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
        <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/10" />
        <div className="absolute right-20 bottom-4 h-20 w-20 rounded-full bg-white/5" />
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-yellow-300" />
            <h1 className="text-3xl font-bold">
              Welcome back, {user?.name || "Student"}! 👋
            </h1>
          </div>
          <p className="mt-3 max-w-xl text-lg text-indigo-100">
            &ldquo;{quote}&rdquo;
          </p>
          <div className="mt-4 flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-300" />
              <span className="text-sm font-medium">{learningStreak} day streak!</span>
            </div>
            <Badge className="bg-white/20 text-white hover:bg-white/30" variant="outline">
              STUDENT
            </Badge>
          </div>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const gradients = [
            "from-blue-500 to-blue-600",
            "from-emerald-500 to-emerald-600",
            "from-amber-500 to-orange-500",
            "from-rose-500 to-pink-500",
          ];
          const bgGradients = [
            "from-blue-50 to-blue-100/50",
            "from-emerald-50 to-green-100/50",
            "from-amber-50 to-orange-100/50",
            "from-rose-50 to-pink-100/50",
          ];
          return (
            <Card
              key={stat.label}
              className={`relative overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 bg-gradient-to-br ${bgGradients[index] || bgGradients[0]}`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-4xl font-extrabold tracking-tight text-gray-900">
                      {loading ? "—" : stat.value}
                    </p>
                    <div className="flex items-center gap-1.5 pt-1">
                      {stat.trend === "up" ? (
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                          <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none"><path d="M6 2v8M3 5l3-3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          {stat.change}
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600">
                          {stat.change}
                        </span>
                      )}
                    </div>
                    {stat.subtitle && (
                      <p className="text-xs text-gray-400">{stat.subtitle}</p>
                    )}
                  </div>
                  <div className={`rounded-2xl bg-gradient-to-br ${gradients[index] || gradients[0]} p-3.5 shadow-lg`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="mt-4 flex items-end gap-0.5 h-8">
                  {[35, 60, 42, 75, 50, 85, 65].map((h, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-sm bg-gradient-to-t ${gradients[index] || gradients[0]} opacity-30`}
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Continue Learning Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b bg-gray-50/50">
              <CardTitle className="flex items-center gap-2">
                <BookMarked className="h-5 w-5 text-indigo-600" />
                Continue Learning
              </CardTitle>
              <Link
                href="/courses"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
              >
                View All <ChevronRight className="inline h-4 w-4" />
              </Link>
            </CardHeader>
            <CardContent className="p-6">
              {loading ? (
                <div className="py-12 text-center text-gray-400">Loading...</div>
              ) : recentCourses.length > 0 ? (
                <div className="space-y-4">
                  {recentCourses.map((course, i) => (
                    <div
                      key={i}
                      className="group rounded-xl border border-gray-100 p-4 transition-all hover:border-indigo-200 hover:shadow-md"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg">
                          <BookOpen className="h-7 w-7" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold text-gray-900 group-hover:text-indigo-600">
                                {course.title}
                              </h4>
                              <p className="mt-1 text-sm text-gray-500">
                                Last: {course.lastLesson}
                              </p>
                            </div>
                            <Badge
                              variant={course.progress >= 75 ? "success" : course.progress >= 40 ? "warning" : "secondary"}
                            >
                              {course.progress}%
                            </Badge>
                          </div>
                          <div className="mt-3">
                            <Progress
                              value={course.progress}
                              className="h-2"
                              color={course.progress >= 75 ? "green" : course.progress >= 40 ? "default" : "blue"}
                            />
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <p className="text-xs text-gray-400">
                              <Clock className="mr-1 inline h-3 w-3" />
                              {formatTimeAgo(course.lastAccessed)}
                            </p>
                            <Link
                              href={`/courses/${course.id}/learn`}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 shadow-sm"
                            >
                              <Play className="h-4 w-4" />
                              Continue
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <BookOpen className="mx-auto h-12 w-12 text-gray-300" />
                  <p className="mt-4 text-gray-500">No courses yet</p>
                  <Link
                    href="/courses"
                    className="mt-4 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                  >
                    Browse Courses
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recommended Courses */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-500" />
                Recommended For You
              </CardTitle>
              <Link
                href="/courses"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
              >
                Browse More <ChevronRight className="inline h-4 w-4" />
              </Link>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="py-8 text-center text-gray-400">Loading...</div>
              ) : recommendedCourses.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {recommendedCourses.slice(0, 3).map((course) => (
                    <div
                      key={course.id}
                      className="group rounded-xl border border-gray-100 p-4 transition-all hover:border-indigo-200 hover:shadow-md"
                    >
                      <div className="flex h-24 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100">
                        <BookOpen className="h-10 w-10 text-indigo-400" />
                      </div>
                      <div className="mt-3">
                        {course.category && (
                          <Badge variant="secondary" className="text-[10px]">
                            {course.category}
                          </Badge>
                        )}
                        <h4 className="mt-2 font-semibold text-gray-900 group-hover:text-indigo-600">
                          {course.title}
                        </h4>
                        <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                          {course.rating && (
                            <>
                              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                              <span>{course.rating}</span>
                              <span className="text-gray-300">·</span>
                            </>
                          )}
                          <span>{course.totalStudents} students</span>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="font-bold text-indigo-600">
                            {course.price === 0 ? "Free" : `₦${course.price.toLocaleString()}`}
                          </span>
                          <Link
                            href={`/courses/${course.id}`}
                            className="text-sm font-medium text-gray-600 hover:text-indigo-600"
                          >
                            Enroll →
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-gray-400 text-sm">No courses available</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Learning Streak */}
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6 text-white">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-white/20 p-3">
                  <Flame className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-sm font-medium text-orange-100">Learning Streak</p>
                  <p className="text-3xl font-bold">{learningStreak} Days</p>
                </div>
              </div>
              <div className="mt-4 flex gap-1">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-8 flex-1 rounded-md ${
                      i < learningStreak
                        ? "bg-white/30"
                        : "bg-white/10"
                    }`}
                  />
                ))}
              </div>
              <div className="mt-2 flex justify-between text-xs text-orange-100">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>
          </Card>

          {/* Upcoming Deadlines */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Timer className="h-5 w-5 text-rose-500" />
                Upcoming Deadlines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activeEnrollments.length === 0 ? (
                  <div className="py-4 text-center text-gray-400 text-sm">No active deadlines</div>
                ) : (
                  activeEnrollments.slice(0, 3).map((enrollment) => (
                    <div
                      key={enrollment.id}
                      className="rounded-xl border border-gray-100 p-3"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 rounded-lg p-1.5 bg-gray-100 text-gray-600">
                          <AlertCircle className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {enrollment.course.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {Math.round(enrollment.progress)}% complete
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity Feed */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Zap className="h-5 w-5 text-blue-500" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-[17px] top-0 bottom-0 w-0.5 bg-gray-100" />
                <div className="space-y-4">
                  {loading ? (
                    <div className="py-4 text-center text-gray-400 text-sm">Loading...</div>
                  ) : recentActivityData.length > 0 ? (
                    recentActivityData.map((activity) => (
                      <div key={activity.id} className="relative flex gap-3">
                        <div
                          className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${activity.color}`}
                        >
                          <activity.icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {activity.title}
                          </p>
                          <p className="text-xs text-gray-500">{activity.course}</p>
                          <div className="mt-1 flex items-center gap-2">
                            <p className="text-xs text-gray-400">{formatTimeAgo(activity.time)}</p>
                            {"score" in activity && activity.score != null && (
                              <Badge variant="success" className="text-[10px]">
                                {(activity as any).score}%
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-4 text-center text-gray-400 text-sm">No recent activity</div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Grid */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action) => (
                  <Link
                    key={action.label}
                    href={action.href}
                    className="group flex flex-col items-center gap-2 rounded-xl border border-gray-100 p-4 text-center transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:shadow-sm"
                  >
                    <div className={`rounded-xl p-3 ${action.color} text-white shadow-md transition-transform group-hover:scale-110`}>
                      <action.icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-medium text-gray-700 group-hover:text-indigo-600">
                      {action.label}
                    </span>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
