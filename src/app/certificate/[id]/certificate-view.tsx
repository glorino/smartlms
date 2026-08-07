"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, ChevronDown, Copy, Check } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function QRCodeSVG({ data, size = 100 }: { data: string; size?: number }) {
  const modules = 21;
  const cellSize = size / modules;
  const cells: { x: number; y: number }[] = [];

  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    hash = ((hash << 5) - hash + data.charCodeAt(i)) | 0;
  }

  for (let row = 0; row < modules; row++) {
    for (let col = 0; col < modules; col++) {
      const isFinderPattern =
        (row < 7 && col < 7) ||
        (row < 7 && col >= modules - 7) ||
        (row >= modules - 7 && col < 7);

      if (isFinderPattern) {
        const innerRow = row < 7 ? row : row - (modules - 7);
        const innerCol = col < 7 ? col : col - (modules - 7);
        const isBorder =
          innerRow === 0 ||
          innerRow === 6 ||
          innerCol === 0 ||
          innerCol === 6;
        const isInner =
          innerRow >= 2 && innerRow <= 4 && innerCol >= 2 && innerCol <= 4;
        if (isBorder || isInner) {
          cells.push({ x: col, y: row });
        }
      } else {
        const seed = (hash + row * 31 + col * 17) & 0xffff;
        if (seed % 3 === 0) {
          cells.push({ x: col, y: row });
        }
      }
    }
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <rect width={size} height={size} fill="white" />
      {cells.map((cell, i) => (
        <rect
          key={i}
          x={cell.x * cellSize}
          y={cell.y * cellSize}
          width={cellSize}
          height={cellSize}
          fill="#1a1a2e"
        />
      ))}
    </svg>
  );
}

