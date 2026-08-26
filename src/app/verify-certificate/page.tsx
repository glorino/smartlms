"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ShieldCheck,
  Search,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Award,
  Calendar,
  User,
  BookOpen,
  ExternalLink,
} from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

type CertificateResult = {
  certificateId: string;
  studentName: string;
  courseName: string;
  issuedAt: string;
  status: "ACTIVE" | "REVOKED";
  instructorName: string;
  verificationUrl: string;
};

function VerifyCertificateContent() {
  const searchParams = useSearchParams();
  const [verificationId, setVerificationId] = useState("");
  const [result, setResult] = useState<CertificateResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  const doVerify = useCallback(async (id: string) => {
    if (!id.trim()) return;
    setLoading(true);
    setSearched(false);
    setError("");
    setResult(null);

    try {
      const res = await fetch(`/api/certificates/verify?id=${encodeURIComponent(id.trim())}`);
      if (res.ok) {
        const data = await res.json();
        setResult(data.certificate);
      } else {
        setError("Certificate not found. Please check the verification ID and try again.");
      }
    } catch {
      setError("An error occurred while verifying the certificate. Please try again.");
    } finally {
      setLoading(false);
      setSearched(true);
    }
  }, []);

  useEffect(() => {
    const idFromUrl = searchParams.get("id");
    if (idFromUrl) {
      setVerificationId(idFromUrl);
      doVerify(idFromUrl);
    }
  }, [searchParams, doVerify]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    doVerify(verificationId);
  };

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Navbar />

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        {/* Hero Section */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
            <ShieldCheck className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Verify a Certificate
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Enter a verification ID to confirm the authenticity of a SmartLMS certificate.
          </p>
        </div>

        {/* Search Form */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg sm:p-8">
          <form onSubmit={handleSearch}>
            <label className="block text-sm font-medium text-gray-700">
              Verification ID
            </label>
            <p className="mb-3 text-xs text-gray-500">
              Format: SLMS-XXXX-XXXX-XXXX
            </p>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={verificationId}
                  onChange={(e) => setVerificationId(e.target.value)}
                  placeholder="Enter verification ID..."
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 py-3 pl-10 pr-4 font-mono text-sm uppercase tracking-wider text-gray-900 placeholder-gray-400 transition-colors focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !verificationId.trim()}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <Search className="h-4 w-4" />
                )}
                Verify
              </button>
            </div>
          </form>
        </div>

        {/* Results */}
        {searched && result && (
          <div className="mt-8 overflow-hidden rounded-2xl border border-green-200 bg-white shadow-lg">
            {/* Verified Banner */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-6 text-center text-white">
              <CheckCircle className="mx-auto h-12 w-12" />
              <h2 className="mt-3 text-2xl font-bold">Certificate Verified</h2>
              <p className="mt-1 text-green-100">
                This certificate is authentic and was issued by SmartLMS
              </p>
            </div>

            <div className="p-8">
              {/* Certificate Details */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                      Certificate Holder
                    </p>
                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      {result.studentName}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-purple-100">
                    <BookOpen className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                      Course
                    </p>
                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      {result.courseName}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-amber-100">
                    <Calendar className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                      Date Issued
                    </p>
                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      {new Date(result.issuedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-rose-100">
                    <Award className="h-5 w-5 text-rose-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                      Status
                    </p>
                    <div className="mt-1">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                          result.status === "ACTIVE"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {result.status === "ACTIVE" ? (
                          <CheckCircle className="h-3.5 w-3.5" />
                        ) : (
                          <XCircle className="h-3.5 w-3.5" />
                        )}
                        {result.status === "ACTIVE" ? "Active" : "Revoked"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="my-6 border-t border-gray-200" />

              {/* Bottom Section */}
              <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
                <div className="text-left">
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                    Verification ID
                  </p>
                  <p className="mt-1 font-mono text-sm font-bold text-gray-800">
                    {result.certificateId}
                  </p>
                  <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Verified by SmartLMS
                  </div>
                </div>
              </div>

              {/* View Certificate */}
              <div className="mt-6 text-center">
                <a
                  href={`/certificate/${result.certificateId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
                >
                  <ExternalLink className="h-4 w-4" />
                  View Full Certificate
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Not Found */}
        {searched && !result && !loading && (
          <div className="mt-8 rounded-2xl border border-red-200 bg-white p-8 text-center shadow-lg">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Certificate Not Found
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              {error || "No certificate matches the verification ID you entered. Please check and try again."}
            </p>
          </div>
        )}

        {/* Footer Note */}
        <p className="mt-8 text-center text-xs text-gray-400">
          SmartLMS certificates are cryptographically verified and tamper-proof.
        </p>
      </div>
    </div>
    <Footer />
  </>
  );
}

export default function VerifyCertificatePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <Navbar />
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-20">
            <svg className="h-8 w-8 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        </div>
      </div>
    }>
      <VerifyCertificateContent />
    </Suspense>
  );
}
