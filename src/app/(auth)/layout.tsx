import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex justify-center py-6">
        <Link href="/" className="text-2xl font-bold text-indigo-600 hover:text-indigo-700">
          SmartLMS
        </Link>
      </div>
      {children}
    </div>
  );
}
