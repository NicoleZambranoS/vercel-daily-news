"use client";

import {
  createContext,
  type ReactNode,
  type TransitionStartFunction,
  useContext,
  useTransition,
} from "react";
import ArticlesSkeleton from "./articles-skeleton";

type SearchTransitionContextType = {
  isPending: boolean;
  startTransition: TransitionStartFunction;
};

const SearchTransitionContext = createContext<SearchTransitionContextType>({
  isPending: false,
  startTransition: (cb) => cb(),
});

export function SearchTransitionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isPending, startTransition] = useTransition();
  return (
    <SearchTransitionContext.Provider value={{ isPending, startTransition }}>
      {children}
    </SearchTransitionContext.Provider>
  );
}

export function useSearchTransition() {
  return useContext(SearchTransitionContext);
}

/**
 * Shows a skeleton overlay while a search transition is pending,
 * keeping the Suspense boundary mounted for React to process.
 */
export function ArticlesLoadingWrapper({ children }: { children: ReactNode }) {
  const { isPending } = useSearchTransition();
  return (
    <>
      {isPending && <ArticlesSkeleton />}
      <div className={isPending ? "hidden" : ""}>{children}</div>
    </>
  );
}
