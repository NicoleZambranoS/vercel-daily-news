import { getArticleDetails } from '@/lib/api';
import ArticleContent from '@/components/ui/article/article-content';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import TrendingArticles from '@/components/ui/article/trending-articles';
import ArticleHeader from '@/components/ui/article/article-header';
import FeaturedImage from '@/components/ui/article/featured-image';
import SubscribeCTA from '@/components/ui/article/subscribe-cta';
import { isSubscribed } from '@/lib/subscription';

export const generateMetadata = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const slug = (await params).slug;
    const article = await getArticleDetails(slug);
    return {
        title: article?.title,
        description: article?.excerpt,
    };
};

export default async function ArticleDetailPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const slug = params.slug;

    // Get article details and subscription status
    const [article, subscribed] = await Promise.all([getArticleDetails(slug), isSubscribed()]);

    if (!article) {
        notFound();
    }

    return (
        <>
            <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
                {/* Header */}
                <ArticleHeader title={article.title} category={article.category} publishedAt={article.publishedAt} author={article.author.name} />

                {/* Featured Image */}
                <FeaturedImage src={article.image} alt={article.title} />

                {/* Article Content */}
                <div className="max-w-none mb-16">
                    {
                        !subscribed ? (
                            <>
                                <ArticleContent blocks={article.content.slice(0, 2)} />
                                <div className="relative mt-16">
                                    <div className="h-32 bg-linear-to-b from-transparent to-white absolute inset-x-0 -top-32 pointer-events-none" />
                                    <SubscribeCTA />
                                </div></>
                        ) : (
                            <ArticleContent blocks={article.content} />
                        )}
                </div>
            </div>

            {/* Trending Articles*/}
            <Suspense >
                <TrendingArticles articleId={article.id} />
            </Suspense>
        </>
    );
}
