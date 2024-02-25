import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Param {
  params: { courseId: string };
}

export async function POST(req: Request, { params }: Param) {
  try {
    const { url } = await req.json();
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorised user", {
        status: 401,
      });
    }

    const courseOwner = await prisma.courses.findUnique({
      where: { id: params.courseId, userId: userId },
    });

    if (courseOwner === null) {
      return new NextResponse("Unauthorised user", {
        status: 401,
      });
    }

    const attachment = await prisma.attachment.create({
      data: {
        url: url,
        name: url.split("/").pop(),
        courseId: params.courseId,
      },
    });

    return NextResponse.json(attachment);
  } catch (error) {
    console.error(["COURSE_ID_ATTACHMENTS"], error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
