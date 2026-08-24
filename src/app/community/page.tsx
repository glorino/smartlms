"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
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
  Heart,
  Share2,
  TrendingUp,
  X,
  ThumbsDown,
  Repeat,
  Smile,
  Send,
  Loader2,
  PlusCircle,
  Bookmark,
} from "lucide-react";

interface Reply {
  id: string;
  author: { id: string; name: string; avatar: string | null };
  content: string;
  createdAt: string;
  likes: number;
}

interface Discussion {
  id: string;
  title: string;
  author: { id: string; name: string; avatar: string | null };
  replies: Reply[];
  likes: number;
  category: string | null;
  createdAt: string;
  content: string;
  tags: string | null;
}

const trendingTopics = [
  { tag: "React", count: 234 },
  { tag: "Python", count: 189 },
  { tag: "Machine Learning", count: 156 },
  { tag: "Cybersecurity", count: 132 },
  { tag: "UI/UX", count: 118 },
  { tag: "Digital Marketing", count: 98 },
];

const commonEmojis = ["👍", "❤️", "😊", "🎉", "🔥", "💡"];

const CATEGORIES = ["All", "Web Development", "AI & ML", "Data Science", "DevOps"];

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export default function CommunityPage() {
  const { data: session } = useSession();
  const isLoggedIn = !!session;

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDiscussion, setSelectedDiscussion] = useState<Discussion | null>(null);
  const [replyText, setReplyText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [showNewPost, setShowNewPost] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostCategory, setNewPostCategory] = useState("Web Development");
  const [submittingPost, setSubmittingPost] = useState(false);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (activeCategory !== "All") params.set("category", activeCategory);
      const res = await fetch(`/api/community/posts?${params.toString()}`);
      const data = await res.json();
      setDiscussions(data.posts || []);
    } catch {
      toast.error("Failed to load discussions");
    } finally {
      setLoading(false);
    }
  }, [activeCategory]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const filteredDiscussions = discussions.filter(
    (d) =>
      searchQuery === "" ||
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLike = async (postId: string) => {
    if (!isLoggedIn) {
      toast("Login to like posts", { icon: "🔒" });
      return;
    }
    try {
      const res = await fetch("/api/community/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });
      const data = await res.json();
      if (res.ok) {
        setDiscussions((prev) =>
          prev.map((d) => (d.id === postId ? { ...d, likes: data.likes } : d))
        );
        setSelectedDiscussion((prev) =>
          prev?.id === postId ? { ...prev, likes: data.likes } : prev
        );
      }
    } catch {
      toast.error("Failed to like post");
    }
  };

  const handleReplyLike = async (replyId: string) => {
    if (!isLoggedIn) {
      toast("Login to like replies", { icon: "🔒" });
      return;
    }
    try {
      const res = await fetch("/api/community/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replyId }),
      });
      const data = await res.json();
      if (res.ok) {
        const updateReplies = (replies: Reply[]) =>
          replies.map((r) => (r.id === replyId ? { ...r, likes: data.likes } : r));
        setDiscussions((prev) =>
          prev.map((d) => ({ ...d, replies: updateReplies(d.replies) }))
        );
        setSelectedDiscussion((prev) =>
          prev ? { ...prev, replies: updateReplies(prev.replies) } : prev
        );
      }
    } catch {
      toast.error("Failed to like reply");
    }
  };

  const addReply = async () => {
    if (!isLoggedIn || !selectedDiscussion || !replyText.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/community/replies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: selectedDiscussion.id, content: replyText.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        const newReply: Reply = {
          id: data.reply.id,
          author: data.reply.author,
          content: data.reply.content,
          createdAt: data.reply.createdAt,
          likes: 0,
        };
        const updatedDiscussion = {
          ...selectedDiscussion,
          replies: [...selectedDiscussion.replies, newReply],
        };
        setSelectedDiscussion(updatedDiscussion);
        setDiscussions((prev) =>
          prev.map((d) => (d.id === updatedDiscussion.id ? updatedDiscussion : d))
        );
        setReplyText("");
        toast.success("Reply posted!");
      } else {
        toast.error(data.error || "Failed to post reply");
      }
    } catch {
      toast.error("Failed to post reply");
    } finally {
      setSubmitting(false);
    }
  };

  const createPost = async () => {
    if (!isLoggedIn || !newPostTitle.trim() || !newPostContent.trim()) return;
    setSubmittingPost(true);
    try {
      const res = await fetch("/api/community/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newPostTitle.trim(),
          content: newPostContent.trim(),
          category: newPostCategory,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setDiscussions((prev) => [data.post, ...prev]);
        setShowNewPost(false);
        setNewPostTitle("");
        setNewPostContent("");
        toast.success("Post created!");
      } else {
        toast.error(data.error || "Failed to create post");
      }
    } catch {
      toast.error("Failed to create post");
    } finally {
      setSubmittingPost(false);
    }
  };

  const insertEmoji = (emoji: string) => {
    setReplyText((prev) => prev + emoji);
    setShowEmojiPicker(false);
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
          {!isLoggedIn && (
            <div className="mb-8 rounded-xl border border-indigo-200 bg-indigo-50 p-6">
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
                <div>
                  <h3 className="text-lg font-bold text-indigo-900">Join the Community</h3>
                  <p className="text-sm text-indigo-700">Login to participate in discussions, connect with members, and share your knowledge.</p>
                </div>
                <div className="flex gap-3">
                  <Link href="/login" className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">
                    Login
                  </Link>
                  <Link href="/register" className="rounded-lg border border-indigo-300 px-5 py-2.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-100">
                    Sign Up
                  </Link>
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Search & New Post */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search discussions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                {isLoggedIn && (
                  <button
                    onClick={() => setShowNewPost(!showNewPost)}
                    className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
                  >
                    <PlusCircle className="h-4 w-4" />
                    New Post
                  </button>
                )}
              </div>

              {/* New Post Form */}
              {showNewPost && (
                <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-6">
                  <h3 className="mb-4 text-lg font-bold text-indigo-900">Create New Post</h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Post title"
                      value={newPostTitle}
                      onChange={(e) => setNewPostTitle(e.target.value)}
                      className="w-full rounded-lg border border-indigo-200 bg-white px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <textarea
                      placeholder="Write your post content..."
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      rows={4}
                      className="w-full rounded-lg border border-indigo-200 bg-white px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <select
                      value={newPostCategory}
                      onChange={(e) => setNewPostCategory(e.target.value)}
                      className="w-full rounded-lg border border-indigo-200 bg-white px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      {CATEGORIES.filter((c) => c !== "All").map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    <div className="flex gap-3">
                      <button
                        onClick={createPost}
                        disabled={submittingPost || !newPostTitle.trim() || !newPostContent.trim()}
                        className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {submittingPost ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        {submittingPost ? "Posting..." : "Post"}
                      </button>
                      <button
                        onClick={() => setShowNewPost(false)}
                        className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Category Filters */}
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      activeCategory === cat
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Discussions */}
              <div>
                <h2 className="mb-4 text-xl font-bold text-gray-900">Recent Discussions</h2>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                    <span className="ml-3 text-sm text-gray-500">Loading discussions...</span>
                  </div>
                ) : filteredDiscussions.length === 0 ? (
                  <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
                    <MessageSquare className="mx-auto h-12 w-12 text-gray-300" />
                    <h3 className="mt-4 text-lg font-semibold text-gray-700">No discussions yet</h3>
                    <p className="mt-2 text-sm text-gray-500">Be the first to start a conversation!</p>
                    {isLoggedIn && (
                      <button
                        onClick={() => setShowNewPost(true)}
                        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
                      >
                        <PlusCircle className="h-4 w-4" />
                        Create First Post
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredDiscussions.map((post) => (
                      <div
                        key={post.id}
                        onClick={() => setSelectedDiscussion(post)}
                        className="cursor-pointer rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-indigo-300"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 hover:text-indigo-600">
                              {post.title}
                            </h3>
                            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                              <span className="flex items-center gap-1.5">
                                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-[8px] font-bold text-white">
                                  {getInitials(post.author.name)}
                                </div>
                                {post.author.name}
                              </span>
                              {post.category && (
                                <span className="rounded-full bg-gray-100 px-2 py-0.5">{post.category}</span>
                              )}
                              <span>{timeAgo(post.createdAt)}</span>
                            </div>
                          </div>
                          <div className="flex shrink-0 gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLike(post.id);
                              }}
                              className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-gray-500 hover:bg-gray-100"
                            >
                              <Heart className="h-3.5 w-3.5" />
                              {post.likes}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedDiscussion(post);
                              }}
                              className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-gray-500 hover:bg-gray-100"
                            >
                              <MessageSquare className="h-3.5 w-3.5" />
                              {post.replies.length}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (!isLoggedIn) return;
                                navigator.clipboard.writeText(window.location.href);
                                toast.success("Link copied to clipboard");
                              }}
                              className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-gray-500 hover:bg-gray-100"
                            >
                              <Share2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                    <span>Discussions</span>
                    <span className="font-bold">{discussions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Replies</span>
                    <span className="font-bold">{discussions.reduce((sum, d) => sum + d.replies.length, 0)}</span>
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

      {/* Discussion Thread Modal */}
      {selectedDiscussion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedDiscussion(null)}>
          <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b px-6 py-4">
              {selectedDiscussion.category && (
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                  {selectedDiscussion.category}
                </span>
              )}
              <button
                onClick={() => setSelectedDiscussion(null)}
                className="ml-auto rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <h2 className="text-lg font-bold text-gray-900">{selectedDiscussion.title}</h2>
              <div className="mt-2 flex items-center gap-3 text-sm text-gray-500">
                <span className="flex items-center gap-1.5">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-[9px] font-bold text-white">
                    {getInitials(selectedDiscussion.author.name)}
                  </div>
                  {selectedDiscussion.author.name}
                </span>
                <span>{timeAgo(selectedDiscussion.createdAt)}</span>
              </div>
              <p className="mt-4 text-sm text-gray-700 leading-relaxed">{selectedDiscussion.content}</p>

              <div className="mt-4 flex items-center gap-4 border-t border-b py-3">
                <button
                  onClick={() => handleLike(selectedDiscussion.id)}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-500 hover:bg-gray-100"
                >
                  <Heart className="h-4 w-4" />
                  {selectedDiscussion.likes}
                </button>
                <button
                  onClick={() => {
                    if (!isLoggedIn) return;
                    toast.success("Discussion reposted!");
                  }}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${!isLoggedIn ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:bg-gray-100"}`}
                >
                  <Repeat className="h-4 w-4" />
                  Repost
                </button>
                <button
                  onClick={() => {
                    if (!isLoggedIn) return;
                    navigator.clipboard.writeText(window.location.href);
                    toast.success("Link copied to clipboard");
                  }}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${!isLoggedIn ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:bg-gray-100"}`}
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
              </div>

              <div className="mt-6">
                <h3 className="mb-4 text-sm font-semibold text-gray-700">
                  Replies ({selectedDiscussion.replies.length})
                </h3>
                <div className="space-y-4">
                  {selectedDiscussion.replies.map((reply) => (
                    <div key={reply.id} className="rounded-xl bg-gray-50 p-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-gray-400 to-gray-500 text-xs font-bold text-white">
                          {getInitials(reply.author.name)}
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-gray-900">{reply.author.name}</span>
                          <span className="ml-2 text-xs text-gray-400">{timeAgo(reply.createdAt)}</span>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-gray-700">{reply.content}</p>
                      <div className="mt-2 flex items-center gap-3">
                        <button
                          onClick={() => handleReplyLike(reply.id)}
                          className="flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-gray-600"
                        >
                          <Heart className="h-3.5 w-3.5" />
                          {reply.likes}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t p-4">
              {isLoggedIn ? (
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
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        addReply();
                      }
                    }}
                    className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <button
                    onClick={addReply}
                    disabled={!replyText.trim() || submitting}
                    className="rounded-xl bg-indigo-600 p-2.5 text-white transition-colors hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                  <p className="text-sm text-gray-500">Login to join the discussion</p>
                  <Link
                    href="/login"
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                  >
                    Login
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
