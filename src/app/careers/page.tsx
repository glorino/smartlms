import Link from "next/link";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import {
  Briefcase,
  MapPin,
  Clock,
  ArrowRight,
  Heart,
  Rocket,
  Users,
  Globe,
  CheckCircle2,
} from "lucide-react";

const openings = [
  {
    title: "Senior Full-Stack Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    description: "Build and scale our Next.js + Prisma platform. Work with modern tools and ship features that impact thousands of learners.",
  },
  {
    title: "Product Designer",
    department: "Design",
    location: "Remote",
    type: "Full-time",
    description: "Shape the learning experience for students worldwide. Own the end-to-end design process from research to high-fidelity prototypes.",
  },
  {
    title: "Content Marketing Manager",
    department: "Marketing",
    location: "Remote",
    type: "Full-time",
    description: "Drive our content strategy, create engaging educational content, and grow our community of learners and instructors.",
  },
  {
    title: "DevOps Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    description: "Manage our cloud infrastructure, CI/CD pipelines, and ensure 99.9% uptime for our global platform.",
  },
  {
    title: "Data Analyst",
    department: "Analytics",
    location: "Remote",
    type: "Full-time",
    description: "Analyze learning patterns, build dashboards, and use data to improve course outcomes and platform engagement.",
  },
];

const values = [
  {
    icon: Heart,
    title: "Mission-Driven",
    description: "We believe quality education should be accessible to everyone, everywhere.",
  },
  {
    icon: Rocket,
    title: "Ship Fast",
    description: "We move quickly, iterate often, and aren't afraid to try new things.",
  },
  {
    icon: Users,
    title: "Collaborative",
    description: "We work together across teams, share knowledge, and celebrate wins together.",
  },
  {
    icon: Globe,
    title: "Global Team",
    description: "We're a remote-first company with team members across 15+ countries.",
  },
];

const benefits = [
  "Competitive salary and equity",
  "Remote-first culture",
  "Unlimited PTO policy",
  "Annual learning budget",
  "Health & wellness benefits",
  "Team retreats & offsites",
  "Home office stipend",
  "Flexible working hours",
];

export default function CareersPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 py-20 text-white">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <Briefcase className="mx-auto mb-4 h-12 w-12 text-emerald-200" />
            <h1 className="text-4xl font-bold sm:text-5xl">Join Our Team</h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-emerald-100">
              Help us build the future of online learning. We&apos;re looking for
              passionate people to join our mission.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
            Our Values
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div key={value.title} className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100">
                  <value.icon className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">{value.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits */}
        <section className="bg-gray-50 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">
              Benefits & Perks
            </h2>
            <div className="mx-auto grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                  <span className="text-sm font-medium text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="mb-4 text-center text-3xl font-bold text-gray-900">
            Open Positions
          </h2>
          <p className="mx-auto mb-12 max-w-xl text-center text-gray-600">
            Don&apos;t see a role that fits? Send us your resume at{' '}
            <a href="mailto:careers@smartlms.com" className="text-indigo-600 hover:underline">
              careers@smartlms.com
            </a>
          </p>
          <div className="space-y-4">
            {openings.map((job) => (
              <div
                key={job.title}
                className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-indigo-200 hover:shadow-md"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600">
                      {job.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">{job.description}</p>
                    <div className="mt-3 flex flex-wrap gap-3">
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Briefcase className="h-3 w-3" />
                        {job.department}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <MapPin className="h-3 w-3" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        {job.type}
                      </span>
                    </div>
                  </div>
                  <Link
                    href="/contact"
                    className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:border-indigo-500 hover:text-indigo-600"
                  >
                    Apply
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
