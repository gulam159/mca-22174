import React from "react";
import { Menu } from "lucide-react";
import type { Chapter, Courses, UserProgress } from "@prisma/client";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import CourseSidebar from "./CourseSidebar";

type CourseMobileSidebarProps = {
  course: Courses & {
    chapter: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progressCount: number;
};

const CourseMobileSidebar: React.FC<CourseMobileSidebarProps> = ({
  course,
  progressCount,
}) => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-white w-72 ">
        <CourseSidebar course={course} progressCount={progressCount} />
      </SheetContent>
    </Sheet>
  );
};
export default CourseMobileSidebar;
