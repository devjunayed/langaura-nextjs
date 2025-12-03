"use server";

import { prisma } from "@/lib/prisma";
import { stackServerApp } from "@/stack/server";

export const createCourse = async (data: any) => {
  try {
    const user = await stackServerApp.getUser();
    console.log(user)
    if (!user) throw new Error("Not authenticated");
    const res = await prisma.course.create({
      data: {
        name: data.name,
        key: data.key,
        label: data.label,
        authorId: user.id,
      },
    });
    console.log(res);
  } catch (error) {
    console.log(error);
  }
};
