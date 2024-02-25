import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Param {
  params: {
    courseId: string;
    chapterId: string;
  };
}

export async function PUT(req: Request, { params }: Param) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorised user", { status: 401 });

    const payload = await req.json();

    const userProgress = await prisma.userProgress.upsert({
      where: {
        userId: userId,
        chapterId: params.chapterId,
      },
      update: {
        isCompleted: payload.isCompleted,
      },
      create: {
        userId: userId,
        chapterId: params.chapterId,
        isCompleted: payload.isCompleted,
      },
    });

    return NextResponse.json("see console");
  } catch (error) {
    console.error("[CHAPTER_ID_PROGRESS]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
