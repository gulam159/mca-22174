import { prisma } from "@/lib/prisma";
import { getProgress } from "@/actions/get-progress";
import type { Courses, Category } from "@prisma/client";

export type CourseWithProgressWithCategory = Courses & {
  category: Category | null;
  chapter: { id: string }[];
  progress: number | null;
};

interface GetCourses {
  userId: string;
  title?: string;
  categoryId?: string;
}

export async function getCourses({
  userId,
  categoryId,
  title,
}: GetCourses): Promise<CourseWithProgressWithCategory[]> {
  try {
    const courses = await prisma.courses.findMany({
      where: {
        isPublished: true,
        title: {
          contains: title,
        },
        categoryId,
      },
      include: {
        category: true,
        chapter: {
          where: {
            isPublished: true,
          },
        },
        purchases: {
          where: {
            userId: userId,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const coursesWithProgress = (await Promise.all(
      courses.map(async (course) => {
        if (course.purchases.length === 0) {
          return {
            ...course,
            progress: null,
          };
        }

        const progressPercentage = await getProgress(userId, course.id);

        return { ...course, progress: progressPercentage };
      })
    )) satisfies CourseWithProgressWithCategory[];

    return coursesWithProgress;
  } catch (error) {
    console.error("[GET_COURSE_ERROR]", error);
    return [];
  }
}
