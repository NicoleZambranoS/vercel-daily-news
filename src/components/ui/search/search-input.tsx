"use client";

import { useRef } from "react";
import { Loader2, Search as SearchIcon } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import { useUpdateSearchParams } from "@/hooks/use-update-search-params";
import { useSearchTransition } from "./search-transition-provider";

export default function SearchInput({ placeholder }: { placeholder: string }) {
  const { startTransition, isPending } = useSearchTransition();
  const { searchParams, updateParams } = useUpdateSearchParams(startTransition);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = useDebouncedCallback((term: string) => {
    const hasActiveQuery = !!searchParams.get("query");
    // Only update if there's a valid new query, or an existing one that needs clearing
    if (term.length > 2 || hasActiveQuery) {
      updateParams({
        page: "1",
        query: term.length > 2 ? term : null,
      });
    }
  }, 300);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch.flush();
      const term = e.currentTarget.value;
      updateParams({ page: "1", query: term || null });
    }
  };

  const handleSearchButtonClick = () => {
    handleSearch.cancel();
    const term = inputRef.current?.value ?? "";
    updateParams({ page: "1", query: term || null });
  };

  return (
    <div className="flex flex-1 shrink-0 gap-2">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <div className="relative flex-1">
        <SearchIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 pointer-events-none" />
        <input
          id="search"
          ref={inputRef}
          className="block w-full rounded-md border border-gray-200 py-[9px] pl-10 pr-3 text-sm outline-2 placeholder:text-gray-500"
          placeholder={placeholder}
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          defaultValue={searchParams.get("query")?.toString()}
        />
      </div>
      <button
        type="button"
        onClick={handleSearchButtonClick}
        className="flex items-center gap-1.5 rounded-md bg-gray-900 px-4 py-[9px] text-sm font-medium text-white hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isPending}
      >
        {isPending ? (
          <Loader2 className="h-[16px] w-[16px] animate-spin mr-2" />
        ) : null}
        <SearchIcon className="h-[16px] w-[16px]" />
        Search
      </button>
    </div>
  );
}
