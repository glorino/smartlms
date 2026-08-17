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

interface CourseData {
  id: string;
  title: string;
  category: string;
  rating: number;
  price: number;
  thumbnail: string | null;
  duration: number | null;
  description: string | null;
}

interface BookmarkRecord {
  id: string;
  course: CourseData;
  createdAt: string;
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchBookmarks() {
      try {
        const res = await fetch("/api/bookmarks");
        if (res.ok) {
          const data = await res.json();
          setBookmarks(data.bookmarks || []);
        }
      } catch {
        setBookmarks([]);
      } finally {
        setLoading(false);
      }
    }
    fetchBookmarks();
  }, []);

  const filteredBookmarks = bookmarks.filter((b) =>
    b.course?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.course?.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRemoveBookmark = async (id: string) => {
    try {
      await fetch(`/api/bookmarks?id=${id}`, { method: "DELETE" });
      setBookmarks(bookmarks.filter((b) => b.id !== id));
    } catch {
      // silent fail
    }
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
                    {bookmark.course?.category || "Uncategorized"}
                  </Badge>
                  <button
                    onClick={() => handleRemoveBookmark(bookmark.id)}
                    className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex h-24 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100">
                  {bookmark.course?.thumbnail ? (
                    <img src={bookmark.course.thumbnail} alt={bookmark.course.title} className="h-full w-full object-cover rounded-lg" />
                  ) : (
                    <BookMarked className="h-10 w-10 text-indigo-400" />
                  )}
                </div>
                <h3 className="mt-3 font-semibold text-gray-900 group-hover:text-indigo-600">
                  {bookmark.course?.title || "Untitled Course"}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {bookmark.course?.duration ? `${Math.floor(bookmark.course.duration / 60)}h ${bookmark.course.duration % 60}m` : "N/A"}
                </p>
                <div className="mt-2 flex items-center gap-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    {bookmark.course?.rating || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    Bookmarked
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-bold text-indigo-600">
                    {bookmark.course?.price === 0 ? "Free" : `₦${bookmark.course?.price?.toLocaleString()}`}
                  </span>
                  <Link href={`/courses/${bookmark.course?.id || bookmark.id}`}>
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
