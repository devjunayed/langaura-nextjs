"use server";

import { prisma } from "@/lib/prisma";
import { stackServerApp } from "@/stack/server";

export const createCourse = async (data: any) => {
  try {
    const session = await stackServerApp.getUser();
    if (!session) throw new Error("Not authenticated");

    const user = await prisma.user.findUnique({
      where: { stackId: session.id },
    });

    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized: only admins can create courses");
    }

    const res = await prisma.course.create({
      data: {
        name: data.name,
        key: data.key,
        label: data.label,
        price: data.price || 0,
        image: data.image,
        authorId: session.id,
      },
    });
    return res;
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
  }
};

export const updateCourse = async (
  courseId: string,
  data: {
    name: string;
    key: string;
    label: string;
    price: number;
  },
) => {
  try {
    const session = await stackServerApp.getUser();
    if (!session) throw new Error("Not authenticated");

    const user = await prisma.user.findUnique({
      where: { stackId: session.id },
    });

    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized: only admins can update courses");
    }

    return await prisma.course.update({
      where: { id: courseId },
      data: {
        name: data.name,
        key: data.key,
        label: data.label,
        price: data.price,
      },
    });
  } catch (error) {
    console.log("Error updating course:", error);
    throw error;
  }
};

export const deleteCourse = async (courseId: string) => {
  try {
    const session = await stackServerApp.getUser();
    if (!session) throw new Error("Not authenticated");

    const user = await prisma.user.findUnique({
      where: { stackId: session.id },
    });

    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized: only admins can delete courses");
    }

    await prisma.$transaction(async (tx) => {
      const lessonIds = await tx.lesson.findMany({
        where: { courseId },
        select: { id: true },
      });

      const enrollmentIds = await tx.enrollment.findMany({
        where: { courseId },
        select: { id: true },
      });

      if (lessonIds.length > 0) {
        const subLessonIds = await tx.subLesson.findMany({
          where: {
            lessonId: { in: lessonIds.map((lesson) => lesson.id) },
          },
          select: { id: true },
        });

        await tx.lessonProgress.deleteMany({
          where: {
            lessonId: { in: lessonIds.map((lesson) => lesson.id) },
          },
        });

        if (subLessonIds.length > 0) {
          await tx.subLessonProgress.deleteMany({
            where: {
              subLessonId: {
                in: subLessonIds.map((subLesson) => subLesson.id),
              },
            },
          });
        }

        await tx.subLesson.deleteMany({
          where: {
            lessonId: { in: lessonIds.map((lesson) => lesson.id) },
          },
        });
      }

      if (enrollmentIds.length > 0) {
        await tx.lessonProgress.deleteMany({
          where: {
            enrollmentId: {
              in: enrollmentIds.map((enrollment) => enrollment.id),
            },
          },
        });
      }

      await tx.lesson.deleteMany({ where: { courseId } });
      await tx.enrollment.deleteMany({ where: { courseId } });
      await tx.course.delete({ where: { id: courseId } });
    });

    return { success: true };
  } catch (error) {
    console.log("Error deleting course:", error);
    throw error;
  }
};

