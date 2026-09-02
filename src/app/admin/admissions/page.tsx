"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  X,
  Loader2,
  Search,
  Filter,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Admission {
  id: string;
  applicationNumber: string;
  status: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup?: string;
  nationality: string;
  stateOfOrigin?: string;
  homeAddress: string;
  email: string;
  phone: string;
  previousSchool?: string;
  previousScore?: string;
  guardianName?: string;
  guardianRelationship?: string;
  guardianPhone?: string;
  guardianEmail?: string;
  documents: { name: string; type: string; url: string }[];
  notes?: string;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  UNDER_REVIEW: "bg-blue-100 text-blue-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
};

export default function AdminAdmissionsPage() {
  const [applications, setApplications] = useState<Admission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Admission | null>(null);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const [reviewing, setReviewing] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await fetch("/api/admissions");
      if (res.ok) {
        const data = await res.json();
        setApplications(data.applications || []);
      }
    } catch {
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (id: string, status: string) => {
    setReviewing(true);
    try {
      const res = await fetch(`/api/admissions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        toast.success(`Application ${status.toLowerCase()}`);
        setApplications((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status } : a))
        );
        setSelected(null);
      } else {
        toast.error("Failed to update application");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setReviewing(false);
    }
  };

  const filtered = applications.filter((a) => {
    if (filter && a.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        a.firstName.toLowerCase().includes(q) ||
        a.lastName.toLowerCase().includes(q) ||
        a.applicationNumber.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const counts = {
    total: applications.length,
    pending: applications.filter((a) => a.status === "PENDING").length,
    approved: applications.filter((a) => a.status === "APPROVED").length,
    rejected: applications.filter((a) => a.status === "REJECTED").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admission Applications</h1>
        <p className="mt-1 text-gray-500">Review and manage student admission applications</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total", value: counts.total, color: "text-gray-900" },
          { label: "Pending", value: counts.pending, color: "text-yellow-600" },
          { label: "Approved", value: counts.approved, color: "text-green-600" },
          { label: "Rejected", value: counts.rejected, color: "text-red-600" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 text-center">
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, number, or email..."
            className="w-full rounded-lg border border-gray-200 pl-10 pr-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-12 text-center text-gray-400">No applications found</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((app) => (
            <Card key={app.id} className="cursor-pointer transition-shadow hover:shadow-md" onClick={() => setSelected(app)}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                      {app.firstName[0]}{app.lastName[0]}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{app.firstName} {app.lastName}</p>
                      <p className="text-sm text-gray-500">{app.applicationNumber} | {app.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={statusColors[app.status] || "bg-gray-100 text-gray-700"}>
                      {app.status.replace("_", " ")}
                    </Badge>
                    <Eye className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelected(null)}>
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-600">
                  {selected.firstName[0]}{selected.lastName[0]}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {selected.firstName} {selected.middleName} {selected.lastName}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {selected.applicationNumber} |{" "}
                    <Badge className={statusColors[selected.status]}>{selected.status.replace("_", " ")}</Badge>
                  </p>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-6">
              {/* Personal Info */}
              <Section title="Personal Information">
                <Row label="Date of Birth" value={new Date(selected.dateOfBirth).toLocaleDateString()} />
                <Row label="Gender" value={selected.gender} />
                <Row label="Nationality" value={selected.nationality} />
                <Row label="State of Origin" value={selected.stateOfOrigin || "—"} />
                <Row label="Blood Group" value={selected.bloodGroup || "—"} />
              </Section>

              {/* Contact Information */}
              <Section title="Contact Information">
                <Row label="Email" value={selected.email || "—"} highlight={!selected.email} />
                <Row label="Phone" value={selected.phone || "—"} highlight={!selected.phone} />
                <Row label="Address" value={selected.homeAddress} />
                <Row label="Previous School" value={selected.previousSchool || "—"} />
              </Section>

              {/* Guardian Information */}
              <Section title="Guardian Information">
                <Row label="Guardian Name" value={selected.guardianName || "—"} />
                <Row label="Relationship" value={selected.guardianRelationship || "—"} />
                <Row label="Guardian Phone" value={selected.guardianPhone || "—"} />
                <Row label="Guardian Email" value={selected.guardianEmail || "—"} />
              </Section>

              {/* Documents */}
              <Section title="Uploaded Documents">
                {(!selected.documents || selected.documents.length === 0) ? (
                  <p className="text-sm text-gray-400">No documents uploaded</p>
                ) : (
                  <div className="space-y-2">
                    {selected.documents.map((doc, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-blue-500" />
                          <span className="text-sm text-gray-700">{doc.name}</span>
                        </div>
                        {doc.url && doc.url.startsWith("data:") ? (
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-blue-600 hover:text-blue-700"
                          >
                            View
                          </a>
                        ) : (
                          <span className="text-xs text-gray-400">File</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </Section>
            </div>

            {/* Action Buttons */}
            {selected.status === "PENDING" && (
              <div className="mt-6 flex gap-3">
                <Button
                  onClick={() => handleReview(selected.id, "APPROVED")}
                  disabled={reviewing}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {reviewing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                  Approve
                </Button>
                <Button
                  onClick={() => handleReview(selected.id, "REJECTED")}
                  disabled={reviewing}
                  variant="destructive"
                  className="flex-1"
                >
                  {reviewing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <XCircle className="mr-2 h-4 w-4" />}
                  Reject
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">{title}</h3>
      <div className="rounded-lg border border-gray-200 p-4 space-y-2">
        {children}
      </div>
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className={`font-medium ${highlight ? "text-gray-400" : "text-gray-900"}`}>{value}</span>
    </div>
  );
}
