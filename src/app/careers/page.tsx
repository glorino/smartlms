import Link from "next/link";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function CareersPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="py-24 text-center">
          <div className="mx-auto max-w-3xl px-4">
            <h1 className="text-4xl font-bold text-gray-900">Careers</h1>
            <p className="mt-4 text-lg text-gray-600">
              Help us build the future of online learning. We&apos;re always looking
              for talented people to join our team.
            </p>
            <Link
              href="/"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Back to Home
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
