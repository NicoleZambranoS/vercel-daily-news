"use client";

import clsx from "clsx";
import { Category } from "@/types/categories";
import { useUpdateSearchParams } from "@/hooks/use-update-search-params";

type FiltersProps = {
  categories: Category[];
};

export default function CategoryFilter({ categories }: FiltersProps) {
  const { searchParams, updateParams } = useUpdateSearchParams();

  const handleCategoryChange = (categoryId: string) => {
    updateParams({
      page: "1",
      category: categoryId && categoryId !== "all" ? categoryId : null,
    });
  };

  return (
    <select
      className="bg-white border-2 border-gray-200 rounded-2xl p-2 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300"
      value={searchParams.get("category") ?? "all"}
      onChange={(e) => handleCategoryChange(e.target.value)}
    >
      <option value="all">All</option>
      {categories.map((category) => (
        <option
          key={category.slug}
          value={category.slug}
          className={clsx(
            "px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
            {
              "bg-linear-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/30":
                searchParams.get("category") === category.slug,
              "bg-gray-100 text-gray-700 hover:bg-gray-200":
                searchParams.get("category") !== category.slug,
            },
          )}
        >
          {category.name}
        </option>
      ))}
    </select>
  );
}
