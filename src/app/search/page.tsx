import { Metadata } from "next";
import { Suspense } from "react";
import { cacheLife } from "next/cache";
import { getCategories } from "@/lib/api";
import Articles from "@/components/ui/search/articles";
import ArticlesSkeleton from "@/components/ui/search/articles-skeleton";
import SearchHeroSection from "@/components/ui/search/search-hero-section";
import SearchInput from "@/components/ui/search/search-input";
import CategoryFilter from "@/components/ui/search/category-filter";
import {
  ArticlesLoadingWrapper,
  SearchTransitionProvider,
} from "@/components/ui/search/search-transition-provider";

export const metadata: Metadata = {
  title: "Search Results",
  description:
    "Search for articles, announcements, and updates from Vercel Daily",
  openGraph: {
    title: "Search | Vercel Daily News",
    description:
      "Search for articles, announcements, and updates from Vercel Daily",
    images: [
      {
        url: "/vercel-icon.png",
        width: 1120,
        height: 630,
        alt: "Vercel Daily News",
      },
    ],
  },
};

async function CategoriesSection() {
  "use cache";
  cacheLife("days");

  const categories = await getCategories();
  return <CategoryFilter categories={categories} />;
}

async function SearchResultsSection(props: {
  searchParams: Promise<{ query?: string; category?: string; page?: string }>;
}) {
  const { query, category, page } = await props.searchParams;
  return (
    <Articles
      query={query ?? ""}
      category={category ?? ""}
      page={page ?? "1"}
    />
  );
}

export default function SearchPage(props: {
  searchParams: Promise<{ query?: string; category?: string; page?: string }>;
}) {
  return (
    <div className="min-h-screen bg-linear-to-b from-white via-gray-50 to-white">
      {/* Hero Section */}
      <SearchHeroSection />

      <SearchTransitionProvider>
        <div className="site-container pb-24">
          {/* Search Input */}
          <div className="max-w-3xl mx-auto text-center">
            <Suspense
              fallback={
                <div className="h-14 w-full bg-gray-100 rounded-xl animate-pulse" />
              }
            >
              <SearchInput placeholder="Search articles" />
            </Suspense>
          </div>
          {/* Category Filter */}
          <div className="flex items-center justify-between mb-5 p-6">
            <h3 className="font-semibold text-lg">Filter by Category</h3>
            <Suspense
              fallback={
                <div className="h-10 w-40 bg-gray-100 rounded-lg animate-pulse" />
              }
            >
              <CategoriesSection />
            </Suspense>
          </div>

          {/* Articles Section */}
          <ArticlesLoadingWrapper>
            <Suspense fallback={<ArticlesSkeleton />}>
              <SearchResultsSection searchParams={props.searchParams} />
            </Suspense>
          </ArticlesLoadingWrapper>
        </div>
      </SearchTransitionProvider>
    </div>
  );
}
