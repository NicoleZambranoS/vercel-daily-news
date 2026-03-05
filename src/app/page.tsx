import { ArrowRight, TrendingUp } from "lucide-react";
import Link from "next/link";
import { getFeaturedArticles, getBreakingNews } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Banner } from "@/components/ui/banner";

export default async function Home() {
  // Parallel fetch
  const [featuredArticles, breakingNews] = await Promise.all([
    getFeaturedArticles(),
    getBreakingNews(),
  ]);

  return (
    <div>
      <Banner news={breakingNews} />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-20 sm:py-28 relative">
          <div className="max-w-4xl">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/60 backdrop-blur-sm border border-gray-200 rounded-full mb-8 shadow-sm">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">Latest news and insights</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8 leading-[1.1] tracking-tight">
              <span className="bg-linear-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                News and insights for
              </span>
              <br />
              <span className="bg-linear-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                modern web developers
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-gray-600 mb-10 max-w-2xl leading-relaxed">
              Changelogs, engineering deep dives, customer stories, and community updates — all in one place.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/search"
                className="group inline-flex items-center space-x-2 bg-black text-white px-8 py-4 rounded-xl hover:bg-gray-900 transition-all font-semibold shadow-xl shadow-black/10 hover:shadow-2xl hover:shadow-black/20 hover:scale-105"
              >
                <span>Explore Articles</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/search"
                className="inline-flex items-center space-x-2 bg-linear-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all font-semibold shadow-xl shadow-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/40 hover:scale-105"
              >
                <span>Subscribe to Pro</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 pb-24">
        {/* Featured Section */}
        <section id="featured" className="mb-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-sm text-purple-600 font-semibold uppercase tracking-wider mb-2">Featured Stories</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">&quot;Editor&apos;s Picks&quot;</h2>
            </div>
            <a href="#all" className="text-sm text-gray-600 hover:text-black transition-colors hidden sm:flex items-center space-x-1 group">
              <span>View all</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredArticles.map((article) => (
              <Card key={article.id} article={article} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
