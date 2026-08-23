import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Play,
  Clock,
  Users,
  Star,
  Award,
  BookOpen,
  ChevronRight,
  Check,
  Globe,
  FileText,
  Shield,
  Infinity,
  BarChart3,
  Download,
  Share2,
  Target,
  Zap,
  MessageSquare,
  Trophy,
  Smartphone,
  RefreshCw,
} from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import EnrollButton from "./enroll-button";
import BookmarkButton from "./bookmark-button";
import ShareButton from "./share-button";
import ReviewForm from "./review-form";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

async function getCourse(id: string) {
  try {
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        instructor: {
          select: { id: true, name: true, email: true, avatar: true, bio: true },
        },
        sections: {
          include: {
            lessons: { orderBy: { order: "asc" } },
          },
          orderBy: { order: "asc" },
        },
        _count: { select: { enrollments: true, reviews: true, quizzes: true } },
      },
    });
    return course;
  } catch {
    return null;
  }
}

async function getReviews(id: string) {
  try {
    const reviews = await prisma.review.findMany({
      where: { courseId: id },
      include: { user: { select: { id: true, name: true, avatar: true } } },
      orderBy: { createdAt: "desc" },
      take: 10,
    });
    return reviews;
  } catch {
    return [];
  }
}

async function getInstructorStats(instructorId: string) {
  try {
    const stats = await prisma.course.aggregate({
      where: { instructorId, status: "PUBLISHED" },
      _count: { id: true },
      _sum: { totalStudents: true, revenue: true },
    });
    const avgRating = await prisma.course.aggregate({
      where: { instructorId, status: "PUBLISHED" },
      _avg: { rating: true },
    });
    return {
      courseCount: stats._count.id,
      totalStudents: stats._sum.totalStudents || 0,
      totalRevenue: stats._sum.revenue || 0,
      avgRating: avgRating._avg.rating || 0,
    };
  } catch {
    return { courseCount: 0, totalStudents: 0, totalRevenue: 0, avgRating: 0 };
  }
}

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  const sizeClass = size === "lg" ? "h-5 w-5" : "h-4 w-4";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClass} ${
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let course;
  try {
    course = await getCourse(id);
  } catch {
    course = null;
  }

  if (!course) {
    notFound();
  }

  let userId: string | undefined;
  try {
    const session = await auth();
    userId = session?.user?.id;
  } catch {
    userId = undefined;
  }

  let isBookmarked = false;
  let isEnrolled = false;
  if (userId && course.id) {
    try {
      const bookmark = await prisma.bookmark.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId: course.id,
          },
        },
        select: { id: true },
      });
      isBookmarked = !!bookmark;
    } catch {
      isBookmarked = false;
    }
    try {
      const enrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId: course.id,
          },
        },
        select: { id: true },
      });
      isEnrolled = !!enrollment;
    } catch {
      isEnrolled = false;
    }
  }

  let reviews: any[] = [];
  let instructorStats: any = null;
  try {
    [reviews, instructorStats] = await Promise.all([
      getReviews(id),
      course.instructor ? getInstructorStats(course.instructor.id) : Promise.resolve(null),
    ]);
  } catch {
    reviews = [];
    instructorStats = null;
  }

  const totalLessons =
    course.sections?.reduce(
      (acc: number, s: any) => acc + (s.lessons?.length || 0),
      0
    ) || 0;
  const totalDuration =
    course.sections?.reduce(
      (acc: number, s: any) =>
        acc + (s.lessons?.reduce((la: number, l: any) => la + (l.duration || 0), 0) || 0),
      0
    ) || 0;

  const displayRating = course.rating ?? 0;
  const displayTotalRatings = course.totalRatings ?? 0;
  const displayTotalStudents = course.totalStudents ?? 0;

  const videoLessons = course.sections?.reduce(
    (acc: number, s: any) => acc + (s.lessons?.filter((l: any) => l.type === "VIDEO")?.length || 0),
    0
  ) || 0;

  const textLessons = totalLessons - videoLessons;

  const descriptionLines = course.description
    ? course.description.split("\n").filter((l: string) => l.trim())
    : [];

  const requirementLines = course.prerequisites && course.prerequisites.length > 0
    ? course.prerequisites
    : ["No prior experience required", "A computer with internet access", "Willingness to learn"];

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-900 to-indigo-950">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent" />
          </div>
          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-5">
              {/* Left - Course Info */}
              <div className="lg:col-span-3">
                <nav className="mb-6 flex items-center gap-2 text-sm text-gray-400">
                  <Link href="/courses" className="transition-colors hover:text-white">
                    Courses
                  </Link>
                  <ChevronRight className="h-3 w-3" />
                  {course.category && (
                    <>
                      <span className="transition-colors hover:text-white">{course.category}</span>
                      <ChevronRight className="h-3 w-3" />
                    </>
                  )}
                  <span className="text-white">{course.title}</span>
                </nav>

                <div className="mb-4 flex flex-wrap gap-2">
                  {course.category && (
                    <span className="inline-flex items-center rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300 ring-1 ring-inset ring-indigo-500/20">
                      {course.category}
                    </span>
                  )}
                  {course.level && (
                    <span className="inline-flex items-center rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-300 ring-1 ring-inset ring-amber-500/20">
                      {course.level}
                    </span>
                  )}
                  {course.price === 0 && (
                    <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300 ring-1 ring-inset ring-emerald-500/20">
                      Free Course
                    </span>
                  )}
                  {course.isFeatured && (
                    <span className="inline-flex items-center rounded-full bg-orange-500/10 px-3 py-1 text-xs font-medium text-orange-300 ring-1 ring-inset ring-orange-500/20">
                      Featured
                    </span>
                  )}
                </div>

                <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                  {course.title}
                </h1>

                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-gray-300">
                  {course.shortDescription || descriptionLines[0] || "Master the skills with this comprehensive course designed for all levels."}
                </p>

                {/* Rating & Stats */}
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <StarRating rating={Math.round(displayRating)} size="lg" />
                    <span className="text-lg font-bold text-white">{displayRating.toFixed(1)}</span>
                    <span className="text-sm text-gray-400">
                      ({displayTotalRatings.toLocaleString()} ratings)
                    </span>
                  </div>
                  <div className="h-4 w-px bg-gray-700" />
                  <div className="flex items-center gap-1.5 text-gray-300">
                    <Users className="h-4 w-4" />
                    <span className="text-sm font-medium">{displayTotalStudents.toLocaleString()} students</span>
                  </div>
                </div>

                {/* Instructor */}
                <div className="mt-6 flex items-center gap-3">
                  <img
                    src={course.instructor?.avatar || "/avatars/default.png"}
                    alt={course.instructor?.name || "Instructor"}
                    className="h-10 w-10 rounded-full ring-2 ring-white/10"
                  />
                  <div>
                    <span className="text-sm text-gray-400">Created by</span>
                    <span className="ml-1 text-sm font-semibold text-white hover:underline">
                      {course.instructor?.name}
                    </span>
                  </div>
                </div>

                {/* Meta Stats */}
                <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-gray-500" />
                    {Math.floor(totalDuration / 60)}h {totalDuration % 60}m total
                  </span>
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4 text-gray-500" />
                    {totalLessons} lessons
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Globe className="h-4 w-4 text-gray-500" />
                    {course.language || "English"}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <BarChart3 className="h-4 w-4 text-gray-500" />
                    {course.level || "All Levels"}
                  </span>
                </div>

                {userId && (
                  <div className="mt-6">
                    <BookmarkButton courseId={course.id} initialBookmarked={isBookmarked} />
                  </div>
                )}
              </div>

              {/* Right - Sticky Enroll Card */}
              <div className="lg:col-span-2">
                <div className="sticky top-24">
                  <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 shadow-2xl shadow-black/20">
                    {/* Thumbnail */}
                    <div className="relative aspect-video bg-gray-800">
                      {course.thumbnail ? (
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700">
                          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                            <Play className="h-8 w-8 text-white ml-1" fill="white" />
                          </div>
                        </div>
                      )}
                      {course.price === 0 && (
                        <div className="absolute left-4 top-4">
                          <span className="inline-flex items-center rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
                            FREE
                          </span>
                        </div>
                      )}
                      {course.salePrice && course.price > 0 && (
                        <div className="absolute left-4 top-4">
                          <span className="inline-flex items-center rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
                            {Math.round(((course.price - course.salePrice) / course.price) * 100)}% OFF
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Price & CTA */}
                    <div className="p-6">
                      <div className="mb-5">
                        {course.price === 0 ? (
                          <p className="text-4xl font-extrabold text-white">Free</p>
                        ) : (
                          <div className="flex items-baseline gap-3">
                            {course.salePrice && (
                              <span className="text-lg text-gray-500 line-through">
                                ₦{course.price.toLocaleString()}
                              </span>
                            )}
                            <p className="text-4xl font-extrabold text-white">
                              ₦{(course.salePrice || course.price).toLocaleString()}
                            </p>
                          </div>
                        )}
                      </div>

                      <EnrollButton
                        courseId={course.id}
                        courseName={course.title}
                        price={course.salePrice || course.price}
                        currency="NGN"
                      />

                      <p className="mt-3 text-center text-xs text-gray-500">
                        30-day money-back guarantee
                      </p>

                      <div className="my-5 h-px bg-gray-800" />

                      <h4 className="mb-4 text-sm font-semibold text-white">
                        This course includes:
                      </h4>
                      <ul className="space-y-3">
                        <li className="flex items-center gap-3 text-sm text-gray-300">
                          <Play className="h-4 w-4 text-indigo-400" />
                          {Math.floor(totalDuration / 60)}h {totalDuration % 60}m of HD video
                        </li>
                        <li className="flex items-center gap-3 text-sm text-gray-300">
                          <FileText className="h-4 w-4 text-indigo-400" />
                          {totalLessons} engaging lessons
                        </li>
                        <li className="flex items-center gap-3 text-sm text-gray-300">
                          <Download className="h-4 w-4 text-indigo-400" />
                          Downloadable resources & source code
                        </li>
                        <li className="flex items-center gap-3 text-sm text-gray-300">
                          <Infinity className="h-4 w-4 text-indigo-400" />
                          Full lifetime access
                        </li>
                        <li className="flex items-center gap-3 text-sm text-gray-300">
                          <Shield className="h-4 w-4 text-indigo-400" />
                          Certificate of completion
                        </li>
                        <li className="flex items-center gap-3 text-sm text-gray-300">
                          <Smartphone className="h-4 w-4 text-indigo-400" />
                          Access on mobile, tablet & desktop
                        </li>
                        <li className="flex items-center gap-3 text-sm text-gray-300">
                          <MessageSquare className="h-4 w-4 text-indigo-400" />
                          Direct instructor support via Q&A
                        </li>
                      </ul>

                      <div className="my-5 h-px bg-gray-800" />

                      <ShareButton courseTitle={course.title} courseId={course.id} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-5">
            <div className="lg:col-span-3 space-y-8">

              {/* What You'll Learn - Rich Card */}
              {descriptionLines.length > 0 && (
                <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-6 shadow-sm sm:p-8">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100">
                      <Target className="h-5 w-5 text-indigo-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      What you&apos;ll learn
                    </h2>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {descriptionLines.map((item: string, i: number) => (
                      <div key={i} className="flex items-start gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
                        <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                        </div>
                        <span className="text-sm leading-relaxed text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Requirements */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="mb-5 text-2xl font-bold text-gray-900">Requirements</h2>
                <ul className="space-y-3">
                  {requirementLines.map((req: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                      <Zap className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Course Content / Curriculum */}
              {course.sections && course.sections.length > 0 && (
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                  <h2 className="mb-2 text-2xl font-bold text-gray-900">
                    Course Content
                  </h2>
                  <p className="mb-6 text-sm text-gray-500">
                    {course.sections.length} sections &middot; {totalLessons} lessons &middot;{" "}
                    {Math.floor(totalDuration / 60)}h {totalDuration % 60}m total length
                  </p>
                  <div className="space-y-3">
                    {course.sections.map((section: any, sIdx: number) => {
                      const sectionDuration = section.lessons?.reduce(
                        (acc: number, l: any) => acc + (l.duration || 0), 0
                      ) || 0;
                      return (
                        <details
                          key={section.id}
                          className="group rounded-xl border border-gray-200"
                          open={sIdx === 0}
                        >
                          <summary className="flex cursor-pointer items-center justify-between rounded-xl bg-gray-50 px-5 py-4 transition-colors hover:bg-gray-100">
                            <div className="flex items-center gap-3">
                              <ChevronRight className="h-4 w-4 text-gray-400 transition-transform group-open:rotate-90" />
                              <span className="text-sm font-semibold text-gray-900">
                                Section {sIdx + 1}: {section.title}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <span>{section.lessons?.length || 0} lessons</span>
                              {sectionDuration > 0 && (
                                <span>{Math.floor(sectionDuration / 60)}m</span>
                              )}
                            </div>
                          </summary>
                          {section.lessons && section.lessons.length > 0 && (
                            <div className="divide-y divide-gray-100 border-t border-gray-100">
                              {section.lessons.map((lesson: any) => (
                                <div
                                  key={lesson.id}
                                  className="flex items-center justify-between px-5 py-3 transition-colors hover:bg-gray-50"
                                >
                                  <div className="flex items-center gap-3">
                                    {lesson.type === "VIDEO" ? (
                                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-50">
                                        <Play className="h-3 w-3 text-indigo-600 ml-0.5" fill="currentColor" />
                                      </div>
                                    ) : (
                                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50">
                                        <FileText className="h-3.5 w-3.5 text-emerald-600" />
                                      </div>
                                    )}
                                    <div>
                                      <span className="text-sm font-medium text-gray-800">
                                        {lesson.title}
                                      </span>
                                      {lesson.description && (
                                        <p className="mt-0.5 text-xs text-gray-500 line-clamp-1">
                                          {lesson.description}
                                        </p>
                                      )}
                                    </div>
                                    {lesson.isPreview && (
                                      <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600 ring-1 ring-inset ring-indigo-500/10">
                                        Preview
                                      </span>
                                    )}
                                  </div>
                                  {lesson.duration && (
                                    <span className="text-xs text-gray-400">
                                      {Math.floor(lesson.duration / 60)}:
                                      {String(lesson.duration % 60).padStart(2, "0")}
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </details>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Instructor - Enhanced */}
              {course.instructor && (
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                  <h2 className="mb-6 text-2xl font-bold text-gray-900">Instructor</h2>
                  <div className="flex items-start gap-5">
                    <img
                      src={course.instructor.avatar || "/avatars/default.png"}
                      alt={course.instructor.name || "Instructor"}
                      className="h-20 w-20 shrink-0 rounded-2xl object-cover ring-2 ring-gray-100"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 hover:text-indigo-600 transition-colors">
                        {course.instructor.name}
                      </h3>
                      <p className="mt-0.5 text-sm font-medium text-indigo-600">Instructor</p>
                      {course.instructor.bio && (
                        <p className="mt-3 text-sm leading-relaxed text-gray-600">
                          {course.instructor.bio}
                        </p>
                      )}
                      {instructorStats && (
                        <div className="mt-4 flex flex-wrap gap-4">
                          <div className="flex items-center gap-1.5 text-sm text-gray-600">
                            <BookOpen className="h-4 w-4 text-gray-400" />
                            <span><strong>{instructorStats.courseCount}</strong> courses</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-sm text-gray-600">
                            <Users className="h-4 w-4 text-gray-400" />
                            <span><strong>{instructorStats.totalStudents.toLocaleString()}</strong> students</span>
                          </div>
                          {instructorStats.avgRating > 0 && (
                            <div className="flex items-center gap-1.5 text-sm text-gray-600">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span><strong>{instructorStats.avgRating.toFixed(1)}</strong> avg rating</span>
                            </div>
                          )}
                        </div>
                )}
              </div>

              <ReviewForm
                courseId={course.id}
                isEnrolled={isEnrolled}
                onReviewSubmitted={() => {}}
              />
            </div>
                </div>
              )}

              {/* Reviews */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Student Reviews</h2>
                  <div className="flex items-center gap-2">
                    <StarRating rating={Math.round(displayRating)} />
                    <span className="text-sm font-semibold text-gray-900">
                      {displayRating.toFixed(1)} out of 5
                    </span>
                  </div>
                </div>
                {reviews.length === 0 ? (
                  <div className="py-12 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                      <Star className="h-8 w-8 text-gray-300" />
                    </div>
                    <p className="text-gray-500">
                      No reviews yet. Be the first to review this course!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {reviews.map((review: any) => (
                      <div
                        key={review.id}
                        className="rounded-xl border border-gray-100 p-5"
                      >
                        <div className="flex items-start gap-4">
                          <img
                            src={review.user?.avatar || "/avatars/default.png"}
                            alt={review.user?.name}
                            className="h-10 w-10 shrink-0 rounded-full"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <span className="font-semibold text-gray-900">
                                {review.user?.name}
                              </span>
                              <StarRating rating={review.rating} />
                            </div>
                            <p className="mt-0.5 text-xs text-gray-400">
                              {new Date(review.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                            {review.comment && (
                              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                                {review.comment}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2">
              <div className="sticky top-24 space-y-6">
                {/* Course Details */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <h3 className="mb-5 text-lg font-bold text-gray-900">Course Details</h3>
                  <div className="space-y-4">
                    {[
                      { icon: BookOpen, label: "Lessons", value: totalLessons },
                      { icon: Play, label: "Video Lessons", value: videoLessons },
                      { icon: FileText, label: "Text Lessons", value: textLessons },
                      { icon: Clock, label: "Duration", value: `${Math.floor(totalDuration / 60)}h ${totalDuration % 60}m` },
                      { icon: Users, label: "Students", value: displayTotalStudents.toLocaleString() },
                      { icon: Star, label: "Rating", value: `${displayRating.toFixed(1)} / 5` },
                      ...(course._count.quizzes > 0 ? [{ icon: Target, label: "Quizzes", value: course._count.quizzes }] : []),
                    ].map(({ icon: Icon, label, value }) => (
                      <div key={label} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">
                            <Icon className="h-4 w-4 text-gray-600" />
                          </div>
                          <span className="text-sm text-gray-600">{label}</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{value}</span>
                      </div>
                    ))}
                    {course.level && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">
                            <BarChart3 className="h-4 w-4 text-gray-600" />
                          </div>
                          <span className="text-sm text-gray-600">Level</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{course.level}</span>
                      </div>
                    )}
                    {course.language && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">
                            <Globe className="h-4 w-4 text-gray-600" />
                          </div>
                          <span className="text-sm text-gray-600">Language</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{course.language}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <h3 className="mb-5 text-lg font-bold text-gray-900">Features</h3>
                  <div className="space-y-4">
                    {[
                      { icon: Award, label: "Certificate of Completion", desc: "Showcase your achievement" },
                      { icon: Infinity, label: "Lifetime Access", desc: "Learn at your own pace" },
                      { icon: Smartphone, label: "Mobile Friendly", desc: "Learn anywhere, anytime" },
                      { icon: RefreshCw, label: "Free Updates", desc: "Get new content automatically" },
                      { icon: Trophy, label: "Community Access", desc: "Connect with other learners" },
                    ].map(({ icon: Icon, label, desc }) => (
                      <div key={label} className="flex items-start gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50">
                          <Icon className="h-4 w-4 text-indigo-600" />
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-900">{label}</span>
                          <p className="text-xs text-gray-500">{desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                {course.tags && course.tags.length > 0 && (
                  <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h3 className="mb-4 text-lg font-bold text-gray-900">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {course.tags.map((tag: string) => (
                        <span
                          key={tag}
                          className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-500/10"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
