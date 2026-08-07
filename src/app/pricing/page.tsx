"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, X, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import Navbar from "@/components/layout/navbar";

const plans = [
  {
    name: "Free",
    price: 0,
    period: "forever",
    description: "Perfect for getting started",
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
    name: "Pro",
    price: 29,
    period: "month",
    description: "For serious course creators",
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
    price: 99,
    period: "month",
    description: "For organizations and teams",
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

const faqs = [
  {
    q: "Can I switch plans anytime?",
    a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately with prorated billing.",
  },
  {
    q: "Is there a free trial for Pro?",
    a: "Yes, we offer a 14-day free trial for the Pro plan. No credit card required to start.",
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
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <div className="gradient-primary py-16">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h1 className="text-4xl font-bold text-white">
            Simple, Transparent Pricing
          </h1>
          <p className="mt-4 text-lg text-white/80">
            Start free, scale as you grow. No hidden fees.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <span
              className={`text-sm ${!annual ? "text-white font-semibold" : "text-white/60"}`}
            >
              Monthly
            </span>
            <button
              onClick={() => setAnnual(!annual)}
              className={`relative h-6 w-12 rounded-full transition-colors ${annual ? "bg-white" : "bg-white/30"}`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-indigo-600 transition-transform ${annual ? "translate-x-6" : "translate-x-0.5"}`}
              />
            </button>
            <span
              className={`text-sm ${annual ? "text-white font-semibold" : "text-white/60"}`}
            >
              Annual
              <span className="ml-1 rounded-full bg-white/20 px-2 py-0.5 text-xs">
                Save 20%
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border-2 bg-white p-8 shadow-sm transition-shadow hover:shadow-lg ${
                plan.popular
                  ? "border-indigo-500"
                  : "border-gray-200"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-4 py-1 text-xs font-semibold text-white">
                  Most Popular
                </div>
              )}
              <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
              <p className="mt-2 text-sm text-gray-500">{plan.description}</p>
              <div className="mt-6">
                <span className="text-4xl font-bold text-gray-900">
                  ${annual ? Math.round(plan.price * 0.8) : plan.price}
                </span>
                <span className="text-gray-500">/{plan.period}</span>
              </div>
              <Link
                href={plan.href}
                className={`mt-6 block w-full rounded-xl py-3 text-center text-sm font-semibold transition-colors ${
                  plan.popular
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {plan.cta}
              </Link>
              <ul className="mt-8 space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    {feature.included ? (
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                    ) : (
                      <X className="mt-0.5 h-4 w-4 shrink-0 text-gray-300" />
                    )}
                    <span
                      className={`text-sm ${feature.included ? "text-gray-700" : "text-gray-400"}`}
                    >
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-xl border border-gray-200 bg-white"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="flex w-full items-center justify-between p-5 text-left"
              >
                <span className="font-medium text-gray-900">{faq.q}</span>
                {openFaq === i ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </button>
              {openFaq === i && (
                <div className="border-t border-gray-100 px-5 pb-5 pt-4">
                  <p className="text-sm text-gray-600">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
