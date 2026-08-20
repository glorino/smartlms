"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import {
  Users,
  MessageSquare,
  BookOpen,
  Trophy,
  Search,
  UserPlus,
  UserCheck,
  ExternalLink,
  Heart,
  Share2,
  TrendingUp,
} from "lucide-react";

const communityMembers = [
  { id: "1", name: "Dr. Sarah Johnson", role: "Instructor", avatar: "", courses: 5, students: 12500, bio: "Web development & data science expert" },
  { id: "2", name: "Prof. Michael Chen", role: "Instructor", avatar: "", courses: 4, students: 8900, bio: "Cybersecurity & mobile development" },
  { id: "3", name: "Emily Rodriguez", role: "Student", avatar: "", courses: 3, students: 0, bio: "Aspiring full-stack developer" },
  { id: "4", name: "James Wilson", role: "Student", avatar: "", courses: 2, students: 0, bio: "Data enthusiast & ML learner" },
  { id: "5", name: "Aisha Bello", role: "Instructor", avatar: "", courses: 3, students: 5600, bio: "Digital marketing strategist" },
  { id: "6", name: "Carlos Mendez", role: "Student", avatar: "", courses: 4, students: 0, bio: "UI/UX design student" },
];

const discussions = [
  {
    id: "1",
    title: "Best practices for React state management in 2026?",
    author: "Emily Rodriguez",
    replies: 24,
    likes: 56,
    category: "Web Development",
    timeAgo: "2 hours ago",
  },
  {
    id: "2",
    title: "How to prepare for cybersecurity certification exams",
    author: "James Wilson",
    replies: 18,
    likes: 42,
    category: "Security",
    timeAgo: "5 hours ago",
  },
  {
    id: "3",
    title: "分享 my machine learning project: predicting stock prices",
    author: "Carlos Mendez",
    replies: 31,
    likes: 89,
    category: "Data Science",
    timeAgo: "1 day ago",
  },
  {
    id: "4",
    title: "Tips for building a strong portfolio as a beginner",
    author: "Aisha Bello",
    replies: 15,
    likes: 38,
    category: "Career",
    timeAgo: "2 days ago",
  },
];

const trendingTopics = [
  { tag: "React", count: 234 },
  { tag: "Python", count: 189 },
  { tag: "Machine Learning", count: 156 },
  { tag: "Cybersecurity", count: 132 },
  { tag: "UI/UX", count: 118 },
  { tag: "Digital Marketing", count: 98 },
];

export default function CommunityPage() {
  const [connections, setConnections] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  const toggleConnection = (id: string) => {
    setConnections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredMembers = communityMembers.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.bio.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 py-20 text-white">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <Users className="mx-auto mb-4 h-12 w-12 text-orange-200" />
            <h1 className="text-4xl font-bold sm:text-5xl">SmartLMS Community</h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-orange-100">
              Connect with fellow learners and instructors. Share knowledge,
              collaborate on projects, and grow together.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
              <span className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm">
                <Users className="h-4 w-4" />
                {communityMembers.length.toLocaleString()} Members
              </span>
              <span className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm">
                <MessageSquare className="h-4 w-4" />
                {discussions.length} Active Discussions
              </span>
              <span className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm">
                <TrendingUp className="h-4 w-4" />
                {trendingTopics.length} Trending Topics
              </span>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search community members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Members */}
              <div>
                <h2 className="mb-4 text-xl font-bold text-gray-900">Community Members</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {filteredMembers.map((member) => (
                    <div
                      key={member.id}
                      className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white">
                          {member.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">{member.name}</h3>
                          <span className="inline-block rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
                            {member.role}
                          </span>
                          <p className="mt-1 text-xs text-gray-500 line-clamp-2">{member.bio}</p>
                          {member.role === "Instructor" && (
                            <div className="mt-2 flex gap-3 text-xs text-gray-500">
                              <span>{member.courses} courses</span>
                              <span>{member.students.toLocaleString()} students</span>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => toggleConnection(member.id)}
                          className={`flex shrink-0 items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                            connections.has(member.id)
                              ? "bg-green-100 text-green-700"
                              : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                          }`}
                        >
                          {connections.has(member.id) ? (
                            <>
                              <UserCheck className="h-3 w-3" />
                              Connected
                            </>
                          ) : (
                            <>
                              <UserPlus className="h-3 w-3" />
                              Connect
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Discussions */}
              <div>
                <h2 className="mb-4 text-xl font-bold text-gray-900">Recent Discussions</h2>
                <div className="space-y-3">
                  {discussions.map((post) => (
                    <div
                      key={post.id}
                      className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 hover:text-indigo-600 cursor-pointer">
                            {post.title}
                          </h3>
                          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                            <span>{post.author}</span>
                            <span className="rounded-full bg-gray-100 px-2 py-0.5">{post.category}</span>
                            <span>{post.timeAgo}</span>
                          </div>
                        </div>
                        <div className="flex shrink-0 gap-2">
                          <button className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-gray-500 hover:bg-gray-100">
                            <Heart className="h-3.5 w-3.5" />
                            {post.likes}
                          </button>
                          <button className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-gray-500 hover:bg-gray-100">
                            <MessageSquare className="h-3.5 w-3.5" />
                            {post.replies}
                          </button>
                          <button className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-gray-500 hover:bg-gray-100">
                            <Share2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Trending Topics */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-bold text-gray-900">Trending Topics</h3>
                <div className="space-y-3">
                  {trendingTopics.map((topic) => (
                    <div key={topic.tag} className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm text-gray-700">
                        <TrendingUp className="h-4 w-4 text-orange-500" />
                        #{topic.tag}
                      </span>
                      <span className="text-xs text-gray-400">{topic.count} posts</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-bold text-gray-900">Quick Links</h3>
                <div className="space-y-3">
                  <Link href="/courses" className="flex items-center gap-3 rounded-lg p-2 text-sm text-gray-700 hover:bg-gray-50">
                    <BookOpen className="h-4 w-4 text-indigo-500" />
                    Browse Courses
                  </Link>
                  <Link href="/live-classes" className="flex items-center gap-3 rounded-lg p-2 text-sm text-gray-700 hover:bg-gray-50">
                    <Trophy className="h-4 w-4 text-amber-500" />
                    Live Classes
                  </Link>
                  <Link href="/help" className="flex items-center gap-3 rounded-lg p-2 text-sm text-gray-700 hover:bg-gray-50">
                    <MessageSquare className="h-4 w-4 text-green-500" />
                    Get Help
                  </Link>
                </div>
              </div>

              {/* Community Stats */}
              <div className="rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-6 text-white">
                <h3 className="mb-3 text-lg font-bold">Community Stats</h3>
                <div className="space-y-2 text-sm text-indigo-100">
                  <div className="flex justify-between">
                    <span>Active Members</span>
                    <span className="font-bold">2,500+</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discussions</span>
                    <span className="font-bold">1,200+</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Courses Available</span>
                    <span className="font-bold">15+</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
