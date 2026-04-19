import SearchHeroSection from "@/components/ui/search/search-hero-section";
import ArticlesSkeleton from "@/components/ui/search/articles-skeleton";

export default function SearchLoading() {
  return (
    <div className="min-h-screen bg-linear-to-b from-white via-gray-50 to-white">
      <SearchHeroSection />

      <div className="site-container pb-24">
        {/* Search Input skeleton */}
        <div className="max-w-3xl mx-auto text-center">
          <div className="h-10 w-full rounded-md border border-gray-200 bg-gray-100 animate-pulse" />
        </div>

        {/* Category Filter skeleton */}
        <div className="flex items-center justify-between mb-5 p-6">
          <div className="h-6 w-40 bg-gray-200 rounded-md animate-pulse" />
          <div className="h-10 w-36 bg-gray-200 rounded-2xl animate-pulse" />
        </div>

        {/* Articles skeleton */}
        <ArticlesSkeleton />
      </div>
    </div>
  );
}
