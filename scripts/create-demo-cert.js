const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const studentEmail = "student@smartlms.com";

  const user = await prisma.user.findUnique({
    where: { email: studentEmail },
    select: { id: true, name: true },
  });

  if (!user) {
    console.log("Student not found:", studentEmail);
    return;
  }
  console.log("Found student:", user.name, user.id);

  const course = await prisma.course.findFirst({
    where: { slug: "complete-web-development-bootcamp" },
    select: { id: true, title: true },
  });

  if (!course) {
    console.log("Course not found");
    return;
  }
  console.log("Found course:", course.title, course.id);

  const existing = await prisma.certificate.findFirst({
    where: { userId: user.id, courseId: course.id },
  });

  if (existing) {
    console.log("Certificate already exists:", existing.certificateId);
    return;
  }

  const certId = `SLMS-WEB-${Date.now().toString(36).toUpperCase()}`;

  const cert = await prisma.certificate.create({
    data: {
      title: `Certificate of Completion - ${course.title}`,
      certificateId: certId,
      userId: user.id,
      courseId: course.id,
      status: "ACTIVE",
      qrCode: `https://smartlms-bay.vercel.app/verify-certificate?id=${certId}`,
    },
    include: {
      course: { select: { title: true } },
      user: { select: { name: true, email: true } },
    },
  });

  console.log("Certificate created!");
  console.log("  ID:", cert.certificateId);
  console.log("  Student:", cert.user.name);
  console.log("  Course:", cert.course.title);
  console.log("  Status:", cert.status);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
