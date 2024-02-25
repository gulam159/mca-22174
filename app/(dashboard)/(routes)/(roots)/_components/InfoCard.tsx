import React from "react";
import type { LucideIcon } from "lucide-react";
import IconBadge from "@/components/IconBadge";

interface InfoCardProps {
  icon: LucideIcon;
  label: string;
  numberOfItems: number;
  variant?: "default" | "success";
}

const InfoCard: React.FC<InfoCardProps> = ({
  icon,
  label,
  numberOfItems,
  variant,
}) => {
  return (
    <div className="border rounded-md flex items-center gap-x-2.5 p-3">
      <IconBadge icon={icon} variant={variant ? variant : "default"} />
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-gray-500 text-xs">
          {numberOfItems} {numberOfItems === 1 ? "Course" : "Courses"}
        </p>
      </div>
    </div>
  );
};
export default InfoCard;
