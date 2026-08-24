import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

const blogPosts = [
  {
    title: "10 Tips for Effective Online Learning in 2024",
    slug: "10-tips-effective-online-learning-2024",
    excerpt: "Discover proven strategies to maximize your learning outcomes in online courses.",
    content: "Online learning has transformed education, offering flexibility and accessibility to millions. However, succeeding in a virtual classroom requires discipline and strategy. Here are 10 tips to help you get the most out of your online learning experience: 1) Create a dedicated study space, 2) Set a consistent schedule, 3) Engage actively in discussions, 4) Take structured notes, 5) Break study sessions into chunks, 6) Use spaced repetition, 7) Apply what you learn immediately, 8) Connect with peers, 9) Seek feedback regularly, 10) Review and reflect weekly.",
    coverImage: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&h=450&fit=crop",
    author: "Dr. Sarah Johnson",
    category: "Learning Tips",
    tags: "online learning,study tips,productivity",
    published: true,
  },
  {
    title: "The Future of AI in Education: What to Expect",
    slug: "future-of-ai-in-education",
    excerpt: "How artificial intelligence is reshaping the way we teach and learn.",
    content: "Artificial Intelligence is revolutionizing education in ways we never imagined. From personalized learning paths to automated grading, AI is making education more efficient and accessible. Key trends include adaptive learning platforms that adjust to student pace, AI tutors available 24/7, intelligent content recommendations, and automated assessment tools. However, the human element remains crucial — AI augments rather than replaces educators. The future of education lies in the synergy between human expertise and AI capabilities.",
    coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=450&fit=crop",
    author: "SmartLMS Team",
    category: "Technology",
    tags: "AI,education,technology,future",
    published: true,
  },
  {
    title: "How to Build a Career in Tech: A Complete Guide",
    slug: "build-career-in-tech-complete-guide",
    excerpt: "A roadmap for aspiring tech professionals navigating the industry.",
    content: "Breaking into the tech industry can seem daunting, but with the right approach, it's entirely achievable. Start by identifying your area of interest — web development, data science, cybersecurity, or cloud computing. Build a strong foundation with online courses and certifications. Create a portfolio of projects to showcase your skills. Network actively through tech communities and conferences. Stay curious and keep learning — the tech landscape evolves rapidly. Consider mentorship from experienced professionals and contribute to open-source projects to gain real-world experience.",
    coverImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=450&fit=crop",
    author: "Prof. Michael Chen",
    category: "Career",
    tags: "career,tech,programming,guidance",
    published: true,
  },
];

const jobListings = [
  {
    title: "Software Engineer",
    department: "Engineering",
    location: "Remote",
    type: "FULL_TIME",
    description: "Join our engineering team to build and maintain the SmartLMS platform. You'll work with modern technologies like Next.js, TypeScript, and PostgreSQL to deliver high-quality educational experiences to thousands of users worldwide.",
    requirements: "3+ years of experience with TypeScript/JavaScript, proficiency in React and Node.js, experience with PostgreSQL or similar databases, familiarity with cloud services (AWS/GCP), strong problem-solving skills.",
    salary: "₦4,000,000 - ₦6,000,000",
    published: true,
  },
  {
    title: "Content Creator & Instructional Designer",
    department: "Content",
    location: "Hybrid - Lagos",
    type: "FULL_TIME",
    description: "Create engaging educational content for our platform. You'll collaborate with subject matter experts to develop courses, quizzes, and interactive learning materials that inspire and educate students across various disciplines.",
    requirements: "2+ years in content creation or instructional design, experience with e-learning tools (Articulate, Camtasia), strong writing and editing skills, knowledge of adult learning principles, portfolio of previous work.",
    salary: "₦2,500,000 - ₦3,500,000",
    published: true,
  },
  {
    title: "Product Manager",
    department: "Product",
    location: "Remote",
    type: "FULL_TIME",
    description: "Lead the product vision and strategy for SmartLMS. You'll work closely with engineering, design, and content teams to define product roadmaps, prioritize features, and ensure we deliver maximum value to our users.",
    requirements: "4+ years of product management experience, track record of launching successful digital products, strong analytical and data-driven decision making, excellent communication and stakeholder management skills, experience in ed-tech is a plus.",
    salary: "₦5,000,000 - ₦7,500,000",
    published: true,
  },
];

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let blogCount = 0;
    for (const bp of blogPosts) {
      const existing = await prisma.blogPost.findUnique({ where: { slug: bp.slug } });
      if (!existing) {
        await prisma.blogPost.create({ data: bp });
        blogCount++;
      }
    }

    let jobCount = 0;
    for (const jl of jobListings) {
      const existing = await prisma.jobListing.findFirst({ where: { title: jl.title } });
      if (!existing) {
        await prisma.jobListing.create({ data: jl });
        jobCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Seeded ${blogCount} blog posts and ${jobCount} job listings`,
      blogCount,
      jobCount,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Failed to seed data" },
      { status: 500 }
    );
  }
}
