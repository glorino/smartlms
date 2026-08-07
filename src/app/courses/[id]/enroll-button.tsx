"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EnrollButton({ courseId }: { courseId: string }) {
  const router = useRouter();
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [error, setError] = useState("");

  const handleEnroll = async () => {
    setIsEnrolling(true);
    setError("");
    try {
      const res = await fetch("/api/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });
      const data = await res.json();
      if (res.ok) {
        setEnrolled(true);
        router.refresh();
      } else {
        setError(data.error || "Failed to enroll");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsEnrolling(false);
    }
  };

  if (enrolled) {
    return (
      <Button className="w-full text-base" size="lg" disabled>
        <Check className="mr-2 h-4 w-4" />
        Enrolled
      </Button>
    );
  }

  return (
    <div>
      <Button
        className="w-full text-base"
        size="lg"
        onClick={handleEnroll}
        disabled={isEnrolling}
      >
        {isEnrolling ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Enrolling...
          </>
        ) : (
          "Enroll Now"
        )}
      </Button>
      {error && (
        <p className="mt-2 text-center text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
