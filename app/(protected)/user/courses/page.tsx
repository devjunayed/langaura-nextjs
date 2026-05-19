import { prisma } from "@/lib/prisma";
import { stackServerApp } from "@/stack/server";
import CourseBrowser from "./CourseBrowser";

const CoursesPage = async () => {
  const session = await stackServerApp.getUser();

  const courses = await prisma.course.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
  });

  // Get user's enrollments if logged in
  let userEnrollments: { courseId: string; progress: number }[] = [];
  if (session) {
    userEnrollments = await prisma.enrollment.findMany({
      where: { userId: session.id },
      select: { courseId: true, progress: true },
    });
  }

  const enrolledCourseIds = new Set(userEnrollments.map((e) => e.courseId));

  return (
    <section className="container mx-auto max-w-7xl py-10 px-4">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.4em] text-primary font-semibold">
          Explore courses
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
          Find the right course for your learning path.
        </h1>
        <p className="max-w-2xl mt-4 text-base text-slate-600 dark:text-slate-300">
          Browse all available courses, filter by name or language, and discover
          new learning opportunities.
        </p>
      </div>

      <CourseBrowser
        courses={courses.map((course) => ({
          id: course.id,
          name: course.name,
          key: course.key,
          label: course.label,
          price: course.price,
          image: course.image,
          author: course.author ? { name: course.author.name } : null,
          createdAt: course.createdAt.toISOString(),
          isEnrolled: enrolledCourseIds.has(course.id),
        }))}
      />
    </section>
  );
};

export default CoursesPage;
