import React from "react";
import { LucideIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const backGroundVariats = cva("rounded-full flex items-center justify-center", {
  variants: {
    variant: {
      default: "bg-sky-100",
      success: "bg-emerald-100",
    },
    size: {
      default: "p-2",
      sm: "p-1",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

const iconVariants = cva("", {
  variants: {
    variant: {
      default: "text-sky-700",
      success: "text-emerald-700",
    },
    size: {
      default: "h-6 w-6",
      sm: "h-4 w-4",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

type BackGroundVariantProps = VariantProps<typeof backGroundVariats>;
type IconVariantProps = VariantProps<typeof iconVariants>;

interface IconBadgeProps extends BackGroundVariantProps, IconVariantProps {
  icon: LucideIcon;
}

const IconBadge: React.FC<IconBadgeProps> = ({ icon: Icon, variant, size }) => {
  return (
    <div className={cn(backGroundVariats({ variant, size }))}>
      <Icon className={cn(iconVariants({ variant, size }))} />
    </div>
  );
};
export default IconBadge;
