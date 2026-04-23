import { CardSkeleton } from "../card-skeleton";

export default function FeaturedArticlesSkeleton() {
  return (
    <div className="site-container pb-24">
      <section className="mb-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="h-4 w-28 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-9 w-48 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        <div className="article-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
