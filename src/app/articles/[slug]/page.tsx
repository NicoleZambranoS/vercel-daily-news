import type { Metadata } from "next";
import { getArticleDetails, getTrendingArticles } from "@/lib/api";
import ArticleContent from "@/components/ui/article/article-content";
import TrendingArticles from "@/components/ui/article/trending-articles";
import ArticleHeader from "@/components/ui/article/article-header";
import FeaturedImage from "@/components/ui/article/featured-image";
import SubscribeCTA from "@/components/ui/article/subscribe-cta";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import TrendingArticlesSkeleton from "@/components/ui/article/trending-articles-skeleton";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ access?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleDetails(slug);

  if (!article) {
    return {
      title: "Article Not Found",
      description: "The requested article could not be found.",
    };
  }

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [
        {
          url: article.image,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
      type: "article",
      publishedTime: article.publishedAt,
      authors: [article.author.name],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [article.image],
    },
  };
}

async function TrendingSection({ slug }: { slug: string }) {
  const trendingArticles = await getTrendingArticles(slug);
  return <TrendingArticles trendingArticles={trendingArticles} />;
}

export default async function ArticleDetailPage({
  params,
  searchParams,
}: Props) {
  const [{ slug }, { access }] = await Promise.all([params, searchParams]);
  const subscribed = access === "full";

  const article = await getArticleDetails(slug);

  if (!article) notFound();

  return (
    <>
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
        {/* Header */}
        <ArticleHeader
          title={article.title}
          category={article.category}
          publishedAt={article.publishedAt}
          author={article.author.name}
        />

        {/* Featured Image */}
        <FeaturedImage src={article.image} alt={article.title} />

        {/* Article Content */}
        <div className="max-w-none mb-16">
          {subscribed ? (
            <ArticleContent blocks={article.content} />
          ) : (
            <>
              <ArticleContent blocks={article.content.slice(0, 2)} />
              <div className="relative mt-16">
                <div className="h-32 bg-linear-to-b from-transparent to-white absolute inset-x-0 -top-32 pointer-events-none" />
                <SubscribeCTA />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Trending Articles — streams in independently via Suspense */}
      <Suspense fallback={<TrendingArticlesSkeleton />}>
        <TrendingSection slug={slug} />
      </Suspense>
    </>
  );
}
