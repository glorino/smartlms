"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Shield,
  CreditCard,
  Sparkles,
  Zap,
  Crown,
  Building2,
  ArrowRight,
  HelpCircle,
  Star,
  PhoneCall,
} from "lucide-react";
import Navbar from "@/components/layout/navbar";

const plans = [
  {
    name: "Starter",
    price: 0,
    annualPrice: 0,
    period: "forever",
    description: "Perfect for getting started",
    gradient: "from-blue-500 to-blue-600",
    borderGradient: "from-blue-400 to-blue-600",
    buttonGradient: "from-blue-500 to-blue-600",
    buttonHover: "from-blue-600 to-blue-700",
    icon: <Sparkles className="h-5 w-5" />,
    badge: null,
    features: [
      { text: "Up to 5 courses", included: true },
      { text: "Unlimited students", included: true },
      { text: "Basic quizzes", included: true },
      { text: "Certificate generation", included: true },
      { text: "Community support", included: true },
      { text: "AI course builder", included: false },
      { text: "Live classes", included: false },
      { text: "Priority support", included: false },
      { text: "Custom branding", included: false },
      { text: "Analytics dashboard", included: false },
    ],
    cta: "Get Started Free",
    href: "/register",
    popular: false,
  },
  {
    name: "Professional",
    price: 28000,
    annualPrice: 22000,
    period: "/mo",
    description: "For serious course creators",
    gradient: "from-purple-500 to-pink-500",
    borderGradient: "from-purple-400 to-pink-500",
    buttonGradient: "from-purple-500 to-pink-500",
    buttonHover: "from-purple-600 to-pink-600",
    icon: <Zap className="h-5 w-5" />,
    badge: "Most Popular",
    features: [
      { text: "Unlimited courses", included: true },
      { text: "Unlimited students", included: true },
      { text: "14 quiz types", included: true },
      { text: "Certificate builder", included: true },
      { text: "Priority support", included: true },
      { text: "AI course builder", included: true },
      { text: "Live classes (Zoom/Meet)", included: true },
      { text: "Analytics dashboard", included: true },
      { text: "Custom branding", included: true },
      { text: "SCORM support", included: true },
    ],
    cta: "Start Pro Trial",
    href: "/register?plan=pro",
    popular: true,
  },
  {
    name: "Enterprise",
    price: 95000,
    annualPrice: 76000,
    period: "/mo",
    description: "For organizations and teams",
    gradient: "from-amber-400 to-orange-500",
    borderGradient: "from-amber-400 to-orange-500",
    buttonGradient: "from-amber-400 to-orange-500",
    buttonHover: "from-amber-500 to-orange-600",
    icon: <Crown className="h-5 w-5" />,
    badge: "Best Value",
    features: [
      { text: "Everything in Pro", included: true },
      { text: "Multi-instructor support", included: true },
      { text: "Group management", included: true },
      { text: "Seat-based pricing", included: true },
      { text: "API access", included: true },
      { text: "SSO integration", included: true },
      { text: "Custom integrations", included: true },
      { text: "Dedicated support", included: true },
      { text: "SLA guarantee", included: true },
      { text: "On-premise option", included: true },
    ],
    cta: "Contact Sales",
    href: "/contact",
    popular: false,
  },
];

const comparisonFeatures = [
  { name: "Courses", starter: "5", pro: "Unlimited", enterprise: "Unlimited" },
  { name: "Students", starter: "Unlimited", pro: "Unlimited", enterprise: "Unlimited" },
  { name: "Quiz Types", starter: "Basic", pro: "14 Types", enterprise: "14 Types" },
  { name: "Certificates", starter: "Basic", pro: "Custom Builder", enterprise: "Custom Builder" },
  { name: "AI Course Builder", starter: false, pro: true, enterprise: true },
  { name: "Live Classes", starter: false, pro: true, enterprise: true },
  { name: "Analytics Dashboard", starter: false, pro: true, enterprise: true },
  { name: "Custom Branding", starter: false, pro: true, enterprise: true },
  { name: "SCORM Support", starter: false, pro: true, enterprise: true },
  { name: "Multi-Instructor", starter: false, pro: false, enterprise: true },
  { name: "API Access", starter: false, pro: false, enterprise: true },
  { name: "SSO Integration", starter: false, pro: false, enterprise: true },
  { name: "Dedicated Support", starter: false, pro: false, enterprise: true },
  { name: "SLA Guarantee", starter: false, pro: false, enterprise: true },
  { name: "On-Premise Option", starter: false, pro: false, enterprise: true },
];

