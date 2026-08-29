"use client";

import Link from "next/link";
import { Star, Clock, Users, BookOpen } from "lucide-react";

type Course = {
  id: string;
  title: string;
  instructor: string;
  rating: number;
  reviewCount: number;
  price: number;
  originalPrice?: number;
  thumbnail: string;
  duration: string;
  studentsCount: number;
  lessonsCount: number;
  progress?: number;
  category: string;
};

type CourseCardProps = {
  course: Course;
  variant?: "grid" | "list";
};

export default function CourseCard({ course, variant = "grid" }: CourseCardProps) {
  const discount = course.originalPrice
    ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)
    : 0;

  if (variant === "list") {
    return (
      <Link href={`/courses/${course.id}`}>
        <div className="group flex gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
          <div className="relative h-32 w-48 flex-shrink-0 overflow-hidden rounded-lg">
            <div className="h-full w-full bg-gradient-to-br from-blue-500 to-purple-600" />
            {discount > 0 && (
              <span className="absolute left-2 top-2 rounded bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
                -{discount}%
              </span>
            )}
          </div>
          <div className="flex flex-1 flex-col justify-between">
            <div>
              <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                {course.category}
              </span>
              <h3 className="mt-1 text-lg font-semibold text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                {course.title}
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                by {course.instructor}
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                {course.rating}
                <span className="text-gray-400">({course.reviewCount})</span>
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {course.duration}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {course.studentsCount.toLocaleString()}
              </span>
            </div>
            {course.progress !== undefined && (
              <div className="mt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-400">{course.progress}% complete</span>
                </div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-full rounded-full bg-blue-500"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col items-end justify-between">
            <div className="text-right">
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                &#8358;{course.price.toLocaleString()}
              </span>
              {course.originalPrice && (
                <span className="ml-2 text-sm text-gray-400 line-through">
                  &#8358;{course.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/courses/${course.id}`}>
      <div className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
        <div className="relative aspect-video overflow-hidden">
          <div className="h-full w-full bg-gradient-to-br from-blue-500 to-purple-600 transition-transform duration-300 group-hover:scale-105" />
          {discount > 0 && (
            <span className="absolute left-3 top-3 rounded bg-red-500 px-2 py-1 text-xs font-bold text-white">
              -{discount}%
            </span>
          )}
          <div className="absolute right-3 top-3 rounded-lg bg-black/50 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {course.duration}
          </div>
        </div>
        <div className="p-4">
          <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
            {course.category}
          </span>
          <h3 className="mt-1 line-clamp-2 text-lg font-semibold text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
            {course.title}
          </h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            by {course.instructor}
          </p>
          <div className="mt-3 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              {course.rating}
              <span className="text-gray-400">({course.reviewCount})</span>
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {course.studentsCount.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              {course.lessonsCount} lessons
            </span>
          </div>
          {course.progress !== undefined && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">{course.progress}% complete</span>
              </div>
              <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className="h-full rounded-full bg-blue-500"
                  style={{ width: `${course.progress}%` }}
                />
              </div>
            </div>
          )}
          <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-700">
            <div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                &#8358;{course.price.toLocaleString()}
              </span>
              {course.originalPrice && (
                <span className="ml-2 text-sm text-gray-400 line-through">
                  &#8358;{course.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
