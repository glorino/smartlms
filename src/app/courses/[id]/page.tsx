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
} from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import EnrollButton from "./enroll-button";
import BookmarkButton from "./bookmark-button";
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
        _count: { select: { enrollments: true, reviews: true } },
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
  const course = await getCourse(id);

  if (!course) {
    notFound();
  }

  const session = await auth();
  const userId = session?.user?.id;

  let isBookmarked = false;
  if (userId && course.id) {
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
  }

  const reviews = await getReviews(id);
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

  return (
    <>
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <nav className="mb-4 flex items-center gap-2 text-sm text-gray-400">
                <Link href="/courses" className="hover:text-white">
                  Courses
                </Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-white">{course.title}</span>
              </nav>

              <div className="mb-4 flex flex-wrap gap-2">
                {course.category && (
                  <Badge variant="secondary">{course.category}</Badge>
                )}
                {course.level && (
                  <Badge variant="outline" className="border-gray-600 text-gray-300">
                    {course.level}
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl font-bold lg:text-4xl">{course.title}</h1>

              <p className="mt-4 text-lg text-gray-300">
                {course.shortDescription || course.description}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-1">
                  <StarRating rating={Math.round(displayRating)} size="lg" />
                  <span className="ml-1 text-lg font-semibold">
                    {displayRating.toFixed(1)}
                  </span>
                  <span className="text-gray-400">
                    ({displayTotalRatings.toLocaleString()} ratings)
                  </span>
                </div>
                <div className="flex items-center gap-1 text-gray-300">
                  <Users className="h-4 w-4" />
                  {displayTotalStudents.toLocaleString()} students
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <img
                  src={course.instructor?.avatar || "/avatars/default.png"}
                  alt={course.instructor?.name || "Instructor"}
                  className="h-8 w-8 rounded-full"
                />
                <span className="text-gray-300">
                  Created by{" "}
                  <span className="font-medium text-white">
                    {course.instructor?.name}
                  </span>
                </span>
              </div>

               <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-400">
               <span className="flex items-center gap-1">
                 <Clock className="h-4 w-4" />
                 {Math.floor(totalDuration / 60)}h {totalDuration % 60}m total
               </span>
               <span className="flex items-center gap-1">
                 <BookOpen className="h-4 w-4" />
                 {totalLessons} lessons
               </span>
               <span className="flex items-center gap-1">
                 <Globe className="h-4 w-4" />
                 {course.language}
               </span>
             </div>
             {userId && (
               <BookmarkButton courseId={course.id} initialBookmarked={isBookmarked} />
             )}
             </div>

            {/* Sticky CTA Card */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 overflow-hidden">
                <div className="relative h-48 bg-gray-800">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Play className="h-16 w-16 text-gray-600" />
                    </div>
                  )}
                  {course.price === 0 && (
                    <Badge className="absolute left-3 top-3 bg-green-500 text-white">
                      Free
                    </Badge>
                  )}
                </div>
                <CardContent className="p-6">
                  <div className="mb-4">
                    {course.price === 0 ? (
                      <p className="text-3xl font-bold text-gray-900">Free</p>
                    ) : (
                      <div className="flex items-baseline gap-2">
                        {course.salePrice && (
                          <span className="text-lg text-gray-400 line-through">
                            ₦{course.price.toLocaleString()}
                          </span>
                        )}
                        <p className="text-3xl font-bold text-gray-900">
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

                  <p className="mt-3 text-center text-sm text-gray-500">
                    30-day money-back guarantee
                  </p>

                  <Separator className="my-4" />

                  <h4 className="mb-3 text-sm font-semibold text-gray-900">
                    This course includes:
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <Play className="h-4 w-4 text-gray-500" />
                      {Math.floor(totalDuration / 60)}h {totalDuration % 60}m of video
                    </li>
                    <li className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      {totalLessons} lessons
                    </li>
                    <li className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-gray-500" />
                      Certificate of completion
                    </li>
                    <li className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-gray-500" />
                      Lifetime access
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            {/* What You'll Learn */}
            {course.description && (
              <Card>
                <CardHeader>
                  <CardTitle>What you&apos;ll learn</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {course.description
                      .split("\n")
                      .filter(Boolean)
                      .map((item: string, i: number) => (
                        <div key={i} className="flex items-start gap-2">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                          <span className="text-sm text-gray-700">{item}</span>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Course Content / Curriculum */}
            {course.sections && course.sections.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Course Content</CardTitle>
                  <p className="text-sm text-gray-500">
                    {course.sections.length} sections · {totalLessons} lessons ·{" "}
                    {Math.floor(totalDuration / 60)}h {totalDuration % 60}m total
                  </p>
                </CardHeader>
                <CardContent className="space-y-2">
                  {course.sections.map((section: any, sIdx: number) => (
                    <div
                      key={section.id}
                      className="rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center justify-between bg-gray-50 px-4 py-3">
                        <div className="flex items-center gap-2">
                          <ChevronRight className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-900">
                            Section {sIdx + 1}: {section.title}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {section.lessons?.length || 0} lessons
                        </span>
                      </div>
                      {section.lessons && section.lessons.length > 0 && (
                        <div className="divide-y divide-gray-100">
                          {section.lessons.map((lesson: any) => (
                            <div
                              key={lesson.id}
                              className="flex items-center justify-between px-4 py-2.5"
                            >
                              <div className="flex items-center gap-3">
                                {lesson.type === "VIDEO" ? (
                                  <Play className="h-4 w-4 text-gray-400" />
                                ) : (
                                  <FileText className="h-4 w-4 text-gray-400" />
                                )}
                                <span className="text-sm text-gray-700">
                                  {lesson.title}
                                </span>
                                {lesson.isPreview && (
                                  <Badge variant="outline" className="text-xs">
                                    Preview
                                  </Badge>
                                )}
                              </div>
                              {lesson.duration && (
                                <span className="text-xs text-gray-500">
                                  {Math.floor(lesson.duration / 60)}:
                                  {String(lesson.duration % 60).padStart(2, "0")}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Instructor */}
            {course.instructor && (
              <Card>
                <CardHeader>
                  <CardTitle>Instructor</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-4">
                    <img
                      src={course.instructor.avatar || "/avatars/default.png"}
                      alt={course.instructor.name || "Instructor"}
                      className="h-16 w-16 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {course.instructor.name}
                      </h3>
                      <p className="text-sm text-gray-500">Instructor</p>
                      {course.instructor.bio && (
                        <p className="mt-2 text-sm text-gray-600">
                          {course.instructor.bio}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reviews */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Student Reviews</CardTitle>
                  <div className="flex items-center gap-2">
                    <StarRating rating={Math.round(displayRating)} />
                    <span className="text-sm font-medium">
                      {displayRating.toFixed(1)} out of 5
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {reviews.length === 0 ? (
                  <p className="py-8 text-center text-gray-500">
                    No reviews yet. Be the first to review this course!
                  </p>
                ) : (
                  <div className="space-y-6">
                    {reviews.map((review: any) => (
                      <div
                        key={review.id}
                        className="border-b border-gray-100 pb-6 last:border-0"
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src={review.user?.avatar || "/avatars/default.png"}
                            alt={review.user?.name}
                            className="h-10 w-10 rounded-full"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900">
                                {review.user?.name}
                              </span>
                              <StarRating rating={review.rating} />
                            </div>
                            <p className="mt-1 text-sm text-gray-600">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                            {review.comment && (
                              <p className="mt-2 text-sm text-gray-700">
                                {review.comment}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Course Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Lessons</span>
                  <span className="font-medium">{totalLessons}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Duration</span>
                  <span className="font-medium">
                    {Math.floor(totalDuration / 60)}h {totalDuration % 60}m
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Students</span>
                  <span className="font-medium">{displayTotalStudents.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Rating</span>
                  <span className="font-medium">{displayRating.toFixed(1)} / 5</span>
                </div>
                {course.level && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Level</span>
                    <span className="font-medium">{course.level}</span>
                  </div>
                )}
                {course.language && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Language</span>
                    <span className="font-medium">{course.language}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </>
  );
}
