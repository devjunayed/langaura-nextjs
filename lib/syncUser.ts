import { stackServerApp } from "@/stack/server";
import { prisma } from "./prisma";

export async function syncUser() {
  const session = await stackServerApp.getUser();

  if (!session) return null;

  const { id: stackId, displayName: name, primaryEmail: email }: any = session;

  let user = await prisma.user.findUnique({
    where: { stackId },
  });

  if (!user) {
    user = await prisma.user.create({
      data: { stackId, name, email },
    });
  } else {
    user = await prisma.user.update({
      where: { stackId },
      data: { name, email },
    });
  }
}
