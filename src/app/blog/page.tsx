import Link from "next/link";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Calendar, ArrowRight, Clock, Tag } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "10 Tips for Effective Online Learning in 2026",
    excerpt: "Discover proven strategies to maximize your learning outcomes when taking online courses. From time management to active recall, these techniques will help you succeed.",
    category: "Learning Tips",
    readTime: "5 min read",
    date: "Jan 15, 2026",
    image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=600&h=300&fit=crop",
  },
  {
    id: 2,
    title: "The Future of AI in Education: What to Expect",
    excerpt: "Artificial Intelligence is reshaping how we learn and teach. Explore the latest AI-powered tools and their impact on modern education platforms.",
    category: "Technology",
    readTime: "8 min read",
    date: "Jan 10, 2026",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=300&fit=crop",
  },
  {
    id: 3,
    title: "How to Build a Career in Tech: A Complete Roadmap",
    excerpt: "From beginner to professional, this comprehensive guide covers everything you need to know about breaking into the technology industry.",
    category: "Career",
    readTime: "12 min read",
    date: "Jan 5, 2026",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=300&fit=crop",
  },
  {
    id: 4,
    title: "Why Live Classes Are the Future of Online Education",
    excerpt: "Live interactive sessions are transforming the online learning experience. Learn how SmartLMS live classes boost engagement and retention.",
    category: "Platform",
    readTime: "6 min read",
    date: "Dec 28, 2025",
    image: "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=600&h=300&fit=crop",
  },
  {
    id: 5,
    title: "Mastering Digital Marketing: Lessons from Top Performers",
    excerpt: "Insights from industry leaders on what it takes to excel in digital marketing. Practical advice you can apply immediately.",
    category: "Marketing",
    readTime: "7 min read",
    date: "Dec 20, 2025",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=300&fit=crop",
  },
  {
    id: 6,
    title: "The Complete Guide to Cybersecurity for Beginners",
    excerpt: "Understanding cybersecurity fundamentals is essential in today's digital world. Start your journey with these essential concepts.",
    category: "Security",
    readTime: "10 min read",
    date: "Dec 15, 2025",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=300&fit=crop",
  },
];

export default function BlogPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 py-20 text-white">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold sm:text-5xl">SmartLMS Blog</h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-indigo-100">
              Insights, tutorials, and updates from the SmartLMS team. Stay informed
              about online education, course creation, and learning technology.
            </p>
          </div>
        </section>

        {/* Blog Posts */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <article
                key={post.id}
                className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-lg"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute left-3 top-3">
                    <span className="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-indigo-700 backdrop-blur-sm">
                      <Tag className="mr-1 h-3 w-3" />
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readTime}
                    </span>
                  </div>
                  <h2 className="mt-3 text-lg font-bold text-gray-900 group-hover:text-indigo-600">
                    {post.title}
                  </h2>
                  <p className="mt-2 line-clamp-3 text-sm text-gray-600">
                    {post.excerpt}
                  </p>
                  <Link
                    href="#"
                    className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                  >
                    Read More
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
