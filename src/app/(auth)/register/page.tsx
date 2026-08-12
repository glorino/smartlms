"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import {
  GraduationCap,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  BookOpen,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Zap,
  Globe,
  Upload,
} from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";

type Role = "STUDENT" | "INSTRUCTOR";

const EXPERTISE_OPTIONS = [
  "Web Development",
  "Mobile Development",
  "Data Science",
  "AI/ML",
  "Design",
  "Business",
  "Marketing",
  "Other",
] as const;

const EXPERIENCE_LEVELS = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Expert",
] as const;

interface FormState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: Role;
  agreeTerms: boolean;
  professionalHeadline: string;
  bio: string;
  expertise: string[];
  experience: string;
  portfolioUrl: string;
  linkedinUrl: string;
  resumeCv: File | null;
}

const features = [
  { icon: Sparkles, text: "AI-powered personalized learning paths" },
  { icon: Zap, text: `${SITE_CONFIG.stats.courses} courses from expert instructors` },
  { icon: Globe, text: "Learn from anywhere, anytime" },
  { icon: GraduationCap, text: "Earn recognized certificates" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "STUDENT",
    agreeTerms: false,
    professionalHeadline: "",
    bio: "",
    expertise: [],
    experience: "",
    portfolioUrl: "",
    linkedinUrl: "",
    resumeCv: null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const updateField = <K extends keyof FormState>(
    key: K,
    value: FormState[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const toggleExpertise = (area: string) => {
    setForm((prev) => {
      const exists = prev.expertise.includes(area);
      return {
        ...prev,
        expertise: exists
          ? prev.expertise.filter((e) => e !== area)
          : [...prev.expertise, area],
      };
    });
    if (errors.expertise) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.expertise;
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    } else if (form.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) {
      newErrors.password =
        "Password must contain uppercase, lowercase, and a number";
    }
    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!form.agreeTerms) {
      newErrors.agreeTerms = "You must agree to the terms and conditions";
    }
    if (form.role === "INSTRUCTOR") {
      if (!form.professionalHeadline.trim()) {
        newErrors.professionalHeadline = "Professional headline is required";
      } else if (form.professionalHeadline.trim().length < 3) {
        newErrors.professionalHeadline =
          "Professional headline must be at least 3 characters";
      }
      if (!form.bio.trim()) {
        newErrors.bio = "Bio is required";
      } else if (form.bio.trim().length < 50) {
        newErrors.bio = "Bio must be at least 50 characters";
      }
      if (form.expertise.length === 0) {
        newErrors.expertise = "Select at least one expertise area";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;
    setLoading(true);
    try {
      const payload: Record<string, unknown> = {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
      };
      if (form.role === "INSTRUCTOR") {
        payload.professionalHeadline = form.professionalHeadline.trim();
        payload.bio = form.bio.trim();
        payload.expertise = form.expertise;
        payload.experience = form.experience;
        payload.portfolioUrl = form.portfolioUrl.trim();
        payload.linkedinUrl = form.linkedinUrl.trim();
      }
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setServerError(data?.error || "Registration failed. Please try again.");
        return;
      }
      const signInResult = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });
      if (signInResult?.error) {
        setServerError(
          "Account created but sign-in failed. Please go to login."
        );
        router.push("/login");
      } else {
        localStorage.setItem("userRole", form.role);
        toast.success("Welcome to SmartLMS!");
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Panel */}
      <div className="hidden w-1/2 overflow-y-auto bg-gradient-to-br from-indigo-600 via-purple-600 to-purple-700 p-12 lg:block">
        <div className="flex min-h-full flex-col justify-between">
          <div className="max-w-md">
            <Link
              href="/"
              className="mb-10 inline-flex items-center gap-2 text-white/80 transition-colors hover:text-white"
            >
              <GraduationCap className="h-8 w-8" />
              <span className="text-2xl font-bold">SmartLMS</span>
            </Link>
            <h1 className="mb-4 text-4xl font-extrabold leading-tight text-white">
              Start your learning journey today
            </h1>
            <p className="mb-10 text-lg text-white/70">
              Join a global community of learners and unlock your full potential
              with AI-powered education.
            </p>
            <div className="space-y-5">
              {features.map((f) => (
                <div key={f.text} className="flex items-center gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
                    <f.icon className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-base font-medium text-white/90">{f.text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-12 rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
            <p className="text-sm italic text-white/80">
              &ldquo;SmartLMS helped me transition from a complete beginner to
              a full-stack developer in 6 months. The AI learning paths are
              incredible!&rdquo;
            </p>
            <p className="mt-3 text-sm font-semibold text-white">
              — Jessica Park, Software Engineer
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex w-full justify-center overflow-y-auto p-6 lg:w-1/2 lg:p-12">
        <div className="w-full max-w-lg">
          <div className="mb-8 text-center lg:hidden">
            <Link
              href="/"
              className="inline-flex items-center gap-2"
            >
              <GraduationCap className="h-10 w-10 text-indigo-600" />
              <span className="text-2xl font-bold text-gray-900">SmartLMS</span>
            </Link>
          </div>
          <div className="mb-8">
            <Link
              href="/"
              className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Homepage
            </Link>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Fill in your details to get started for free.
            </p>
          </div>

          {/* Social Login - Hidden until Google/GitHub OAuth configured */}
          {false && (
            <div className="mb-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </button>
              <button
                type="button"
                onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
                className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </button>
            </div>
          )}

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-gray-400">
                or continue with email
              </span>
            </div>
          </div>

          {serverError && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Selector */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                I want to
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(
                  [
                    {
                      value: "STUDENT" as Role,
                      label: "Learn",
                      desc: "Take courses & grow skills",
                      icon: User,
                      gradient: "from-blue-500 to-indigo-600",
                    },
                    {
                      value: "INSTRUCTOR" as Role,
                      label: "Teach",
                      desc: "Create & share knowledge",
                      icon: BookOpen,
                      gradient: "from-purple-500 to-pink-600",
                    },
                  ] as const
                ).map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => updateField("role", option.value)}
                    className={`relative flex flex-col items-center rounded-xl border-2 p-4 text-center transition-all ${
                      form.role === option.value
                        ? `border-transparent bg-gradient-to-br ${option.gradient} text-white shadow-lg`
                        : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300 hover:bg-white"
                    }`}
                  >
                    <option.icon className="mb-2 h-6 w-6" />
                    <span className="text-sm font-bold">{option.label}</span>
                    <span
                      className={`mt-0.5 text-xs ${
                        form.role === option.value
                          ? "text-white/80"
                          : "text-gray-400"
                      }`}
                    >
                      {option.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Instructor Profile Fields */}
            {form.role === "INSTRUCTOR" && (
              <div className="space-y-4 rounded-xl border-2 border-purple-200 bg-purple-50/50 p-4">
                <h3 className="text-sm font-semibold text-purple-800">Instructor Profile</h3>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                    Professional Headline
                  </label>
                  <input
                    name="professionalHeadline"
                    placeholder="e.g. Senior Software Engineer | React Expert"
                    value={form.professionalHeadline}
                    onChange={(e) => updateField("professionalHeadline", e.target.value)}
                    className={`w-full rounded-xl border-2 bg-gray-50 py-3 px-4 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                      errors.professionalHeadline ? "border-red-400" : "border-gray-200"
                    }`}
                  />
                  {errors.professionalHeadline && (
                    <p className="mt-1.5 text-sm text-red-500">{errors.professionalHeadline}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    placeholder="Tell students about your experience and teaching style..."
                    rows={3}
                    value={form.bio}
                    onChange={(e) => updateField("bio", e.target.value)}
                    className={`w-full rounded-xl border-2 bg-gray-50 py-3 px-4 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                      errors.bio ? "border-red-400" : "border-gray-200"
                    }`}
                  />
                  {errors.bio && (
                    <p className="mt-1.5 text-sm text-red-500">{errors.bio}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                    Areas of Expertise
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {EXPERTISE_OPTIONS.filter((o) => o !== "Other").map((area) => (
                      <button
                        key={area}
                        type="button"
                        onClick={() => toggleExpertise(area)}
                        className={`rounded-full border-2 px-3 py-1.5 text-xs font-medium transition-all ${
                          form.expertise.includes(area)
                            ? "border-indigo-500 bg-indigo-500 text-white"
                            : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        {form.expertise.includes(area) && (
                          <CheckCircle2 className="mr-1 inline-block h-3 w-3" />
                        )}
                        {area}
                      </button>
                    ))}
                  </div>
                  {errors.expertise && (
                    <p className="mt-1.5 text-sm text-red-500">{errors.expertise}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                    Years of Experience
                  </label>
                  <select
                    name="experience"
                    value={form.experience}
                    onChange={(e) => updateField("experience", e.target.value)}
                    className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 py-3 px-4 text-sm text-gray-900 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="">Select...</option>
                    <option value="1-3">1-3 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="5-10">5-10 years</option>
                    <option value="10+">10+ years</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                    Portfolio URL (optional)
                  </label>
                  <input
                    name="portfolioUrl"
                    placeholder="https://yourportfolio.com"
                    value={form.portfolioUrl}
                    onChange={(e) => updateField("portfolioUrl", e.target.value)}
                    className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 py-3 px-4 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                    LinkedIn URL (optional)
                  </label>
                  <input
                    name="linkedinUrl"
                    placeholder="https://linkedin.com/in/yourprofile"
                    value={form.linkedinUrl}
                    onChange={(e) => updateField("linkedinUrl", e.target.value)}
                    className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 py-3 px-4 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                    Resume / CV (optional)
                  </label>
                  <label className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 py-4 px-4 text-sm text-gray-600 transition-all hover:border-indigo-400 hover:bg-indigo-50/50">
                    <Upload className="h-5 w-5 text-gray-400" />
                    <span>{form.resumeCv ? form.resumeCv.name : "Choose a PDF or DOC file"}</span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={(e) => updateField("resumeCv", e.target.files?.[0] || null)}
                    />
                  </label>
                </div>
              </div>
            )}

            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-1.5 block text-sm font-semibold text-gray-700"
              >
                Full name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className={`w-full rounded-xl border-2 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                    errors.name ? "border-red-400" : "border-gray-200"
                  }`}
                />
              </div>
              {errors.name && (
                <p className="mt-1.5 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-semibold text-gray-700"
              >
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className={`w-full rounded-xl border-2 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                    errors.email ? "border-red-400" : "border-gray-200"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-semibold text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min 8 characters"
                  value={form.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  className={`w-full rounded-xl border-2 bg-gray-50 py-3 pl-11 pr-12 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                    errors.password ? "border-red-400" : "border-gray-200"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1.5 block text-sm font-semibold text-gray-700"
              >
                Confirm password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Re-enter your password"
                  value={form.confirmPassword}
                  onChange={(e) =>
                    updateField("confirmPassword", e.target.value)
                  }
                  className={`w-full rounded-xl border-2 bg-gray-50 py-3 pl-11 pr-12 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                    errors.confirmPassword
                      ? "border-red-400"
                      : "border-gray-200"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirm ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1.5 text-sm text-red-500">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={form.agreeTerms}
                onChange={(e) => updateField("agreeTerms", e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-600">
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Privacy Policy
                </Link>
              </span>
            </label>
            {errors.agreeTerms && (
              <p className="text-sm text-red-500">{errors.agreeTerms}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition-all hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl hover:shadow-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <svg
                  className="h-5 w-5 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              ) : (
                <>
                  Create account
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-indigo-600 hover:text-indigo-500"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
