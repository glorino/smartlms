import Link from "next/link";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import {
  BookOpen,
  Code2,
  CreditCard,
  GraduationCap,
  Users,
  Settings,
  Shield,
  Play,
  ArrowRight,
  FileText,
  Video,
  MessageSquare,
  Trophy,
} from "lucide-react";

const guides = [
  {
    icon: GraduationCap,
    title: "Getting Started",
    description: "Learn how to create an account, enroll in courses, and start your learning journey.",
    href: "#getting-started",
  },
  {
    icon: BookOpen,
    title: "Course Enrollment",
    description: "Step-by-step guide to browsing, enrolling, and accessing courses.",
    href: "#enrollment",
  },
  {
    icon: Play,
    title: "Taking Lessons",
    description: "How to watch videos, read content, take notes, and track your progress.",
    href: "#lessons",
  },
  {
    icon: Trophy,
    title: "Quizzes & Certificates",
    description: "Take quizzes, pass assessments, and earn your certificates of completion.",
    href: "#quizzes",
  },
  {
    icon: CreditCard,
    title: "Payments & Billing",
    description: "Understand payment options, refunds, and subscription plans.",
    href: "#payments",
  },
  {
    icon: Settings,
    title: "Account Settings",
    description: "Manage your profile, notifications, security, and preferences.",
    href: "#settings",
  },
];

const sections = [
  {
    id: "getting-started",
    title: "Getting Started",
    content: [
      { q: "How do I create an account?", a: "Click the Register button on the homepage. You can sign up with your email address, or use Google/GitHub for one-click registration. After signing up, verify your email to activate your account." },
      { q: "How do I browse courses?", a: "Navigate to the Courses page from the main menu. Use the search bar and category filters to find courses that match your interests. Each course page shows a detailed description, curriculum, reviews, and instructor information." },
      { q: "What are the system requirements?", a: "SmartLMS works on any modern web browser (Chrome, Firefox, Safari, Edge). For the best experience, we recommend a stable internet connection of at least 5 Mbps for video content. The platform is fully responsive and works on mobile, tablet, and desktop." },
    ],
  },
  {
    id: "enrollment",
    title: "Course Enrollment",
    content: [
      { q: "How do I enroll in a course?", a: "Click on a course to view its details page. If it's free, click 'Enroll Now' to get instant access. For paid courses, click 'Buy Now' to complete the payment via Flutterwave. After successful payment, you'll be automatically enrolled." },
      { q: "Can I enroll in multiple courses?", a: "Yes! There's no limit to how many courses you can enroll in. Your dashboard shows all your enrolled courses with progress tracking for each one." },
      { q: "Is there a refund policy?", a: "We offer a 30-day money-back guarantee on all paid courses. If you're not satisfied, contact our support team for a full refund." },
    ],
  },
  {
    id: "lessons",
    title: "Taking Lessons",
    content: [
      { q: "How do I navigate between lessons?", a: "Use the sidebar to see all sections and lessons. Click any lesson to jump directly to it. Use the Previous/Next buttons at the bottom of each lesson to move sequentially. You can also use the hamburger menu to toggle the sidebar on mobile." },
      { q: "How do I track my progress?", a: "Click 'Mark Complete' at the bottom of each lesson when you finish it. Your progress is tracked automatically and displayed in the progress bar at the top of the learn page and on your dashboard." },
      { q: "Can I take notes?", a: "Yes! Click the Notes icon in the bottom panel (on mobile) or the right sidebar to open the notes panel. You can add notes to any lesson, and they'll be saved for future reference." },
    ],
  },
  {
    id: "quizzes",
    title: "Quizzes & Certificates",
    content: [
      { q: "How do quizzes work?", a: "Quizzes are available at the end of course sections. You need a passing score (usually 60-70%) to proceed. Each quiz has a time limit and you can retake it up to the maximum attempts allowed." },
      { q: "How do I earn a certificate?", a: "Complete all lessons and pass all quizzes in a course to automatically receive a certificate of completion. Your certificate will appear in your Dashboard > Certificates section." },
      { q: "Can I share my certificate?", a: "Yes! You can download your certificate as a PDF, share it directly to LinkedIn, or share the verification link with anyone. Each certificate has a unique ID that can be verified on our platform." },
    ],
  },
  {
    id: "payments",
    title: "Payments & Billing",
    content: [
      { q: "What payment methods are accepted?", a: "We accept all major credit/debit cards, bank transfers, and mobile payments through Flutterwave. Payments are processed in NGN (Nigerian Naira) by default." },
      { q: "Are there subscription plans?", a: "Yes, we offer monthly, quarterly, and yearly subscription plans that give you access to all courses on the platform. Visit the Pricing page for details." },
      { q: "How do I get a receipt?", a: "Payment receipts are sent to your registered email address immediately after a successful transaction. You can also view your payment history in the dashboard." },
    ],
  },
  {
    id: "settings",
    title: "Account Settings",
    content: [
      { q: "How do I update my profile?", a: "Go to Dashboard > Settings to update your name, email, avatar, bio, and other personal information." },
      { q: "How do I change my password?", a: "Go to Dashboard > Settings > Security to change your password. We recommend using a strong, unique password." },
      { q: "How do I become an instructor?", a: "Visit the Become Instructor page and submit an application. Our team will review it within 48 hours and get back to you with next steps." },
    ],
  },
];

export default function DocsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 py-20 text-white">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <FileText className="mx-auto mb-4 h-12 w-12 text-blue-200" />
            <h1 className="text-4xl font-bold sm:text-5xl">Documentation</h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
              Everything you need to know about using SmartLMS. Guides, tutorials,
              and answers to common questions.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-4">
            {/* Sidebar Nav */}
            <div className="lg:col-span-1">
              <nav className="sticky top-24 space-y-1">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">
                  Quick Links
                </h3>
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    {section.title}
                  </a>
                ))}
              </nav>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
              {/* Guide Cards */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {guides.map((guide) => (
                  <a
                    key={guide.title}
                    href={guide.href}
                    className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-indigo-200 hover:shadow-md"
                  >
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100">
                      <guide.icon className="h-5 w-5 text-indigo-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600">
                      {guide.title}
                    </h3>
                    <p className="mt-1 text-xs text-gray-500">{guide.description}</p>
                  </a>
                ))}
              </div>

              {/* Documentation Sections */}
              {sections.map((section) => (
                <div key={section.id} id={section.id} className="scroll-mt-24">
                  <h2 className="mb-4 text-2xl font-bold text-gray-900">{section.title}</h2>
                  <div className="space-y-3">
                    {section.content.map((item) => (
                      <div
                        key={item.q}
                        className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                      >
                        <h3 className="font-semibold text-gray-900">{item.q}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-gray-600">{item.a}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
