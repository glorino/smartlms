import { NextResponse } from "next/server";
import { generateJSON } from "@/lib/ai";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

interface StudyGroupRequest {
  courseId: string;
}

interface GroupMember {
  userId: string;
  name: string;
  strengths: string[];
  role: string;
}

interface StudyGroup {
  name: string;
  members: GroupMember[];
  rationale: string;
}

interface GroupAssignment {
  groups: StudyGroup[];
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: StudyGroupRequest = await request.json();
    const { courseId } = body;

    if (!courseId) {
      return NextResponse.json(
        { error: "courseId is required" },
        { status: 400 }
      );
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true, title: true, category: true, level: true },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const enrollments = await prisma.enrollment.findMany({
      where: {
        courseId,
        status: "ACTIVE",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      take: 30,
    });

    if (enrollments.length < 2) {
      return NextResponse.json(
        { error: "Not enough students enrolled to form study groups" },
        { status: 400 }
      );
    }

    const studentProfiles = await Promise.all(
      enrollments.map(async (enrollment) => {
        const profile = await prisma.learningProfile.findUnique({
          where: {
            userId_courseId: {
              userId: enrollment.userId,
              courseId,
            },
          },
        });

        return {
          userId: enrollment.user.id,
          name: enrollment.user.name || enrollment.user.email,
          strengths: profile?.strengths || [],
          weaknesses: profile?.weaknesses || [],
          learningStyle: profile?.learningStyle || "visual",
          pacePreference: profile?.pacePreference || "moderate",
          engagementScore: profile?.engagementScore || 50,
          averageScore: profile?.averageScore || 0,
        };
      })
    );

    const studentData = studentProfiles
      .map(
        (s) =>
          `${s.name} (ID: ${s.userId}): Strengths: ${JSON.stringify(s.strengths)}, Learning Style: ${s.learningStyle}, Pace: ${s.pacePreference}, Engagement: ${s.engagementScore}%, Avg Score: ${s.averageScore}%`
      )
      .join("\n");

    const assignment = await generateJSON<GroupAssignment>(
      [
        {
          role: "system",
          content: `You are an AI study group coordinator for an online learning platform. Create optimal study groups based on student profiles.

Course: ${course.title} (${course.category}, ${course.level})

Respond with JSON only:
{
  "groups": [
    {
      "name": "creative group name",
      "members": [
        {
          "userId": "student id",
          "name": "student name",
          "strengths": ["strength1", "strength2"],
          "role": "role in group (e.g., Facilitator, Note-taker, Researcher, Presenter)"
        }
      ],
      "rationale": "explanation of why these students were grouped together"
    }
  ]
}

Grouping guidelines:
- Mix different learning styles for complementary strengths
- Balance group sizes (2-5 members per group)
- Consider complementary strengths and weaknesses
- Assign meaningful roles based on individual strengths
- Ensure diverse skill sets within each group
- Groups should help members improve weak areas through peer learning
- If a student has strong skills in an area where others are weak, assign them a mentoring role`,
        },
        {
          role: "user",
          content: `Create optimal study groups from these students:\n\n${studentData}`,
        },
      ]
    );

    return NextResponse.json({
      course: {
        id: course.id,
        title: course.title,
      },
      groups: assignment.groups || [],
      studentCount: enrollments.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Study groups error:", error);
    return NextResponse.json(
      { error: "Failed to generate study groups" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");

    if (!courseId) {
      return NextResponse.json(
        { error: "courseId query parameter is required" },
        { status: 400 }
      );
    }

    const enrollments = await prisma.enrollment.findMany({
      where: {
        courseId,
        status: "ACTIVE",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    const profiles = await prisma.learningProfile.findMany({
      where: {
        courseId,
      },
    });

    const profileMap = new Map(profiles.map((p) => [p.userId, p]));

    const students = enrollments.map((e) => ({
      userId: e.user.id,
      name: e.user.name || e.user.email,
      profile: profileMap.get(e.user.id) || null,
    }));

    return NextResponse.json({
      courseId,
      students,
      totalStudents: students.length,
    });
  } catch (error) {
    console.error("Study groups fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch study group data" },
      { status: 500 }
    );
  }
}
