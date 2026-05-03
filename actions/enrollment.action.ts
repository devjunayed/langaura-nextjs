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

    return enrollments;
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
    return [];
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
