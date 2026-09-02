"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  ChevronLeft,
  ChevronRight,
  Upload,
  Trash2,
  CheckCircle2,
  Loader2,
  User,
  GraduationCap,
  Shield,
  FileText,
  Eye,
} from "lucide-react";

const steps = [
  { id: 1, label: "Personal Info", icon: User },
  { id: 2, label: "Academic Info", icon: GraduationCap },
  { id: 3, label: "Guardian Info", icon: Shield },
  { id: 4, label: "Documents", icon: FileText },
  { id: 5, label: "Review", icon: Eye },
];

export default function AdmissionForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    dateOfBirth: "",
    gender: "",
    bloodGroup: "",
    nationality: "Nigerian",
    stateOfOrigin: "",
    homeAddress: "",
    email: "",
    phone: "",
    previousSchool: "",
    previousScore: "",
    guardianName: "",
    guardianRelationship: "",
    guardianPhone: "",
    guardianEmail: "",
  });

  const [documents, setDocuments] = useState<{ name: string; type: string; url: string }[]>([]);

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 5MB)`);
        continue;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setDocuments((prev) => [
          ...prev,
          { name: file.name, type: file.type, url: reader.result as string },
        ]);
        toast.success(`${file.name} uploaded`);
      };
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeDoc = (index: number) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  const validateStep = (): boolean => {
    switch (currentStep) {
      case 1:
        if (!form.firstName || !form.lastName || !form.dateOfBirth || !form.gender || !form.homeAddress || !form.email || !form.phone) {
          toast.error("Please fill all required fields");
          return false;
        }
        return true;
      case 2:
        return true;
      case 3:
        return true;
      case 4:
        return true;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/admissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, documents }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
        toast.success("Application submitted successfully!");
      } else {
        toast.error(data.error || "Failed to submit application");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
            <CheckCircle2 className="h-8 w-8 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Application Submitted!</h2>
          <p className="mt-2 text-gray-300">
            Your application has been received. You will be contacted soon.
          </p>
          <button
            onClick={() => router.push("/")}
            className="mt-6 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-500"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-12 px-4">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">Admission Application</h1>
          <p className="mt-2 text-gray-300">Complete the form below to apply for admission.</p>
        </div>

        {/* Step Indicator */}
        <div className="mb-8 flex items-center justify-between">
          {steps.map((step, i) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-all ${
                  currentStep >= step.id
                    ? "bg-green-500 text-white"
                    : "bg-white/10 text-gray-400"
                }`}
              >
                {currentStep > step.id ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  step.id
                )}
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`mx-1 h-0.5 w-8 sm:w-12 ${
                    currentStep > step.id ? "bg-green-500" : "bg-white/10"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="mb-6 flex justify-center gap-4 text-xs text-gray-400">
          {steps.map((step) => (
            <span key={step.id} className={currentStep === step.id ? "text-green-400 font-medium" : ""}>
              {step.label}
            </span>
          ))}
        </div>

        {/* Form Card */}
        <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-6 sm:p-8">
          <h2 className="mb-6 text-xl font-bold text-white">
            {steps[currentStep - 1].label}
          </h2>

          {/* Step 1: Personal Info */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-300">First Name *</label>
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={(e) => update("firstName", e.target.value)}
                    className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-300">Last Name *</label>
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={(e) => update("lastName", e.target.value)}
                    className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-300">Middle Name</label>
                <input
                  type="text"
                  value={form.middleName}
                  onChange={(e) => update("middleName", e.target.value)}
                  className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-300">Date of Birth *</label>
                  <input
                    type="date"
                    value={form.dateOfBirth}
                    onChange={(e) => update("dateOfBirth", e.target.value)}
                    className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-300">Gender *</label>
                  <select
                    value={form.gender}
                    onChange={(e) => update("gender", e.target.value)}
                    className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-white focus:border-blue-500 focus:outline-none"
                    required
                  >
                    <option value="" className="bg-slate-800">Select</option>
                    <option value="Male" className="bg-slate-800">Male</option>
                    <option value="Female" className="bg-slate-800">Female</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-300">Blood Group</label>
                  <select
                    value={form.bloodGroup}
                    onChange={(e) => update("bloodGroup", e.target.value)}
                    className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="" className="bg-slate-800">Select</option>
                    <option value="A+" className="bg-slate-800">A+</option>
                    <option value="A-" className="bg-slate-800">A-</option>
                    <option value="B+" className="bg-slate-800">B+</option>
                    <option value="B-" className="bg-slate-800">B-</option>
                    <option value="O+" className="bg-slate-800">O+</option>
                    <option value="O-" className="bg-slate-800">O-</option>
                    <option value="AB+" className="bg-slate-800">AB+</option>
                    <option value="AB-" className="bg-slate-800">AB-</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-300">Nationality</label>
                  <input
                    type="text"
                    value={form.nationality}
                    onChange={(e) => update("nationality", e.target.value)}
                    className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-300">State of Origin</label>
                  <input
                    type="text"
                    value={form.stateOfOrigin}
                    onChange={(e) => update("stateOfOrigin", e.target.value)}
                    className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-300">Email *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                    placeholder="student@email.com"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-300">Phone Number *</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                  placeholder="+234..."
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-300">Home Address *</label>
                <textarea
                  value={form.homeAddress}
                  onChange={(e) => update("homeAddress", e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none resize-none"
                  required
                />
              </div>
            </div>
          )}

          {/* Step 2: Academic Info */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-300">Previous School</label>
                <input
                  type="text"
                  value={form.previousSchool}
                  onChange={(e) => update("previousSchool", e.target.value)}
                  className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                  placeholder="e.g., XAD School"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-300">Previous Score / GPA</label>
                <input
                  type="text"
                  value={form.previousScore}
                  onChange={(e) => update("previousScore", e.target.value)}
                  className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                  placeholder="e.g., 85% or 3.8 GPA"
                />
              </div>
            </div>
          )}

          {/* Step 3: Guardian Info */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-300">Guardian Name</label>
                  <input
                    type="text"
                    value={form.guardianName}
                    onChange={(e) => update("guardianName", e.target.value)}
                    className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-300">Relationship</label>
                  <select
                    value={form.guardianRelationship}
                    onChange={(e) => update("guardianRelationship", e.target.value)}
                    className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="" className="bg-slate-800">Select</option>
                    <option value="Parent" className="bg-slate-800">Parent</option>
                    <option value="Guardian" className="bg-slate-800">Guardian</option>
                    <option value="Sibling" className="bg-slate-800">Sibling</option>
                    <option value="Other" className="bg-slate-800">Other</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-300">Guardian Phone</label>
                  <input
                    type="tel"
                    value={form.guardianPhone}
                    onChange={(e) => update("guardianPhone", e.target.value)}
                    className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                    placeholder="+234..."
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-300">Guardian Email</label>
                  <input
                    type="email"
                    value={form.guardianEmail}
                    onChange={(e) => update("guardianEmail", e.target.value)}
                    className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Documents */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-400">Upload supporting documents (birth certificate, previous school report, etc.)</p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.pdf"
                className="hidden"
                onChange={handleFileUpload}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-white/20 bg-white/5 p-6 text-gray-300 transition-colors hover:border-blue-500/50 hover:bg-white/10"
              >
                <Upload className="h-5 w-5" />
                Click to upload documents
              </button>
              {documents.length > 0 && (
                <div className="space-y-2">
                  {documents.map((doc, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3">
                      <span className="text-sm text-gray-300 truncate">{doc.name}</span>
                      <button onClick={() => removeDoc(i)} className="text-red-400 hover:text-red-300">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 5: Review */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <ReviewSection title="Personal Information">
                <ReviewRow label="Name" value={`${form.firstName} ${form.middleName} ${form.lastName}`} />
                <ReviewRow label="Date of Birth" value={form.dateOfBirth} />
                <ReviewRow label="Gender" value={form.gender} />
                <ReviewRow label="Blood Group" value={form.bloodGroup || "—"} />
                <ReviewRow label="Nationality" value={form.nationality} />
                <ReviewRow label="State of Origin" value={form.stateOfOrigin || "—"} />
                <ReviewRow label="Email" value={form.email} />
                <ReviewRow label="Phone" value={form.phone} />
                <ReviewRow label="Address" value={form.homeAddress} />
              </ReviewSection>

              <ReviewSection title="Academic Information">
                <ReviewRow label="Previous School" value={form.previousSchool || "—"} />
                <ReviewRow label="Previous Score" value={form.previousScore || "—"} />
              </ReviewSection>

              <ReviewSection title="Guardian Information">
                <ReviewRow label="Guardian Name" value={form.guardianName || "—"} />
                <ReviewRow label="Relationship" value={form.guardianRelationship || "—"} />
                <ReviewRow label="Guardian Phone" value={form.guardianPhone || "—"} />
                <ReviewRow label="Guardian Email" value={form.guardianEmail || "—"} />
              </ReviewSection>

              <ReviewSection title={`Documents (${documents.length})`}>
                {documents.length === 0 ? (
                  <p className="text-sm text-gray-400">No documents uploaded</p>
                ) : (
                  documents.map((doc, i) => (
                    <p key={i} className="text-sm text-gray-300">{doc.name}</p>
                  ))
                )}
              </ReviewSection>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
              className="flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2.5 text-sm font-medium text-gray-300 hover:bg-white/10 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>
            {currentStep < 5 ? (
              <button
                onClick={() => {
                  if (validateStep()) setCurrentStep((prev) => Math.min(5, prev + 1));
                }}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-500"
              >
                Next Step
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-2 rounded-lg bg-green-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-green-500 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Submit Application
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ReviewSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-green-400">{title}</h3>
      <div className="rounded-lg border border-white/10 bg-white/5 p-4 space-y-2">
        {children}
      </div>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-400">{label}</span>
      <span className="font-medium text-white">{value}</span>
    </div>
  );
}
