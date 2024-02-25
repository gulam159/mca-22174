import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

interface Param {
  params: {
    courseId: string;
  };
}

export async function PATCH(req: Request, { params }: Param) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorised user", { status: 401 });

    const course = await prisma.courses.findUnique({
      where: {
        id: params.courseId,
        userId: userId,
      },
      include: {
        chapter: {
          include: {
            muxData: true,
          },
        },
      },
    });

    if (!course) return new NextResponse("No course found", { status: 404 });

    const hasPublishedChapter = course.chapter.some((el) => el.isPublished);

    if (
      !course.title ||
      !course.description ||
      !course.imageUrl ||
      !course.categoryId ||
      !hasPublishedChapter
    ) {
      return new NextResponse("Missing required fields", { status: 401 });
    }

    const publishedCourse = await prisma.courses.update({
      where: {
        id: params.courseId,
      },
      data: {
        isPublished: true,
      },
    });

    return NextResponse.json(publishedCourse);
  } catch (error) {
    console.error("[COURSE_ID_PUBLISH]", error);
    return new NextResponse("Internal server error", { status: 200 });
  }
}
