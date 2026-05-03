import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { stackServerApp } from "@/stack/server";
import React, { ReactNode } from "react";

const AdminLayout = async ({ children }: { children: ReactNode }) => {
  const session = await stackServerApp.getUser({ or: "redirect" });

  const user = await prisma.user.findUnique({
    where: { stackId: session.id },
  });

  if (!user || user.role !== "admin") {
    return redirect("/");
  }

  return <>{children}</>;
};

export default AdminLayout;
