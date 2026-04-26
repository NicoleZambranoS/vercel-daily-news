import ArticleBodySkeleton from "@/components/ui/article/article-body-skeleton";
import TrendingArticlesSkeleton from "@/components/ui/article/trending-articles-skeleton";

export default function ArticleLoading() {
  return (
    <>
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12 animate-pulse">
        {/* Back link */}
        <div className="h-4 w-32 bg-gray-200 rounded-md mb-10" />

        {/* Category + date + author */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-6 w-20 bg-gray-200 rounded-lg" />
          <div className="h-4 w-24 bg-gray-100 rounded-md" />
          <div className="h-4 w-28 bg-gray-100 rounded-md" />
        </div>

        {/* Title */}
        <div className="space-y-3 mb-12">
          <div className="h-10 w-full bg-gray-200 rounded-md" />
          <div className="h-10 w-3/4 bg-gray-200 rounded-md" />
        </div>

        {/* Featured image */}
        <div className="h-80 sm:h-112 w-full bg-gray-200 rounded-2xl mb-12" />

        {/* Article body */}
        <ArticleBodySkeleton />
      </div>

      <TrendingArticlesSkeleton />
    </>
  );
}
