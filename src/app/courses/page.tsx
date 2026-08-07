"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  Filter,
  Star,
  Clock,
  Users,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import Navbar from "@/components/layout/navbar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";
import type { Course } from "@/types";

const categoryImages: Record<string, string> = {
  "Web Development": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=450&fit=crop",
  "Data Science": "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=450&fit=crop",
  Marketing: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop",
  Programming: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&h=450&fit=crop",
  Design: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=450&fit=crop",
  Security: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=450&fit=crop",
  Cloud: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=450&fit=crop",
  Finance: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=450&fit=crop",
  Mobile: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=450&fit=crop",
  Data: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop",
};

function getCourseImage(course: Course): string | null {
  if (course.thumbnail) return course.thumbnail;
  if (course.category && categoryImages[course.category]) return categoryImages[course.category];
  return null;
}

const categories = [
  "Web Development",
  "Data Science",
  "Marketing",
  "Programming",
  "Design",
  "Security",
  "Cloud",
  "Finance",
  "Mobile",
  "Data",
];

const levels = ["Beginner", "Intermediate", "Expert"];
const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "popular", label: "Most Popular" },
  { value: "rating", label: "Highest Rated" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
}

function CourseCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="h-48 w-full rounded-none" />
      <CardContent className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-20" />
        </div>
        <Skeleton className="h-3 w-full" />
      </CardContent>
    </Card>
  );
}

function CoursesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [selectedLevel, setSelectedLevel] = useState(searchParams.get("level") || "");
  const [priceFilter, setPriceFilter] = useState(searchParams.get("price") || "");
  const [ratingFilter, setRatingFilter] = useState(searchParams.get("rating") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "newest");
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);
      if (selectedCategory) params.set("category", selectedCategory);
      if (selectedLevel) params.set("level", selectedLevel);
      if (priceFilter) params.set("price", priceFilter);
      if (ratingFilter) params.set("rating", ratingFilter);
      params.set("sort", sortBy);
      params.set("page", String(currentPage));
      params.set("limit", "12");

      const res = await fetch(`/api/courses?${params.toString()}`);
      const data = await res.json();
      setCourses(data.courses || []);
      setTotalPages(data.pagination?.pages || 1);
    } catch {
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory, selectedLevel, priceFilter, ratingFilter, sortBy, currentPage]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedLevel("");
    setPriceFilter("");
    setRatingFilter("");
    setSortBy("newest");
    setCurrentPage(1);
  };

  const hasActiveFilters = selectedCategory || selectedLevel || priceFilter || ratingFilter;

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-primary hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Category */}
      <div>
        <h4 className="mb-3 text-sm font-medium text-gray-900">Category</h4>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label key={cat} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="category"
                checked={selectedCategory === cat}
                onChange={() => setSelectedCategory(selectedCategory === cat ? "" : cat)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-600">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Level */}
      <div>
        <h4 className="mb-3 text-sm font-medium text-gray-900">Level</h4>
        <div className="space-y-2">
          {levels.map((level) => (
            <label key={level} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="level"
                checked={selectedLevel === level}
                onChange={() => setSelectedLevel(selectedLevel === level ? "" : level)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-600">{level}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h4 className="mb-3 text-sm font-medium text-gray-900">Price</h4>
        <div className="space-y-2">
          {["free", "paid"].map((price) => (
            <label key={price} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="price"
                checked={priceFilter === price}
                onChange={() => setPriceFilter(priceFilter === price ? "" : price)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-600 capitalize">{price}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h4 className="mb-3 text-sm font-medium text-gray-900">Rating</h4>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <label key={rating} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="rating"
                checked={ratingFilter === String(rating)}
                onChange={() =>
                  setRatingFilter(ratingFilter === String(rating) ? "" : String(rating))
                }
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <div className="flex items-center gap-1">
                <StarRating rating={rating} />
                <span className="text-sm text-gray-600">& up</span>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Explore Courses</h1>
          <p className="mt-2 text-gray-600">
            Discover thousands of courses to advance your career
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-gray-900 shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </form>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-24 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <FilterSidebar />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 lg:hidden"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                </button>
                {loading ? (
                  <Spinner size="sm" />
                ) : (
                  <p className="text-sm text-gray-500">
                    {courses.length} course{courses.length !== 1 ? "s" : ""} found
                  </p>
                )}
              </div>

              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="mb-4 flex flex-wrap gap-2">
                {selectedCategory && (
                  <Badge variant="secondary" className="gap-1">
                    {selectedCategory}
                    <button onClick={() => setSelectedCategory("")}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {selectedLevel && (
                  <Badge variant="secondary" className="gap-1">
                    {selectedLevel}
                    <button onClick={() => setSelectedLevel("")}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {priceFilter && (
                  <Badge variant="secondary" className="gap-1 capitalize">
                    {priceFilter}
                    <button onClick={() => setPriceFilter("")}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {ratingFilter && (
                  <Badge variant="secondary" className="gap-1">
                    {ratingFilter}+ Stars
                    <button onClick={() => setRatingFilter("")}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
              </div>
            )}

            {/* Course Grid */}
            {loading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <CourseCardSkeleton key={i} />
                ))}
              </div>
            ) : courses.length === 0 ? (
              <div className="rounded-xl border border-gray-200 bg-white py-16 text-center">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  No courses found
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Try adjusting your filters or search terms
                </p>
                <Button onClick={clearFilters} className="mt-4">
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {courses.map((course) => (
                  <Link key={course.id} href={`/courses/${course.id}`}>
                    <Card className="group h-full overflow-hidden transition-shadow hover:shadow-lg">
                      <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600">
                        {getCourseImage(course) ? (
                          <img
                            src={getCourseImage(course)!}
                            alt={course.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <BookOpen className="h-12 w-12 text-white/80" />
                          </div>
                        )}
                        {course.price === 0 && (
                          <Badge className="absolute left-3 top-3 bg-green-500">
                            Free
                          </Badge>
                        )}
                        {course.level && (
                          <Badge variant="outline" className="absolute right-3 top-3 bg-white/90">
                            {course.level}
                          </Badge>
                        )}
                      </div>

                      <CardContent className="p-4">
                        {course.category && (
                          <Badge variant="secondary" className="mb-2 text-xs">
                            {course.category}
                          </Badge>
                        )}
                        <h3 className="line-clamp-2 text-base font-semibold text-gray-900 group-hover:text-primary">
                          {course.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {course.instructor?.name}
                        </p>

                        <div className="mt-3 flex items-center gap-2">
                          <StarRating rating={Math.round(course.rating)} />
                          <span className="text-sm font-medium text-gray-700">
                            {course.rating.toFixed(1)}
                          </span>
                          <span className="text-xs text-gray-400">
                            ({course.totalRatings})
                          </span>
                        </div>

                        <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {course.duration ? `${Math.floor(course.duration / 60)}h ${course.duration % 60}m` : "N/A"}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3.5 w-3.5" />
                            {course.totalStudents.toLocaleString()} students
                          </span>
                        </div>
                      </CardContent>

                      <CardFooter className="border-t border-gray-100 px-4 py-3">
                        <p className="text-lg font-bold text-gray-900">
                          {course.price === 0 ? (
                            "Free"
                          ) : course.salePrice ? (
                            <>
                              <span className="text-gray-400 line-through mr-2 text-sm font-normal">
                                ₦{course.price.toLocaleString()}
                              </span>
                              ₦{course.salePrice.toLocaleString()}
                            </>
                          ) : (
                            `₦${course.price.toLocaleString()}`
                          )}
                        </p>
                      </CardFooter>
                    </Card>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  let page: number;
                  if (totalPages <= 7) {
                    page = i + 1;
                  } else if (currentPage <= 4) {
                    page = i + 1;
                  } else if (currentPage >= totalPages - 3) {
                    page = totalPages - 6 + i;
                  } else {
                    page = currentPage - 3 + i;
                  }
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-10"
                    >
                      {page}
                    </Button>
                  );
                })}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-full max-w-sm overflow-y-auto bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="rounded-lg p-1 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <FilterSidebar />
            <div className="mt-6 flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  clearFilters();
                  setMobileFiltersOpen(false);
                }}
              >
                Clear
              </Button>
              <Button
                className="flex-1"
                onClick={() => setMobileFiltersOpen(false)}
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CoursesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen">
          <Navbar />
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-80 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <CoursesContent />
    </Suspense>
  );
}
