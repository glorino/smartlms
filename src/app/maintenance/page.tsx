import Link from "next/link";
import { GraduationCap, Wrench } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata = {
  title: `Maintenance - ${SITE_CONFIG.name}`,
  description: `${SITE_CONFIG.name} is currently undergoing scheduled maintenance. Please check back soon.`,
};

export default function MaintenancePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-orange-100">
          <Wrench className="h-12 w-12 text-amber-600" />
        </div>
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100">
          <GraduationCap className="h-7 w-7 text-indigo-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
          We&apos;ll be right back
        </h1>
        <p className="mt-4 text-xl text-gray-600">
          {SITE_CONFIG.name} is currently under maintenance.
        </p>
        <p className="mt-2 max-w-md text-gray-500">
          We&apos;re performing scheduled maintenance to make the platform
          better. Please check back in a few minutes.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-700 hover:shadow-xl hover:-translate-y-0.5"
          >
            <GraduationCap className="h-4 w-4" />
            Try Again
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
