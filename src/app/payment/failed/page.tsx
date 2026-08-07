"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";

function PaymentFailedContent() {
  const searchParams = useSearchParams();
  const txRef = searchParams.get("tx_ref");
  const reason = searchParams.get("reason");

  const getErrorMessage = () => {
    switch (reason) {
      case "cancelled":
        return "You cancelled the payment. No charges were made.";
      case "declined":
        return "Your payment was declined. Please check your payment details and try again.";
      case "verification_failed":
        return "We could not verify your payment. Please contact support if you were charged.";
      case "no_course":
        return "Payment reference issue. Please try enrolling again.";
      case "missing_reference":
        return "Payment reference was not found. Please try again.";
      case "server_error":
        return "A server error occurred during payment. Please try again.";
      default:
        return "Something went wrong with your payment. Please try again.";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="rounded-2xl bg-white p-8 shadow-xl border border-gray-100">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-12 w-12 text-red-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900">Payment Failed</h1>
          <p className="mt-3 text-gray-500">{getErrorMessage()}</p>

          {txRef && (
            <div className="mt-4 rounded-lg bg-gray-50 px-4 py-3 text-sm">
              <span className="text-gray-400">Transaction Reference:</span>
              <p className="mt-1 font-mono text-gray-700 break-all">{txRef}</p>
            </div>
          )}

          <div className="mt-8 space-y-3">
            <Link href="/courses" className="block">
              <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </Link>

            <Link href="/dashboard" className="block">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentFailedPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 flex items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-500" />
        </div>
      }
    >
      <PaymentFailedContent />
    </Suspense>
  );
}
