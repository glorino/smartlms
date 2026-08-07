"use client";

import Link from "next/link";
import { GraduationCap, Users, Globe, BookOpen, Award, Heart } from "lucide-react";
import Navbar from "@/components/layout/navbar";

const stats = [
  { label: "Students Worldwide", value: "100,000+", icon: Users },
  { label: "Courses Available", value: "500+", icon: BookOpen },
  { label: "Countries Reached", value: "50+", icon: Globe },
  { label: "Average Rating", value: "4.9/5", icon: Award },
];

const team = [
  { name: "Sarah Johnson", role: "CEO & Founder", avatar: "SJ" },
  { name: "Michael Chen", role: "CTO", avatar: "MC" },
  { name: "Emily Rodriguez", role: "Head of Design", avatar: "ER" },
  { name: "Alex Kim", role: "Lead Engineer", avatar: "AK" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <div className="gradient-primary py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-5xl font-bold text-white">About SmartLMS</h1>
          <p className="mt-6 text-xl text-white/80">
            We&apos;re on a mission to make education accessible to everyone, everywhere.
            SmartLMS combines the best features from the world&apos;s top learning platforms
            into one powerful, AI-driven solution.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100">
                <stat.icon className="h-8 w-8 text-indigo-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mission */}
      <div className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
          <p className="mt-6 text-lg text-gray-600">
            SmartLMS was born from a simple observation: educators need a single platform
            that combines the best features of Tutor LMS, LearnDash, and MasterStudy
            without compromise. We built SmartLMS to be the last LMS you&apos;ll ever need.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl bg-gray-50 p-6">
              <Heart className="mb-4 h-8 w-8 text-rose-500" />
              <h3 className="font-semibold text-gray-900">Education First</h3>
              <p className="mt-2 text-sm text-gray-600">
                Every feature we build starts with the question: &quot;How does this help
                students learn better?&quot;
              </p>
            </div>
            <div className="rounded-2xl bg-gray-50 p-6">
              <GraduationCap className="mb-4 h-8 w-8 text-indigo-500" />
              <h3 className="font-semibold text-gray-900">AI-Powered</h3>
              <p className="mt-2 text-sm text-gray-600">
                Our AI tools help instructors create courses faster and students
                learn more effectively.
              </p>
            </div>
            <div className="rounded-2xl bg-gray-50 p-6">
              <Globe className="mb-4 h-8 w-8 text-emerald-500" />
              <h3 className="font-semibold text-gray-900">Global Reach</h3>
              <p className="mt-2 text-sm text-gray-600">
                Supporting 21 languages and learners in 50+ countries, education
                knows no boundaries.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Meet Our Team
          </h2>
          <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-4">
            {team.map((member) => (
              <div key={member.name} className="text-center">
                <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-2xl font-bold text-white">
                  {member.avatar}
                </div>
                <h3 className="font-semibold text-gray-900">{member.name}</h3>
                <p className="text-sm text-gray-500">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gray-900 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl font-bold text-white">
            Ready to Start Learning?
          </h2>
          <p className="mt-4 text-lg text-gray-400">
            Join 100,000+ students and instructors on SmartLMS
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              href="/register"
              className="rounded-xl bg-indigo-600 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
            >
              Get Started Free
            </Link>
            <Link
              href="/courses"
              className="rounded-xl border border-gray-600 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
            >
              Browse Courses
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
