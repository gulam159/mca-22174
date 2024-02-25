import { auth } from "@clerk/nextjs";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

interface Params {
  params: {
    courseId: string;
    attachmentId: string;
  };
}
export async function DELETE(req: Request, { params }: Params) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorize user", { status: 401 });
    const courseOwner = await prisma.courses.findUnique({
      where: {
        id: params.courseId,
        userId: userId,
      },
    });

    if (!courseOwner)
      return new NextResponse("Unauthorize user", { status: 401 });
    const attachment = await prisma.attachment.delete({
      where: {
        id: params.attachmentId,
        courseId: params.courseId,
      },
    });

    return NextResponse.json(attachment);
  } catch (error) {
    console.error("[ATTACHMENT_DELETE_ERROR]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
