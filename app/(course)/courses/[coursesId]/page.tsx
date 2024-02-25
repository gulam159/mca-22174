import React from "react";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

interface CourseIdProps {
  params: {
    coursesId: string;
  };
}

const CourseId: React.FC<CourseIdProps> = async ({ params }) => {
  const course = await prisma.courses.findUnique({
    where: {
      id: params.coursesId,
    },
    include: {
      chapter: {
        where: {
          isPublished: true,
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!course) return redirect("/");

  return redirect(`/courses/${course.id}/chapters/${course.chapter[0].id}`);
};
export default CourseId;
