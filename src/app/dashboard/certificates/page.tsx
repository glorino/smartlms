"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Award,
  Download,
  Share2,
  Search,
  ExternalLink,
  BookOpen,
  Copy,
  Check,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import type { Certificate } from "@/types";

export default function MyCertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

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
                    <Button variant="outline" size="sm" className="flex-1">
                      <Download className="mr-1.5 h-3.5 w-3.5" />
                      PDF
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Share2 className="mr-1.5 h-3.5 w-3.5" />
                      Share
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                      Verify
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
    </div>
  );
}
