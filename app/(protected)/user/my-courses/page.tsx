import { getUserEnrollments } from "@/actions/enrollment.action";
import { stackServerApp } from "@/stack/server";
import MyCoursesList from "./MyCoursesList";

const MyCoursesPage = async () => {
  const session = await stackServerApp.getUser({ or: "redirect" });

  const enrollments = await getUserEnrollments();

  return (
    <section className="container mx-auto max-w-7xl py-10 px-4">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.4em] text-primary font-semibold">
          My Learning
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
          My Enrolled Courses
        </h1>
        <p className="max-w-2xl mt-4 text-base text-slate-600 dark:text-slate-300">
          Track your progress and continue learning from your enrolled courses.
        </p>
      </div>

      <MyCoursesList enrollments={enrollments} />
    </section>
  );
};

export default MyCoursesPage;
