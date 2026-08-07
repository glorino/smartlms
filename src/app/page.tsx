import Link from "next/link";
import {
  BookOpen,
  Brain,
  Award,
  Video,
  BarChart3,
  Package,
  ArrowRight,
  Check,
  Star,
  Users,
  Globe,
  Zap,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

const features = [
  {
    icon: Brain,
    title: "AI Course Builder",
    description:
      "Generate entire course outlines, lessons, and quizzes with our advanced AI engine. Create content 10x faster.",
    gradient: "from-blue-500 to-cyan-400",
  },
  {
    icon: BookOpen,
    title: "14 Question Types",
    description:
      "From multiple choice to drag-and-drop, matching to code challenges. Every assessment type you need.",
    gradient: "from-purple-500 to-pink-400",
  },
  {
    icon: Award,
    title: "Certificate Builder",
    description:
      "Design custom certificates with templates, auto-issue on course completion, and verify authenticity.",
    gradient: "from-amber-500 to-orange-400",
  },
  {
    icon: Video,
    title: "Live Classes",
    description:
      "Built-in live video sessions with screen sharing, whiteboard, and real-time Q&A. No third-party tools needed.",
    gradient: "from-green-500 to-emerald-400",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "Track student progress, engagement, and completion rates with beautiful, actionable analytics.",
    gradient: "from-rose-500 to-red-400",
  },
  {
    icon: Package,
    title: "SCORM Support",
    description:
      "Import and export SCORM packages. Full compatibility with industry-standard e-learning content.",
    gradient: "from-indigo-500 to-violet-400",
  },
];

const steps = [
  {
    number: "01",
    title: "Create Your Course",
    description:
      "Use AI to build your course structure, add lessons, quizzes, and assignments in minutes.",
    icon: Brain,
  },
  {
    number: "02",
    title: "Engage Your Students",
    description:
      "Launch live classes, create interactive quizzes, and build a thriving learning community.",
    icon: Users,
  },
  {
    number: "03",
    title: "Track & Improve",
    description:
      "Monitor progress with analytics, gather feedback, and continuously improve your courses.",
    icon: BarChart3,
  },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Senior Instructor, Tech Academy",
    avatar: "/avatars/sarah.jpg",
    rating: 5,
    content:
      "SmartLMS transformed how I create courses. The AI builder cut my preparation time from weeks to hours. The analytics help me understand exactly what my students need.",
  },
  {
    name: "Michael Chen",
    role: "CEO, LearnPro",
    avatar: "/avatars/michael.jpg",
    rating: 5,
    content:
      "We migrated 500+ courses to SmartLMS. The SCORM support made it seamless, and our students love the live class feature. Best LMS we have ever used.",
  },
  {
    name: "Elena Rodriguez",
    role: "University Professor",
    avatar: "/avatars/elena.jpg",
    rating: 5,
    content:
      "The 14 question types and certificate builder are game-changers. My students are more engaged, and completion rates jumped 40% since switching to SmartLMS.",
  },
];

