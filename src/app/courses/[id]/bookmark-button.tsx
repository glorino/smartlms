"use client";

import { useState } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { useRouter } from "next/navigation";

interface BookmarkButtonProps {
  courseId: string;
  initialBookmarked: boolean;
}

export default function BookmarkButton({ courseId, initialBookmarked }: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const router = useRouter();

  async function toggleBookmark() {
    try {
      if (isBookmarked) {
        const res = await fetch(`/api/bookmarks?courseId=${courseId}`, {
          method: "DELETE",
        });
        if (res.ok) {
          setIsBookmarked(false);
        }
      } else {
        const res = await fetch("/api/bookmarks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ courseId }),
        });
        if (res.ok) {
          setIsBookmarked(true);
        }
      }
      router.refresh();
    } catch {
      // silent fail
    }
  }

  return (
    <button
      onClick={toggleBookmark}
      className={`mt-4 rounded-lg p-2 transition-colors ${
        isBookmarked
          ? "bg-indigo-100 text-indigo-700"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }`}
      aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
    >
      {isBookmarked ? (
        <BookmarkCheck className="h-5 w-5 fill-current" />
      ) : (
        <Bookmark className="h-5 w-5" />
      )}
    </button>
  );
}
