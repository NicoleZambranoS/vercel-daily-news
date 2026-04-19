import { CardSkeleton } from "@/components/ui/card-skeleton";

export default function ArticlesSkeleton() {
  return (
    <div className="article-grid">
      {Array.from({ length: 6 }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
