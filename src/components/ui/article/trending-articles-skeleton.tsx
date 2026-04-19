import { TrendingUp } from "lucide-react";
import { CardSkeleton } from "@/components/ui/card-skeleton";

export default function TrendingArticlesSkeleton() {
  return (
    <div className="bg-linear-to-b from-gray-50 to-white py-20">
      <div className="site-container">
        <div className="flex items-center space-x-2 mb-10">
          <TrendingUp className="w-6 h-6 text-purple-600" />
          <h2 className="text-3xl font-bold text-gray-900">
            Trending Articles
          </h2>
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
