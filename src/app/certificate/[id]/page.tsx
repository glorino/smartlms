import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Award,
  CheckCircle,
  Download,
  Printer,
  Share2,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";
import Navbar from "@/components/layout/navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

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

export default async function CertificateVerifyPage({
  params,
}: {
  params: { id: string };
}) {
  const certificate = await getCertificate(params.id);

  if (!certificate) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        {/* Verified Banner */}
        <div className="mb-8 rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-green-800">
            Certificate Verified
          </h2>
          <p className="mt-1 text-sm text-green-600">
            This certificate is authentic and was issued by SmartLMS
          </p>
        </div>

        {/* Certificate Card */}
        <Card className="overflow-hidden">
          {/* Decorative Header */}
          <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-8 py-12 text-center text-white">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDJ2LTJoMzR6TTIgMTBoMzZ2MkgyVjEweiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
            <div className="relative">
              <Award className="mx-auto mb-4 h-16 w-16" />
              <h1 className="text-3xl font-bold">Certificate of Completion</h1>
              <p className="mt-2 text-blue-100">SmartLMS Platform</p>
            </div>
          </div>

          <CardContent className="p-8">
            {/* Certificate Details */}
            <div className="text-center">
              <p className="text-sm text-gray-500">This is to certify that</p>
              <h2 className="mt-2 text-2xl font-bold text-gray-900">
                {certificate.user?.name || "Student"}
              </h2>
              <p className="mt-4 text-sm text-gray-500">
                has successfully completed the course
              </p>
              <h3 className="mt-2 text-xl font-semibold text-primary">
                {certificate.course?.title || certificate.title}
              </h3>
            </div>

            <Separator className="my-8" />

            {/* Info Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                    Certificate ID
                  </p>
                  <p className="mt-1 font-mono text-sm font-semibold text-gray-900">
                    {certificate.certificateId}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                    Date Issued
                  </p>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(certificate.issuedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                {certificate.expiresAt && (
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                      Expires
                    </p>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(certificate.expiresAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                    Status
                  </p>
                  <div className="mt-1">
                    <Badge
                      variant={
                        certificate.status === "ACTIVE" ? "success" : "danger"
                      }
                    >
                      {certificate.status === "ACTIVE" ? (
                        <>
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Verified & Active
                        </>
                      ) : (
                        "Revoked"
                      )}
                    </Badge>
                  </div>
                </div>
                {certificate.course?.instructor && (
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                      Instructor
                    </p>
                    <p className="mt-1 text-sm text-gray-900">
                      {certificate.course.instructor.name}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                    Verification URL
                  </p>
                  <p className="mt-1 break-all text-xs text-gray-600">
                    {typeof window !== "undefined"
                      ? window.location.href
                      : ""}
                  </p>
                </div>
              </div>
            </div>

            {/* QR Code Placeholder */}
            <div className="mt-8 flex justify-center">
              <div className="flex h-32 w-32 items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50">
                <div className="text-center">
                  <div className="mx-auto mb-1 grid grid-cols-5 gap-0.5">
                    {Array.from({ length: 25 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-3 w-3 ${
                          Math.random() > 0.5 ? "bg-gray-900" : "bg-white"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="mt-1 text-[10px] text-gray-400">QR Code</p>
                </div>
              </div>
            </div>

            <Separator className="my-8" />

            {/* Actions */}
            <div className="flex flex-wrap justify-center gap-3">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
              <Button variant="outline">
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
              <Button variant="outline">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <p className="mt-6 text-center text-xs text-gray-400">
          This certificate can be verified by sharing this URL or the Certificate
          ID with anyone.
        </p>
      </div>
    </div>
  );
}
