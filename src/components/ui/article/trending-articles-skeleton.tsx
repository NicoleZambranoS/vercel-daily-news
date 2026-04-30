import { CardSkeleton } from "../card-skeleton";

export default function TrendingArticlesSkeleton() {
  return (
    <div className="bg-linear-to-b from-gray-50 to-white py-20">
      <div className="site-container">
        <div className="mb-10">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="mt-4 h-px bg-gray-300" />
        </div>
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
