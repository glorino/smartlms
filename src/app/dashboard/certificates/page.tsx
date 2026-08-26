"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  Award,
  Download,
  Share2,
  Search,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import type { Certificate } from "@/types";

export default function MyCertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [renderCert, setRenderCert] = useState<Certificate | null>(null);
  const certRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = useCallback(async (cert: Certificate) => {
    setDownloadingId(cert.id);
    setRenderCert(cert);
  }, []);

  useEffect(() => {
    if (!renderCert || !certRef.current) return;
    const el = certRef.current;
    let cancelled = false;

    const timer = setTimeout(async () => {
      try {
        const canvas = await html2canvas(el, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: "#FFFEF7",
        });
        if (cancelled) return;
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({
          orientation: canvas.width > canvas.height ? "landscape" : "portrait",
          unit: "px",
          format: [canvas.width / 2, canvas.height / 2],
        });
        pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 2, canvas.height / 2);
        pdf.save(`SmartLMS-Certificate-${renderCert.certificateId}.pdf`);
      } catch {
        alert("Failed to generate PDF. Please try again.");
      } finally {
        if (!cancelled) {
          setDownloadingId(null);
          setRenderCert(null);
        }
      }
    }, 100);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [renderCert]);

  useEffect(() => {
    async function loadCertificates() {
      try {
        const res = await fetch("/api/certificates");
        if (res.ok) {
          const data = await res.json();
          setCertificates(data.certificates || data || []);
        }
      } catch {
        setCertificates([]);
      } finally {
        setLoading(false);
      }
    }
    loadCertificates();
  }, []);

  const filtered = useMemo(() => {
    if (!searchQuery) return certificates;
    return certificates.filter(
      (c) =>
        c.certificateId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.course.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [certificates, searchQuery]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Certificates</h1>
          <p className="mt-1 text-gray-600">
            View and download your earned certificates
          </p>
        </div>

        {/* Search */}
        <div className="mb-6 flex max-w-md items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by certificate ID or course name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Award className="h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                {searchQuery ? "No certificates found" : "No certificates yet"}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery
                  ? "Try a different search term"
                  : "Complete courses to earn certificates"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((cert) => (
              <Card
                key={cert.id}
                className="group overflow-hidden transition-shadow hover:shadow-md"
              >
                {/* Certificate Preview */}
                <div className="relative h-40 bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500">
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                    <Award className="mb-2 h-10 w-10 text-white drop-shadow" />
                    <h3 className="text-sm font-bold text-white drop-shadow">
                      Certificate of Completion
                    </h3>
                    <p className="mt-1 line-clamp-1 text-xs text-white/90">
                      {cert.course.title}
                    </p>
                  </div>
                  <Badge
                    variant={cert.status === "ACTIVE" ? "success" : "danger"}
                    className="absolute right-3 top-3"
                  >
                    {cert.status}
                  </Badge>
                </div>

                <CardContent className="p-5">
                  <h4 className="font-semibold text-gray-900">
                    {cert.course.title}
                  </h4>

                  <div className="mt-3 space-y-2 text-sm text-gray-500">
                    <div className="flex items-center justify-between">
                      <span>Issued:</span>
                      <span>
                        {new Date(cert.issuedAt).toLocaleDateString()}
                      </span>
                    </div>
                    {cert.expiresAt && (
                      <div className="flex items-center justify-between">
                        <span>Expires:</span>
                        <span>
                          {new Date(cert.expiresAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span>Certificate ID:</span>
                      <div className="flex items-center gap-1">
                        <span className="max-w-[120px] truncate font-mono text-xs">
                          {cert.certificateId}
                        </span>
                        <button
                          onClick={() =>
                            copyToClipboard(cert.certificateId, cert.id)
                          }
                          className="text-gray-400 hover:text-primary"
                        >
                          {copiedId === cert.id ? (
                            <Check className="h-3.5 w-3.5 text-green-500" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      disabled={downloadingId === cert.id}
                      onClick={() => handleDownloadPDF(cert)}
                    >
                      <Download className="mr-1.5 h-3.5 w-3.5" />
                      {downloadingId === cert.id ? "Generating..." : "PDF"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        const url = `${window.location.origin}/certificate/${cert.certificateId}`;
                        const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
                        window.open(linkedinUrl, "_blank", "width=600,height=400");
                      }}
                    >
                      <Share2 className="mr-1.5 h-3.5 w-3.5" />
                      LinkedIn
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => window.open(`/certificate/${cert.certificateId}`, "_blank")}
                    >
                      <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                      Verify
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        {renderCert && (
          <HiddenCertificate cert={renderCert} certRef={certRef} />
        )}
    </div>
  );
}

function HiddenCertificate({
  cert,
  certRef,
}: {
  cert: Certificate;
  certRef: React.RefObject<HTMLDivElement | null>;
}) {
  const issuedDate = new Date(cert.issuedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const studentName = cert.user?.name || "Student";
  const courseName = cert.course.title;
  const instructorName = cert.course?.instructor?.name || "SmartLMS Team";
  const verificationId = cert.certificateId;
  const verificationUrl = `https://smartlms-bay.vercel.app/verify-certificate?id=${verificationId}`;

  return (
    <div
      ref={certRef}
      style={{
        position: "fixed",
        left: "-9999px",
        top: 0,
        width: "1122px",
        height: "794px",
        background: "#ffffff",
        fontFamily: "'Georgia', 'Palatino Linotype', serif",
        overflow: "hidden",
      }}
    >
      {/* Blue double border - outer */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          border: "40px solid #B8D4E8",
          boxSizing: "border-box",
        }}
      />
      {/* Blue double border - inner */}
      <div
        style={{
          position: "absolute",
          inset: "50px",
          border: "2px solid #B8D4E8",
          boxSizing: "border-box",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "100%",
          padding: "60px 80px 50px",
          boxSizing: "border-box",
          zIndex: 1,
        }}
      >
        {/* Top row: Logo left, Badge right */}
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          {/* Logo + Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "#0068C8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ color: "white", fontSize: "18px" }}>📚</span>
            </div>
            <span
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                color: "#0068C8",
                fontFamily: "Arial, sans-serif",
              }}
            >
              SmartLMS
            </span>
          </div>

          {/* Certified Badge */}
          <div
            style={{
              width: "70px",
              height: "82px",
              position: "relative",
              textAlign: "center",
            }}
          >
            <svg width="70" height="82" viewBox="0 0 70 82" fill="none">
              <path d="M35 4L62 17V48C62 62 49 73 35 77C21 73 8 62 8 48V17L35 4Z" fill="#0056A4" />
              <path d="M35 8L58 19V48C58 60 47 69 35 73C23 69 12 60 12 48V19L35 8Z" fill="#0068C8" />
              <path d="M35 15L50 24V46C50 55 43 62 35 65C27 62 20 55 20 46V24L35 15Z" fill="white" />
              <text x="35" y="38" textAnchor="middle" fill="#0056A4" fontSize="14" fontWeight="bold" fontFamily="Arial">★</text>
              <text x="35" y="52" textAnchor="middle" fill="#0056A4" fontSize="5" fontWeight="bold" fontFamily="Arial">SmartLMS</text>
              <text x="35" y="59" textAnchor="middle" fill="#0056A4" fontSize="4.5" fontWeight="600" fontFamily="Arial">CERTIFIED</text>
            </svg>
          </div>
        </div>

        {/* Title Section */}
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <p style={{ fontSize: "14px", color: "#0068C8", fontWeight: "medium", letterSpacing: "1px" }}>
            SmartLMS Presents
          </p>
          <h1
            style={{
              fontSize: "52px",
              fontWeight: "bold",
              color: "#1a1a1a",
              margin: "8px 0 0",
              letterSpacing: "2px",
            }}
          >
            CERTIFICATE
          </h1>
          <p style={{ fontSize: "16px", fontWeight: "600", color: "#333", letterSpacing: "3px", textTransform: "uppercase", margin: "4px 0 0" }}>
            of Completion
          </p>
        </div>

        {/* Presented to */}
        <div style={{ textAlign: "center", marginTop: "30px" }}>
          <p style={{ fontSize: "13px", color: "#444" }}>
            This Certificate is Proudly Presented to
          </p>
        </div>

        {/* Student Name */}
        <div style={{ textAlign: "center", marginTop: "16px", width: "60%" }}>
          <h2
            style={{
              fontSize: "36px",
              fontWeight: "bold",
              color: "#1a1a1a",
              paddingBottom: "8px",
              borderBottom: "2px solid #0068C8",
              margin: 0,
            }}
          >
            {studentName}
          </h2>
        </div>

        {/* Course completion text */}
        <div style={{ textAlign: "center", marginTop: "24px" }}>
          <p style={{ fontSize: "13px", color: "#444" }}>
            for successfully completing the course on
          </p>
          <h3
            style={{
              fontSize: "22px",
              fontWeight: "bold",
              color: "#1a1a1a",
              margin: "6px 0 0",
            }}
          >
            {courseName}
          </h3>
        </div>

        {/* Bottom section: Date - Badges - Signature */}
        <div
          style={{
            marginTop: "auto",
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          {/* Date */}
          <div style={{ textAlign: "center", minWidth: "140px" }}>
            <div
              style={{
                borderBottom: "1px solid #333",
                paddingBottom: "6px",
                marginBottom: "4px",
              }}
            >
              <span style={{ fontSize: "12px", fontWeight: "600", color: "#333" }}>
                {issuedDate}
              </span>
            </div>
            <span style={{ fontSize: "10px", color: "#666" }}>Date</span>
          </div>

          {/* Certification Badges */}
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            {/* ISO Badge */}
            <div
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                border: "2px solid #0068C8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              <div>
                <div style={{ fontSize: "5px", fontWeight: "bold", color: "#0068C8" }}>CERTIFIED</div>
                <div style={{ fontSize: "6px", fontWeight: "bold", color: "#0068C8" }}>COMPANY</div>
                <div style={{ fontSize: "5px", color: "#0068C8" }}>ISO</div>
              </div>
            </div>

            {/* AICPA SOC Badge */}
            <div
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                background: "#0068C8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              <div>
                <div style={{ fontSize: "5px", fontWeight: "bold", color: "white" }}>AICPA</div>
                <div style={{ fontSize: "6px", fontWeight: "bold", color: "white" }}>SOC</div>
              </div>
            </div>

            {/* ISO 37001 Badge */}
            <div
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                border: "2px solid #0068C8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              <div>
                <div style={{ fontSize: "5px", fontWeight: "bold", color: "#0068C8" }}>ISO</div>
                <div style={{ fontSize: "6px", fontWeight: "bold", color: "#0068C8" }}>37001</div>
              </div>
            </div>
          </div>

          {/* Signature */}
          <div style={{ textAlign: "center", minWidth: "140px" }}>
            <div
              style={{
                borderBottom: "1px solid #333",
                paddingBottom: "6px",
                marginBottom: "4px",
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  fontStyle: "italic",
                  color: "#333",
                }}
              >
                {instructorName}
              </span>
            </div>
            <span style={{ fontSize: "10px", color: "#666" }}>Founder and CEO</span>
          </div>
        </div>

        {/* QR Code + Verification Row */}
        <div
          style={{
            marginTop: "24px",
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ fontSize: "8px", color: "#999" }}>
              View at: smartlms-bay.vercel.app/certificate/{verificationId}
            </div>
            <div style={{ fontSize: "8px", color: "#999" }}>
              This certificate was issued by SmartLMS Platform
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=70x70&data=${encodeURIComponent(verificationUrl)}`}
              alt="QR Code"
              width={70}
              height={70}
              crossOrigin="anonymous"
            />
            <div style={{ fontSize: "7px", fontWeight: "bold", color: "#0068C8", textTransform: "uppercase", letterSpacing: "1px", marginTop: "4px" }}>
              Scan to Verify
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "8px", fontWeight: "bold", color: "#00A67E", textTransform: "uppercase" }}>
              Verified
            </div>
            <div style={{ marginTop: "4px" }}>
              <div style={{ fontSize: "7px", fontWeight: "600", color: "#666", textTransform: "uppercase", letterSpacing: "1px" }}>
                Certificate No.
              </div>
              <div style={{ fontSize: "11px", fontWeight: "bold", color: "#333", fontFamily: "monospace", letterSpacing: "1px" }}>
                {verificationId}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
