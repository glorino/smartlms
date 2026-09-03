import { auth } from "@/lib/auth";
import Sidebar from "@/components/layout/sidebar";
import Navbar from "@/components/layout/navbar";

export const dynamic = "force-dynamic";

export default async function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar user={session?.user ?? undefined} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar session={session ?? undefined} />
        <main className="flex-1 overflow-y-auto p-6 pb-20 md:pb-6">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
