"use client";

import { Search as SearchIcon } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import { useUpdateSearchParams } from "@/hooks/use-update-search-params";

export default function SearchInput({ placeholder }: { placeholder: string }) {
  const { searchParams, updateParams } = useUpdateSearchParams();

  const handleSearch = useDebouncedCallback((term: string) => {
    updateParams({
      page: "1",
      query: term.length > 2 ? term : null,
    });
  }, 300);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch.flush();
      const term = e.currentTarget.value;
      updateParams({ page: "1", query: term || null });
    }
  };

  return (
    <div className="relative flex flex-1 shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        onKeyDown={handleKeyDown}
        defaultValue={searchParams.get("query")?.toString()}
      />
      <SearchIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
