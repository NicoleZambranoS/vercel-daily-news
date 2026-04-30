import { CardSkeleton } from "../card-skeleton";

export default function FeaturedArticlesSkeleton() {
  return (
    <div className="site-container pb-24">
      <section className="mb-20">
        <div className="mb-10">
          <div className="flex items-end justify-between">
            <div>
              <div className="h-4 w-28 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-9 w-48 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
          <div className="mt-4 h-px bg-gray-300" />
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
