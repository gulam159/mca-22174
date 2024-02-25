import React from "react";
import { columns } from "./_components/Coloumn";
import { DataTable } from "./_components/DataTable";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

async function Courses() {
  const { userId } = auth();
  if (!userId) return redirect("/");

  const courses = await prisma.courses.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="p-6">
      <DataTable columns={columns} data={courses} />
    </div>
  );
}
export default Courses;
