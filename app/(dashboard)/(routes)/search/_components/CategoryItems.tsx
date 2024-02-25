"use client";
import React from "react";
import qs from "query-string";
import { cn } from "@/lib/utils";
import type { IconType } from "react-icons";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface CategoryItemsProps {
  label: string;
  icon?: IconType;
  value?: string;
}

const CategoryItems: React.FC<CategoryItemsProps> = ({
  icon: Icon,
  label,
  value,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategoryId = searchParams.get("categoryId");
  const currentTitle = searchParams.get("title");
  const isSelected = currentCategoryId === value;

  const handleClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          title: currentTitle,
          categoryId: isSelected ? null : value,
        },
      },
      {
        skipNull: true,
        skipEmptyString: true,
      }
    );
    router.push(url);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "py-2 px-3 text-sm border border-slate-200 rounded-full flex items-center gap-x-1 hover:bg-sky-700 transition",
        isSelected && "border-sky-700 bg-sky-200/20 text-sky-800"
      )}
    >
      {Icon && <Icon />}
      <div className="truncate">{label}</div>
    </button>
  );
};
export default CategoryItems;