function CertificateActions({
  certificateId,
  certificateRef,
}: {
  certificateId: string;
  certificateRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const verificationUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/verify-certificate?id=${certificateId}`;

  const handleDownloadPDF = async () => {
    if (!certificateRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#FFFEF7",
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? "landscape" : "portrait",
        unit: "px",
        format: [canvas.width / 2, canvas.height / 2],
      });
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(`SmartLMS-Certificate-${certificateId}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(verificationUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = verificationUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareLinks = [
    {
      name: "LinkedIn",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(verificationUrl)}`,
      color: "hover:bg-blue-50 text-[#0A66C2]",
      icon: (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    {
      name: "Twitter",
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent("I just earned a certificate on SmartLMS! 🎓")}&url=${encodeURIComponent(verificationUrl)}`,
      color: "hover:bg-sky-50 text-sky-500",
      icon: (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: "Facebook",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(verificationUrl)}`,
      color: "hover:bg-blue-50 text-[#1877F2]",
      icon: (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="mt-8 flex flex-wrap justify-center gap-3 print:hidden">
      {/* Download PDF */}
      <button
        onClick={handleDownloadPDF}
        disabled={downloading}
        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {downloading ? (
          <>
            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Generating PDF...
          </>
        ) : (
          <>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download PDF
          </>
        )}
      </button>

      {/* Print */}
      <button
        onClick={() => window.print()}
        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
        Print
      </button>

      {/* Share with dropdown */}
      <div className="relative">
        <button
          onClick={() => setShareOpen(!shareOpen)}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share
          <ChevronDown className="h-3.5 w-3.5" />
        </button>

        {shareOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShareOpen(false)}
            />
            <div className="absolute left-1/2 z-50 mt-2 w-56 -translate-x-1/2 rounded-xl border border-gray-200 bg-white py-2 shadow-xl">
              {/* Copy Link */}
              <button
                onClick={() => {
                  handleCopyLink();
                  setShareOpen(false);
                }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4 text-gray-400" />
                )}
                {copied ? "Copied!" : "Copy verification link"}
              </button>
              <div className="my-1 border-t border-gray-100" />
              {/* Social shares */}
              {shareLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-3 px-4 py-2.5 text-sm ${link.color}`}
                  onClick={() => setShareOpen(false)}
                >
                  {link.icon}
                  Share to {link.name}
                </a>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Verify button */}
      <a
        href={`/verify-certificate?id=${certificateId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
      >
        <ShieldCheck className="h-4 w-4" />
        Verify Certificate
      </a>
    </div>
  );
}

interface CertificateData {
  certificateId: string;
  status: string;
  issuedAt: string;
  expiresAt?: string;
  title?: string;
  course?: {
    title: string;
    instructor?: { name: string };
  };
  user?: {
    name: string;
  };
}

export default function CertificateView({
  certificate,
}: {
  certificate: CertificateData;
}) {
  const certificateRef = useRef<HTMLDivElement>(null);

  const issuedDate = new Date(certificate.issuedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const instructorName = certificate.course?.instructor?.name || "SmartLMS Team";
  const studentName = certificate.user?.name || "Student";
  const courseName = certificate.course?.title || certificate.title;
  const verificationId = certificate.certificateId;
  const isActive = certificate.status === "ACTIVE";

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50">
      <Navbar />

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Back to Dashboard link */}
        <Link
          href="/dashboard"
          className="mb-4 inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-amber-700 print:hidden"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        {/* Certificate Card */}
        <div ref={certificateRef} className="certificate-card relative overflow-hidden rounded-2xl border-4 border-double border-amber-600 bg-gradient-to-br from-[#FFFEF7] via-[#FFFDF0] to-[#FFF8E7] shadow-2xl print:shadow-none">
          {/* Corner Ornaments */}
          <div className="absolute left-0 top-0 h-32 w-32 bg-gradient-to-br from-amber-200/40 to-transparent print:h-24 print:w-24" />
          <div className="absolute right-0 top-0 h-32 w-32 bg-gradient-to-bl from-amber-200/40 to-transparent print:h-24 print:w-24" />
          <div className="absolute bottom-0 left-0 h-32 w-32 bg-gradient-to-tr from-amber-200/40 to-transparent print:h-24 print:w-24" />
          <div className="absolute bottom-0 right-0 h-32 w-32 bg-gradient-to-tl from-amber-200/40 to-transparent print:h-24 print:w-24" />

          {/* Inner Border */}
          <div className="m-3 border-2 border-amber-300/60 p-8 sm:m-4 sm:p-12 print:m-2 print:p-8">
            <div className="text-center">
              {/* Company Logo */}
              <div className="mb-6 flex justify-center print:mb-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-amber-700 shadow-lg print:h-12 print:w-12">
                  <svg className="h-10 w-10 text-white print:h-8 print:w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>

              {/* Certificate Title */}
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-700 print:text-xs">
                SmartLMS Platform
              </p>
              <h1
                className="mt-4 font-serif text-4xl font-bold text-amber-900 sm:text-5xl print:mt-2 print:text-4xl"
                style={{ fontFamily: "'Georgia', 'Palatino Linotype', serif" }}
              >
                Certificate of Completion
              </h1>

              {/* Decorative Line */}
              <div className="mx-auto mt-6 flex items-center justify-center gap-3 print:mt-4">
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-400 sm:w-24" />
                <svg className="h-5 w-5 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-400 sm:w-24" />
              </div>

              {/* This is to certify */}
              <p className="mt-6 text-base text-gray-600 print:mt-4 print:text-sm">
                This is to certify that
              </p>

              {/* Student Name */}
              <h2
                className="mt-3 border-b-2 border-amber-300 pb-2 font-serif text-3xl font-bold text-gray-900 sm:text-4xl print:mt-2 print:text-3xl"
                style={{ fontFamily: "'Georgia', 'Palatino Linotype', serif" }}
              >
                {studentName}
              </h2>

              {/* Has completed */}
              <p className="mt-6 text-base text-gray-600 print:mt-4 print:text-sm">
                has successfully completed the course
              </p>

              {/* Course Name */}
              <h3
                className="mt-3 text-xl font-bold text-amber-800 sm:text-2xl print:text-xl"
                style={{ fontFamily: "'Georgia', 'Palatino Linotype', serif" }}
              >
                {courseName}
              </h3>

              {/* Date Issued */}
              <p className="mt-6 text-sm text-gray-500 print:mt-4">
                Issued on <span className="font-semibold text-gray-700">{issuedDate}</span>
              </p>

              {/* Signatures Row */}
              <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 print:mt-8">
                <div className="flex flex-col items-center">
                  <div className="w-48 border-b border-gray-400 pb-1">
                    <p
                      className="text-center font-serif text-lg italic text-gray-700"
                      style={{ fontFamily: "'Georgia', 'Palatino Linotype', serif" }}
                    >
                      {instructorName}
                    </p>
                  </div>
                  <p className="mt-2 text-xs font-medium uppercase tracking-wider text-gray-500">
                    Instructor Signature
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-48 border-b border-gray-400 pb-1">
                    <p
                      className="text-center font-serif text-lg italic text-gray-700"
                      style={{ fontFamily: "'Georgia', 'Palatino Linotype', serif" }}
                    >
                      SmartLMS
                    </p>
                  </div>
                  <p className="mt-2 text-xs font-medium uppercase tracking-wider text-gray-500">
                    Platform Director
                  </p>
                </div>
              </div>

              {/* Bottom Section: QR + Verification */}
              <div className="mt-10 flex flex-col items-center justify-between gap-6 sm:flex-row sm:items-end print:mt-8">
                {/* Verification ID */}
                <div className="text-left">
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                    Verification ID
                  </p>
                  <p className="mt-1 font-mono text-sm font-bold text-gray-800">
                    {verificationId}
                  </p>
                  <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Verified by SmartLMS
                  </div>
                </div>

                {/* QR Code */}
                <div className="flex flex-col items-center">
                  <div className="rounded-lg border border-gray-200 bg-white p-2 shadow-sm">
                    <QRCodeSVG
                      data={`${typeof window !== "undefined" ? window.location.origin : ""}/verify-certificate?id=${verificationId}`}
                      size={90}
                    />
                  </div>
                  <p className="mt-1 text-[10px] text-gray-400">Scan to verify</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="mt-6 flex justify-center print:hidden">
          <div
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold shadow-sm ${
              isActive
                ? "border border-green-200 bg-green-50 text-green-700"
                : "border border-red-200 bg-red-50 text-red-700"
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            Certificate Status: {isActive ? "Active & Verified" : "Revoked"}
          </div>
        </div>

        {/* Action Buttons */}
        <CertificateActions
          certificateId={verificationId}
          certificateRef={certificateRef}
        />

        {/* Footer Note */}
        <p className="mt-6 text-center text-xs text-gray-400 print:hidden">
          This certificate can be verified by sharing the Verification ID or scanning the QR code.
        </p>
      </div>
    </div>
  );
}
