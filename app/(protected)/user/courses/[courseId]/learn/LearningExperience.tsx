"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Button } from "@heroui/button";
import { Progress } from "@heroui/progress";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  CornerDownRight,
  Menu,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  markLessonComplete,
  markSubLessonComplete,
} from "@/actions/enrollment.action";

type SidebarSubLesson = {
  id: string;
  title: string;
  order: number;
};

type SidebarLesson = {
  id: string;
  title: string;
  order: number;
  subLessons: SidebarSubLesson[];
};

type ActiveItem =
  | {
      id: string;
      type: "lesson";
      title: string;
      content: string;
      order: number;
    }
  | {
      id: string;
      type: "subLesson";
      lessonId: string;
      title: string;
      content: string;
      order: number;
      parentTitle: string;
      parentOrder: number;
    };

type Course = {
  id: string;
  name: string;
  label: string;
};

type FlatItem = {
  id: string;
  type: "lesson" | "subLesson";
};

type LearningExperienceProps = {
  course: Course;
  activeItem: ActiveItem | null;
  sidebarLessons: SidebarLesson[];
  progress: number;
  completedItemCount: number;
  totalItemCount: number;
  completedSidebarLessonIds: string[];
  completedSidebarSubLessonIds: string[];
};

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Failed to update progress";

