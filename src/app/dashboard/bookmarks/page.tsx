"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookMarked,
  Star,
  Users,
  Clock,
  Trash2,
  ExternalLink,
  Search,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";

interface BookmarkedCourse {
  id: string;
  title: string;
  instructor: string;
  category: string;
  rating: number;
  students: number;
  duration: string;
  price: string;
  thumbnail: string;
  bookmarkedAt: string;
}

const fallbackBookmarks: BookmarkedCourse[] = [
  {
    id: "1",
    title: "TypeScript Mastery",
    instructor: "Mike Chen",
    category: "Web Development",
    rating: 4.8,
    students: 1234,
    duration: "12h 30m",
    price: "₦75,000",
    thumbnail: "",
    bookmarkedAt: "2026-08-05",
  },
  {
    id: "2",
    title: "Python for Data Science",
    instructor: "Dr. Lisa Wang",
    category: "Data Science",
    rating: 4.9,
    students: 2345,
    duration: "18h 45m",
    price: "₦89,000",
    thumbnail: "",
    bookmarkedAt: "2026-08-03",
  },
  {
    id: "3",
    title: "Docker & Kubernetes",
    instructor: "Chris Brown",
    category: "DevOps",
    rating: 4.7,
    students: 987,
    duration: "15h 20m",
    price: "₦85,000",
    thumbnail: "",
    bookmarkedAt: "2026-08-01",
  },
];

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkedCourse[]>(fallbackBookmarks);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchBookmarks() {
      try {
        const res = await fetch("/api/bookmarks");
        if (res.ok) {
          const data = await res.json();
          setBookmarks(data.bookmarks || data || []);
        }
      } catch {
        // Use fallback
      } finally {
        setLoading(false);
      }
    }
    fetchBookmarks();
  }, []);

  const filteredBookmarks = bookmarks.filter((b) =>
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRemoveBookmark = (id: string) => {
    setBookmarks(bookmarks.filter((b) => b.id !== id));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Bookmarks</h1>
        <p className="mt-1 text-gray-600">
          Courses you&apos;ve saved for later
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search bookmarks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm focus:border-indigo-500 focus:outline-none"
        />
      </div>

      {/* Bookmarks Grid */}
      {filteredBookmarks.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <BookMarked className="h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No bookmarks yet
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Save courses you&apos;re interested in to view them here
            </p>
            <Link href="/courses">
              <Button className="mt-4">Browse Courses</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBookmarks.map((bookmark) => (
            <Card key={bookmark.id} className="group transition-shadow hover:shadow-md">
              <CardContent className="p-5">
                <div className="mb-3 flex items-start justify-between">
                  <Badge variant="secondary" className="text-xs">
                    {bookmark.category}
                  </Badge>
                  <button
                    onClick={() => handleRemoveBookmark(bookmark.id)}
                    className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex h-24 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100">
                  <BookMarked className="h-10 w-10 text-indigo-400" />
                </div>
                <h3 className="mt-3 font-semibold text-gray-900 group-hover:text-indigo-600">
                  {bookmark.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500">{bookmark.instructor}</p>
                <div className="mt-2 flex items-center gap-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    {bookmark.rating}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    {bookmark.students.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {bookmark.duration}
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-bold text-indigo-600">{bookmark.price}</span>
                  <Link href={`/courses/${bookmark.id}`}>
                    <Button size="sm">
                      View Course
                      <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
