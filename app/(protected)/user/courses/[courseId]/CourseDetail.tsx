"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Progress } from "@heroui/progress";
import { toast } from "sonner";
import { enrollInCourse } from "@/actions/enrollment.action";
import { useState } from "react";

type Lesson = {
  id: string;
  title: string;
  order: number;
};

type CourseDetailData = {
  id: string;
  name: string;
  key: string;
  label: string;
  price: number;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  author: { name: string } | null;
  lessons: Lesson[];
  lessonCount: number;
  enrollmentCount: number;
  enrollment: {
    id: string;
    progress: number;
    enrolledAt: string;
  } | null;
};

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Failed to enroll in course";

const CourseDetail = ({ course }: { course: CourseDetailData }) => {
  const router = useRouter();
  const [isEnrolling, setIsEnrolling] = useState(false);

  const handleEnroll = async () => {
    setIsEnrolling(true);
    try {
      await enrollInCourse(course.id);
      toast.success("Successfully enrolled in the course!");
      router.refresh();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsEnrolling(false);
    }
  };

  const isEnrolled = Boolean(course.enrollment);
  const progress = course.enrollment?.progress ?? 0;
  const learningButtonLabel = progress > 0 ? "Continue" : "Start Learning";

  const handleLearningAction = () => {
    router.push(`/user/courses/${course.id}/learn`);
  };

  return (
    <section className="py-10">
      <Button as={Link} href="/user/courses" variant="light" className="mb-6">
        Back to courses
      </Button>

      <div className="grid gap-8 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="space-y-6">
          <div className="overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-950">
            {course.image && (
              <div className="aspect-[16/7] w-full bg-slate-100 dark:bg-slate-800">
                <Image
                  src={course.image}
                  alt={course.name}
                  width={1100}
                  height={480}
                  priority
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  {course.label}
                </span>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  Course key: {course.key}
                </span>
              </div>

              <h1 className="mt-5 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
                {course.name}
              </h1>

              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300">
                A focused {course.label} course created by{" "}
                {course.author?.name ?? "Unknown"}. Review the lesson plan,
                enrollment status, and course details before you begin.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Lessons
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-50">
                    {course.lessonCount}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Learners
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-50">
                    {course.enrollmentCount}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Price
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-50">
                    {course.price === 0
                      ? "Free"
                      : `$${course.price.toFixed(2)}`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            id="course-curriculum"
            className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950 sm:p-8"
          >
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-primary">
                  Curriculum
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-50">
                  Course lessons
                </h2>
              </div>
            </div>

            {course.lessons.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                No lessons have been added to this course yet.
              </div>
            ) : (
              <div className="space-y-4">
                {course.lessonCount > course.lessons.length && (
                  <p className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                    Showing the first {course.lessons.length} of{" "}
                    {course.lessonCount} lessons. Open the learning view to
                    browse the full curriculum efficiently.
                  </p>
                )}

                <div className="space-y-3">
                  {course.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900"
                    >
                      <div className="flex items-start gap-4">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                          {lesson.order}
                        </span>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-slate-900 dark:text-slate-50">
                            {lesson.title}
                          </h3>
                          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                            Lesson {lesson.order} in this course.
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-5">
          <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
              Enrollment
            </h2>

            {isEnrolled ? (
              <div className="mt-5 space-y-4">
                <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                  Enrolled
                </span>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-700 dark:text-slate-200">
                      Progress
                    </span>
                    <span className="font-medium text-slate-900 dark:text-slate-50">
                      {progress.toFixed(0)}%
                    </span>
                  </div>
                  <Progress value={progress} color="primary" className="h-2" />
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Enrolled{" "}
                  {new Date(course.enrollment!.enrolledAt).toLocaleDateString()}
                </p>
                <Button
                  color="primary"
                  fullWidth
                  onPress={handleLearningAction}
                >
                  {learningButtonLabel}
                </Button>
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                  Enroll to add this course to your learning dashboard.
                </p>
                <Button
                  color="primary"
                  fullWidth
                  onPress={handleEnroll}
                  isLoading={isEnrolling}
                  disabled={isEnrolling}
                >
                  {course.price === 0 ? "Enroll Free" : "Enroll"}
                </Button>
              </div>
            )}
          </div>

          <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
              Course details
            </h2>
            <dl className="mt-5 space-y-4 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500 dark:text-slate-400">Author</dt>
                <dd className="font-medium text-slate-900 dark:text-slate-50">
                  {course.author?.name ?? "Unknown"}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500 dark:text-slate-400">Language</dt>
                <dd className="font-medium text-slate-900 dark:text-slate-50">
                  {course.label}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500 dark:text-slate-400">Added</dt>
                <dd className="font-medium text-slate-900 dark:text-slate-50">
                  {new Date(course.createdAt).toLocaleDateString()}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500 dark:text-slate-400">Updated</dt>
                <dd className="font-medium text-slate-900 dark:text-slate-50">
                  {new Date(course.updatedAt).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default CourseDetail;