export const getAllCourses = async () => {
  try {
    const session = await stackServerApp.getUser();
    if (!session) return [];

    const user = await prisma.user.findUnique({
      where: { stackId: session.id },
    });

    if (!user || user.role !== "admin") return [];

    const courses = await prisma.course.findMany({
      include: {
        author: {
          select: { name: true },
        },
        _count: {
          select: { enrollments: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return courses;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getAdminStats = async () => {
  try {
    const session = await stackServerApp.getUser();
    if (!session) return null;

    const user = await prisma.user.findUnique({
      where: { stackId: session.id },
    });

    if (!user || user.role !== "admin") return null;

    const [totalCourses, totalEnrollments, enrollmentsWithPrices, totalUsers] =
      await Promise.all([
        prisma.course.count(),
        prisma.enrollment.count(),
        prisma.enrollment.findMany({
          include: {
            course: {
              select: { price: true },
            },
          },
        }),
        prisma.user.count(),
      ]);

    const totalRevenue = enrollmentsWithPrices.reduce(
      (sum, enrollment) => sum + enrollment.course.price,
      0,
    );

    return {
      totalCourses,
      totalEnrollments,
      totalRevenue,
      totalUsers,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const createLesson = async (data: {
  courseId: string;
  title: string;
  content: string;
  order: number;
}) => {
  try {
    const session = await stackServerApp.getUser();
    if (!session) throw new Error("Not authenticated");

    const user = await prisma.user.findUnique({
      where: { stackId: session.id },
    });

    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized: only admins can create lessons");
    }

    const course = await prisma.course.findUnique({
      where: {
        id: data.courseId,
      },
    });

    if (!course) {
      throw new Error("Course not found");
    }

    const lesson = await prisma.lesson.create({
      data: {
        courseId: data.courseId,
        title: data.title,
        content: data.content,
        order: data.order,
      },
    });

    return lesson;
  } catch (error) {
    console.log("Error creating lesson:", error);
    throw error;
  }
};

export const getLessonsByCourse = async (courseId: string) => {
  try {
    const session = await stackServerApp.getUser();
    if (!session) return [];

    const user = await prisma.user.findUnique({
      where: { stackId: session.id },
    });

    if (!user || user.role !== "admin") return [];

    const lessons = await prisma.lesson.findMany({
      where: { courseId },
      include: {
        subLessons: {
          orderBy: { order: "asc" },
        },
      },
      orderBy: { order: "asc" },
    });

    return lessons;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const createSubLesson = async (data: {
  lessonId: string;
  title: string;
  content: string;
  order: number;
}) => {
  try {
    const session = await stackServerApp.getUser();
    if (!session) throw new Error("Not authenticated");

    const user = await prisma.user.findUnique({
      where: { stackId: session.id },
    });

    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized: only admins can create sub-lessons");
    }

    const lesson = await prisma.lesson.findUnique({
      where: { id: data.lessonId },
    });

    if (!lesson) {
      throw new Error("Lesson not found");
    }

    return await prisma.subLesson.create({
      data: {
        lessonId: data.lessonId,
        title: data.title,
        content: data.content,
        order: data.order,
      },
    });
  } catch (error) {
    console.log("Error creating sub-lesson:", error);
    throw error;
  }
};

export const updateLesson = async (
  lessonId: string,
  data: { title?: string; content?: string; order?: number },
) => {
  try {
    const session = await stackServerApp.getUser();
    if (!session) throw new Error("Not authenticated");

    const user = await prisma.user.findUnique({
      where: { stackId: session.id },
    });

    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized: only admins can update lessons");
    }

    const lesson = await prisma.lesson.findFirst({
      where: { id: lessonId },
    });

    if (!lesson) {
      throw new Error("Lesson not found");
    }

    const updatedLesson = await prisma.lesson.update({
      where: { id: lessonId },
      data,
    });

    return updatedLesson;
  } catch (error) {
    console.log("Error updating lesson:", error);
    throw error;
  }
};

export const deleteLesson = async (lessonId: string) => {
  try {
    const session = await stackServerApp.getUser();
    if (!session) throw new Error("Not authenticated");

    const user = await prisma.user.findUnique({
      where: { stackId: session.id },
    });

    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized: only admins can delete lessons");
    }

    const lesson = await prisma.lesson.findFirst({
      where: { id: lessonId },
    });

    if (!lesson) {
      throw new Error("Lesson not found");
    }

    await prisma.$transaction(async (tx) => {
      const subLessons = await tx.subLesson.findMany({
        where: { lessonId },
        select: { id: true },
      });

      if (subLessons.length > 0) {
        await tx.subLessonProgress.deleteMany({
          where: {
            subLessonId: {
              in: subLessons.map((subLesson) => subLesson.id),
            },
          },
        });
      }

      await tx.subLesson.deleteMany({
        where: { lessonId },
      });

      await tx.lessonProgress.deleteMany({
        where: { lessonId },
      });

      await tx.lesson.delete({
        where: { id: lessonId },
      });
    });

    return { success: true };
  } catch (error) {
    console.log("Error deleting lesson:", error);
    throw error;
  }
};
