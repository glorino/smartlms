"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  GraduationCap,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  GraduationCap as StudentIcon,
  BookOpen,
  Briefcase,
  FileText,
  LinkIcon,
  Globe,
  ArrowLeft,
} from "lucide-react";

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
}

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
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
        <div className="mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <GraduationCap className="h-10 w-10 text-primary" />
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Start your learning journey today.
          </p>
        </div>

        {serverError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Role Selector */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              I want to
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(
                [
                  {
                    value: "STUDENT" as Role,
                    label: "Learn",
                    desc: "I want to take courses",
                    icon: StudentIcon,
                  },
                  {
                    value: "INSTRUCTOR" as Role,
                    label: "Teach",
                    desc: "I want to create courses",
                    icon: BookOpen,
                  },
                ] as const
              ).map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => updateField("role", option.value)}
                  className={`flex flex-col items-center rounded-xl border-2 p-4 text-center transition-all ${
                    form.role === option.value
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  <option.icon className="mb-2 h-6 w-6" />
                  <span className="text-sm font-semibold">{option.label}</span>
                  <span className="mt-0.5 text-xs text-gray-400">
                    {option.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="name"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Full name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                id="name"
                type="text"
                placeholder="John Doe"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                className={`w-full rounded-xl border bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                  errors.name ? "border-red-400" : "border-gray-300"
                }`}
              />
            </div>
            {errors.name && (
              <p className="mt-1.5 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                className={`w-full rounded-xl border bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                  errors.email ? "border-red-400" : "border-gray-300"
                }`}
              />
            </div>
            {errors.email && (
              <p className="mt-1.5 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Min 8 characters"
                value={form.password}
                onChange={(e) => updateField("password", e.target.value)}
                className={`w-full rounded-xl border bg-gray-50 py-3 pl-11 pr-12 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                  errors.password ? "border-red-400" : "border-gray-300"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
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

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Confirm password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                placeholder="Re-enter your password"
                value={form.confirmPassword}
                onChange={(e) => updateField("confirmPassword", e.target.value)}
                className={`w-full rounded-xl border bg-gray-50 py-3 pl-11 pr-12 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                  errors.confirmPassword
                    ? "border-red-400"
                    : "border-gray-300"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
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

          {/* Instructor-only fields with smooth transition */}
          <div
            className={`grid transition-all duration-500 ease-in-out ${
              form.role === "INSTRUCTOR"
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden">
              <div className="space-y-5 pt-1">
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                  <h3 className="mb-3 text-sm font-semibold text-primary">
                    Instructor Details
                  </h3>

                  {/* Professional Headline */}
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="professionalHeadline"
                        className="mb-1.5 block text-sm font-medium text-gray-700"
                      >
                        Professional headline
                      </label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                        <input
                          id="professionalHeadline"
                          type="text"
                          placeholder='e.g., "Web Developer", "Data Scientist"'
                          value={form.professionalHeadline}
                          onChange={(e) =>
                            updateField("professionalHeadline", e.target.value)
                          }
                          className={`w-full rounded-xl border bg-white py-3 pl-11 pr-4 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                            errors.professionalHeadline
                              ? "border-red-400"
                              : "border-gray-300"
                          }`}
                        />
                      </div>
                      {errors.professionalHeadline && (
                        <p className="mt-1.5 text-sm text-red-500">
                          {errors.professionalHeadline}
                        </p>
                      )}
                    </div>

                    {/* Bio */}
                    <div>
                      <label
                        htmlFor="bio"
                        className="mb-1.5 block text-sm font-medium text-gray-700"
                      >
                        Bio / About you
                      </label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <textarea
                          id="bio"
                          rows={4}
                          placeholder="Tell students about yourself, your background, and what you teach..."
                          value={form.bio}
                          onChange={(e) => updateField("bio", e.target.value)}
                          className={`w-full rounded-xl border bg-white py-3 pl-11 pr-4 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                            errors.bio ? "border-red-400" : "border-gray-300"
                          }`}
                        />
                      </div>
                      {errors.bio && (
                        <p className="mt-1.5 text-sm text-red-500">
                          {errors.bio}
                        </p>
                      )}
                    </div>

                    {/* Expertise Areas */}
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">
                        Expertise areas
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {EXPERTISE_OPTIONS.map((area) => (
                          <button
                            key={area}
                            type="button"
                            onClick={() => toggleExpertise(area)}
                            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                              form.expertise.includes(area)
                                ? "border-primary bg-primary text-white"
                                : "border-gray-300 bg-white text-gray-600 hover:border-gray-400"
                            }`}
                          >
                            {area}
                          </button>
                        ))}
                      </div>
                      {errors.expertise && (
                        <p className="mt-1.5 text-sm text-red-500">
                          {errors.expertise}
                        </p>
                      )}
                    </div>

                    {/* Teaching Experience */}
                    <div>
                      <label
                        htmlFor="experience"
                        className="mb-1.5 block text-sm font-medium text-gray-700"
                      >
                        Teaching experience
                      </label>
                      <select
                        id="experience"
                        value={form.experience}
                        onChange={(e) =>
                          updateField("experience", e.target.value)
                        }
                        className="w-full rounded-xl border border-gray-300 bg-white py-3 px-4 text-sm text-gray-900 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="">Select your level</option>
                        {EXPERIENCE_LEVELS.map((level) => (
                          <option key={level} value={level}>
                            {level}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Portfolio URL */}
                    <div>
                      <label
                        htmlFor="portfolioUrl"
                        className="mb-1.5 block text-sm font-medium text-gray-700"
                      >
                        Portfolio / Website URL{" "}
                        <span className="text-gray-400">(optional)</span>
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                        <input
                          id="portfolioUrl"
                          type="url"
                          placeholder="https://yourwebsite.com"
                          value={form.portfolioUrl}
                          onChange={(e) =>
                            updateField("portfolioUrl", e.target.value)
                          }
                          className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                    </div>

                    {/* LinkedIn URL */}
                    <div>
                      <label
                        htmlFor="linkedinUrl"
                        className="mb-1.5 block text-sm font-medium text-gray-700"
                      >
                        LinkedIn profile URL{" "}
                        <span className="text-gray-400">(optional)</span>
                      </label>
                      <div className="relative">
                        <LinkIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                        <input
                          id="linkedinUrl"
                          type="url"
                          placeholder="https://linkedin.com/in/yourprofile"
                          value={form.linkedinUrl}
                          onChange={(e) =>
                            updateField("linkedinUrl", e.target.value)
                          }
                          className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={form.agreeTerms}
              onChange={(e) => updateField("agreeTerms", e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-sm text-gray-600">
              I agree to the{" "}
              <Link
                href="/terms"
                className="font-medium text-primary hover:text-primary/80"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="font-medium text-primary hover:text-primary/80"
              >
                Privacy Policy
              </Link>
            </span>
          </label>
          {errors.agreeTerms && (
            <p className="text-sm text-red-500">{errors.agreeTerms}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin"
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
                Creating account...
              </span>
            ) : (
              "Create account"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary hover:text-primary/80"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
