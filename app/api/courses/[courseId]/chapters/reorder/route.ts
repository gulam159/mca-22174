import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

interface Param {
  params: { courseId: string };
}

export async function PUT(req: Request, { params }: Param) {
  try {
    const { userId } = auth();
    const { list } = await req.json();

    if (!userId) return new NextResponse("Unauthorised user", { status: 401 });

    const courseOwner = await prisma.courses.findUnique({
      where: {
        id: params.courseId,
        userId: userId,
      },
    });

    if (!courseOwner)
      return new NextResponse("Unauthorised user", { status: 401 });

    for (let item of list) {
      await prisma.chapter.update({
        where: { id: item.id },
        data: { position: item.position },
      });
    }

    return new NextResponse("Success", { status: 200 });
  } catch (error) {
    console.error("[REORDERED_ERROR]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
