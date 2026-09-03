import prisma from "@/lib/prisma";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import LiveClassesClient from "./live-classes-client";

export const dynamic = "force-dynamic";

async function getLiveClasses() {
  try {
    const now = new Date();
    const classes = await prisma.liveClass.findMany({
      include: {
        instructor: {
          select: { id: true, name: true, avatar: true },
        },
        course: {
          select: { id: true, title: true, slug: true },
        },
        _count: { select: { attendees: true } },
      },
      orderBy: { scheduledAt: "desc" },
    });

    return classes.map((cls) => ({
      id: cls.id,
      title: cls.title,
      description: cls.description,
      platform: cls.platform,
      scheduledAt: cls.scheduledAt.toISOString(),
      duration: cls.duration,
      meetingUrl: cls.meetingUrl,
      recordingUrl: cls.recordingUrl,
      isRecorded: cls.isRecorded,
      instructor: {
        id: cls.instructor.id,
        name: cls.instructor.name || "Instructor",
        avatar: cls.instructor.avatar,
      },
      course: cls.course,
      attendeeCount: cls._count.attendees,
      isPast: new Date(cls.scheduledAt) < now,
    }));
  } catch {
    return [];
  }
}

export const metadata = {
  title: "Live Classes | SmartLMS",
  description: "Join live interactive sessions with expert instructors. Ask questions in real-time and master new skills.",
};

export default async function LiveClassesPage() {
  const classes = await getLiveClasses();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <LiveClassesClient initialClasses={classes} />
      <Footer />
    </div>
  );
}