const faqs = [
  {
    q: "Can I switch plans anytime?",
    a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately with prorated billing.",
  },
  {
    q: "Is there a free trial for Pro?",
    a: "Yes, we offer a 14-day free trial for the Professional plan. No credit card required to start.",
  },
  {
    q: "Do you take a cut of my course revenue?",
    a: "No, SmartLMS takes 0% of your course revenue. You keep 100% of what you earn.",
  },
  {
    q: "Can I use my own domain?",
    a: "Yes, Enterprise plan users can use custom domains. Contact our sales team for setup.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit cards, PayPal, and bank transfers for annual Enterprise plans.",
  },
  {
    q: "Is there a money-back guarantee?",
    a: "Absolutely! We offer a 30-day money-back guarantee on all paid plans. If you're not satisfied, we'll refund your payment — no questions asked.",
  },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-500/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-500/20 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-amber-300/10 to-orange-400/10 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600">
            <Sparkles className="h-4 w-4" />
            No credit card required
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
            Simple,{" "}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Transparent
            </span>{" "}
            Pricing
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-500 sm:text-xl">
            Start free, scale as you grow. No hidden fees, no surprises.
            Choose the plan that fits your needs.
          </p>

          {/* Billing Toggle */}
          <div className="mt-10 flex items-center justify-center gap-4">
            <span
              className={`text-sm font-medium transition-colors ${
                !annual ? "text-gray-900" : "text-gray-400"
              }`}
            >
              Monthly
            </span>
            <button
              onClick={() => setAnnual(!annual)}
              className={`relative h-8 w-16 rounded-full transition-all duration-300 ${
                annual
                  ? "bg-gradient-to-r from-blue-500 to-purple-600"
                  : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-md transition-transform duration-300 ${
                  annual ? "translate-x-8" : "translate-x-1"
                }`}
              />
            </button>
            <span
              className={`text-sm font-medium transition-colors ${
                annual ? "text-gray-900" : "text-gray-400"
              }`}
            >
              Annual
            </span>
            <span className="rounded-full bg-gradient-to-r from-green-400 to-emerald-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
              Save 20%
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="mx-auto max-w-7xl px-4 pb-20">
        <div className="grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`group relative rounded-3xl transition-all duration-500 hover:scale-105 ${
                plan.popular
                  ? "z-10 shadow-2xl lg:-mt-4 lg:mb-4"
                  : "shadow-lg hover:shadow-2xl"
              }`}
            >
              {/* Popular Badge */}
              {plan.badge && (
                <div className="absolute -top-5 left-1/2 z-20 -translate-x-1/2">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r px-5 py-2 text-sm font-bold text-white shadow-lg ${plan.gradient}`}
                  >
                    {plan.popular && <Star className="h-4 w-4 fill-current" />}
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Card Background */}
              <div
                className={`relative overflow-hidden rounded-3xl ${
                  plan.popular
                    ? "bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 p-1"
                    : "border-2 border-transparent bg-white p-1"
                }`}
                style={{
                  backgroundImage: !plan.popular
                    ? `linear-gradient(white, white), linear-gradient(135deg, var(--tw-gradient-stops))`
                    : undefined,
                }}
              >
                <div
                  className={`overflow-hidden rounded-[22px] ${
                    plan.popular ? "bg-white/95" : "bg-white"
                  }`}
                >
                  <div className="p-8 lg:p-10">
                    {/* Plan Header */}
                    <div className="mb-6">
                      <div
                        className={`mb-4 inline-flex items-center justify-center rounded-2xl p-3 bg-gradient-to-br ${plan.gradient} text-white shadow-lg`}
                      >
                        {plan.icon}
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {plan.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {plan.description}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="mb-8">
                      <div className="flex items-baseline gap-1">
                        <span className="text-5xl font-extrabold text-gray-900">
                          {annual
                            ? `₦${plan.annualPrice.toLocaleString()}`
                            : `₦${plan.price.toLocaleString()}`}
                        </span>
                        {plan.price > 0 && (
                          <span className="text-gray-400">
                            {plan.period}
                          </span>
                        )}
                      </div>
                      {annual && plan.price > 0 && (
                        <p className="mt-1 text-sm text-green-600 font-medium">
                          Save ₦{((plan.price - plan.annualPrice) * 12).toLocaleString()}/year
                        </p>
                      )}
                      {plan.price === 0 && (
                        <p className="mt-1 text-sm text-gray-400">
                          Free forever
                        </p>
                      )}
                    </div>

                    {/* CTA Button */}
                    <Link
                      href={plan.href}
                      className={`mb-8 block w-full rounded-xl bg-gradient-to-r py-4 text-center text-sm font-bold text-white shadow-lg transition-all duration-300 hover:shadow-xl ${plan.buttonGradient} hover:${plan.buttonHover}`}
                    >
                      <span className="flex items-center justify-center gap-2">
                        {plan.cta}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </Link>

                    {/* Features */}
                    <div className="space-y-3">
                      {plan.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div
                            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                              feature.included
                                ? "bg-gradient-to-br from-green-400 to-emerald-500 text-white"
                                : "bg-gray-100"
                            }`}
                          >
                            {feature.included ? (
                              <Check className="h-3 w-3" />
                            ) : (
                              <X className="h-3 w-3 text-gray-400" />
                            )}
                          </div>
                          <span
                            className={`text-sm ${
                              feature.included
                                ? "text-gray-700 font-medium"
                                : "text-gray-400"
                            }`}
                          >
                            {feature.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Feature Comparison
          </h2>
          <p className="mt-4 text-gray-500">
            See exactly what each plan includes
          </p>
        </div>
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Features
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-blue-600">Starter</span>
                      <span className="text-xs font-normal text-gray-400">Free</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-purple-600">Professional</span>
                      <span className="text-xs font-normal text-gray-400">₦28,000/mo</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-amber-600">Enterprise</span>
                      <span className="text-xs font-normal text-gray-400">₦95,000/mo</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {comparisonFeatures.map((feature, i) => (
                  <tr
                    key={i}
                    className="transition-colors hover:bg-gray-50/50"
                  >
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {feature.name}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <FeatureCell value={feature.starter} color="blue" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <FeatureCell value={feature.pro} color="purple" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <FeatureCell value={feature.enterprise} color="amber" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mx-auto max-w-3xl px-4 py-20">
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-100 bg-purple-50 px-4 py-2 text-sm font-medium text-purple-600">
            <HelpCircle className="h-4 w-4" />
            FAQ
          </div>
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-gray-500">
            Everything you need to know about our plans
          </p>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                openFaq === i
                  ? "border-purple-200 bg-white shadow-lg"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="flex w-full items-center justify-between p-6 text-left"
              >
                <span className="pr-4 font-semibold text-gray-900">
                  {faq.q}
                </span>
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                    openFaq === i
                      ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white rotate-180"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <ChevronDown className="h-4 w-4" />
                </span>
              </button>
              <div
                className={`transition-all duration-300 ${
                  openFaq === i ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 pb-6">
                  <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Money-Back Guarantee */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 p-1">
          <div className="relative overflow-hidden rounded-[22px] bg-white/95 px-8 py-16 text-center sm:px-16">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-green-100/50 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-emerald-100/50 blur-3xl" />
            </div>
            <div className="relative">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-500 shadow-xl">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                30-Day Money-Back Guarantee
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-gray-600">
                We&apos;re confident you&apos;ll love SmartLMS. If you&apos;re not
                completely satisfied within 30 days, we&apos;ll refund your
                payment — no questions asked.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
                <div className="flex items-center gap-2 text-gray-600">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium">Full refund</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium">No questions asked</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium">Keep your data</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-1">
          <div className="relative overflow-hidden rounded-[22px] px-8 py-16 text-center sm:px-16">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-20 -right-20 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-2xl" />
            </div>
            <div className="relative">
              <h2 className="text-3xl font-extrabold text-white sm:text-5xl">
                Ready to Get Started?
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80">
                Join thousands of educators and organizations building the
                future of learning. Start for free today.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-sm font-bold text-gray-900 shadow-xl transition-all duration-300 hover:scale-105 hover:bg-gray-50"
                >
                  <CreditCard className="h-5 w-5" />
                  Start Free Trial
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 px-8 py-4 text-sm font-bold text-white transition-all duration-300 hover:border-white/60 hover:bg-white/10"
                >
                  <PhoneCall className="h-5 w-5" />
                  Talk to Sales
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-white/70">
                <span className="flex items-center gap-1.5">
                  <Check className="h-4 w-4" />
                  No credit card required
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="h-4 w-4" />
                  14-day free trial
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="h-4 w-4" />
                  Cancel anytime
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCell({
  value,
  color,
}: {
  value: boolean | string;
  color: "blue" | "purple" | "amber";
}) {
  const gradients = {
    blue: "from-blue-400 to-blue-600",
    purple: "from-purple-400 to-purple-600",
    amber: "from-amber-400 to-amber-600",
  };

  if (typeof value === "boolean") {
    return value ? (
      <div
        className={`mx-auto flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br text-white shadow-sm ${gradients[color]}`}
      >
        <Check className="h-3.5 w-3.5" />
      </div>
    ) : (
      <div className="mx-auto flex h-6 w-6 items-center justify-center rounded-full bg-gray-100">
        <X className="h-3.5 w-3.5 text-gray-400" />
      </div>
    );
  }
  return (
    <span className="text-sm font-medium text-gray-700">{value}</span>
  );
}
