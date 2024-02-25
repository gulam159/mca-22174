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

    const chapter = await prisma.chapter.findUnique({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
    });

    let muxData = await prisma.muxData.findUnique({
      where: {
        chapterId: params.chapterId,
      },
    });

    if (
      !chapter ||
      !muxData ||
      !chapter.title ||
      !chapter.description ||
      !chapter.videoUrl
    )
      return new NextResponse("Missing required field", { status: 400 });

    const publishedChapter = await prisma.chapter.update({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
      data: {
        isPublished: true,
      },
    });

    return NextResponse.json(publishedChapter);
  } catch (error) {
    console.error("[CHAPTER_PUBLISH_ERROR]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
