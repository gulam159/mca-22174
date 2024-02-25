import { auth } from "@clerk/nextjs";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Categories from "./_components/Categories";
import { getCourses } from "@/actions/get-courses";
import { SearchInput } from "@/components/SearchInput";
import CourseList from "@/components/CourseList";

interface SearchPageProps {
  searchParams: {
    title: string;
    categoryId: string;
  };
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const { userId } = auth();
  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  if (!userId) {
    return redirect("/");
  }

  const courses = await getCourses({ userId, ...searchParams });

  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <SearchInput />
      </div>
      <div className="p-6">
        <Categories items={categories} />
        <CourseList items={courses} />
      </div>
    </>
  );
};

export default SearchPage;
