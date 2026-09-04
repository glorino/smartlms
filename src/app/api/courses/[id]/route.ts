import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        instructor: {
          select: { id: true, name: true, email: true, avatar: true, bio: true },
        },
        sections: {
          include: {
            lessons: {
              orderBy: { order: "asc" },
              include: {
                quizzes: {
                  include: {
                    questions: {
                      include: { answers: { orderBy: { order: "asc" } } },
                      orderBy: { order: "asc" },
                    },
                  },
                },
                assignments: true,
              },
            },
          },
          orderBy: { order: "asc" },
        },
        quizzes: {
          where: { isPublished: true },
          select: { id: true, title: true, description: true, passingScore: true, lessonId: true },
        },
        reviews: {
          include: {
            user: { select: { id: true, name: true, avatar: true } },
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        _count: { select: { enrollments: true, reviews: true } },
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json({ course });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const course = await prisma.course.findUnique({ where: { id } });
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    if (course.instructorId !== session.user.id && (session.user as any).role !== "ADMIN") {
      return NextResponse.json(
        { error: "You can only update your own courses" },
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
      status,
      thumbnail,
      tags,
      sections,
    } = body;

    const userId = session.user!.id as string;

    let slug = course.slug;
    if (title && title !== course.title) {
      const newSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      const existingSlug = await prisma.course.findFirst({
        where: { slug: newSlug, id: { not: id } },
      });
      slug = existingSlug ? `${newSlug}-${Date.now()}` : newSlug;
    }

    const updatedCourse = await prisma.$transaction(async (tx) => {
      const updated = await tx.course.update({
        where: { id },
        data: {
          ...(title && { title, slug }),
          ...(description !== undefined && { description }),
          ...(shortDescription !== undefined && { shortDescription }),
          ...(price !== undefined && { price: Number(price) }),
          ...(category !== undefined && { category }),
          ...(level && { level }),
          ...(language && { language }),
          ...(status && { status }),
          ...(thumbnail !== undefined && { thumbnail }),
          ...(tags && { tags }),
        },
      });

      if (Array.isArray(sections)) {
        const existingSections = await tx.courseSection.findMany({
          where: { courseId: id },
          include: { lessons: true },
        });

        const existingSectionIds = new Set(existingSections.map((s) => s.id));
        const incomingSectionIds = new Set(
          sections.filter((s: any) => s.id).map((s: any) => s.id)
        );

        for (const sData of sections) {
          const sectionId = sData.id || null;

          let sectionRecord;
          if (sectionId && existingSectionIds.has(sectionId)) {
            sectionRecord = await tx.courseSection.update({
              where: { id: sectionId },
              data: {
                title: sData.title,
                description: sData.description || null,
                order: sData.order ?? 0,
              },
            });
          } else {
            sectionRecord = await tx.courseSection.create({
              data: {
                title: sData.title,
                description: sData.description || null,
                order: sData.order ?? 0,
                courseId: id,
              },
            });
          }

          if (Array.isArray(sData.lessons)) {
            const existingLessons = await tx.lesson.findMany({
              where: { sectionId: sectionRecord.id },
            });
            const existingLessonIds = new Set(existingLessons.map((l) => l.id));

            for (const lData of sData.lessons) {
              const lessonId = lData.id || null;

              let lessonRecord;
              if (lessonId && existingLessonIds.has(lessonId)) {
                lessonRecord = await tx.lesson.update({
                  where: { id: lessonId },
                  data: {
                    title: lData.title,
                    type: lData.type || "TEXT",
                    content: lData.content || null,
                    videoUrl: lData.videoUrl || null,
                    videoType: lData.videoType || null,
                    duration: lData.duration || null,
                    order: lData.order ?? 0,
                    isPreview: lData.isPreview || false,
                  },
                });

                await tx.quiz.deleteMany({ where: { lessonId: lessonRecord.id } });
                await tx.assignment.deleteMany({ where: { lessonId: lessonRecord.id } });
              } else {
                lessonRecord = await tx.lesson.create({
                  data: {
                    title: lData.title,
                    type: lData.type || "TEXT",
                    content: lData.content || null,
                    videoUrl: lData.videoUrl || null,
                    videoType: lData.videoType || null,
                    duration: lData.duration || null,
                    order: lData.order ?? 0,
                    isPreview: lData.isPreview || false,
                    sectionId: sectionRecord.id,
                    courseId: id,
                  },
                });
              }

              if (lData.type === "QUIZ" && lData.quiz) {
                const quiz = await tx.quiz.create({
                  data: {
                    title: lData.quiz.title,
                    description: lData.quiz.description,
                    timeLimit: lData.quiz.timeLimit,
                    passingScore: lData.quiz.passingScore || 60,
                    maxAttempts: lData.quiz.maxAttempts,
                    shuffleQuestions: lData.quiz.shuffleQuestions ?? true,
                    showCorrectAnswers: lData.quiz.showCorrectAnswers ?? true,
                    courseId: id,
                    lessonId: lessonRecord.id,
                  },
                });

                if (lData.quiz.questions && Array.isArray(lData.quiz.questions)) {
                  for (let k = 0; k < lData.quiz.questions.length; k++) {
                    const qd = lData.quiz.questions[k];
                    const question = await tx.question.create({
                      data: {
                        content: qd.content || qd.text || "",
                        type: qd.type || "SINGLE_CHOICE",
                        points: qd.points || 1,
                        explanation: qd.explanation,
                        order: k,
                        quizId: quiz.id,
                      },
                    });

                    const answerList = qd.answers || qd.options || [];
                    if (Array.isArray(answerList) && answerList.length > 0) {
                      await tx.answer.createMany({
                        data: answerList.map((a: any, idx: number) => ({
                          content: a.content || a.text || "",
                          isCorrect: a.isCorrect || false,
                          order: a.order ?? idx,
                          questionId: question.id,
                        })),
                      });
                    }
                  }
                }
              }

              if (lData.type === "ASSIGNMENT" && lData.assignment) {
                await tx.assignment.create({
                  data: {
                    title: lData.assignment.title,
                    description: lData.assignment.description,
                    maxScore: lData.assignment.maxScore || 100,
                    status: "PENDING",
                    userId: userId,
                    lessonId: lessonRecord.id,
                  },
                });
              }
            }

            const incomingLessonIds = new Set(
              sData.lessons.filter((l: any) => l.id).map((l: any) => l.id)
            );
            for (const existing of existingLessons) {
              if (!incomingLessonIds.has(existing.id)) {
                await tx.lesson.delete({ where: { id: existing.id } });
              }
            }
          }
        }

        for (const existing of existingSections) {
          if (!incomingSectionIds.has(existing.id)) {
            await tx.courseSection.delete({ where: { id: existing.id } });
          }
        }
      }

      return updated;
    });

    const fullCourse = await prisma.course.findUnique({
      where: { id },
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
      },
    });

    return NextResponse.json({ course: fullCourse });
  } catch (error) {
    console.error("Course update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const course = await prisma.course.findUnique({ where: { id } });
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    if (course.instructorId !== session.user.id && (session.user as any).role !== "ADMIN") {
      return NextResponse.json(
        { error: "You can only delete your own courses" },
        { status: 403 }
      );
    }

    await prisma.course.delete({ where: { id } });

    return NextResponse.json({ message: "Course deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
