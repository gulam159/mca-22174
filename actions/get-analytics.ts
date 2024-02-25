import { prisma } from "@/lib/prisma";
import type { Courses, Purchase } from "@prisma/client";

type PurchaseWithCourse = Purchase & {
  course: Courses;
};

interface AnalyticData {
  data: { name: string; total: number }[];
  totalRevenue: number;
  totalSales: number;
}

export const groupByCourse = (purchase: PurchaseWithCourse[]) => {
  const grouped: { [courseTitle: string]: number } = {};

  purchase.forEach((purchase) => {
    const courseTitle = purchase.course.title;

    if (!grouped[courseTitle]) {
      grouped[courseTitle] = 0;
    }
    grouped[courseTitle] += purchase.course.price!;
  });

  return grouped;
};

export const getAnalytics = async (userId: string): Promise<AnalyticData> => {
  try {
    const purchase = await prisma.purchase.findMany({
      where: {
        userId: userId,
      },
      include: {
        course: true,
      },
    });

    const groupedEarnings = groupByCourse(purchase);
    const data = Object.entries(groupedEarnings).map(
      ([courseTitle, total]) => ({
        name: courseTitle,
        total: total,
      })
    );

    const totalRevenue = data.reduce((acc, curr) => acc + curr.total, 0);
    const totalSales = await purchase.length;

    return {
      data,
      totalRevenue,
      totalSales,
    };
  } catch (error) {
    console.error("[GET_ANALYTICS] ", error);
    return {
      data: [],
      totalRevenue: 0,
      totalSales: 0,
    };
  }
};
