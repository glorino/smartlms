import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const level = searchParams.get("level") || "";
    const price = searchParams.get("price") || "";
    const rating = searchParams.get("rating") || "";
    const sort = searchParams.get("sort") || "newest";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const where: any = {
      status: "PUBLISHED",
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (level) {
      where.level = level;
    }

    if (price === "free") {
      where.price = 0;
    } else if (price === "paid") {
      where.price = { gt: 0 };
    }

    if (rating) {
      where.rating = { gte: parseFloat(rating) };
    }

    let orderBy: any;
    switch (sort) {
      case "oldest":
        orderBy = { createdAt: "asc" };
        break;
      case "price-low":
        orderBy = { price: "asc" };
        break;
      case "price-high":
        orderBy = { price: "desc" };
        break;
      case "rating":
        orderBy = { rating: "desc" };
        break;
      case "popular":
        orderBy = { totalStudents: "desc" };
        break;
      case "newest":
      default:
        orderBy = { createdAt: "desc" };
        break;
    }

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        include: {
          instructor: {
            select: { id: true, name: true, email: true, avatar: true },
          },
          _count: { select: { enrollments: true, reviews: true } },
        },
        skip,
        take: limit,
        orderBy,
      }),
      prisma.course.count({ where }),
    ]);

    return NextResponse.json({
      courses,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const userRole = (session.user as any).role;
    if (userRole !== "INSTRUCTOR" && userRole !== "ADMIN") {
      return NextResponse.json(
        { error: "Only instructors can create courses" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      shortDescription,
      price,
      category,
      level,
      language,
      thumbnail,
      tags,
      sections,
    } = body;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const existingSlug = await prisma.course.findUnique({ where: { slug } });
    const finalSlug = existingSlug ? `${slug}-${Date.now()}` : slug;

    const course = await prisma.$transaction(async (tx) => {
      const newCourse = await tx.course.create({
        data: {
          title,
          slug: finalSlug,
          description,
          shortDescription,
          price: price || 0,
          category,
          level: level || "BEGINNER",
          language: language || "en",
          thumbnail,
          tags: tags || [],
          instructorId: userId,
          status: "DRAFT",
        },
      });

      if (sections && Array.isArray(sections) && sections.length > 0) {
        await tx.courseSection.createMany({
          data: sections.map((s: any, i: number) => ({
            title: s.title,
            description: s.description,
            order: i,
            courseId: newCourse.id,
          })),
        });

        const createdSections = await tx.courseSection.findMany({
          where: { courseId: newCourse.id },
          orderBy: { order: "asc" },
        });

        for (let i = 0; i < sections.length; i++) {
          const sectionData = sections[i];
          const section = createdSections[i];

          if (!sectionData.lessons || !Array.isArray(sectionData.lessons) || sectionData.lessons.length === 0) {
            continue;
          }

          await tx.lesson.createMany({
            data: sectionData.lessons.map((l: any, j: number) => ({
              title: l.title,
              content: l.content,
              type: l.type || "TEXT",
              videoUrl: l.videoUrl,
              pdfUrl: l.pdfUrl,
              duration: l.duration,
              order: l.order ?? j,
              isPreview: l.isPreview || false,
              sectionId: section.id,
              courseId: newCourse.id,
            })),
          });

          const createdLessons = await tx.lesson.findMany({
            where: { sectionId: section.id },
            orderBy: { order: "asc" },
          });

          for (let j = 0; j < sectionData.lessons.length; j++) {
            const lessonData = sectionData.lessons[j];
            const lesson = createdLessons[j];

            if (lessonData.type === "QUIZ" && lessonData.quiz) {
              const quiz = await tx.quiz.create({
                data: {
                  title: lessonData.quiz.title,
                  description: lessonData.quiz.description,
                  timeLimit: lessonData.quiz.timeLimit,
                  passingScore: lessonData.quiz.passingScore || 60,
                  maxAttempts: lessonData.quiz.maxAttempts,
                  shuffleQuestions: lessonData.quiz.shuffleQuestions ?? true,
                  showCorrectAnswers: lessonData.quiz.showCorrectAnswers ?? true,
                  courseId: newCourse.id,
                  lessonId: lesson.id,
                },
              });

              if (lessonData.quiz.questions && Array.isArray(lessonData.quiz.questions)) {
                for (let k = 0; k < lessonData.quiz.questions.length; k++) {
                  const questionData = lessonData.quiz.questions[k];

                  const question = await tx.question.create({
                    data: {
                      content: questionData.content,
                      type: questionData.type || "SINGLE_CHOICE",
                      points: questionData.points || 1,
                      explanation: questionData.explanation,
                      order: k,
                      quizId: quiz.id,
                    },
                  });

                  if (questionData.answers && Array.isArray(questionData.answers)) {
                    await tx.answer.createMany({
                      data: questionData.answers.map((a: any) => ({
                        content: a.content,
                        isCorrect: a.isCorrect || false,
                        order: a.order,
                        questionId: question.id,
                      })),
                    });
                  }
                }
              }
            }

            if (lessonData.type === "ASSIGNMENT" && lessonData.assignment) {
              await tx.assignment.create({
                data: {
                  title: lessonData.assignment.title,
                  description: lessonData.assignment.description,
                  maxScore: lessonData.assignment.maxScore || 100,
                  status: "PENDING",
                  userId,
                  lessonId: lesson.id,
                },
              });
            }
          }
        }
      }

      return newCourse;
    });

    const fullCourse = await prisma.course.findUnique({
      where: { id: course.id },
      include: {
        instructor: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        sections: {
          include: {
            lessons: true,
          },
          orderBy: { order: "asc" },
        },
        quizzes: {
          include: {
            questions: {
              include: {
                answers: {
                  orderBy: { order: "asc" },
                },
              },
              orderBy: { order: "asc" },
            },
          },
        },
      },
    });

    return NextResponse.json({ course: fullCourse }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
