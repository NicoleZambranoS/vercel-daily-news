import { TrendingUp } from "lucide-react";
import { Article } from "@/types/article";
import Card from "../card";

type TrendingArticlesProps = {
  trendingArticles: Article[];
};

export default function TrendingArticles({
  trendingArticles,
}: TrendingArticlesProps) {
  if (trendingArticles.length === 0) return null;

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
          {trendingArticles.slice(0, 4).map((article) => (
            <Card key={article.id} article={article} />
          ))}
        </div>
      </div>
    </div>
  );
}
