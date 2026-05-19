"use server";

import { prisma } from "@/lib/prisma";
import { stackServerApp } from "@/stack/server";

export const enrollInCourse = async (courseId: string) => {
  try {
    const session = await stackServerApp.getUser();
    if (!session) throw new Error("Not authenticated");

    // Check if user is already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.id,
          courseId,
        },
      },
    });

    if (existingEnrollment) {
      throw new Error("Already enrolled in this course");
    }

    // Create enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: session.id,
        courseId,
      },
    });

    return enrollment;
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
    throw error;
  }
};

export const getUserEnrollments = async () => {
  try {
    const session = await stackServerApp.getUser();
    if (!session) return [];

    const enrollments = await prisma.enrollment.findMany({
      where: { userId: session.id },
      include: {
        course: {
          include: {
            author: {
              select: { name: true },
            },
          },
        },
      },
    });

    return await Promise.all(
      enrollments.map(async (enrollment) => {
        const [
          totalLessons,
          totalSubLessons,
          completedLessons,
          completedSubLessons,
        ] = await Promise.all([
          prisma.lesson.count({
            where: { courseId: enrollment.courseId },
          }),
          prisma.subLesson.count({
            where: {
              lesson: {
                courseId: enrollment.courseId,
              },
            },
          }),
          prisma.lessonProgress.count({
            where: {
              enrollmentId: enrollment.id,
              completed: true,
            },
          }),
          prisma.subLessonProgress.count({
            where: {
              enrollmentId: enrollment.id,
              completed: true,
            },
          }),
        ]);

        const totalItems = totalLessons + totalSubLessons;
        const completedItems = completedLessons + completedSubLessons;

        return {
          ...enrollment,
          progress:
            totalItems === 0
              ? 0
              : Math.round((completedItems / totalItems) * 100),
        };
      }),
    );
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
    return [];
  }
};

export const markLessonComplete = async (
  courseId: string,
  lessonId: string,
) => {
  try {
    const session = await stackServerApp.getUser();
    if (!session) throw new Error("Not authenticated");

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.id,
          courseId,
        },
      },
    });

    if (!enrollment) {
      throw new Error("You must be enrolled in this course");
    }

    const lesson = await prisma.lesson.findFirst({
      where: {
        id: lessonId,
        courseId,
      },
    });

    if (!lesson) {
      throw new Error("Lesson not found");
    }

    await prisma.lessonProgress.upsert({
      where: {
        enrollmentId_lessonId: {
          enrollmentId: enrollment.id,
          lessonId,
        },
      },
      update: {
        completed: true,
        completedAt: new Date(),
      },
      create: {
        enrollmentId: enrollment.id,
        lessonId,
        completed: true,
        completedAt: new Date(),
      },
    });

    const [
      totalLessons,
      totalSubLessons,
      completedLessons,
      completedSubLessons,
    ] = await Promise.all([
      prisma.lesson.count({
        where: { courseId },
      }),
      prisma.subLesson.count({
        where: {
          lesson: {
            courseId,
          },
        },
      }),
      prisma.lessonProgress.count({
        where: {
          enrollmentId: enrollment.id,
          completed: true,
          lesson: {
            courseId,
          },
        },
      }),
      prisma.subLessonProgress.count({
        where: {
          enrollmentId: enrollment.id,
          completed: true,
          subLesson: {
            lesson: {
              courseId,
            },
          },
        },
      }),
    ]);

    const totalItems = totalLessons + totalSubLessons;
    const completedItems = completedLessons + completedSubLessons;
    const progress =
      totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100);

    await prisma.enrollment.update({
      where: { id: enrollment.id },
      data: { progress },
    });

    return { progress, completedItems, totalItems };
  } catch (error) {
    console.log("Error marking lesson complete:", error);
    throw error;
  }
};

export const markSubLessonComplete = async (
  courseId: string,
  subLessonId: string,
) => {
  try {
    const session = await stackServerApp.getUser();
    if (!session) throw new Error("Not authenticated");

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.id,
          courseId,
        },
      },
    });

    if (!enrollment) {
      throw new Error("You must be enrolled in this course");
    }

    const subLesson = await prisma.subLesson.findFirst({
      where: {
        id: subLessonId,
        lesson: {
          courseId,
        },
      },
    });

    if (!subLesson) {
      throw new Error("Sub-lesson not found");
    }

    await prisma.subLessonProgress.upsert({
      where: {
        enrollmentId_subLessonId: {
          enrollmentId: enrollment.id,
          subLessonId,
        },
      },
      update: {
        completed: true,
        completedAt: new Date(),
      },
      create: {
        enrollmentId: enrollment.id,
        subLessonId,
        completed: true,
        completedAt: new Date(),
      },
    });

    const [
      totalLessons,
      totalSubLessons,
      completedLessons,
      completedSubLessons,
    ] = await Promise.all([
      prisma.lesson.count({
        where: { courseId },
      }),
      prisma.subLesson.count({
        where: {
          lesson: {
            courseId,
          },
        },
      }),
      prisma.lessonProgress.count({
        where: {
          enrollmentId: enrollment.id,
          completed: true,
          lesson: {
            courseId,
          },
        },
      }),
      prisma.subLessonProgress.count({
        where: {
          enrollmentId: enrollment.id,
          completed: true,
          subLesson: {
            lesson: {
              courseId,
            },
          },
        },
      }),
    ]);

    const totalItems = totalLessons + totalSubLessons;
    const completedItems = completedLessons + completedSubLessons;
    const progress =
      totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100);

    await prisma.enrollment.update({
      where: { id: enrollment.id },
      data: { progress },
    });

    return { progress, completedItems, totalItems };
  } catch (error) {
    console.log("Error marking sub-lesson complete:", error);
    throw error;
  }
};

export const getAllEnrollments = async () => {
  try {
    const session = await stackServerApp.getUser();
    if (!session) return [];

    const user = await prisma.user.findUnique({
      where: { stackId: session.id },
    });

    if (!user || user.role !== "admin") return [];

    const enrollments = await prisma.enrollment.findMany({
      include: {
        course: {
          select: {
            id: true,
            name: true,
            key: true,
            label: true,
            price: true,
            image: true,
            author: {
              select: { name: true },
            },
          },
        },
        user: {
          select: { name: true, email: true },
        },
      },
      orderBy: { enrolledAt: "desc" },
    });

    return enrollments;
  } catch (error) {
    console.log(error);
    return [];
  }
};
