import { getArticles, getBreakingNews } from "@/lib/api";
import BreakingNewsBanner from "@/components/ui/home/breaking-news-banner";
import FeaturedArticles from "@/components/ui/home/featured-articles";
import HeroSection from "@/components/ui/home/hero-section";
import { Suspense } from "react";
import { Metadata } from "next";
import BreakingNewsSkeleton from "@/components/ui/home/breaking-news-skeleton";
import FeaturedArticlesSkeleton from "@/components/ui/home/featured-articles-skeleton";

export const metadata: Metadata = {
  title: "Home",
  description:
    "The latest news, tutorials, and insights for modern web developers. Breaking stories, featured articles, and deep dives.",
  openGraph: {
    title: "Vercel Daily News",
    description:
      "Breaking stories, featured articles, and deep dives for modern web developers.",
  },
};

async function BreakingNewsSection() {
  const breakingNews = await getBreakingNews();
  return <BreakingNewsBanner news={breakingNews} />;
}

async function FeaturedArticlesSection() {
  const { articles } = await getArticles({ limit: "6" });
  return <FeaturedArticles featuredArticles={articles} />;
}

export default function Home() {
  return (
    <>
      {/* Breaking News Banner Section */}
      <Suspense fallback={<BreakingNewsSkeleton />}>
        <BreakingNewsSection />
      </Suspense>

      {/* Hero Section */}
      <HeroSection />

      {/* Featured Articles Section */}
      <Suspense fallback={<FeaturedArticlesSkeleton />}>
        <FeaturedArticlesSection />
      </Suspense>
    </>
  );
}
