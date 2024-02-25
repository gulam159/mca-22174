import type { ReactNode } from "react";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { getProgress } from "@/actions/get-progress";
import CourseSidebar from "./_components/CourseSidebar";
import CourseNavbar from "./_components/CourseNavbar";

interface CourseLayoutProps {
  children: ReactNode;
  params: {
    coursesId: string;
  };
}

export default async function CourseLayout({
  children,
  params,
}: CourseLayoutProps) {
  const { userId } = auth();

  if (!userId) return redirect("/");

  const course = await prisma.courses.findUnique({
    where: {
      id: params.coursesId,
    },
    include: {
      chapter: {
        where: {
          isPublished: true,
        },
        include: {
          userProgress: {
            where: {
              userId: userId,
            },
          },
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!course) return redirect("/");

  const currentProgress = await getProgress(userId, course.id);

  return (
    <div className="h-full w-full">
      <div className="h-[80px] md:pl-80 fixed inset-y-0 w-full z-50">
        <CourseNavbar course={course} progressCount={currentProgress} />
      </div>
      <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50 bg-white">
        <CourseSidebar course={course} progressCount={currentProgress} />
      </div>
      <main className="md:pl-80 pt-[80px]">{children}</main>
    </div>
  );
}
