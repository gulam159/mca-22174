import { prisma } from "@/lib/prisma";
import type { Attachment, Chapter } from "@prisma/client";

interface GetChapterProp {
  userId: string;
  chapterId: string;
  coursesId: string;
}

export const getChapter = async ({
  userId,
  chapterId,
  coursesId,
}: GetChapterProp) => {
  try {
    const purchase = await prisma.purchase.findUnique({
      where: {
        userId,
        courseId: coursesId,
      },
    });

    const course = await prisma.courses.findUnique({
      where: {
        id: coursesId,
        isPublished: true,
      },
      select: {
        price: true,
      },
    });

    const chapter = await prisma.chapter.findUnique({
      where: {
        id: chapterId,
        isPublished: true,
      },
    });

    if (!chapter || !course) {
      throw new Error("Chapter not found");
    }

    let muxData = null;
    let attachment: Attachment[] = [];
    let nextChapter: Chapter | null = null;

    if (purchase) {
      attachment = await prisma.attachment.findMany({
        where: {
          courseId: coursesId,
        },
      });
    }

    if (chapter.isFree || purchase) {
      muxData = await prisma.muxData.findUnique({
        where: {
          chapterId: chapterId,
        },
      });

      nextChapter = await prisma.chapter.findFirst({
        where: {
          courseId: coursesId,
          isPublished: true,
          position: {
            gt: chapter?.position,
          },
        },
        orderBy: {
          position: "asc",
        },
      });
    }

    const userProgress = await prisma.userProgress.findUnique({
      where: {
        chapterId: chapterId,
      },
    });

    return {
      chapter,
      course,
      muxData,
      attachment,
      nextChapter,
      userProgress,
      purchase,
    };
  } catch (error) {
    console.error("[GET_CHAPTER_ERROR]", error);
    return {
      chapter: null,
      course: null,
      muxData: null,
      attachment: null,
      nextChapter: null,
      userProgress: null,
      purchase: null,
    };
  }
};
