"use client";

import clsx from "clsx";
import { Category } from "@/types/categories";
import { useUpdateSearchParams } from "@/hooks/use-update-search-params";
import { useSearchTransition } from "./search-transition-provider";

type FiltersProps = {
  categories: Category[];
};

export default function CategoryFilter({ categories }: FiltersProps) {
  const { startTransition } = useSearchTransition();
  const { searchParams, updateParams } = useUpdateSearchParams(startTransition);

  const handleCategoryChange = (categoryId: string) => {
    updateParams({
      page: "1",
      category: categoryId && categoryId !== "all" ? categoryId : null,
    });
  };

  return (
    <select
      className="appearance-none bg-white border-2 border-gray-200 rounded-2xl py-2 pl-3 pr-10 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300 bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_12px_center] bg-no-repeat"
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
