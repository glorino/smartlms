"use client";

import { useState } from "react";
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Mail,
  MessageSquare,
  Phone,
  Send,
  BookOpen,
  Video,
  FileText,
  Shield,
  CreditCard,
  Settings,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const faqCategories = [
  {
    icon: GraduationCap,
    title: "Getting Started",
    faqs: [
      {
        q: "How do I create an account?",
        a: "Click the Sign Up button on the homepage, fill in your details, and verify your email. You can also sign up using Google or GitHub.",
      },
      {
        q: "How do I enroll in a course?",
        a: "Browse the course catalog, click on a course you like, and click the Enroll button. Free courses enroll instantly, paid courses require payment.",
      },
      {
        q: "How do I track my progress?",
        a: "Visit your Dashboard to see enrolled courses, completion percentages, quiz scores, and certificates earned.",
      },
    ],
  },
  {
    icon: BookOpen,
    title: "Courses & Learning",
    faqs: [
      {
        q: "Can I download course materials?",
        a: "Yes, most courses offer downloadable resources like PDFs, code files, and worksheets. Look for the download icon on lesson pages.",
      },
      {
        q: "How do quizzes work?",
        a: "Quizzes are available at the end of course sections. You need a passing score (usually 60%) to proceed. You can retake quizzes up to the max attempts limit.",
      },
      {
        q: "How do I earn a certificate?",
        a: "Complete all lessons and pass all quizzes in a course to automatically receive a certificate of completion.",
      },
    ],
  },
  {
    icon: CreditCard,
    title: "Payments & Billing",
    faqs: [
      {
        q: "What payment methods are accepted?",
        a: "We accept all major credit/debit cards, bank transfers, and mobile payments through our secure Flutterwave integration.",
      },
      {
        q: "Can I get a refund?",
        a: "Yes, we offer a 30-day money-back guarantee on all paid courses. Contact support for refund requests.",
      },
      {
        q: "Are there any subscription plans?",
        a: "Yes, we offer monthly, quarterly, and yearly subscription plans that give you access to all courses on the platform.",
      },
    ],
  },
  {
    icon: Settings,
    title: "Account & Settings",
    faqs: [
      {
        q: "How do I update my profile?",
        a: "Go to Settings > Profile to update your name, email, avatar, bio, and other personal information.",
      },
      {
        q: "How do I change my password?",
        a: "Go to Settings > Security to change your password. You can also enable two-factor authentication for added security.",
      },
      {
        q: "How do I become an instructor?",
        a: "Visit the Become Instructor page and submit an application. Our team will review it within 48 hours.",
      },
    ],
  },
];

const supportChannels = [
  {
    icon: Mail,
    title: "Email Support",
    description: "Send us an email and we'll respond within 24 hours",
    contact: "support@smartlms.com",
    action: "mailto:support@smartlms.com",
  },
  {
    icon: MessageSquare,
    title: "Live Chat",
    description: "Chat with our support team in real-time",
    contact: "Available Mon-Fri, 9am-6pm EST",
    action: "#",
  },
  {
    icon: Phone,
    title: "Phone Support",
    description: "Call us for urgent issues",
    contact: "+234 800 SMART LMS",
    action: "tel:+2348007627856",
  },
];

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setContactForm({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Hero Section */}
        <div className="rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-8 text-white shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <HelpCircle className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Help & Support</h1>
          </div>
          <p className="max-w-xl text-indigo-100">
            Find answers to common questions or reach out to our support team.
          </p>
        </div>

        {/* Support Channels */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {supportChannels.map((channel) => (
            <Card key={channel.title} className="transition-shadow hover:shadow-md border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="rounded-xl bg-indigo-100 p-2.5">
                    <channel.icon className="h-5 w-5 text-indigo-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{channel.title}</h3>
                </div>
                <p className="text-sm text-gray-500 mb-3">{channel.description}</p>
                <a
                  href={channel.action}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                >
                  {channel.contact}
                </a>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqCategories.map((category) => (
              <Card key={category.title} className="border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <category.icon className="h-5 w-5 text-indigo-600" />
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {category.faqs.map((faq) => {
                    const faqKey = `${category.title}-${faq.q}`;
                    const isOpen = openFaq === faqKey;
                    return (
                      <div
                        key={faq.q}
                        className="rounded-xl border border-gray-100 overflow-hidden"
                      >
                        <button
                          onClick={() => setOpenFaq(isOpen ? null : faqKey)}
                          className="flex w-full items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                        >
                          <span className="font-medium text-gray-900">{faq.q}</span>
                          {isOpen ? (
                            <ChevronUp className="h-5 w-5 text-gray-400 shrink-0" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-400 shrink-0" />
                          )}
                        </button>
                        {isOpen && (
                          <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Contact Us
            </CardTitle>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <div className="py-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                  <Send className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Message Sent!</h3>
                <p className="mt-1 text-sm text-gray-500">
                  We&apos;ll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) =>
                        setContactForm({ ...contactForm, name: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) =>
                        setContactForm({ ...contactForm, email: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    required
                    value={contactForm.subject}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, subject: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="How can we help?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={contactForm.message}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, message: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="Describe your issue or question..."
                  />
                </div>
                <div className="flex justify-end">
                  <Button type="submit">
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Resources */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle>Additional Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Link
                href="/courses"
                className="flex items-center gap-3 rounded-xl border border-gray-100 p-4 transition-colors hover:bg-gray-50"
              >
                <FileText className="h-5 w-5 text-indigo-600" />
                <div>
                  <p className="font-medium text-gray-900">Documentation</p>
                  <p className="text-sm text-gray-500">Platform guides and tutorials</p>
                </div>
              </Link>
              <Link
                href="/courses"
                className="flex items-center gap-3 rounded-xl border border-gray-100 p-4 transition-colors hover:bg-gray-50"
              >
                <Video className="h-5 w-5 text-indigo-600" />
                <div>
                  <p className="font-medium text-gray-900">Video Tutorials</p>
                  <p className="text-sm text-gray-500">Step-by-step video guides</p>
                </div>
              </Link>
              <Link
                href="/community"
                className="flex items-center gap-3 rounded-xl border border-gray-100 p-4 transition-colors hover:bg-gray-50"
              >
                <Shield className="h-5 w-5 text-indigo-600" />
                <div>
                  <p className="font-medium text-gray-900">Community Forum</p>
                  <p className="text-sm text-gray-500">Ask questions and share tips</p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
