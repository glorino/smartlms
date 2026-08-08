import Link from "next/link";
import {
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Globe,
  MessageCircle,
  Code2,
  Play,
} from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";

const footerLinks = {
  platform: [
    { label: "All Courses", href: "/courses" },
    { label: "Live Classes", href: "/live-classes" },
    { label: "Pricing", href: "/pricing" },
    { label: "For Enterprise", href: "/enterprise" },
  ],
  resources: [
    { label: "Blog", href: "/blog" },
    { label: "Documentation", href: "/docs" },
    { label: "Help Center", href: "/support" },
    { label: "Community", href: "/community" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

const socialLinks = [
  { icon: Globe, label: "Twitter", href: SITE_CONFIG.social.twitter },
  { icon: MessageCircle, label: "Chat", href: SITE_CONFIG.social.linkedin },
  { icon: Code2, label: "GitHub", href: SITE_CONFIG.social.github },
  { icon: Play, label: "YouTube", href: SITE_CONFIG.social.youtube },
];

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-gray-900">{SITE_CONFIG.name}</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-gray-600">
              The most advanced LMS combining AI-powered course creation, live
              classes, and comprehensive analytics for modern education.
            </p>
            <div className="mt-6 space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>{SITE_CONFIG.contact.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>{SITE_CONFIG.contact.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{SITE_CONFIG.contact.address}</span>
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
                {category}
              </h3>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-600 transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} SmartLMS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
