"use client";

import { useMemo, useState } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { enrollInCourse } from "@/actions/enrollment.action";
import { toast } from "sonner";
import Image from "next/image";

type Course = {
  id: string;
  name: string;
  key: string;
  label: string;
  price: number;
  image?: string;
  author: { name: string } | null;
  createdAt: string;
  isEnrolled: boolean;
};

const CourseBrowser = ({ courses }: { courses: Course[] }) => {
  const [query, setQuery] = useState("");
  const [languageFilter, setLanguageFilter] = useState("");
  const [enrollingCourseId, setEnrollingCourseId] = useState<string | null>(
    null,
  );

  const handleEnroll = async (courseId: string) => {
    setEnrollingCourseId(courseId);
    try {
      await enrollInCourse(courseId);
      toast.success("Successfully enrolled in the course!");
      // Refresh the page to update enrollment status
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message || "Failed to enroll in course");
    } finally {
      setEnrollingCourseId(null);
    }
  };

  const languageOptions = useMemo(
    () => Array.from(new Set(courses.map((course) => course.label))).sort(),
    [courses],
  );

  const filteredCourses = useMemo(
    () =>
      courses.filter((course) => {
        const matchesQuery =
          query.length === 0 ||
          course.name.toLowerCase().includes(query.toLowerCase()) ||
          course.label.toLowerCase().includes(query.toLowerCase()) ||
          course.author?.name.toLowerCase().includes(query.toLowerCase());

        const matchesLanguage =
          languageFilter.length === 0 || course.label === languageFilter;

        return matchesQuery && matchesLanguage;
      }),
    [courses, query, languageFilter],
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-[1fr_auto] items-end">
        <div className="space-y-2">
          <label
            className="text-sm font-medium text-slate-700 dark:text-slate-200"
            htmlFor="course-search"
          >
            Search courses
          </label>
          <Input
            id="course-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by course name, language, or author"
            className="min-w-0"
          />
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-medium text-slate-700 dark:text-slate-200"
            htmlFor="language-filter"
          >
            Filter by language
          </label>
          <select
            id="language-filter"
            value={languageFilter}
            onChange={(event) => setLanguageFilter(event.target.value)}
            className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            <option value="">All languages</option>
            {languageOptions.map((language) => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-4xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-950">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Showing
            </p>
            <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
              {filteredCourses.length}
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            <span className="font-medium">Sorted by</span> newest first
          </div>
        </div>

        {filteredCourses.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
            No courses found. Try a different search term or language filter.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredCourses.map((course) => (
              <article
                key={course.id}
                className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                    {course.label}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {course.key}
                  </span>
                </div>
                {course.image && (
                  <div className="mt-4 aspect-video w-full overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
                    <Image
                      src={course.image}
                      alt={course.name}
                      width={400}
                      height={225}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <h2 className="mt-5 text-xl font-semibold text-slate-900 dark:text-slate-50">
                  {course.name}
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  A curated course for {course.label} learners, created by{" "}
                  {course.author?.name ?? "Unknown"}.
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                    {course.price === 0 ? (
                      <span className="text-green-600 dark:text-green-400">
                        Free
                      </span>
                    ) : (
                      <span>${course.price.toFixed(2)}</span>
                    )}
                  </div>
                  {course.isEnrolled ? (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                      Enrolled
                    </span>
                  ) : (
                    <Button
                      size="sm"
                      color="primary"
                      variant="solid"
                      onPress={() => handleEnroll(course.id)}
                      isLoading={enrollingCourseId === course.id}
                      disabled={enrollingCourseId === course.id}
                    >
                      {course.price === 0 ? "Enroll Free" : "Enroll"}
                    </Button>
                  )}
                </div>
                <div className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                  Added {new Date(course.createdAt).toLocaleDateString()}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseBrowser;
