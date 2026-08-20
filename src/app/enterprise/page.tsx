import Link from "next/link";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import {
  Building2,
  Users,
  Shield,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Mail,
  Phone,
  Headphones,
  Globe,
  Lock,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Team Management",
    description: "Create teams, assign roles, and manage your organization's learning programs with ease.",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Track employee progress, completion rates, and skill gaps with detailed reporting dashboards.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "SOC 2 compliant with SSO, SCIM provisioning, and advanced data encryption.",
  },
  {
    icon: Lock,
    title: "Custom Integrations",
    description: "Integrate with your existing LMS, HRIS, and SSO systems via our robust API.",
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    description: "Priority support with a dedicated account manager and 24/7 technical assistance.",
  },
  {
    icon: Zap,
    title: "Custom Content",
    description: "Create branded learning portals with custom courses, paths, and certifications.",
  },
  {
    icon: Globe,
    title: "Global Accessibility",
    description: "Multi-language support, timezone-aware scheduling, and mobile access for distributed teams.",
  },
  {
    icon: Building2,
    title: "Staff Onboarding",
    description: "Streamline new hire onboarding with automated learning paths, compliance tracking, and progress dashboards.",
  },
  {
    icon: Users,
    title: "Staff Routine Training",
    description: "Schedule and manage recurring training sessions, certifications, and compliance refreshers across departments.",
  },
];

const plans = [
  {
    name: "Starter",
    price: "50,000",
    period: "/year",
    description: "For small teams getting started",
    features: ["Up to 50 learners", "10 courses", "Basic analytics", "Email support", "SSO integration"],
  },
  {
    name: "Professional",
    price: "150,000",
    period: "/year",
    description: "For growing organizations",
    features: ["Up to 200 learners", "Unlimited courses", "Advanced analytics", "Priority support", "Custom integrations", "Team management"],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large organizations",
    features: ["Unlimited learners", "Unlimited courses", "Custom analytics", "Dedicated support", "Custom integrations", "SSO & SCIM", "SLA guarantee", "On-premise option"],
  },
];

export default function EnterprisePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-gray-900 via-gray-900 to-indigo-950 py-20 text-white">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <Building2 className="mx-auto mb-4 h-12 w-12 text-indigo-400" />
            <h1 className="text-4xl font-bold sm:text-5xl">SmartLMS for Enterprise</h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-300">
              Empower your organization with a customized learning platform. Train teams,
              track progress, and build skills at scale.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                <Mail className="h-4 w-4" />
                Contact Sales
              </Link>
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-600 px-6 py-3 text-sm font-semibold text-gray-300 hover:bg-gray-800"
              >
                View Courses
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
            Everything Your Team Needs
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100">
                  <feature.icon className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section className="bg-gray-50 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-4 text-center text-3xl font-bold text-gray-900">
              Enterprise Plans
            </h2>
            <p className="mx-auto mb-12 max-w-xl text-center text-gray-600">
              Choose the plan that fits your organization. All plans include a 14-day free trial.
            </p>
            <div className="grid gap-8 md:grid-cols-3">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative rounded-2xl border bg-white p-8 shadow-sm ${
                    plan.popular
                      ? "border-indigo-500 ring-2 ring-indigo-500"
                      : "border-gray-200"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="rounded-full bg-indigo-600 px-4 py-1 text-xs font-semibold text-white">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">{plan.description}</p>
                  <div className="mt-4">
                    <span className="text-3xl font-extrabold text-gray-900">
                      {plan.price === "Custom" ? "" : "₦"}
                      {plan.price}
                    </span>
                    <span className="text-sm text-gray-500">{plan.period}</span>
                  </div>
                  <ul className="mt-6 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/contact"
                    className={`mt-8 block rounded-xl py-3 text-center text-sm font-semibold transition-colors ${
                      plan.popular
                        ? "bg-indigo-600 text-white hover:bg-indigo-700"
                        : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {plan.price === "Custom" ? "Contact Sales" : "Start Free Trial"}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16 text-white">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold">Ready to Transform Your Team's Learning?</h2>
            <p className="mt-4 text-lg text-indigo-100">
              Join hundreds of organizations using SmartLMS to upskill their workforce.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
              >
                <Phone className="h-4 w-4" />
                Talk to Sales
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
