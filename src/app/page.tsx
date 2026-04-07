import { getArticles, getBreakingNews } from "@/lib/api";
import BreakingNewsBanner from "@/components/ui/home/breaking-news-banner";
import FeaturedArticles from "@/components/ui/home/featured-articles";
import HeroSection from "@/components/ui/home/hero-section";

export default async function Home() {
  // Parallel fetch
  const [featuredArticles, breakingNews] = await Promise.all([
    getArticles({ searchParams: Promise.resolve({ limit: "6" }) }),
    getBreakingNews(),
  ]);

  return (
    <>
      {/* Breaking News Banner Section */}
      <BreakingNewsBanner news={breakingNews} />

      {/* Hero Section */}
      <HeroSection />

      {/* Featured Articles Section */}
      <FeaturedArticles featuredArticles={featuredArticles.articles ?? []} />
    </>
  );
}
