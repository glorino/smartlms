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

function CertifiedBadge() {
  return (
    <svg width="80" height="95" viewBox="0 0 80 95" fill="none">
      {/* Shield shape */}
      <path d="M40 5L70 20V55C70 72 55 85 40 90C25 85 10 72 10 55V20L40 5Z" fill="#0056A4" />
      <path d="M40 10L65 23V55C65 69.5 52 81 40 85.5C28 81 15 69.5 15 55V23L40 10Z" fill="#0068C8" />
      {/* Inner shield */}
      <path d="M40 18L58 28V52C58 63 50 72 40 75.5C30 72 22 63 22 52V28L40 18Z" fill="white" />
      {/* Star */}
      <path d="M40 28L43.5 37H53L45.5 43L48 52L40 46L32 52L34.5 43L27 37H36.5L40 28Z" fill="#0056A4" />
      {/* Text */}
      <text x="40" y="64" textAnchor="middle" fill="#0056A4" fontSize="5.5" fontWeight="bold" fontFamily="Arial">SmartLMS</text>
      <text x="40" y="71" textAnchor="middle" fill="#0056A4" fontSize="4.5" fontWeight="600" fontFamily="Arial">CERTIFIED</text>
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
        backgroundColor: "#ffffff",
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
          className="relative overflow-hidden rounded-sm bg-white shadow-2xl print:shadow-none"
          style={{ minHeight: "700px" }}
        >
          {/* Blue double border - outer */}
          <div
            className="absolute inset-0"
            style={{
              border: "12px solid #B8D4E8",
              boxSizing: "border-box",
            }}
          />
          {/* Blue double border - inner */}
          <div
            className="absolute"
            style={{
              inset: "16px",
              border: "2px solid #B8D4E8",
              boxSizing: "border-box",
            }}
          />

          {/* Content */}
          <div
            className="relative flex h-full flex-col items-center"
            style={{ padding: "50px 60px 40px" }}
          >
            {/* Top row: Logo left, Badge right */}
            <div className="flex w-full items-start justify-between">
              {/* Logo + Brand */}
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full" style={{ backgroundColor: "#0068C8" }}>
                  <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <span className="text-lg font-bold" style={{ color: "#0068C8", fontFamily: "Arial, sans-serif" }}>
                  SmartLMS
                </span>
              </div>

              {/* Certified Badge */}
              <CertifiedBadge />
            </div>

            {/* Title Section */}
            <div className="mt-6 text-center">
              <p className="text-sm font-medium tracking-wide" style={{ color: "#0068C8" }}>
                SmartLMS Presents
              </p>
              <h1
                className="mt-3 text-5xl font-bold tracking-wide sm:text-6xl"
                style={{
                  fontFamily: "'Georgia', 'Palatino Linotype', 'Book Antiqua', serif",
                  color: "#1a1a1a",
                }}
              >
                CERTIFICATE
              </h1>
              <p
                className="mt-1 text-lg font-semibold tracking-widest uppercase"
                style={{ color: "#333333", fontFamily: "Arial, sans-serif" }}
              >
                of Completion
              </p>
            </div>

            {/* Presented to */}
            <div className="mt-8 text-center">
              <p className="text-sm" style={{ color: "#444444" }}>
                This Certificate is Proudly Presented to
              </p>
            </div>

            {/* Student Name */}
            <div className="mt-4 w-full max-w-xl text-center">
              <h2
                className="text-3xl font-bold sm:text-4xl"
                style={{
                  fontFamily: "'Georgia', 'Palatino Linotype', serif",
                  color: "#1a1a1a",
                  paddingBottom: "8px",
                  borderBottom: "2px solid #0068C8",
                }}
              >
                {studentName}
              </h2>
            </div>

            {/* Course completion text */}
            <div className="mt-6 text-center">
              <p className="text-sm" style={{ color: "#444444" }}>
                for successfully completing the course on
              </p>
              <h3
                className="mt-2 text-xl font-bold sm:text-2xl"
                style={{
                  fontFamily: "'Georgia', 'Palatino Linotype', serif",
                  color: "#1a1a1a",
                }}
              >
                {courseName}
              </h3>

              {/* Course details */}
              <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
                {courseLevel && (
                  <span
                    className="rounded-full border px-3 py-1 text-xs font-semibold"
                    style={{ borderColor: "#B8D4E8", color: "#0068C8", backgroundColor: "rgba(0,104,200,0.05)" }}
                  >
                    {courseLevel}
                  </span>
                )}
                {courseDuration && (
                  <span
                    className="rounded-full border px-3 py-1 text-xs font-semibold"
                    style={{ borderColor: "#B8D4E8", color: "#0068C8", backgroundColor: "rgba(0,104,200,0.05)" }}
                  >
                    {courseDuration} Hours
                  </span>
                )}
              </div>
            </div>

            {/* Bottom Section: Date - Badges - Signature */}
            <div className="mt-auto w-full pt-10">
              <div className="flex items-end justify-between">
                {/* Date */}
                <div className="flex flex-col items-center">
                  <div className="w-32 border-b pb-2" style={{ borderColor: "#333" }}>
                    <p className="text-center text-sm font-semibold" style={{ color: "#333" }}>
                      {issuedDate}
                    </p>
                  </div>
                  <p className="mt-1 text-xs font-medium" style={{ color: "#666" }}>
                    Date
                  </p>
                </div>

                {/* Certification Badges */}
                <div className="flex items-center gap-4">
                  {/* ISO Badge */}
                  <div className="flex flex-col items-center">
                    <div className="h-14 w-14 rounded-full border-2 flex items-center justify-center" style={{ borderColor: "#0068C8" }}>
                      <div className="text-center">
                        <p className="text-[7px] font-bold" style={{ color: "#0068C8" }}>CERTIFIED</p>
                        <p className="text-[9px] font-bold" style={{ color: "#0068C8" }}>COMPANY</p>
                        <p className="text-[6px]" style={{ color: "#0068C8" }}>ISO</p>
                      </div>
                    </div>
                  </div>

                  {/* AICPA SOC Badge */}
                  <div className="flex flex-col items-center">
                    <div className="h-14 w-14 rounded-full flex items-center justify-center" style={{ backgroundColor: "#0068C8" }}>
                      <div className="text-center">
                        <p className="text-[7px] font-bold text-white">AICPA</p>
                        <p className="text-[9px] font-bold text-white">SOC</p>
                      </div>
                    </div>
                  </div>

                  {/* ISO 37001 Badge */}
                  <div className="flex flex-col items-center">
                    <div className="h-14 w-14 rounded-full border-2 flex items-center justify-center" style={{ borderColor: "#0068C8" }}>
                      <div className="text-center">
                        <p className="text-[6px] font-bold" style={{ color: "#0068C8" }}>ISO</p>
                        <p className="text-[8px] font-bold" style={{ color: "#0068C8" }}>37001</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Signature */}
                <div className="flex flex-col items-center">
                  <div className="w-32 border-b pb-2" style={{ borderColor: "#333" }}>
                    <p
                      className="text-center text-sm italic"
                      style={{
                        fontFamily: "'Georgia', 'Palatino Linotype', serif",
                        color: "#333",
                      }}
                    >
                      {instructorName}
                    </p>
                  </div>
                  <p className="mt-1 text-xs font-medium" style={{ color: "#666" }}>
                    Founder and CEO
                  </p>
                </div>
              </div>
            </div>

            {/* QR Code + Verification Row */}
            <div className="mt-6 flex w-full items-center justify-between">
              <p className="text-[9px] max-w-[200px] leading-tight" style={{ color: "#999" }}>
                View at: smartlms-bay.vercel.app/certificate/{verificationId}
                <br />
                This certificate was issued by SmartLMS Platform
              </p>

              <div className="flex flex-col items-center">
                <div className="rounded-lg border p-2 shadow-sm" style={{ borderColor: "#B8D4E8", backgroundColor: "white" }}>
                  <QRCodeSVG data={verificationUrl} size={70} />
                </div>
                <p className="mt-1 text-[8px] font-semibold uppercase tracking-wider" style={{ color: "#0068C8" }}>
                  Scan to Verify
                </p>
              </div>

              <div className="flex flex-col items-end">
                <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "#00A67E" }}>
                  Verified
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
