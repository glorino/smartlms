"use client";

import { useState } from "react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Calendar, ArrowRight, Clock, Tag, X } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "10 Tips for Effective Online Learning in 2026",
    excerpt:
      "Discover proven strategies to maximize your learning outcomes when taking online courses. From time management to active recall, these techniques will help you succeed.",
    category: "Learning Tips",
    readTime: "5 min read",
    date: "Jan 15, 2026",
    image:
      "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=600&h=300&fit=crop",
    content: [
      "Online learning has evolved dramatically over the past few years, and 2026 brings even more opportunities for self-directed education. Whether you're a working professional looking to upskill or a student supplementing your formal education, mastering the art of online learning is essential for success in today's fast-paced world.",
      "One of the most effective strategies is to create a dedicated learning environment. Designate a specific space in your home solely for studying — free from distractions and equipped with everything you need. This physical separation helps your brain switch into learning mode, making your study sessions significantly more productive. Pair this with a consistent schedule, and you'll build a routine that sticks.",
      "Active recall and spaced repetition are two evidence-based techniques that can dramatically improve retention. Instead of passively watching lectures, test yourself regularly on the material. Use flashcards, practice quizzes, or teach the concepts to someone else. Spacing out your study sessions over days or weeks — rather than cramming — allows your brain to consolidate information into long-term memory far more effectively.",
      "Finally, don't underestimate the power of community. Join online study groups, participate in discussion forums, and connect with fellow learners. The social aspect of learning provides accountability, motivation, and diverse perspectives that deepen your understanding. SmartLMS makes this easy with built-in discussion boards and live session features that keep you connected with peers and instructors alike.",
    ],
  },
  {
    id: 2,
    title: "The Future of AI in Education: What to Expect",
    excerpt:
      "Artificial Intelligence is reshaping how we learn and teach. Explore the latest AI-powered tools and their impact on modern education platforms.",
    category: "Technology",
    readTime: "8 min read",
    date: "Jan 10, 2026",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=300&fit=crop",
    content: [
      "Artificial Intelligence is no longer a futuristic concept in education — it's here, and it's transforming every aspect of the learning experience. From personalized learning paths to intelligent tutoring systems, AI is making education more adaptive, accessible, and effective than ever before. The question is no longer whether AI will impact education, but how we can harness its potential responsibly.",
      "Personalized learning is perhaps the most significant gift AI brings to education. Traditional classrooms follow a one-size-fits-all approach, but AI-powered platforms can analyze a student's strengths, weaknesses, learning pace, and preferences to create truly customized learning journeys. This means students spend more time on concepts they struggle with and breeze through material they've already mastered, optimizing every minute of study time.",
      "AI-driven assessment tools are also revolutionizing how we evaluate learning. Automated grading systems can provide instant, detailed feedback on assignments, freeing instructors to focus on mentorship and curriculum development. Natural language processing enables AI to evaluate written responses, critical thinking, and even creativity — going far beyond simple multiple-choice grading.",
      "Looking ahead, the integration of AI with virtual and augmented reality will create immersive learning environments that were once science fiction. Imagine practicing surgical procedures in a realistic virtual operating room or exploring ancient Rome through augmented reality overlays. SmartLMS is at the forefront of this revolution, continuously integrating cutting-edge AI features to enhance the learning experience for every student on the platform.",
    ],
  },
  {
    id: 3,
    title: "How to Build a Career in Tech: A Complete Roadmap",
    excerpt:
      "From beginner to professional, this comprehensive guide covers everything you need to know about breaking into the technology industry.",
    category: "Career",
    readTime: "12 min read",
    date: "Jan 5, 2026",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=300&fit=crop",
    content: [
      "Breaking into the technology industry can feel overwhelming, but with the right roadmap, it's an incredibly rewarding journey. The tech industry offers some of the most lucrative, flexible, and impactful career opportunities available today. Whether you're interested in software development, data science, cybersecurity, or product management, there's a path for you — and it starts with a clear plan.",
      "The first step is building a solid foundation. Start with the fundamentals: learn a programming language like Python or JavaScript, understand basic data structures and algorithms, and get comfortable with version control using Git. Online platforms like SmartLMS offer structured courses that take you from absolute beginner to competent practitioner in a matter of months. Focus on understanding concepts deeply rather than memorizing syntax — the ability to problem-solve is what employers value most.",
      "Once you have the basics down, specialize in an area that excites you. Build a portfolio of real projects that demonstrate your skills — this matters more than any certification. Contribute to open-source projects, participate in hackathons, and create personal projects that solve real problems. Document your work on GitHub and write about your learning journey on a personal blog or LinkedIn. These tangible artifacts speak louder than resumes.",
      "Networking and continuous learning are the final pieces of the puzzle. Attend tech meetups, join online communities, and find mentors who can guide your career. The technology landscape evolves rapidly, so commit to lifelong learning. The professionals who thrive are those who stay curious, adapt to change, and never stop building. With dedication and the right resources, a successful tech career is well within your reach.",
    ],
  },
  {
    id: 4,
    title: "Why Live Classes Are the Future of Online Education",
    excerpt:
      "Live interactive sessions are transforming the online learning experience. Learn how SmartLMS live classes boost engagement and retention.",
    category: "Platform",
    readTime: "6 min read",
    date: "Dec 28, 2025",
    image:
      "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=600&h=300&fit=crop",
    content: [
      "The online education landscape has long struggled with a fundamental challenge: student engagement. Pre-recorded courses, while convenient, often suffer from high dropout rates and low completion percentages. Live classes are emerging as the solution to this problem, bridging the gap between the flexibility of online learning and the interactivity of traditional classrooms.",
      "Live classes create a sense of urgency and accountability that self-paced courses simply cannot match. When students know a session is happening at a specific time, they're far more likely to show up, participate, and follow through on their learning commitments. This real-time structure mirrors the discipline of in-person education while retaining the convenience of learning from anywhere in the world.",
      "The interactive features of modern live class platforms take engagement even further. Students can ask questions in real-time, participate in group discussions, collaborate on exercises, and receive immediate feedback from instructors. Polls, breakout rooms, and shared whiteboards transform passive viewers into active participants. Research consistently shows that active learning leads to deeper understanding and better long-term retention of material.",
      "SmartLMS's live class feature is designed with these principles at its core. Instructors can schedule sessions, manage attendance, share screens, record sessions for later review, and track student engagement metrics. For students, it means the best of both worlds — the structure and interaction of live instruction combined with the flexibility to review recordings at their own pace. This hybrid model represents the future of effective online education.",
    ],
  },
  {
    id: 5,
    title: "Mastering Digital Marketing: Lessons from Top Performers",
    excerpt:
      "Insights from industry leaders on what it takes to excel in digital marketing. Practical advice you can apply immediately.",
    category: "Marketing",
    readTime: "7 min read",
    date: "Dec 20, 2025",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=300&fit=crop",
    content: [
      "Digital marketing is one of the most dynamic and fast-evolving fields in business today. What worked last year might not work tomorrow, which is why the top performers in this industry share one critical trait: they never stop learning. From SEO and content marketing to paid advertising and social media strategy, mastering digital marketing requires both breadth of knowledge and depth of expertise.",
      "Content remains king, but context is queen. The most successful digital marketers understand that creating great content isn't enough — it needs to reach the right audience, at the right time, through the right channels. This means investing in thorough audience research, understanding buyer personas, and mapping content to every stage of the customer journey. Quality content that solves real problems will always outperform shallow, keyword-stuffed articles.",
      "Data literacy is the secret weapon of top digital marketers. The ability to analyze campaign performance, interpret analytics dashboards, and make data-driven decisions separates good marketers from great ones. Every campaign generates valuable data — click-through rates, conversion rates, cost per acquisition, customer lifetime value — and understanding these metrics enables you to optimize continuously and allocate budgets effectively.",
      "Perhaps the most underrated skill in digital marketing is adaptability. Algorithm changes, new platforms, shifting consumer behaviors, and emerging technologies mean that strategies must evolve constantly. The marketers who thrive are those who embrace change, experiment fearlessly, and learn from both successes and failures. Investing in continuous education through platforms like SmartLMS ensures you stay ahead of the curve and maintain your competitive edge in this exciting field.",
    ],
  },
  {
    id: 6,
    title: "The Complete Guide to Cybersecurity for Beginners",
    excerpt:
      "Understanding cybersecurity fundamentals is essential in today's digital world. Start your journey with these essential concepts.",
    category: "Security",
    readTime: "10 min read",
    date: "Dec 15, 2025",
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=300&fit=crop",
    content: [
      "In an era where our lives are increasingly digital, cybersecurity has transitioned from a niche IT concern to a fundamental life skill. Every day, individuals and organizations face threats ranging from phishing emails and malware to sophisticated ransomware attacks. Understanding the basics of cybersecurity isn't just important for IT professionals — it's essential for everyone who uses the internet.",
      "The foundation of good cybersecurity starts with strong passwords and authentication practices. Using unique, complex passwords for every account — ideally managed through a reputable password manager — is your first line of defense. Enable multi-factor authentication wherever possible, as it dramatically reduces the risk of unauthorized access even if your password is compromised. These simple steps prevent the vast majority of common attacks.",
      "Recognizing social engineering tactics is equally critical. Phishing remains the most common attack vector, and modern phishing emails can be remarkably convincing. Always verify the sender's address, hover over links before clicking, and never provide sensitive information through email or text. When in doubt, navigate directly to a website by typing the URL rather than following a link. Healthy skepticism is your greatest asset in the fight against cyber threats.",
      "For those interested in pursuing cybersecurity as a career, the field offers tremendous opportunity. There's a massive global shortage of cybersecurity professionals, making it one of the most in-demand and well-compensated career paths in technology. Start with foundational certifications like CompTIA Security+, learn networking fundamentals, and practice in safe environments like capture-the-flag competitions. Platforms like SmartLMS offer structured learning paths that can take you from complete beginner to job-ready cybersecurity professional.",
    ],
  },
];

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  image: string;
  content: string[];
}

export default function BlogPage() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 py-20 text-white">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold sm:text-5xl">SmartLMS Blog</h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-indigo-100">
              Insights, tutorials, and updates from the SmartLMS team. Stay
              informed about online education, course creation, and learning
              technology.
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
                  <button
                    onClick={() => setSelectedPost(post)}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                  >
                    Read More
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />

      {/* Article Modal */}
      {selectedPost && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPost(null)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" />

          {/* Modal */}
          <div
            className="relative z-10 max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute right-4 top-4 z-20 rounded-full bg-white/90 p-2 text-gray-600 shadow-md backdrop-blur-sm transition-colors hover:bg-white hover:text-gray-900"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Image */}
            <div className="relative h-64 overflow-hidden sm:h-72">
              <img
                src={selectedPost.image}
                alt={selectedPost.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-indigo-700 backdrop-blur-sm">
                  <Tag className="mr-1 h-3 w-3" />
                  {selectedPost.category}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                {selectedPost.title}
              </h2>
              <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {selectedPost.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {selectedPost.readTime}
                </span>
              </div>
              <div className="mt-6 space-y-4">
                {selectedPost.content.map((paragraph, index) => (
                  <p key={index} className="leading-relaxed text-gray-700">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
