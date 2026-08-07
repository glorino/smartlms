import Link from "next/link";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function SupportPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="py-24 text-center">
          <div className="mx-auto max-w-3xl px-4">
            <h1 className="text-4xl font-bold text-gray-900">Support Center</h1>
            <p className="mt-4 text-lg text-gray-600">
              Get help with your SmartLMS account, courses, or billing. Our
              support team is here to assist you.
            </p>
            <Link
              href="/help"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Go to Help Center
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
