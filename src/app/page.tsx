import { getArticles, getBreakingNews } from "@/lib/api";
import BreakingNewsBanner from "@/components/ui/home/breaking-news-banner";
import FeaturedArticles from "@/components/ui/home/featured-articles";
import HeroSection from "@/components/ui/home/hero-section";

export default async function Home() {
  const [{ articles }, breakingNews] = await Promise.all([
    getArticles({ limit: "6" }),
    getBreakingNews(),
  ]);

  return (
    <>
      {/* Breaking News Banner Section */}
      <BreakingNewsBanner news={breakingNews} />

      {/* Hero Section */}
      <HeroSection />

      {/* Featured Articles Section */}
      <FeaturedArticles featuredArticles={articles} />
    </>
  );
}
