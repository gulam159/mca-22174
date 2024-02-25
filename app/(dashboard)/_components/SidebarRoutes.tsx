"use client";
import React from "react";
import { SidebarItems } from "./SidebarItems";
import { usePathname } from "next/navigation";
import { BarChart, LayoutDashboard, List, Search } from "lucide-react";

interface SidebarRoutesProps {}

const guestRoutes = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/",
  },
  {
    icon: Search,
    label: "Browse",
    href: "/search",
  },
];

const teacherRoutes = [
  {
    icon: List,
    label: "Courses",
    href: "/teacher/courses",
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: "/teacher/analytics",
  },
];

const SidebarRoutes: React.FC<SidebarRoutesProps> = () => {
  const pathname = usePathname();
  const routes = pathname.includes("/teacher") ? teacherRoutes : guestRoutes;

  return (
    <div className="flex flex-col w-full">
      {routes.map(({ label, icon, href }) => (
        <SidebarItems key={href} href={href} Icon={icon} label={label} />
      ))}
    </div>
  );
};
export default SidebarRoutes;
