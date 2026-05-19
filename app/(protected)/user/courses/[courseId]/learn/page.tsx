import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { stackServerApp } from "@/stack/server";
import LearningExperience from "./LearningExperience";

type LearningPageProps = {
  params: Promise<{
    courseId: string;
  }>;
  searchParams: Promise<{
    lessonId?: string;
    subLessonId?: string;
  }>;
};

const SIDEBAR_LESSON_LIMIT = 80;

const LearningPage = async ({ params, searchParams }: LearningPageProps) => {
  const { courseId } = await params;
  const { lessonId, subLessonId } = await searchParams;
  const session = await stackServerApp.getUser({ or: "redirect" });

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: {
      id: true,
      name: true,
      label: true,
    },
  });

  if (!course) {
    notFound();
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: session.id,
        courseId,
      },
    },
    select: {
      id: true,
    },
  });

  if (!enrollment) {
    redirect(`/user/courses/${courseId}`);
  }

  const [
    totalLessons,
    totalSubLessons,
    completedLessonCount,
    completedSubLessonCount,
  ] = await Promise.all([
    prisma.lesson.count({ where: { courseId } }),
    prisma.subLesson.count({
      where: {
        lesson: {
          courseId,
        },
      },
    }),
    prisma.lessonProgress.count({
      where: {
        enrollmentId: enrollment.id,
        completed: true,
        lesson: {
          courseId,
        },
      },
    }),
    prisma.subLessonProgress.count({
      where: {
        enrollmentId: enrollment.id,
        completed: true,
        subLesson: {
          lesson: {
            courseId,
          },
        },
      },
    }),
  ]);

  const requestedSubLesson = subLessonId
    ? await prisma.subLesson.findFirst({
        where: {
          id: subLessonId,
          lesson: {
            courseId,
          },
        },
        select: {
          id: true,
          title: true,
          content: true,
          order: true,
          lessonId: true,
          lesson: {
            select: {
              title: true,
              order: true,
            },
          },
        },
      })
    : null;

  const requestedLesson =
    !requestedSubLesson && lessonId
      ? await prisma.lesson.findFirst({
          where: {
            id: lessonId,
            courseId,
          },
          select: {
            id: true,
            title: true,
            content: true,
            order: true,
          },
        })
      : null;

  const firstIncompleteLesson =
    !requestedSubLesson && !requestedLesson
      ? await prisma.lesson.findFirst({
          where: {
            courseId,
            lessonProgress: {
              none: {
                enrollmentId: enrollment.id,
                completed: true,
              },
            },
          },
          orderBy: [{ order: "asc" }, { createdAt: "asc" }],
          select: {
            id: true,
            title: true,
            content: true,
            order: true,
          },
        })
      : null;

  const fallbackLesson =
    !requestedSubLesson && !requestedLesson && !firstIncompleteLesson
      ? await prisma.lesson.findFirst({
          where: { courseId },
          orderBy: [{ order: "asc" }, { createdAt: "asc" }],
          select: {
            id: true,
            title: true,
            content: true,
            order: true,
          },
        })
      : null;

  const activeItem = requestedSubLesson
    ? {
        id: requestedSubLesson.id,
        type: "subLesson" as const,
        lessonId: requestedSubLesson.lessonId,
        title: requestedSubLesson.title,
        content: requestedSubLesson.content,
        order: requestedSubLesson.order,
        parentTitle: requestedSubLesson.lesson.title,
        parentOrder: requestedSubLesson.lesson.order,
      }
    : (requestedLesson ?? firstIncompleteLesson ?? fallbackLesson)
      ? {
          id: (requestedLesson ?? firstIncompleteLesson ?? fallbackLesson)!.id,
          type: "lesson" as const,
          title: (requestedLesson ?? firstIncompleteLesson ?? fallbackLesson)!
            .title,
          content: (requestedLesson ?? firstIncompleteLesson ?? fallbackLesson)!
            .content,
          order: (requestedLesson ?? firstIncompleteLesson ?? fallbackLesson)!
            .order,
        }
      : null;

  const activeLessonOrder =
    activeItem?.type === "subLesson"
      ? activeItem.parentOrder
      : activeItem?.order;

  const sidebarLessons = await prisma.lesson.findMany({
    where: {
      courseId,
      ...(activeLessonOrder
        ? {
            order: {
              gte: Math.max(1, activeLessonOrder - SIDEBAR_LESSON_LIMIT / 2),
              lte: activeLessonOrder + SIDEBAR_LESSON_LIMIT / 2,
            },
          }
        : {}),
    },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    take: SIDEBAR_LESSON_LIMIT,
    select: {
      id: true,
      title: true,
      order: true,
      subLessons: {
        orderBy: [{ order: "asc" }, { createdAt: "asc" }],
        select: {
          id: true,
          title: true,
          order: true,
        },
      },
    },
  });

  const sidebarLessonIds = sidebarLessons.map((lesson) => lesson.id);
  const sidebarSubLessonIds = sidebarLessons.flatMap((lesson) =>
    lesson.subLessons.map((subLesson) => subLesson.id),
  );

  const [completedSidebarLessons, completedSidebarSubLessons] =
    await Promise.all([
      sidebarLessonIds.length > 0
        ? prisma.lessonProgress.findMany({
            where: {
              enrollmentId: enrollment.id,
              completed: true,
              lessonId: {
                in: sidebarLessonIds,
              },
            },
            select: {
              lessonId: true,
            },
          })
        : [],
      sidebarSubLessonIds.length > 0
        ? prisma.subLessonProgress.findMany({
            where: {
              enrollmentId: enrollment.id,
              completed: true,
              subLessonId: {
                in: sidebarSubLessonIds,
              },
            },
            select: {
              subLessonId: true,
            },
          })
        : [],
    ]);

  const totalItems = totalLessons + totalSubLessons;
  const completedItems = completedLessonCount + completedSubLessonCount;
  const progress =
    totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100);

  return (
    <LearningExperience
      course={course}
      activeItem={activeItem}
      sidebarLessons={sidebarLessons}
      progress={progress}
      completedItemCount={completedItems}
      totalItemCount={totalItems}
      completedSidebarLessonIds={completedSidebarLessons.map(
        (progressItem) => progressItem.lessonId,
      )}
      completedSidebarSubLessonIds={completedSidebarSubLessons.map(
        (progressItem) => progressItem.subLessonId,
      )}
    />
  );
};

export default LearningPage;
