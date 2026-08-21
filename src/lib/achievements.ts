import { PrismaClient } from "@prisma/client";

export type AchievementType = "first_lesson" | "quiz_master" | "course_complete" | "streak_7";

const ACHIEVEMENT_CONFIG: Record<
  AchievementType,
  { title: string; description: string; icon: string; points: number }
> = {
  first_lesson: {
    title: "First Steps",
    description: "Completed your first lesson",
    icon: "🚀",
    points: 10,
  },
  quiz_master: {
    title: "Quiz Master",
    description: "Scored 100% on a quiz",
    icon: "🏆",
    points: 50,
  },
  course_complete: {
    title: "Course Champion",
    description: "Completed an entire course",
    icon: "🎓",
    points: 100,
  },
  streak_7: {
    title: "7-Day Streak",
    description: "Maintained a 7-day learning streak",
    icon: "🔥",
    points: 25,
  },
};

export async function awardAchievement(
  userId: string,
  type: AchievementType,
  prisma: PrismaClient
) {
  const existing = await prisma.achievement.findFirst({
    where: { userId, type },
  });

  if (existing) return null;

  const config = ACHIEVEMENT_CONFIG[type];

  return prisma.achievement.create({
    data: {
      userId,
      title: config.title,
      description: config.description,
      icon: config.icon,
      points: config.points,
      type,
    },
  });
}

export async function checkAndAwardFirstLesson(
  userId: string,
  prisma: PrismaClient
) {
  const completedCount = await prisma.lessonProgress.count({
    where: { userId, completed: true },
  });

  if (completedCount <= 1) {
    return awardAchievement(userId, "first_lesson", prisma);
  }
  return null;
}

export async function checkAndAwardStreak7(
  userId: string,
  prisma: PrismaClient
) {
  const recentCompletions = await prisma.lessonProgress.findMany({
    where: { userId, completed: true, completedAt: { not: null } },
    orderBy: { completedAt: "desc" },
    select: { completedAt: true },
  });

  if (recentCompletions.length < 7) return null;

  const uniqueDays = new Set(
    recentCompletions.slice(0, 14).map((p) =>
      p.completedAt!.toISOString().split("T")[0]
    )
  );

  if (uniqueDays.size >= 7) {
    return awardAchievement(userId, "streak_7", prisma);
  }
  return null;
}