const LearningExperience = ({
  course,
  activeItem,
  sidebarLessons,
  progress,
  completedItemCount,
  totalItemCount,
  completedSidebarLessonIds,
  completedSidebarSubLessonIds,
}: LearningExperienceProps) => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const completedLessonIds = new Set(completedSidebarLessonIds);
  const completedSubLessonIds = new Set(completedSidebarSubLessonIds);
  const activeItemCompleted = activeItem
    ? activeItem.type === "lesson"
      ? completedLessonIds.has(activeItem.id)
      : completedSubLessonIds.has(activeItem.id)
    : false;

  const flatItems = useMemo(
    () =>
      sidebarLessons.flatMap<FlatItem>((lesson) => [
        { id: lesson.id, type: "lesson" },
        ...lesson.subLessons.map((subLesson) => ({
          id: subLesson.id,
          type: "subLesson" as const,
        })),
      ]),
    [sidebarLessons],
  );

  const activeIndex = activeItem
    ? flatItems.findIndex(
        (item) => item.id === activeItem.id && item.type === activeItem.type,
      )
    : -1;
  const previousItem = activeIndex > 0 ? flatItems[activeIndex - 1] : null;
  const nextItem =
    activeIndex >= 0 && activeIndex < flatItems.length - 1
      ? flatItems[activeIndex + 1]
      : null;

  const getItemHref = (item: FlatItem) =>
    item.type === "lesson"
      ? `/user/courses/${course.id}/learn?lessonId=${item.id}`
      : `/user/courses/${course.id}/learn?subLessonId=${item.id}`;

  const goToItem = (item: FlatItem | null) => {
    if (!item) return;
    router.push(getItemHref(item));
    setIsMenuOpen(false);
  };

  const completeActiveItem = async () => {
    if (!activeItem || activeItemCompleted) return;

    setIsCompleting(true);
    try {
      if (activeItem.type === "lesson") {
        await markLessonComplete(course.id, activeItem.id);
      } else {
        await markSubLessonComplete(course.id, activeItem.id);
      }

      toast.success("Marked complete");

      if (nextItem) {
        router.push(getItemHref(nextItem));
      } else {
        router.refresh();
      }
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsCompleting(false);
    }
  };

  const LessonList = () => (
    <div className="flex h-full flex-col">
      <div className="border-b border-slate-200 p-5 dark:border-slate-800">
        <Button
          as={Link}
          href={`/user/courses/${course.id}`}
          variant="light"
          size="sm"
          className="mb-4"
        >
          <ArrowLeft size={16} />
          Course
        </Button>
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
          {course.label}
        </p>
        <h2 className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-50">
          {course.name}
        </h2>
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-300">
              {completedItemCount} of {totalItemCount} sections complete
            </span>
            <span className="font-semibold text-slate-900 dark:text-slate-50">
              {progress.toFixed(0)}%
            </span>
          </div>
          <Progress value={progress} color="primary" className="h-2" />
        </div>
      </div>

      <nav className="flex-1 space-y-3 overflow-y-auto p-3">
        {sidebarLessons.map((lesson) => {
          const isLessonActive =
            activeItem?.type === "lesson" && activeItem.id === lesson.id;
          const isLessonCompleted = completedLessonIds.has(lesson.id);

          return (
            <div key={lesson.id} className="space-y-1">
              <button
                type="button"
                onClick={() => goToItem({ id: lesson.id, type: "lesson" })}
                className={`flex w-full items-start gap-3 rounded-2xl border p-3 text-left transition ${
                  isLessonActive
                    ? "border-primary bg-primary/10"
                    : "border-transparent hover:border-slate-200 hover:bg-slate-50 dark:hover:border-slate-800 dark:hover:bg-slate-900"
                }`}
              >
                <span className="mt-0.5 text-primary">
                  {isLessonCompleted ? (
                    <CheckCircle2 size={18} />
                  ) : (
                    <Circle size={18} />
                  )}
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-medium text-slate-500 dark:text-slate-400">
                    Lesson {lesson.order}
                  </span>
                  <span className="mt-1 block text-sm font-semibold text-slate-900 dark:text-slate-50">
                    {lesson.title}
                  </span>
                </span>
              </button>

              {lesson.subLessons.length > 0 && (
                <div className="ml-5 space-y-1 border-l border-slate-200 pl-3 dark:border-slate-800">
                  {lesson.subLessons.map((subLesson) => {
                    const isSubLessonActive =
                      activeItem?.type === "subLesson" &&
                      activeItem.id === subLesson.id;
                    const isSubLessonCompleted = completedSubLessonIds.has(
                      subLesson.id,
                    );

                    return (
                      <button
                        key={subLesson.id}
                        type="button"
                        onClick={() =>
                          goToItem({ id: subLesson.id, type: "subLesson" })
                        }
                        className={`flex w-full items-start gap-2 rounded-xl border p-2 text-left transition ${
                          isSubLessonActive
                            ? "border-primary bg-primary/10"
                            : "border-transparent hover:border-slate-200 hover:bg-slate-50 dark:hover:border-slate-800 dark:hover:bg-slate-900"
                        }`}
                      >
                        <span className="mt-0.5 text-primary">
                          {isSubLessonCompleted ? (
                            <CheckCircle2 size={15} />
                          ) : (
                            <CornerDownRight size={15} />
                          )}
                        </span>
                        <span className="min-w-0">
                          <span className="block text-xs text-slate-500 dark:text-slate-400">
                            Sub-section {subLesson.order}
                          </span>
                          <span className="mt-0.5 block text-sm font-medium text-slate-800 dark:text-slate-100">
                            {subLesson.title}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );

  if (!activeItem) {
    return (
      <section className="py-10">
        <div className="rounded-4xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm dark:border-slate-700 dark:bg-slate-950">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
            No lessons yet
          </h1>
          <p className="mt-3 text-slate-600 dark:text-slate-300">
            This course does not have any lesson content available yet.
          </p>
          <Button
            as={Link}
            href={`/user/courses/${course.id}`}
            color="primary"
            className="mt-6"
          >
            Back to course
          </Button>
        </div>
      </section>
    );
  }

  const itemLabel =
    activeItem.type === "lesson"
      ? `Lesson ${activeItem.order}`
      : `Lesson ${activeItem.parentOrder} / Sub-section ${activeItem.order}`;

  return (
    <section className="py-6">
      <div className="overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="grid min-h-[calc(100vh-180px)] lg:grid-cols-[320px_1fr]">
          <aside className="hidden border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 lg:block">
            <LessonList />
          </aside>

          <div className="min-w-0">
            <header className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-slate-200 bg-white/95 p-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 lg:px-6">
              <div className="flex min-w-0 items-center gap-3">
                <Button
                  isIconOnly
                  variant="flat"
                  className="lg:hidden"
                  onPress={() => setIsMenuOpen(true)}
                >
                  <Menu size={18} />
                </Button>
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary">
                    Learning
                  </p>
                  <h1 className="truncate text-lg font-semibold text-slate-900 dark:text-slate-50">
                    {activeItem.title}
                  </h1>
                </div>
              </div>
              <div className="hidden items-center gap-2 text-sm text-slate-500 dark:text-slate-400 sm:flex">
                <CheckCircle2 size={16} />
                {progress.toFixed(0)}% complete
              </div>
            </header>

            <main className="p-5 sm:p-8 lg:p-10">
              <div className="mx-auto max-w-4xl">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      {itemLabel}
                    </p>
                    {activeItem.type === "subLesson" && (
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Part of {activeItem.parentTitle}
                      </p>
                    )}
                    <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                      {activeItem.title}
                    </h2>
                  </div>
                  {activeItemCompleted && (
                    <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800 dark:bg-green-900 dark:text-green-100">
                      <CheckCircle2 size={16} />
                      Completed
                    </span>
                  )}
                </div>

                <article
                  className="lesson-content rounded-3xl border border-slate-200 bg-slate-50 p-5 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 sm:p-8"
                  dangerouslySetInnerHTML={{ __html: activeItem.content }}
                />

                <div className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
                  <Button
                    variant="flat"
                    disabled={!previousItem}
                    onPress={() => goToItem(previousItem)}
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </Button>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button
                      color="primary"
                      onPress={completeActiveItem}
                      isLoading={isCompleting}
                      disabled={activeItemCompleted || isCompleting}
                    >
                      <CheckCircle2 size={16} />
                      Mark Complete
                    </Button>
                    <Button
                      variant="flat"
                      disabled={!nextItem}
                      onPress={() => goToItem(nextItem)}
                    >
                      Next
                      <ChevronRight size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close lesson menu"
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsMenuOpen(false)}
          />
          <aside className="relative h-full w-[86vw] max-w-sm bg-white shadow-xl dark:bg-slate-950">
            <div className="absolute right-3 top-3 z-10">
              <Button
                isIconOnly
                variant="flat"
                onPress={() => setIsMenuOpen(false)}
              >
                <X size={18} />
              </Button>
            </div>
            <LessonList />
          </aside>
        </div>
      )}
    </section>
  );
};

export default LearningExperience;
