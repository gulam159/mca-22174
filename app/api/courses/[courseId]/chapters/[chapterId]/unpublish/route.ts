import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Param {
  params: {
    courseId: string;
    chapterId: string;
  };
}

export async function PATCH(req: Request, { params }: Param) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorised user", { status: 401 });

    const ownCourse = await prisma.courses.findUnique({
      where: {
        id: params.courseId,
        userId: userId,
      },
    });

    if (!ownCourse)
      return new NextResponse("Unauthorised user", { status: 401 });

    const unPublishedChapter = await prisma.chapter.update({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
      data: {
        isPublished: false,
      },
    });

    const publisheChapterInCourse = await prisma.chapter.findMany({
      where: {
        courseId: params.courseId,
        isPublished: true,
      },
    });

    if (!publisheChapterInCourse.length) {
      await prisma.courses.update({
        where: { id: params.courseId },
        data: {
          isPublished: false,
        },
      });
    }

    return NextResponse.json(unPublishedChapter);
  } catch (error) {
    console.error("[CHAPTER_UNPUBLISH_ERROR]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
