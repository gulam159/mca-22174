import { prisma } from "@/lib/prisma";

async function getProgress(userId: string, courseId: string): Promise<number> {
  try {
    const publishedChapters = await prisma.chapter.findMany({
      where: {
        courseId: courseId,
        isPublished: true,
      },
      select: {
        id: true,
      },
    });

    const publishedChapterIds = publishedChapters.map((chapter) => chapter.id);

    const validCompletedChapters = await prisma.userProgress.count({
      where: {
        userId: userId,
        chapterId: {
          in: publishedChapterIds,
        },
        isCompleted: true,
      },
    });

    const progressPercentage =
      (validCompletedChapters / publishedChapters.length) * 100;
    return progressPercentage;
  } catch (error) {
    console.error("[GET_PROGRESS]", error);
    return 0;
  }
}
export { getProgress };
