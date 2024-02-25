import React from "react";
import type { Chapter, Courses, UserProgress } from "@prisma/client";
import NavbarRoutes from "@/components/NavbarRoutes";
import CourseMobileSidebar from "./CourseMobileSidebar";

type CourseNavbarProps = {
  course: Courses & {
    chapter: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progressCount: number;
};

const CourseNavbar: React.FC<CourseNavbarProps> = ({
  course,
  progressCount,
}) => {
  return (
    <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
      <CourseMobileSidebar course={course} progressCount={progressCount} />
      <NavbarRoutes />
    </div>
  );
};
export default CourseNavbar;
