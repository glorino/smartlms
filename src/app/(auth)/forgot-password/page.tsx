"use client";

import { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Mail,
  ArrowLeft,
  CheckCircle2,
  Shield,
  KeyRound,
  Clock,
  Lock,
} from "lucide-react";

const features = [
  { icon: Shield, text: "Your data is encrypted and secure" },
  { icon: KeyRound, text: "Reset link expires in 1 hour" },
  { icon: Clock, text: "Get back to learning in minutes" },
];

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
      } else {
        setSent(true);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Panel */}
      <div className="hidden w-1/2 items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-purple-700 p-12 lg:flex">
        <div className="max-w-md">
          <Link
            href="/"
            className="mb-10 inline-flex items-center gap-2 text-white/80 transition-colors hover:text-white"
          >
            <GraduationCap className="h-8 w-8" />
            <span className="text-2xl font-bold">SmartLMS</span>
          </Link>
          <h1 className="mb-4 text-4xl font-extrabold leading-tight text-white">
            Don&apos;t worry, we&apos;ve got you
          </h1>
          <p className="mb-10 text-lg text-white/70">
            It happens to the best of us. Enter your email and we&apos;ll help you get back
            into your account in no time.
          </p>
          <div className="space-y-5">
            {features.map((f) => (
              <div key={f.text} className="flex items-center gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
                  <f.icon className="h-6 w-6 text-white" />
                </div>
                <p className="text-base font-medium text-white/90">{f.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
            <p className="text-sm italic text-white/80">
              &ldquo;SmartLMS&apos;s support team helped me recover my account in
              less than 5 minutes. Amazing experience!&rdquo;
            </p>
            <p className="mt-3 text-sm font-semibold text-white">
              — Aisha Mohammed, Data Science Student
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex w-full items-center justify-center overflow-y-auto p-6 lg:w-1/2 lg:p-12">
        <div className="w-full max-w-lg">
          <div className="mb-8 text-center lg:hidden">
            <Link href="/" className="inline-flex items-center gap-2">
              <GraduationCap className="h-10 w-10 text-indigo-600" />
              <span className="text-2xl font-bold text-gray-900">SmartLMS</span>
            </Link>
          </div>

          {sent ? (
            <>
              <div className="mb-8 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h1 className="mt-4 text-3xl font-extrabold text-gray-900">
                  Check your email
                </h1>
                <p className="mt-2 text-sm text-gray-500">
                  We&apos;ve sent a password reset link to{" "}
                  <span className="font-medium text-gray-700">{email}</span>
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Didn&apos;t receive it? Check your spam folder or{" "}
                  <button
                    onClick={() => {
                      setSent(false);
                      setEmail("");
                    }}
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    try again
                  </button>
                </p>
              </div>
              <Link
                href="/login"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white py-3 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Sign in
              </Link>
            </>
          ) : (
            <>
              <div className="mb-8">
                <Link
                  href="/login"
                  className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-700"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Sign in
                </Link>
                <div className="mt-4 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100">
                    <Lock className="h-8 w-8 text-indigo-600" />
                  </div>
                  <h1 className="text-3xl font-extrabold text-gray-900">
                    Forgot your password?
                  </h1>
                  <p className="mt-2 text-sm text-gray-500">
                    No worries! Enter your email and we&apos;ll send you a reset link.
                  </p>
                </div>
              </div>

              {error && (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-sm font-semibold text-gray-700"
                  >
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full rounded-xl border-2 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                        error ? "border-red-400" : "border-gray-200"
                      }`}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition-all hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl hover:shadow-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <svg
                      className="h-5 w-5 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-500">
                Remember your password?{" "}
                <Link
                  href="/login"
                  className="font-bold text-indigo-600 hover:text-indigo-500"
                >
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
