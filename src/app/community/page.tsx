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
  X,
  ThumbsDown,
  Repeat,
  Smile,
  Award,
  GraduationCap,
  BookMarked,
  Send,
} from "lucide-react";

const communityMembers = [
  { id: "1", name: "Dr. Sarah Johnson", role: "Instructor", avatar: "", courses: 5, students: 12500, bio: "Web development & data science expert with 15 years of teaching experience. Passionate about making complex topics accessible to everyone.", achievements: ["Top Instructor 2025", "10K Students Milestone", "Course of the Year"] },
  { id: "2", name: "Prof. Michael Chen", role: "Instructor", avatar: "", courses: 4, students: 8900, bio: "Cybersecurity & mobile development specialist. Former security engineer at Google. Building the next generation of secure apps.", achievements: ["Security Expert Badge", "Published Author", "8K Students"] },
  { id: "3", name: "Emily Rodriguez", role: "Student", avatar: "", courses: 3, students: 0, bio: "Aspiring full-stack developer. Currently learning React and Node.js. Love building things that solve real problems.", achievements: ["Fast Learner", "Project Star", "Community Helper"] },
  { id: "4", name: "James Wilson", role: "Student", avatar: "", courses: 2, students: 0, bio: "Data enthusiast & ML learner. Background in statistics. Exploring the intersection of AI and business analytics.", achievements: ["Data Wizard", "First Project", "Discussion Starter"] },
  { id: "5", name: "Aisha Bello", role: "Instructor", avatar: "", courses: 3, students: 5600, bio: "Digital marketing strategist helping businesses grow online. Certified in Google Ads and Meta Marketing.", achievements: ["Marketing Guru", "5K Students", "Best New Course"] },
  { id: "6", name: "Carlos Mendez", role: "Student", avatar: "", courses: 4, students: 0, bio: "UI/UX design student with a passion for creating beautiful, intuitive interfaces. Figma enthusiast.", achievements: ["Design Pro", "Portfolio Winner", "4 Courses Done"] },
];

interface Reply {
  id: string;
  author: string;
  content: string;
  timeAgo: string;
  likes: number;
  dislikes: number;
  liked: boolean;
  disliked: boolean;
}

interface Discussion {
  id: string;
  title: string;
  author: string;
  replies: number;
  likes: number;
  dislikes: number;
  category: string;
  timeAgo: string;
  content: string;
  liked: boolean;
  disliked: boolean;
  sampleReplies: Reply[];
}

