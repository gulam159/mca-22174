import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Param {
  params: { courseId: string };
}

export async function POST(req: Request, { params }: Param) {
  try {
    const { title } = await req.json();
    const { userId } = auth();

    if (!userId) return new NextResponse("Unauthorised user", { status: 401 });

    const courseOwner = await prisma.courses.findUnique({
      where: {
        id: params.courseId,
        userId: userId,
      },
    });

    if (!courseOwner)
      return new NextResponse("Unauthorised user", { status: 401 });

    const lastChapter = await prisma.chapter.findFirst({
      where: {
        id: params.courseId,
      },
      orderBy: {
        position: "desc",
      },
    });

    const newPosition = lastChapter ? lastChapter.position + 1 : 1;

    const chapter = await prisma.chapter.create({
      data: {
        title: title,
        courseId: params.courseId,
        position: newPosition,
      },
    });

    return NextResponse.json(chapter);
  } catch (error) {
    console.error("[COURSE_CHAPTERS]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
