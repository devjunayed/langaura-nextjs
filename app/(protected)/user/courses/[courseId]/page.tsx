import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { stackServerApp } from "@/stack/server";
import CourseDetail from "./CourseDetail";

type CourseDetailPageProps = {
  params: Promise<{
    courseId: string;
  }>;
};

const CourseDetailPage = async ({ params }: CourseDetailPageProps) => {
  const { courseId } = await params;
  const session = await stackServerApp.getUser({ or: "redirect" });

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      author: {
        select: {
          name: true,
        },
      },
      lessons: {
        orderBy: { order: "asc" },
        take: 50,
        select: {
          id: true,
          title: true,
          order: true,
        },
      },
      _count: {
        select: {
          enrollments: true,
          lessons: true,
        },
      },
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
      progress: true,
      enrolledAt: true,
    },
  });

  const completedLessonCount = enrollment
    ? await prisma.lessonProgress.count({
        where: {
          enrollmentId: enrollment.id,
          completed: true,
          lesson: {
            courseId,
          },
        },
      })
    : 0;
  const [subLessonCount, completedSubLessonCount] = await Promise.all([
    prisma.subLesson.count({
      where: {
        lesson: {
          courseId,
        },
      },
    }),
    enrollment
      ? prisma.subLessonProgress.count({
          where: {
            enrollmentId: enrollment.id,
            completed: true,
            subLesson: {
              lesson: {
                courseId,
              },
            },
          },
        })
      : 0,
  ]);

  const totalLearningItems = course._count.lessons + subLessonCount;
  const completedLearningItems = completedLessonCount + completedSubLessonCount;
  const computedProgress =
    totalLearningItems === 0
      ? 0
      : Math.round((completedLearningItems / totalLearningItems) * 100);

  return (
    <CourseDetail
      course={{
        id: course.id,
        name: course.name,
        key: course.key,
        label: course.label,
        price: course.price,
        image: course.image,
        createdAt: course.createdAt.toISOString(),
        updatedAt: course.updatedAt.toISOString(),
        author: course.author ? { name: course.author.name } : null,
        lessons: course.lessons,
        lessonCount: course._count.lessons,
        enrollmentCount: course._count.enrollments,
        enrollment: enrollment
          ? {
              id: enrollment.id,
              progress: computedProgress,
              enrolledAt: enrollment.enrolledAt.toISOString(),
            }
          : null,
      }}
    />
  );
};

export default CourseDetailPage;
