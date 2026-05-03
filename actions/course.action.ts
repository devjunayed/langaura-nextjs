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

    // Verify the course belongs to the admin
    const course = await prisma.course.findFirst({
      where: {
        id: data.courseId,
        authorId: session.id,
      },
    });

    if (!course) {
      throw new Error("Course not found or unauthorized");
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
      orderBy: { order: "asc" },
    });

    return lessons;
  } catch (error) {
    console.log(error);
    return [];
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

    // Verify the lesson belongs to the admin's course
    const lesson = await prisma.lesson.findFirst({
      where: { id: lessonId },
      include: { course: true },
    });

    if (!lesson || lesson.course.authorId !== session.id) {
      throw new Error("Lesson not found or unauthorized");
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

    // Verify the lesson belongs to the admin's course
    const lesson = await prisma.lesson.findFirst({
      where: { id: lessonId },
      include: { course: true },
    });

    if (!lesson || lesson.course.authorId !== session.id) {
      throw new Error("Lesson not found or unauthorized");
    }

    await prisma.lesson.delete({
      where: { id: lessonId },
    });

    return { success: true };
  } catch (error) {
    console.log("Error deleting lesson:", error);
    throw error;
  }
};
