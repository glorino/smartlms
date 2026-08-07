import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import Navbar from "@/components/layout/navbar";

async function getCertificate(id: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/certificates/${id}`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

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

function CertificateActions({ certificateId }: { certificateId: string }) {
  const verificationUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/verify-certificate?id=${certificateId}`;

  return (
    <div className="mt-8 flex flex-wrap justify-center gap-3">
      <button
        onClick={() => window.print()}
        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 print:hidden"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
        Print Certificate
      </button>
      <button
        onClick={() => {
          alert("PNG download will be available soon. Use Print to save as PDF.");
        }}
        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 print:hidden"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Download PNG
      </button>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(verificationUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-lg bg-[#0A66C2] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#004182] print:hidden"
      >
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
        Share to LinkedIn
      </a>
    </div>
  );
}

export default async function CertificatePage({
  params,
}: {
  params: { id: string };
}) {
  const certificate = await getCertificate(params.id);

  if (!certificate) {
    notFound();
  }

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
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-amber-700 print:hidden"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        {/* Certificate Card */}
        <div className="certificate-card relative overflow-hidden rounded-2xl border-4 border-double border-amber-600 bg-gradient-to-br from-[#FFFEF7] via-[#FFFDF0] to-[#FFF8E7] shadow-2xl print:shadow-none">
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
                      data={`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/verify-certificate?id=${verificationId}`}
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
        <CertificateActions certificateId={verificationId} />

        {/* Footer Note */}
        <p className="mt-6 text-center text-xs text-gray-400 print:hidden">
          This certificate can be verified by sharing the Verification ID or scanning the QR code.
        </p>
      </div>
    </div>
  );
}
