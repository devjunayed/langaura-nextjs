"use server";

import { prisma } from "@/lib/prisma";
import { stackServerApp } from "@/stack/server";

export const createCourse = async (data: any) => {
  try {
    const session = await stackServerApp.getUser();
    if (!session) throw new Error("Not authenticated");
    const res = await prisma.course.create({
      data: {
        name: data.name,
        key: data.key,
        label: data.label,
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
