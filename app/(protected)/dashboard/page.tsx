import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { stackServerApp } from "@/stack/server";
import EnrolledCourses from "../admin/dashboard/components/EnrolledCourses/EnrolledCourses";
import CompletedCourses from "../admin/dashboard/components/CompletedCourses/CompletedCourses";

const DashboardPage = async () => {
  const session = await stackServerApp.getUser({ or: "redirect" });

  const user = await prisma.user.findUnique({
    where: { stackId: session.id },
  });

  if (!user) {
    return redirect("/");
  }

  if (user.role === "admin") {
    return redirect("/admin/dashboard");
  }

  // Regular users go to their courses page
  return redirect("/user/my-courses");
};

export default DashboardPage;
