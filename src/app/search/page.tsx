import { getCategories } from "@/lib/api";
import { Metadata } from "next";
import { Suspense } from "react";
import Articles from "@/components/ui/search/articles";
import ArticlesSkeleton from "@/components/ui/search/articles-skeleton";
import SearchHeroSection from "@/components/ui/search/search-hero-section";
import SearchInput from "@/components/ui/search/search-input";
import CategoryFilter from "@/components/ui/search/category-filter";
import {
  SearchTransitionProvider,
  ArticlesLoadingWrapper,
} from "@/components/ui/search/search-transition-provider";

export const metadata: Metadata = {
  title: "Search Results",
  description:
    "Search for articles, announcements, and updates from Vercel Daily",
  openGraph: {
    title: "Search | Vercel Daily News",
    description:
      "Search for articles, announcements, and updates from Vercel Daily",
  },
};

export default async function SearchPage(props: {
  searchParams: Promise<{ query?: string; category?: string; page?: string }>;
}) {
  const categories = await getCategories();
  const { query, category, page } = (await props.searchParams) ?? {};
  const suspenseKey = `${query ?? ""}-${category ?? ""}-${page ?? "1"}`;

  return (
    <div className="min-h-screen bg-linear-to-b from-white via-gray-50 to-white">
      {/* Hero Section */}
      <SearchHeroSection />

      <SearchTransitionProvider>
        <div className="site-container pb-24">
          {/* Search Input */}
          <div className="max-w-3xl mx-auto text-center">
            <Suspense>
              <SearchInput placeholder="Search articles" />
            </Suspense>
          </div>
          {/* Category Filter */}
          <div className="flex items-center justify-between mb-5 p-6">
            <h3 className="font-semibold text-lg">Filter by Category</h3>
            <Suspense>
              <CategoryFilter categories={categories} />
            </Suspense>
          </div>

          {/* Articles Section */}
          <ArticlesLoadingWrapper>
            <Suspense key={suspenseKey} fallback={<ArticlesSkeleton />}>
              <Articles
                query={query ?? ""}
                category={category ?? ""}
                page={page ?? "1"}
              />
            </Suspense>
          </ArticlesLoadingWrapper>
        </div>
      </SearchTransitionProvider>
    </div>
  );
}