const stats = [
  { label: "Students", value: "100K+", icon: Users },
  { label: "Courses", value: "500+", icon: BookOpen },
  { label: "Countries", value: "50+", icon: Globe },
  { label: "Rating", value: "4.9", icon: Star },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm">
                <Zap className="h-4 w-4 text-yellow-400" />
                AI-Powered Learning Platform
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Master Any Skill with{" "}
                <span className="bg-gradient-to-r from-cyan-400 to-blue-300 bg-clip-text text-transparent">
                  AI-Powered Learning
                </span>
              </h1>

              <p className="mt-6 max-w-lg text-lg text-blue-100 sm:text-xl">
                The most advanced LMS combining the best features of Tutor LMS,
                LearnDash, and MasterStudy. Create, teach, and scale your
                educational content with cutting-edge AI.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-semibold text-blue-700 shadow-lg transition-all hover:bg-blue-50 hover:shadow-xl"
                >
                  Start Learning Free
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="/courses"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/30 px-8 py-4 text-base font-semibold text-white transition-all hover:border-white/60 hover:bg-white/10"
                >
                  Explore Courses
                </Link>
              </div>

              <div className="mt-8 flex items-center gap-4 text-sm text-blue-200">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="h-8 w-8 rounded-full border-2 border-blue-700 bg-gradient-to-br from-blue-400 to-purple-500"
                    />
                  ))}
                </div>
                <span>Join 100,000+ learners worldwide</span>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="relative rounded-2xl border border-white/10 bg-white/5 p-2 shadow-2xl backdrop-blur-sm">
                <div className="rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-400" />
                    <div className="h-3 w-3 rounded-full bg-yellow-400" />
                    <div className="h-3 w-3 rounded-full bg-green-400" />
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 w-3/4 rounded bg-white/10" />
                    <div className="h-4 w-1/2 rounded bg-white/10" />
                    <div className="h-32 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/30">
                          <Brain className="h-6 w-6 text-blue-300" />
                        </div>
                        <div>
                          <div className="h-3 w-32 rounded bg-white/20" />
                          <div className="mt-1 h-2 w-20 rounded bg-white/10" />
                        </div>
                      </div>
                      <div className="mt-4 space-y-2">
                        <div className="h-2 w-full rounded bg-white/10" />
                        <div className="h-2 w-4/5 rounded bg-white/10" />
                        <div className="h-2 w-3/5 rounded bg-white/10" />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {["Video", "Quiz", "PDF"].map((t) => (
                        <div
                          key={t}
                          className="rounded-lg bg-white/5 p-3 text-center text-xs text-white/60"
                        >
                          {t}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="relative -mt-8 z-10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-xl sm:grid-cols-4 sm:p-8">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center text-center">
                <stat.icon className="mb-2 h-6 w-6 text-primary" />
                <span className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  {stat.value}
                </span>
                <span className="text-sm text-gray-500">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              Features
            </span>
            <h2 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
              Everything You Need to Teach
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              A complete learning management system with tools that rival the
              biggest platforms, powered by artificial intelligence.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1"
              >
                <div
                  className={`mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} text-white shadow-lg`}
                >
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-3 text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
                <div
                  className={`absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br ${feature.gradient} opacity-0 blur-2xl transition-opacity group-hover:opacity-20`}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              How It Works
            </span>
            <h2 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
              Start Teaching in 3 Steps
            </h2>
          </div>

          <div className="relative mt-16">
            <div className="absolute left-1/2 top-0 hidden h-full w-0.5 -translate-x-1/2 bg-gradient-to-b from-primary to-purple-600 lg:block" />

            <div className="space-y-12 lg:space-y-0">
              {steps.map((step, index) => (
                <div
                  key={step.number}
                  className={`relative flex flex-col items-center gap-8 lg:flex-row ${
                    index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                  }`}
                >
                  <div
                    className={`w-full lg:w-1/2 ${
                      index % 2 === 0 ? "lg:text-right" : "lg:text-left"
                    }`}
                  >
                    <div
                      className={`inline-block ${
                        index % 2 === 0 ? "lg:ml-auto" : ""
                      }`}
                    >
                      <span className="text-6xl font-bold text-primary/20">
                        {step.number}
                      </span>
                      <h3 className="mt-2 text-2xl font-bold text-gray-900">
                        {step.title}
                      </h3>
                      <p className="mt-3 max-w-md text-gray-600">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-primary text-white shadow-lg">
                    <step.icon className="h-7 w-7" />
                  </div>

                  <div className="w-full lg:w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              Pricing
            </span>
            <h2 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
              Simple, Transparent Pricing
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              Start free and scale as you grow. No hidden fees.
            </p>
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {/* Starter */}
            <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900">Starter</h3>
              <p className="mt-2 text-sm text-gray-500">
                Perfect for individual educators
              </p>
              <div className="mt-6">
                <span className="text-4xl font-bold text-gray-900">Free</span>
                <span className="text-gray-500"> forever</span>
              </div>
              <ul className="mt-8 flex-1 space-y-3">
                {[
                  "Up to 3 courses",
                  "100 students",
                  "Basic analytics",
                  "Community support",
                  "Certificate builder",
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="mt-8 block w-full rounded-xl border-2 border-gray-900 bg-white py-3 text-center text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-900 hover:text-white"
              >
                Get Started
              </Link>
            </div>

            {/* Pro */}
            <div className="relative flex flex-col rounded-2xl border-2 border-primary bg-white p-8 shadow-lg transition-all hover:shadow-xl">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="rounded-full bg-primary px-4 py-1 text-xs font-semibold text-white">
                  Most Popular
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Pro</h3>
              <p className="mt-2 text-sm text-gray-500">
                For growing educational businesses
              </p>
              <div className="mt-6">
                <span className="text-4xl font-bold text-gray-900">$29</span>
                <span className="text-gray-500"> / month</span>
              </div>
              <ul className="mt-8 flex-1 space-y-3">
                {[
                  "Unlimited courses",
                  "5,000 students",
                  "Advanced analytics",
                  "Live classes",
                  "AI course builder",
                  "Priority support",
                  "Custom certificates",
                  "Email marketing",
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/register?plan=pro"
                className="mt-8 block w-full rounded-xl bg-primary py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-primary/90"
              >
                Start Pro Trial
              </Link>
            </div>

            {/* Enterprise */}
            <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900">
                Enterprise
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                For institutions and large teams
              </p>
              <div className="mt-6">
                <span className="text-4xl font-bold text-gray-900">$99</span>
                <span className="text-gray-500"> / month</span>
              </div>
              <ul className="mt-8 flex-1 space-y-3">
                {[
                  "Everything in Pro",
                  "Unlimited students",
                  "SCORM import/export",
                  "White-label option",
                  "SSO & SAML",
                  "Dedicated account manager",
                  "API access",
                  "Custom integrations",
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/contact"
                className="mt-8 block w-full rounded-xl border-2 border-gray-900 bg-white py-3 text-center text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-900 hover:text-white"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-900 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white">
              Testimonials
            </span>
            <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              Loved by Educators Worldwide
            </h2>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="flex flex-col rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm"
              >
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="flex-1 text-gray-300 leading-relaxed">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500" />
                  <div>
                    <p className="font-semibold text-white">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 flex justify-center gap-4">
            <button className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:bg-white/10">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:bg-white/10">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-blue-600 to-purple-700" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <GraduationCap className="mx-auto h-16 w-16 text-white/90" />
          <h2 className="mt-6 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Ready to Transform Your Teaching?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
            Join over 100,000 educators and institutions already using SmartLMS
            to create exceptional learning experiences.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-semibold text-blue-700 shadow-lg transition-all hover:bg-blue-50 hover:shadow-xl"
            >
              Get Started for Free
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 px-8 py-4 text-base font-semibold text-white transition-all hover:border-white/60 hover:bg-white/10"
            >
              Book a Demo
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
