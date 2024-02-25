import React from "react";
import Logo from "./Logo";
import SidebarRoutes from "./SidebarRoutes";

interface SidebarProps {}

const Sidebar: React.FC<SidebarProps> = () => {
  return (
    <div className="h-full flex flex-col overflow-y-auto bg-white border-r shadow-md">
      <div className="p-5">
        <Logo />
      </div>
      <div className="flex flex-col w-full">
        <SidebarRoutes />
      </div>
    </div>
  );
};
export default Sidebar;