const initialDiscussions: Discussion[] = [
  {
    id: "1",
    title: "Best practices for React state management in 2026?",
    author: "Emily Rodriguez",
    replies: 24,
    likes: 56,
    dislikes: 2,
    category: "Web Development",
    timeAgo: "2 hours ago",
    content: "I've been working with React for a while now and I'm curious about the current best practices for state management. With the evolution of hooks, React Query, and various state management libraries, what approaches are you all using in production? I've been using Zustand recently and love its simplicity. Would love to hear your experiences!",
    liked: false,
    disliked: false,
    sampleReplies: [
      { id: "r1", author: "James Wilson", content: "Zustand is great for medium-sized apps. For larger projects, I still prefer Redux Toolkit with RTK Query for server state management.", timeAgo: "1 hour ago", likes: 12, dislikes: 0, liked: false, disliked: false },
      { id: "r2", author: "Dr. Sarah Johnson", content: "Don't overlook Jotai! It's perfect for atomic state management and works beautifully with Next.js server components.", timeAgo: "45 min ago", likes: 8, dislikes: 1, liked: false, disliked: false },
      { id: "r3", author: "Carlos Mendez", content: "I just use useState and useContext for most things. Am I doing it wrong? 😅", timeAgo: "30 min ago", likes: 15, dislikes: 0, liked: false, disliked: false },
    ],
  },
  {
    id: "2",
    title: "How to prepare for cybersecurity certification exams",
    author: "James Wilson",
    replies: 18,
    likes: 42,
    dislikes: 1,
    category: "Security",
    timeAgo: "5 hours ago",
    content: "I'm planning to take the CompTIA Security+ exam next month. Looking for advice on study materials, practice exams, and study schedules. Any recommendations from those who have passed? How long did you prepare?",
    liked: false,
    disliked: false,
    sampleReplies: [
      { id: "r4", author: "Prof. Michael Chen", content: "Professor Messer's free YouTube series is excellent. Pair it with the Sybex study guide and you'll be well prepared. I'd recommend 2-3 months of study.", timeAgo: "4 hours ago", likes: 18, dislikes: 0, liked: false, disliked: false },
      { id: "r5", author: "Aisha Bello", content: "Don't skip the practice exams! They really help you understand the question format. I used Pocket Prep app for daily quizzes.", timeAgo: "3 hours ago", likes: 9, dislikes: 0, liked: false, disliked: false },
    ],
  },
  {
    id: "3",
    title: "Sharing my machine learning project: predicting stock prices",
    author: "Carlos Mendez",
    replies: 31,
    likes: 89,
    dislikes: 5,
    category: "Data Science",
    timeAgo: "1 day ago",
    content: "I just finished my ML project using Python, TensorFlow, and historical stock data. The model uses LSTM networks with 85% accuracy on test data. I've open-sourced the code on GitHub. Check it out and let me know what you think! Would love feedback on the architecture choices.",
    liked: false,
    disliked: false,
    sampleReplies: [
      { id: "r6", author: "Emily Rodriguez", content: "This is amazing work! Have you considered adding sentiment analysis from news articles as additional features?", timeAgo: "23 hours ago", likes: 22, dislikes: 0, liked: false, disliked: false },
      { id: "r7", author: "Dr. Sarah Johnson", content: "Great project! A few suggestions: try adding dropout layers to prevent overfitting, and consider using attention mechanisms for better temporal pattern recognition.", timeAgo: "20 hours ago", likes: 31, dislikes: 0, liked: false, disliked: false },
      { id: "r8", author: "James Wilson", content: "Love this! I've been wanting to build something similar. Starred the repo. Would you be open to collaboration?", timeAgo: "18 hours ago", likes: 7, dislikes: 0, liked: false, disliked: false },
    ],
  },
  {
    id: "4",
    title: "Tips for building a strong portfolio as a beginner",
    author: "Aisha Bello",
    replies: 15,
    likes: 38,
    dislikes: 0,
    category: "Career",
    timeAgo: "2 days ago",
    content: "As someone who's hired many developers, I want to share what makes a portfolio stand out. Quality over quantity - 3-5 polished projects beat 20 half-finished ones. Include projects that solve real problems, write clean README files, and deploy your projects so they're accessible. What portfolio tips do you all have?",
    liked: false,
    disliked: false,
    sampleReplies: [
      { id: "r9", author: "Carlos Mendez", content: "This is so helpful! I've been struggling with what to include. Focus on quality makes so much sense.", timeAgo: "2 days ago", likes: 11, dislikes: 0, liked: false, disliked: false },
      { id: "r10", author: "Emily Rodriguez", content: "Adding personal projects that show your passion really helps. I built a weather app that got me my first internship!", timeAgo: "1 day ago", likes: 14, dislikes: 0, liked: false, disliked: false },
    ],
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

const commonEmojis = ["👍", "❤️", "😊", "🎉", "🔥", "💡"];

export default function CommunityPage() {
  const [connections, setConnections] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState<typeof communityMembers[0] | null>(null);
  const [selectedDiscussion, setSelectedDiscussion] = useState<Discussion | null>(null);
  const [discussions, setDiscussions] = useState<Discussion[]>(initialDiscussions);
  const [replyText, setReplyText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

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

  const toggleDiscussionLike = (discussionId: string) => {
    setDiscussions((prev) =>
      prev.map((d) => {
        if (d.id !== discussionId) return d;
        const wasLiked = d.liked;
        return {
          ...d,
          liked: !wasLiked,
          likes: wasLiked ? d.likes - 1 : d.likes + 1,
          disliked: false,
          dislikes: d.disliked ? d.dislikes - 1 : d.dislikes,
        };
      })
    );
    if (selectedDiscussion?.id === discussionId) {
      setSelectedDiscussion((prev) => {
        if (!prev) return prev;
        const wasLiked = prev.liked;
        return {
          ...prev,
          liked: !wasLiked,
          likes: wasLiked ? prev.likes - 1 : prev.likes + 1,
          disliked: false,
          dislikes: prev.disliked ? prev.dislikes - 1 : prev.dislikes,
        };
      });
    }
  };

  const toggleDiscussionDislike = (discussionId: string) => {
    setDiscussions((prev) =>
      prev.map((d) => {
        if (d.id !== discussionId) return d;
        const wasDisliked = d.disliked;
        return {
          ...d,
          disliked: !wasDisliked,
          dislikes: wasDisliked ? d.dislikes - 1 : d.dislikes + 1,
          liked: false,
          likes: d.liked ? d.likes - 1 : d.likes,
        };
      })
    );
    if (selectedDiscussion?.id === discussionId) {
      setSelectedDiscussion((prev) => {
        if (!prev) return prev;
        const wasDisliked = prev.disliked;
        return {
          ...prev,
          disliked: !wasDisliked,
          dislikes: wasDisliked ? prev.dislikes - 1 : prev.dislikes + 1,
          liked: false,
          likes: prev.liked ? prev.likes - 1 : prev.likes,
        };
      });
    }
  };

  const toggleReplyLike = (discussionId: string, replyId: string) => {
    const updateReply = (replies: Reply[]) =>
      replies.map((r) => {
        if (r.id !== replyId) return r;
        const wasLiked = r.liked;
        return {
          ...r,
          liked: !wasLiked,
          likes: wasLiked ? r.likes - 1 : r.likes + 1,
          disliked: false,
          dislikes: r.disliked ? r.dislikes - 1 : r.dislikes,
        };
      });

    setDiscussions((prev) =>
      prev.map((d) => {
        if (d.id !== discussionId) return d;
        return { ...d, sampleReplies: updateReply(d.sampleReplies) };
      })
    );
    setSelectedDiscussion((prev) => {
      if (!prev || prev.id !== discussionId) return prev;
      return { ...prev, sampleReplies: updateReply(prev.sampleReplies) };
    });
  };

  const toggleReplyDislike = (discussionId: string, replyId: string) => {
    const updateReply = (replies: Reply[]) =>
      replies.map((r) => {
        if (r.id !== replyId) return r;
        const wasDisliked = r.disliked;
        return {
          ...r,
          disliked: !wasDisliked,
          dislikes: wasDisliked ? r.dislikes - 1 : r.dislikes + 1,
          liked: false,
          likes: r.liked ? r.likes - 1 : r.likes,
        };
      });

    setDiscussions((prev) =>
      prev.map((d) => {
        if (d.id !== discussionId) return d;
        return { ...d, sampleReplies: updateReply(d.sampleReplies) };
      })
    );
    setSelectedDiscussion((prev) => {
      if (!prev || prev.id !== discussionId) return prev;
      return { ...prev, sampleReplies: updateReply(prev.sampleReplies) };
    });
  };

  const addReply = () => {
    if (!selectedDiscussion || !replyText.trim()) return;
    const newReply: Reply = {
      id: `r${Date.now()}`,
      author: "You",
      content: replyText.trim(),
      timeAgo: "Just now",
      likes: 0,
      dislikes: 0,
      liked: false,
      disliked: false,
    };
    const updated = { ...selectedDiscussion, sampleReplies: [...selectedDiscussion.sampleReplies, newReply], replies: selectedDiscussion.replies + 1 };
    setSelectedDiscussion(updated);
    setDiscussions((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
    setReplyText("");
  };

  const insertEmoji = (emoji: string) => {
    setReplyText((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const openThread = (discussion: Discussion) => {
    setSelectedDiscussion(discussion);
  };

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
                      className="cursor-pointer rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-indigo-300"
                      onClick={() => setSelectedMember(member)}
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
                          onClick={(e) => { e.stopPropagation(); toggleConnection(member.id); }}
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
                      onClick={() => openThread(post)}
                      className="cursor-pointer rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-indigo-300"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 hover:text-indigo-600">
                            {post.title}
                          </h3>
                          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                            <span>{post.author}</span>
                            <span className="rounded-full bg-gray-100 px-2 py-0.5">{post.category}</span>
                            <span>{post.timeAgo}</span>
                          </div>
                        </div>
                        <div className="flex shrink-0 gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleDiscussionLike(post.id); }}
                            className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs transition-colors ${post.liked ? "text-red-500 bg-red-50" : "text-gray-500 hover:bg-gray-100"}`}
                          >
                            <Heart className={`h-3.5 w-3.5 ${post.liked ? "fill-red-500" : ""}`} />
                            {post.likes}
                          </button>
                          <button className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-gray-500 hover:bg-gray-100">
                            <MessageSquare className="h-3.5 w-3.5" />
                            {post.replies}
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); }}
                            className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-gray-500 hover:bg-gray-100"
                          >
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

      {/* Member Profile Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedMember(null)}>
          <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedMember(null)}
              className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-2xl font-bold text-white">
                  {selectedMember.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <h2 className="mt-4 text-xl font-bold text-gray-900">{selectedMember.name}</h2>
                <span className="mt-1 inline-block rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
                  {selectedMember.role}
                </span>
                <p className="mt-3 text-sm text-gray-500">{selectedMember.bio}</p>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-4 rounded-xl bg-gray-50 p-4">
                <div className="text-center">
                  <div className="flex items-center justify-center">
                    <BookMarked className="h-5 w-5 text-indigo-500" />
                  </div>
                  <p className="mt-1 text-lg font-bold text-gray-900">{selectedMember.courses}</p>
                  <p className="text-xs text-gray-500">Courses</p>
                </div>
                {selectedMember.role === "Instructor" ? (
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <GraduationCap className="h-5 w-5 text-amber-500" />
                    </div>
                    <p className="mt-1 text-lg font-bold text-gray-900">{selectedMember.students.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Students</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <Award className="h-5 w-5 text-green-500" />
                    </div>
                    <p className="mt-1 text-lg font-bold text-gray-900">{selectedMember.achievements.length}</p>
                    <p className="text-xs text-gray-500">Badges</p>
                  </div>
                )}
                <div className="text-center">
                  <div className="flex items-center justify-center">
                    <Trophy className="h-5 w-5 text-pink-500" />
                  </div>
                  <p className="mt-1 text-lg font-bold text-gray-900">{selectedMember.achievements.length}</p>
                  <p className="text-xs text-gray-500">Achievements</p>
                </div>
              </div>

              {selectedMember.achievements.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Achievements</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedMember.achievements.map((achievement) => (
                      <span key={achievement} className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                        <Trophy className="h-3 w-3" />
                        {achievement}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => { toggleConnection(selectedMember.id); }}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 font-medium transition-colors ${
                    connections.has(selectedMember.id)
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  {connections.has(selectedMember.id) ? (
                    <>
                      <UserCheck className="h-4 w-4" />
                      Connected
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4" />
                      Connect
                    </>
                  )}
                </button>
                <button
                  onClick={() => setSelectedMember(null)}
                  className="rounded-xl border border-gray-200 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Discussion Thread Modal */}
      {selectedDiscussion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedDiscussion(null)}>
          <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b px-6 py-4">
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                {selectedDiscussion.category}
              </span>
              <button
                onClick={() => setSelectedDiscussion(null)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <h2 className="text-lg font-bold text-gray-900">{selectedDiscussion.title}</h2>
              <div className="mt-2 flex items-center gap-3 text-sm text-gray-500">
                <span>{selectedDiscussion.author}</span>
                <span>{selectedDiscussion.timeAgo}</span>
              </div>
              <p className="mt-4 text-sm text-gray-700 leading-relaxed">{selectedDiscussion.content}</p>

              <div className="mt-4 flex items-center gap-4 border-t border-b py-3">
                <button
                  onClick={() => toggleDiscussionLike(selectedDiscussion.id)}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${selectedDiscussion.liked ? "text-red-500 bg-red-50" : "text-gray-500 hover:bg-gray-100"}`}
                >
                  <Heart className={`h-4 w-4 ${selectedDiscussion.liked ? "fill-red-500" : ""}`} />
                  {selectedDiscussion.likes}
                </button>
                <button
                  onClick={() => toggleDiscussionDislike(selectedDiscussion.id)}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${selectedDiscussion.disliked ? "text-blue-500 bg-blue-50" : "text-gray-500 hover:bg-gray-100"}`}
                >
                  <ThumbsDown className={`h-4 w-4 ${selectedDiscussion.disliked ? "fill-blue-500" : ""}`} />
                  {selectedDiscussion.dislikes}
                </button>
                <button className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-500 hover:bg-gray-100">
                  <Repeat className="h-4 w-4" />
                  Repost
                </button>
                <button className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-500 hover:bg-gray-100">
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
              </div>

              <div className="mt-6">
                <h3 className="mb-4 text-sm font-semibold text-gray-700">
                  Replies ({selectedDiscussion.sampleReplies.length})
                </h3>
                <div className="space-y-4">
                  {selectedDiscussion.sampleReplies.map((reply) => (
                    <div key={reply.id} className="rounded-xl bg-gray-50 p-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-gray-400 to-gray-500 text-xs font-bold text-white">
                          {reply.author.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-gray-900">{reply.author}</span>
                          <span className="ml-2 text-xs text-gray-400">{reply.timeAgo}</span>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-gray-700">{reply.content}</p>
                      <div className="mt-2 flex items-center gap-3">
                        <button
                          onClick={() => toggleReplyLike(selectedDiscussion.id, reply.id)}
                          className={`flex items-center gap-1 text-xs font-medium transition-colors ${reply.liked ? "text-red-500" : "text-gray-400 hover:text-gray-600"}`}
                        >
                          <Heart className={`h-3.5 w-3.5 ${reply.liked ? "fill-red-500" : ""}`} />
                          {reply.likes}
                        </button>
                        <button
                          onClick={() => toggleReplyDislike(selectedDiscussion.id, reply.id)}
                          className={`flex items-center gap-1 text-xs font-medium transition-colors ${reply.disliked ? "text-blue-500" : "text-gray-400 hover:text-gray-600"}`}
                        >
                          <ThumbsDown className={`h-3.5 w-3.5 ${reply.disliked ? "fill-blue-500" : ""}`} />
                          {reply.dislikes}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t p-4">
              <div className="relative flex items-center gap-2">
                <div className="relative">
                  <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                  >
                    <Smile className="h-5 w-5" />
                  </button>
                  {showEmojiPicker && (
                    <div className="absolute bottom-full left-0 mb-2 flex gap-1 rounded-xl border bg-white p-2 shadow-lg">
                      {commonEmojis.map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => insertEmoji(emoji)}
                          className="rounded-lg p-2 text-lg hover:bg-gray-100"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Write a reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") addReply(); }}
                  className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  onClick={addReply}
                  disabled={!replyText.trim()}
                  className="rounded-xl bg-indigo-600 p-2.5 text-white transition-colors hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
