"use client";

import { Share2, Link2, Check } from "lucide-react";
import { useState } from "react";

interface ShareButtonProps {
  courseTitle: string;
  courseId: string;
}

export default function ShareButton({ courseTitle, courseId }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? `${window.location.origin}/courses/${courseId}` : "";

    if (navigator.share) {
      try {
        await navigator.share({
          title: courseTitle,
          text: `Check out this course: ${courseTitle}`,
          url,
        });
      } catch {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-700 bg-transparent px-4 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 text-green-400" />
          Link Copied!
        </>
      ) : (
        <>
          <Share2 className="h-4 w-4" />
          Share this course
        </>
      )}
    </button>
  );
}
