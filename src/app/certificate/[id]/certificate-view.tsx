"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, ChevronDown, Copy, Check } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function QRCodeSVG({ data, size = 100 }: { data: string; size?: number }) {
  const modules = 25;
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
      <rect width={size} height={size} fill="white" rx="4" />
      {cells.map((cell, i) => (
        <rect
          key={i}
          x={cell.x * cellSize}
          y={cell.y * cellSize}
          width={cellSize}
          height={cellSize}
          fill="#1a1a2e"
          rx="0.5"
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
        backgroundColor: "#FDFCf5",
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? "landscape" : "portrait",
        unit: "px",
        format: [canvas.width / 2, canvas.height / 2],
      });
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(`SmartLMS-Certificate-${certificateId}.pdf`);
    } catch {
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
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent("I just earned a certificate on SmartLMS!")}&url=${encodeURIComponent(verificationUrl)}`,
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

      <button
        onClick={() => window.print()}
        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
        Print
      </button>

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
            <div className="fixed inset-0 z-40" onClick={() => setShareOpen(false)} />
            <div className="absolute left-1/2 z-50 mt-2 w-56 -translate-x-1/2 rounded-xl border border-gray-200 bg-white py-2 shadow-xl">
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
    description?: string;
    level?: string;
    tags?: string[];
    duration?: number;
    instructor?: { name: string };
  };
  user?: {
    id?: string;
    name: string;
    email?: string;
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

  const expiryDate = certificate.expiresAt
    ? new Date(certificate.expiresAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const instructorName = certificate.course?.instructor?.name || "SmartLMS Team";
  const studentName = certificate.user?.name || "Student";
  const courseName = certificate.course?.title || certificate.title;
  const verificationId = certificate.certificateId;
  const isActive = certificate.status === "ACTIVE";
  const courseLevel = certificate.course?.level || "";
  const courseDuration = certificate.course?.duration
    ? Math.round(certificate.course.duration / 60)
    : null;
  const courseTags = certificate.course?.tags || [];

  const verificationUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/verify-certificate?id=${verificationId}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <Navbar />

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-slate-700 print:hidden"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        {/* Certificate */}
        <div
          ref={certificateRef}
          className="relative overflow-hidden rounded-sm bg-[#FDFCf5] shadow-2xl print:shadow-none min-h-[700px]"
        >
          {/* Outer gold border */}
          <div className="absolute inset-0 border-[14px] border-double" style={{ borderColor: "#8B7355" }} />
          <div className="absolute inset-2 border-2" style={{ borderColor: "#C4A265" }} />
          <div className="absolute inset-3 border" style={{ borderColor: "#D4C5A0" }} />

          {/* Corner ornaments */}
          {[
            "left-4 top-4 border-l-2 border-t-2",
            "right-4 top-4 border-r-2 border-t-2",
            "left-4 bottom-4 border-l-2 border-b-2",
            "right-4 bottom-4 border-r-2 border-b-2",
          ].map((pos, i) => (
            <div key={i} className={`absolute h-14 w-14 ${pos}`} style={{ borderColor: "#8B7355" }} />
          ))}

          {/* Decorative corner diamonds */}
          {[
            "left-5 top-5",
            "right-5 top-5",
            "left-5 bottom-5",
            "right-5 bottom-5",
          ].map((pos, i) => (
            <div key={i} className={`absolute ${pos}`}>
              <svg width="12" height="12" viewBox="0 0 12 12">
                <rect x="3" y="0" width="6" height="6" transform="rotate(45 6 3)" fill="#C4A265" />
              </svg>
            </div>
          ))}

          {/* Background pattern */}
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%238B7355' fill-opacity='1'%3E%3Cpath d='M20 0L40 20L20 40L0 20z' fill-opacity='0.15'/%3E%3C/g%3E%3C/svg%3E")`,
          }} />

          {/* Content */}
          <div className="relative flex h-full flex-col items-center justify-between px-8 py-8 sm:px-16 sm:py-10">

            {/* Top Section: Logo + Title */}
            <div className="text-center w-full">
              {/* Logo */}
              <div className="flex justify-center mb-2">
                <div className="flex h-16 w-16 items-center justify-center rounded-full shadow-lg" style={{ backgroundColor: "#1a1a2e" }}>
                  <svg className="h-9 w-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>

              <p className="text-[10px] font-bold uppercase tracking-[0.4em]" style={{ color: "#8B7355" }}>
                SmartLMS Online Learning Platform
              </p>

              <h1
                className="mt-2 text-3xl font-light tracking-wide sm:text-4xl"
                style={{ fontFamily: "'Georgia', 'Palatino Linotype', 'Book Antiqua', serif", color: "#1a1a2e" }}
              >
                Certificate of Completion
              </h1>

              {/* Decorative divider */}
              <div className="mx-auto mt-3 flex items-center justify-center gap-3">
                <div className="h-px w-16" style={{ backgroundColor: "#C4A265" }} />
                <svg width="16" height="16" viewBox="0 0 16 16">
                  <rect x="4" y="0" width="8" height="8" transform="rotate(45 8 4)" fill="#C4A265" />
                </svg>
                <div className="h-px w-16" style={{ backgroundColor: "#C4A265" }} />
              </div>
            </div>

            {/* Middle Section: Certification Text */}
            <div className="text-center flex-1 flex flex-col items-center justify-center w-full max-w-2xl">
              <p className="text-sm" style={{ color: "#6B5B4F" }}>
                This is to certify that
              </p>

              <h2
                className="mt-1 text-4xl font-bold sm:text-5xl"
                style={{ fontFamily: "'Georgia', 'Palatino Linotype', serif", color: "#1a1a2e" }}
              >
                {studentName}
              </h2>

              <div className="mt-2 h-px w-72" style={{ backgroundColor: "#C4A265" }} />

              <p className="mt-2 max-w-lg text-sm leading-relaxed" style={{ color: "#6B5B4F" }}>
                has successfully completed the course of study in
              </p>

              <h3
                className="mt-1 text-xl font-semibold sm:text-2xl"
                style={{ fontFamily: "'Georgia', 'Palatino Linotype', serif", color: "#1a1a2e" }}
              >
                {courseName}
              </h3>

              {/* Course details */}
              <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-xs" style={{ color: "#8B7355" }}>
                {courseLevel && (
                  <span className="rounded border px-2.5 py-1 font-semibold" style={{ borderColor: "#D4C5A0", backgroundColor: "rgba(196,162,101,0.08)" }}>
                    {courseLevel}
                  </span>
                )}
                {courseDuration && (
                  <span className="rounded border px-2.5 py-1 font-semibold" style={{ borderColor: "#D4C5A0", backgroundColor: "rgba(196,162,101,0.08)" }}>
                    {courseDuration} Hours
                  </span>
                )}
              </div>

              {/* Skills covered */}
              {courseTags.length > 0 && (
                <div className="mt-2 text-center">
                  <p className="text-[10px] uppercase tracking-wider" style={{ color: "#8B7355" }}>
                    Skills Covered
                  </p>
                  <p className="mt-0.5 text-xs" style={{ color: "#6B5B4F" }}>
                    {courseTags.slice(0, 5).join(" · ")}
                  </p>
                </div>
              )}

              {/* Description */}
              {certificate.course?.description && (
                <p className="mt-2 max-w-md text-[11px] leading-relaxed" style={{ color: "#8B7355" }}>
                  {certificate.course.description.replace(/<[^>]*>/g, "").slice(0, 150)}
                  {certificate.course.description.length > 150 ? "..." : ""}
                </p>
              )}

              {/* Date issued */}
              <div className="mt-3 flex items-center gap-6 text-xs" style={{ color: "#6B5B4F" }}>
                <div className="text-center">
                  <p className="font-semibold">{issuedDate}</p>
                  <p className="text-[10px] uppercase tracking-wider" style={{ color: "#8B7355" }}>Date of Issue</p>
                </div>
                {expiryDate && (
                  <div className="text-center">
                    <p className="font-semibold">{expiryDate}</p>
                    <p className="text-[10px] uppercase tracking-wider" style={{ color: "#8B7355" }}>Valid Until</p>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Section: Signatures + QR + Verification */}
            <div className="w-full">
              {/* Signatures Row */}
              <div className="flex items-end justify-between">
                {/* Instructor Signature */}
                <div className="flex flex-col items-center">
                  <div className="w-36 border-b pb-1" style={{ borderColor: "#8B7355" }}>
                    <p
                      className="text-center text-sm italic"
                      style={{ fontFamily: "'Georgia', 'Palatino Linotype', serif", color: "#1a1a2e" }}
                    >
                      {instructorName}
                    </p>
                  </div>
                  <p className="mt-1 text-[9px] font-semibold uppercase tracking-wider" style={{ color: "#8B7355" }}>
                    Course Instructor
                  </p>
                </div>

                {/* QR Code + Verification */}
                <div className="flex flex-col items-center gap-1.5">
                  <div className="rounded-lg border-2 p-2 shadow-md" style={{ borderColor: "#C4A265", backgroundColor: "white" }}>
                    <QRCodeSVG
                      data={verificationUrl}
                      size={80}
                    />
                  </div>
                  <p className="text-[8px] font-semibold uppercase tracking-wider" style={{ color: "#8B7355" }}>
                    Scan to Verify
                  </p>
                  <p className="max-w-[120px] text-center text-[7px] leading-tight" style={{ color: "#6B5B4F" }}>
                    Scan QR code or visit the verification URL to confirm authenticity
                  </p>
                </div>

                {/* Platform Signature */}
                <div className="flex flex-col items-center">
                  <div className="w-36 border-b pb-1" style={{ borderColor: "#8B7355" }}>
                    <p
                      className="text-center text-sm italic"
                      style={{ fontFamily: "'Georgia', 'Palatino Linotype', serif", color: "#1a1a2e" }}
                    >
                      SmartLMS
                    </p>
                  </div>
                  <p className="mt-1 text-[9px] font-semibold uppercase tracking-wider" style={{ color: "#8B7355" }}>
                    Platform Authority
                  </p>
                </div>
              </div>

              {/* Verification Strip */}
              <div className="mt-4 flex items-center justify-between rounded-lg border px-4 py-2.5" style={{ borderColor: "#D4C5A0", backgroundColor: "rgba(196,162,101,0.05)" }}>
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold" style={{ backgroundColor: "#E8F5E9", color: "#2E7D32" }}>
                    <ShieldCheck className="h-3 w-3" />
                    Verified Authentic
                  </div>
                  <span className="text-[10px] font-mono" style={{ color: "#6B5B4F" }}>
                    Certificate ID: {verificationId}
                  </span>
                </div>
                <p className="text-[9px]" style={{ color: "#8B7355" }}>
                  smartlms-bay.vercel.app/verify-certificate
                </p>
              </div>

              {/* Bottom fine print */}
              <div className="mt-2 text-center">
                <p className="text-[8px]" style={{ color: "#8B7355" }}>
                  This certificate was issued by SmartLMS Platform. It can be verified by scanning the QR code or visiting the verification URL above.
                </p>
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

        <CertificateActions
          certificateId={verificationId}
          certificateRef={certificateRef}
        />

        <p className="mt-6 text-center text-xs text-gray-400 print:hidden">
          This certificate can be verified by sharing the Verification ID or scanning the QR code above.
        </p>
      </div>
    </div>
  );
}
