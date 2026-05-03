"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import { Progress } from "@heroui/progress";
import Image from "next/image";

type Enrollment = {
  id: string;
  progress: number;
  enrolledAt: Date;
  course: {
    id: string;
    name: string;
    key: string;
    label: string;
    price: number;
    image: string | null;
    author: {
      name: string;
    } | null;
  };
};

const MyCoursesList = ({ enrollments }: { enrollments: Enrollment[] }) => {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  if (enrollments.length === 0) {
    return (
      <div className="rounded-4xl border border-slate-200 bg-white p-12 text-center shadow-sm dark:border-slate-700 dark:bg-slate-950">
        <div className="mx-auto max-w-md">
          <div className="mx-auto h-12 w-12 text-slate-400">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-50">
            No enrolled courses yet
          </h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Start your learning journey by browsing and enrolling in courses.
          </p>
          <Button as="a" href="/user/courses" color="primary" className="mt-6">
            Browse Courses
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
              Your Courses ({enrollments.length})
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Continue where you left off
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {enrollments.map((enrollment) => (
            <div
              key={enrollment.id}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-6 transition hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                      {enrollment.course.label}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {enrollment.course.key}
                    </span>
                  </div>

                  {enrollment.course.image && (
                    <div className="mb-4 aspect-video w-full max-w-sm overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
                      <Image
                        src={enrollment.course.image}
                        alt={enrollment.course.name}
                        width={400}
                        height={225}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}

                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
                    {enrollment.course.name}
                  </h3>

                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                    by {enrollment.course.author?.name ?? "Unknown"}
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-700 dark:text-slate-200">
                        Progress
                      </span>
                      <span className="font-medium text-slate-900 dark:text-slate-50">
                        {enrollment.progress.toFixed(0)}%
                      </span>
                    </div>
                    <Progress
                      value={enrollment.progress}
                      className="h-2"
                      color="primary"
                    />
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>
                      Enrolled {enrollment.enrolledAt.toLocaleDateString()}
                    </span>
                    <span>
                      {enrollment.progress === 100
                        ? "Completed"
                        : "In Progress"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    size="sm"
                    color="primary"
                    variant="solid"
                    onPress={() => setSelectedCourse(enrollment.course.id)}
                  >
                    {enrollment.progress === 0 ? "Start Learning" : "Continue"}
                  </Button>
                  {enrollment.progress > 0 && (
                    <Button
                      size="sm"
                      variant="light"
                      onPress={() => setSelectedCourse(enrollment.course.id)}
                    >
                      Review
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Course Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950">
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            {enrollments.length}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-300">
            Total Enrolled
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {enrollments.filter((e) => e.progress === 100).length}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-300">
            Completed
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {
              enrollments.filter((e) => e.progress > 0 && e.progress < 100)
                .length
            }
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-300">
            In Progress
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCoursesList;
