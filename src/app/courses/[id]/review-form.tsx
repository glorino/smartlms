"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Star, Send } from "lucide-react";

interface ReviewFormProps {
  courseId: string;
  isEnrolled: boolean;
  onReviewSubmitted?: () => void;
}

export default function ReviewForm({ courseId, isEnrolled, onReviewSubmitted }: ReviewFormProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  if (!session?.user || !isEnrolled) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, rating, comment }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit review");
      }

      setSuccess(true);
      setRating(0);
      setComment("");
      onReviewSubmitted?.();
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-6 rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-6">
      <h3 className="mb-4 text-lg font-bold text-gray-900">Write a Review</h3>

      {success && (
        <div className="mb-4 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
          Your review has been submitted successfully!
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-700 ring-1 ring-inset ring-red-600/20">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Rating</label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="focus:outline-none"
              >
                <Star
                  className={`h-8 w-8 cursor-pointer transition-colors ${
                    star <= (hoverRating || rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300 hover:text-yellow-200"
                  }`}
                />
              </button>
            ))}
            {rating > 0 && (
              <span className="ml-2 text-sm text-gray-500">{rating} out of 5</span>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="comment" className="mb-2 block text-sm font-medium text-gray-700">
            Your Review (optional)
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            placeholder="Share your experience with this course..."
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || rating === 0}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
}
