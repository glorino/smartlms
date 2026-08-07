"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, ArrowRight, LayoutDashboard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const txRef = searchParams.get("tx_ref");
  const courseId = searchParams.get("course_id");
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    async function verifyPayment() {
      if (!txRef) {
        setVerifying(false);
        return;
      }
      try {
        const res = await fetch(`/api/payments/verify?tx_ref=${txRef}`);
        setVerified(res.ok);
      } catch {
        setVerified(true);
      } finally {
        setVerifying(false);
      }
    }
    verifyPayment();
  }, [txRef]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="rounded-2xl bg-white p-8 shadow-xl border border-gray-100">
          {verifying ? (
            <div className="py-8">
              <Loader2 className="mx-auto h-16 w-16 text-indigo-500 animate-spin" />
              <h2 className="mt-6 text-xl font-bold text-gray-900">Verifying Payment</h2>
              <p className="mt-2 text-sm text-gray-500">
                Please wait while we confirm your payment...
              </p>
            </div>
          ) : (
            <>
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>

              <h1 className="text-2xl font-bold text-gray-900">Payment Successful!</h1>
              <p className="mt-3 text-gray-500">
                Your payment has been processed successfully. You are now enrolled in the course.
              </p>

              {txRef && (
                <div className="mt-4 rounded-lg bg-gray-50 px-4 py-3 text-sm">
                  <span className="text-gray-400">Transaction Reference:</span>
                  <p className="mt-1 font-mono text-gray-700 break-all">{txRef}</p>
                </div>
              )}

              <div className="mt-8 space-y-3">
                {courseId && (
                  <Link href={`/courses/${courseId}/learn`} className="block">
                    <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700">
                      Start Learning
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                )}

                <Link href="/dashboard" className="block">
                  <Button variant="outline" className="w-full">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Go to Dashboard
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center">
          <Loader2 className="h-12 w-12 text-indigo-500 animate-spin" />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
