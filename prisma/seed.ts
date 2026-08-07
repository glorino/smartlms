import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@smartlms.com" },
    update: {},
    create: {
      email: "admin@smartlms.com",
      name: "Admin User",
      password: adminPassword,
      role: "ADMIN",
      bio: "Platform administrator",
    },
  });
  console.log("Created admin:", admin.email);

  // Create instructor user
  const instructorPassword = await bcrypt.hash("instructor123", 12);
  const instructor = await prisma.user.upsert({
    where: { email: "instructor@smartlms.com" },
    update: {},
    create: {
      email: "instructor@smartlms.com",
      name: "Dr. Sarah Johnson",
      password: instructorPassword,
      role: "INSTRUCTOR",
      bio: "Experienced educator with 10+ years in online teaching. Specializing in web development and data science.",
    },
  });
  console.log("Created instructor:", instructor.email);

  // Create student user
  const studentPassword = await bcrypt.hash("student123", 12);
  const student = await prisma.user.upsert({
    where: { email: "student@smartlms.com" },
    update: {},
    create: {
      email: "student@smartlms.com",
      name: "John Doe",
      password: studentPassword,
      role: "STUDENT",
      bio: "Passionate learner exploring new technologies",
    },
  });
  console.log("Created student:", student.email);

  // Create sample courses
  const courses = [
    {
      title: "Complete Web Development Bootcamp",
      slug: "complete-web-development-bootcamp",
      description:
        "Master HTML, CSS, JavaScript, React, Node.js, and more. Build real-world projects and become a full-stack developer.",
      shortDescription:
        "Learn web development from scratch. HTML, CSS, JavaScript, React, Node.js and more.",
      price: 49.99,
      level: "BEGINNER",
      category: "Web Development",
      tags: ["javascript", "react", "nodejs", "web development"],
      duration: 1200,
      isFeatured: true,
      rating: 4.8,
      totalRatings: 1250,
      totalStudents: 5430,
    },
    {
      title: "Machine Learning & AI Masterclass",
      slug: "machine-learning-ai-masterclass",
      description:
        "Deep dive into machine learning algorithms, neural networks, and AI applications using Python and TensorFlow.",
      shortDescription:
        "Learn ML and AI from fundamentals to advanced topics with hands-on projects.",
      price: 79.99,
      salePrice: 59.99,
      level: "INTERMEDIATE",
      category: "Data Science",
      tags: ["machine learning", "AI", "python", "tensorflow"],
      duration: 900,
      isFeatured: true,
      rating: 4.9,
      totalRatings: 890,
      totalStudents: 3210,
    },
    {
      title: "Digital Marketing Complete Guide",
      slug: "digital-marketing-complete-guide",
      description:
        "Learn SEO, social media marketing, content marketing, email marketing, and paid advertising strategies.",
      shortDescription:
        "Master digital marketing strategies to grow your business online.",
      price: 39.99,
      level: "BEGINNER",
      category: "Marketing",
      tags: ["SEO", "social media", "content marketing", "advertising"],
      duration: 600,
      isFeatured: true,
      rating: 4.7,
      totalRatings: 650,
      totalStudents: 2890,
    },
    {
      title: "Advanced Python Programming",
      slug: "advanced-python-programming",
      description:
        "Master advanced Python concepts including decorators, generators, async programming, and design patterns.",
      shortDescription:
        "Take your Python skills to the next level with advanced concepts.",
      price: 59.99,
      level: "ADVANCED",
      category: "Programming",
      tags: ["python", "programming", "advanced", "design patterns"],
      duration: 750,
      rating: 4.6,
      totalRatings: 420,
      totalStudents: 1850,
    },
    {
      title: "UI/UX Design Fundamentals",
      slug: "ui-ux-design-fundamentals",
      description:
        "Learn the principles of user interface and user experience design. Create stunning designs with Figma.",
      shortDescription:
        "Design beautiful, user-friendly interfaces with modern tools and techniques.",
      price: 44.99,
      level: "BEGINNER",
      category: "Design",
      tags: ["UI", "UX", "figma", "design"],
      duration: 500,
      rating: 4.8,
      totalRatings: 780,
      totalStudents: 3560,
    },
    {
      title: "Cybersecurity Essentials",
      slug: "cybersecurity-essentials",
      description:
        "Learn ethical hacking, network security, cryptography, and incident response. Prepare for security certifications.",
      shortDescription:
        "Protect systems and networks from cyber threats with hands-on labs.",
      price: 69.99,
      level: "INTERMEDIATE",
      category: "Security",
      tags: ["cybersecurity", "hacking", "network security", "cryptography"],
      duration: 800,
      rating: 4.7,
      totalRatings: 540,
      totalStudents: 2100,
    },
  ];

  for (const courseData of courses) {
    const course = await prisma.course.upsert({
      where: { slug: courseData.slug },
      update: {},
      create: {
        ...courseData,
        status: "PUBLISHED",
        instructorId: instructor.id,
      },
    });
    console.log("Created course:", course.title);

    // Create sections and lessons for each course
    const section1 = await prisma.courseSection.create({
      data: {
        title: "Getting Started",
        order: 0,
        courseId: course.id,
      },
    });

    const section2 = await prisma.courseSection.create({
      data: {
        title: "Core Concepts",
        order: 1,
        courseId: course.id,
      },
    });

    const section3 = await prisma.courseSection.create({
      data: {
        title: "Advanced Topics",
        order: 2,
        courseId: course.id,
      },
    });

    // Create lessons
    const lessons = [
      {
        title: "Introduction to the Course",
        type: "VIDEO",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        videoType: "youtube",
        duration: 15,
        order: 0,
        isPreview: true,
        sectionId: section1.id,
      },
      {
        title: "Course Overview",
        type: "TEXT",
        content:
          "Welcome to this comprehensive course. In this section, we will cover the fundamentals and build a strong foundation.",
        duration: 10,
        order: 1,
        isPreview: true,
        sectionId: section1.id,
      },
      {
        title: "Setting Up Your Environment",
        type: "VIDEO",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        videoType: "youtube",
        duration: 25,
        order: 2,
        sectionId: section1.id,
      },
      {
        title: "Core Concepts Deep Dive",
        type: "VIDEO",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        videoType: "youtube",
        duration: 45,
        order: 0,
        sectionId: section2.id,
      },
      {
        title: "Hands-on Practice",
        type: "TEXT",
        content:
          "Let's apply what we've learned with practical exercises and real-world examples.",
        duration: 30,
        order: 1,
        sectionId: section2.id,
      },
      {
        title: "Advanced Techniques",
        type: "VIDEO",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        videoType: "youtube",
        duration: 60,
        order: 0,
        sectionId: section3.id,
      },
    ];

    for (const lessonData of lessons) {
      await prisma.lesson.create({ data: lessonData });
    }
    console.log(`  Created ${lessons.length} lessons for ${course.title}`);

    // Create a quiz
    const quiz = await prisma.quiz.create({
      data: {
        title: `${course.title} - Final Assessment`,
        description: "Test your knowledge with this comprehensive quiz",
        timeLimit: 30,
        passingScore: 70,
        maxAttempts: 3,
        isPublished: true,
        courseId: course.id,
        points: 100,
      },
    });

    // Create questions
    const question1 = await prisma.question.create({
      data: {
        content: "What is the primary purpose of this course?",
        type: "SINGLE_CHOICE",
        points: 10,
        explanation:
          "This course is designed to provide comprehensive knowledge in the subject area.",
        order: 0,
        quizId: quiz.id,
      },
    });

    await prisma.answer.createMany({
      data: [
        { content: "To learn fundamentals", isCorrect: true, points: 10, order: 0, questionId: question1.id },
        { content: "To pass an exam", isCorrect: false, points: 0, order: 1, questionId: question1.id },
        { content: "To get a certificate only", isCorrect: false, points: 0, order: 2, questionId: question1.id },
        { content: "No specific purpose", isCorrect: false, points: 0, order: 3, questionId: question1.id },
      ],
    });

    const question2 = await prisma.question.create({
      data: {
        content: "True or False: Practice is essential for mastering new skills.",
        type: "TRUE_FALSE",
        points: 10,
        explanation: "Practice is indeed essential for mastering any new skill.",
        order: 1,
        quizId: quiz.id,
      },
    });

    await prisma.answer.createMany({
      data: [
        { content: "True", isCorrect: true, points: 10, order: 0, questionId: question2.id },
        { content: "False", isCorrect: false, points: 0, order: 1, questionId: question2.id },
      ],
    });

    const question3 = await prisma.question.create({
      data: {
        content: "Fill in the blank: The best way to learn is through _____ and practice.",
        type: "FILL_BLANK",
        points: 10,
        explanation: "Hands-on experience combined with practice is the best way to learn.",
        order: 2,
        quizId: quiz.id,
      },
    });

    await prisma.answer.createMany({
      data: [
        { content: "experience", isCorrect: true, points: 10, order: 0, questionId: question3.id },
        { content: "studying", isCorrect: false, points: 0, order: 1, questionId: question3.id },
      ],
    });

    console.log(`  Created quiz with 3 questions for ${course.title}`);
  }

  // Enroll student in first course
  const firstCourse = await prisma.course.findFirst({
    where: { slug: "complete-web-development-bootcamp" },
  });

  if (firstCourse) {
    await prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId: student.id,
          courseId: firstCourse.id,
        },
      },
      update: {},
      create: {
        userId: student.id,
        courseId: firstCourse.id,
        status: "ACTIVE",
        progress: 35,
      },
    });
    console.log("Enrolled student in first course");
  }

  // Create a certificate
  const certificate = await prisma.certificate.create({
    data: {
      title: "Certificate of Completion - Web Development",
      certificateId: "SLMS-ABCD-1234-EFGH",
      userId: student.id,
      courseId: firstCourse!.id,
      status: "ACTIVE",
    },
  });
  console.log("Created certificate:", certificate.certificateId);

  console.log("\nSeed completed successfully!");
  console.log("\nDemo accounts:");
  console.log("  Admin:      admin@smartlms.com / admin123");
  console.log("  Instructor: instructor@smartlms.com / instructor123");
  console.log("  Student:    student@smartlms.com / student123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
