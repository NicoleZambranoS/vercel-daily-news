import type { Metadata } from "next";
import { getArticleDetails, getTrendingArticles } from "@/lib/api";
import ArticleHeader from "@/components/ui/article/article-header";
import ArticleBody from "@/components/ui/article/article-body";
import ArticleBodySkeleton from "@/components/ui/article/article-body-skeleton";
import FeaturedImage from "@/components/ui/article/featured-image";
import TrendingArticles from "@/components/ui/article/trending-articles";
import TrendingArticlesSkeleton from "@/components/ui/article/trending-articles-skeleton";
import { notFound } from "next/navigation";
import { Suspense } from "react";

type Props = {
  params: Promise<{ slug: string }>;
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
        { url: article.image, width: 1200, height: 630, alt: article.title },
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
  const articles = await getTrendingArticles(slug);
  return <TrendingArticles trendingArticles={articles} />;
}

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params;
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

        <Suspense fallback={<ArticleBodySkeleton />}>
          <ArticleBody slug={slug} />
        </Suspense>
      </div>

      {/* Trending Articles */}
      <Suspense fallback={<TrendingArticlesSkeleton />}>
        <TrendingSection slug={slug} />
      </Suspense>
    </>
  );
}
