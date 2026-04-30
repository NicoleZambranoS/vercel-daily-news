import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Article } from "@/types/article";
import Card from "../card";

type FeaturedArticlesProps = {
  featuredArticles: Article[];
};

export default function FeaturedArticles({
  featuredArticles,
}: FeaturedArticlesProps) {
  if (featuredArticles.length === 0) return null;

  return (
    <div className="site-container pb-24">
      {/* Featured Section */}
      <section id="featured" className="mb-20">
        <div className="mb-10">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm text-purple-600 font-semibold uppercase tracking-wider mb-2">
                Featured Stories
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                &quot;Editor&apos;s Picks&quot;
              </h2>
            </div>
            <Link
              href="/search"
              className="text-sm text-gray-600 hover:text-black transition-colors hidden sm:flex items-center space-x-1 group"
            >
              <span>View all</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="mt-4 h-px bg-gray-300" />
        </div>

        <div className="article-grid">
          {featuredArticles.map((article, index) => (
            <Card key={article.id} article={article} priority={index === 0} />
          ))}
        </div>
      </section>
    </div>
  );
}
