import { getArticleDetails, getSubscriptionStatus } from "@/lib/api";
import ArticleContent from "@/components/ui/article/article-content";
import { Suspense } from "react";
import TrendingArticles from "@/components/ui/article/trending-articles";
import ArticleHeader from "@/components/ui/article/article-header";
import FeaturedImage from "@/components/ui/article/featured-image";
import SubscribeCTA from "@/components/ui/article/subscribe-cta";
import TrendingArticlesSkeleton from "@/components/ui/article/trending-articles-skeleton";
import { notFound } from "next/navigation";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const slug = (await params).slug;
  const article = await getArticleDetails(slug);

  if (!article) notFound();

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: article.image ? [{ url: article.image }] : [],
    },
  };
};

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [article, subscribed] = await Promise.all([
    getArticleDetails(slug),
    getSubscriptionStatus(),
  ]);

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
          {!subscribed ? (
            <>
              <ArticleContent blocks={article.content.slice(0, 2)} />
              <div className="relative mt-16">
                <div className="h-32 bg-linear-to-b from-transparent to-white absolute inset-x-0 -top-32 pointer-events-none" />
                <SubscribeCTA subscribed={subscribed} />
              </div>
            </>
          ) : (
            <ArticleContent blocks={article.content} />
          )}
        </div>
      </div>

      {/* Trending Articles */}
      <Suspense fallback={<TrendingArticlesSkeleton />}>
        <TrendingArticles articleId={article.id} />
      </Suspense>
    </>
  );
}
