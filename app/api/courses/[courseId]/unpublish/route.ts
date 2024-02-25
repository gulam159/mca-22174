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
    });

    if (!course) return new NextResponse("No course found", { status: 404 });

    const unPublishedCourse = await prisma.courses.update({
      where: {
        id: params.courseId,
      },
      data: {
        isPublished: false,
      },
    });

    return NextResponse.json(unPublishedCourse);
  } catch (error) {
    console.error("[COURSE_ID_UNPUBLISH]", error);
    return new NextResponse("Internal server error", { status: 200 });
  }
}
