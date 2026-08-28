"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, ShoppingCart, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import PaymentModal from "@/components/payment/payment-modal";

interface EnrollButtonProps {
  courseId: string;
  courseName?: string;
  price?: number;
  currency?: string;
  isEnrolled?: boolean;
}

export default function EnrollButton({
  courseId,
  courseName = "",
  price = 0,
  currency = "NGN",
  isEnrolled: initialEnrolled = false,
}: EnrollButtonProps) {
  const router = useRouter();
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(initialEnrolled);
  const [error, setError] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    setEnrolled(initialEnrolled);
  }, [initialEnrolled]);

  const isFree = price === 0 || price === undefined;

  const handleFreeEnroll = async () => {
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

  const handlePaidEnroll = () => {
    setError("");
    setShowPaymentModal(true);
  };

  if (enrolled) {
    return (
      <Button
        className="w-full text-base"
        size="lg"
        onClick={() => router.push(`/courses/${courseId}/learn`)}
      >
        <Play className="mr-2 h-4 w-4" />
        Start Course
      </Button>
    );
  }

  return (
    <div>
      <Button
        className="w-full text-base"
        size="lg"
        onClick={isFree ? handleFreeEnroll : handlePaidEnroll}
        disabled={isEnrolling}
      >
        {isEnrolling ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Enrolling...
          </>
        ) : isFree ? (
          "Enroll Now"
        ) : (
          <>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Buy Now
          </>
        )}
      </Button>
      {error && (
        <p className="mt-2 text-center text-sm text-red-600">{error}</p>
      )}

      {!isFree && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          courseId={courseId}
          courseName={courseName}
          amount={price}
          currency={currency}
        />
      )}
    </div>
  );
}
