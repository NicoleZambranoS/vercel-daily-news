import { getArticleDetails } from '@/lib/api';
import ArticleContent from '@/components/ui/article/article-content';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import TrendingArticles from '@/components/ui/article/trending-articles';
import ArticleHeader from '@/components/ui/article/article-header';
import FeaturedImage from '@/components/ui/article/featured-image';
import SubscribeCTA from '@/components/ui/article/subscribe-cta';

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
    // Get article details
    const article = await getArticleDetails(slug);

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
                    <ArticleContent blocks={article.content} />
                </div>

                {/* Subscribe CTA */}
                <SubscribeCTA />
            </div>

            {/* Trending Articles*/}
            <Suspense >
                <TrendingArticles articleId={article.id} />
            </Suspense>
        </>
    );
}
