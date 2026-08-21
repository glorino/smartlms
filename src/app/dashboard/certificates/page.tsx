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
  const studentName = "Student";
  const courseName = cert.course.title;
  const instructorName = "Instructor";
  const verificationId = cert.certificateId;

  return (
    <div
      ref={certRef}
      style={{
        position: "fixed",
        left: "-9999px",
        top: 0,
        width: "1122px",
        height: "794px",
        background: "#FFFEF7",
        fontFamily: "'Georgia', 'Palatino Linotype', serif",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          border: "4px double #b9a56e",
          borderRadius: "8px",
          margin: "10px",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          border: "1.5px solid #d2c396",
          borderRadius: "6px",
          margin: "16px",
        }}
      />
      <div style={{ textAlign: "center", padding: "30px 60px", position: "relative", zIndex: 1 }}>
        <div
          style={{
            fontSize: "8px",
            fontWeight: 700,
            letterSpacing: "3px",
            color: "#a5915a",
            marginBottom: "4px",
          }}
        >
          SMARTLMS
        </div>
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            marginBottom: "6px",
          }}
        >
          <div style={{ height: "1px", width: "60px", background: "#b9a56e" }} />
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#b9a56e",
            }}
          />
          <div style={{ height: "1px", width: "60px", background: "#b9a56e" }} />
        </div>
        <div
          style={{
            fontSize: "26px",
            fontWeight: 700,
            color: "#372d1e",
            marginBottom: "8px",
          }}
        >
          Certificate of Completion
        </div>
        <div
          style={{
            height: "2px",
            width: "50%",
            margin: "0 auto 12px",
            background: "#b9a56e",
          }}
        />
        <div
          style={{
            fontSize: "12px",
            fontStyle: "italic",
            color: "#827864",
            marginBottom: "8px",
          }}
        >
          This is to certify that
        </div>
        <div
          style={{
            fontSize: "36px",
            fontWeight: 700,
            fontStyle: "italic",
            color: "#231e14",
            marginBottom: "6px",
            borderBottom: "2px solid #b9a56e",
            display: "inline-block",
            paddingBottom: "4px",
          }}
        >
          {studentName}
        </div>
        <div
          style={{
            fontSize: "12px",
            fontStyle: "italic",
            color: "#827864",
            marginTop: "12px",
            marginBottom: "6px",
          }}
        >
          has successfully completed the course
        </div>
        <div
          style={{
            fontSize: "20px",
            fontWeight: 700,
            color: "#8c7332",
            marginBottom: "8px",
          }}
        >
          {courseName}
        </div>
        <div
          style={{
            height: "1px",
            width: "80%",
            margin: "0 auto 10px",
            background: "#d2c396",
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            maxWidth: "80%",
            margin: "0 auto",
          }}
        >
          {[
            { label: "INSTRUCTOR", value: instructorName },
            { label: "DATE OF ISSUE", value: issuedDate },
            { label: "CERTIFICATE NO.", value: verificationId },
          ].map((item) => (
            <div key={item.label} style={{ textAlign: "center", minWidth: "140px" }}>
              <div style={{ fontSize: "11px", color: "#504632", fontWeight: 400 }}>
                {item.value}
              </div>
              <div
                style={{
                  height: "1px",
                  background: "#b4aa96",
                  margin: "6px auto",
                  width: "120px",
                }}
              />
              <div style={{ fontSize: "7px", letterSpacing: "1px", color: "#a09682" }}>
                {item.label}
              </div>
            </div>
          ))}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "40px",
            fontSize: "7px",
            color: "#a09682",
          }}
        >
          <div>View at: smartlms-bay.vercel.app/certificate/{verificationId}</div>
          <div style={{ marginTop: "3px" }}>This certificate was issued by SmartLMS Platform</div>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            right: "40px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "8px", fontWeight: 700, color: "#3c8250" }}>
            VERIFIED
          </div>
        </div>
      </div>
    </div>
  );
}
