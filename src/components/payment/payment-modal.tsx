"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { X, Loader2, CreditCard, Shield, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  courseName: string;
  amount: number;
  currency?: string;
}

export default function PaymentModal({
  isOpen,
  onClose,
  courseId,
  courseName,
  amount,
  currency = "NGN",
}: PaymentModalProps) {
  const { data: session } = useSession();
  const [email, setEmail] = useState(session?.user?.email || "");
  const [name, setName] = useState(session?.user?.name || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const formatPrice = (price: number, curr: string) => {
    const symbols: Record<string, string> = { NGN: "\u20A6", USD: "$", GBP: "\u00A3" };
    return `${symbols[curr] || curr}${price.toLocaleString()}`;
  };

  const handlePayment = async () => {
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/payments/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId,
          amount,
          currency,
          email: email.trim(),
          name: name.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok && data.paymentLink) {
        window.location.href = data.paymentLink;
      } else {
        setError(data.error || "Failed to initiate payment. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative mx-4 w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-6 pb-0">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-600">
              <CreditCard className="h-7 w-7 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Complete Payment</h2>
            <p className="mt-1 text-sm text-gray-500">
              Secure checkout powered by Flutterwave
            </p>
          </div>

          <div className="mb-5 rounded-xl bg-gray-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
              Course
            </p>
            <p className="mt-1 font-semibold text-gray-900">{courseName}</p>
            <div className="mt-3 flex items-center justify-between border-t border-gray-200 pt-3">
              <span className="text-sm text-gray-500">Total Amount</span>
              <span className="text-2xl font-bold text-gray-900">
                {formatPrice(amount, currency)}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}
          </div>
        </div>

        <div className="p-6 pt-4">
          <Button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 py-6 text-base font-semibold text-white hover:from-indigo-600 hover:to-purple-700"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Pay {formatPrice(amount, currency)}
              </>
            )}
          </Button>

          <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Shield className="h-3.5 w-3.5" />
              Secure Payment
            </span>
            <span className="flex items-center gap-1">
              <Lock className="h-3.5 w-3.5" />
              256-bit SSL
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
