import { ArrowLeft, Clock, Lock, Share2, Bookmark, TrendingUp } from 'lucide-react';
import { getArticleDetails, getBreakingNews } from '@/lib/api';
import Link from 'next/link';
import { formatDate } from '@/lib/format';
import Image from 'next/image';
import { ContentRenderer } from '@/components/ui/content-renderer';
import { Card } from '@/components/ui/card';
import { notFound } from 'next/navigation';

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

    // Get trending articles only if the article is fetched successfully
    const trendingArticles = await getBreakingNews();
    const isLocked = false;

    return (
        <>
            <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
                <Link
                    href="/"
                    className="inline-flex items-center space-x-2 text-gray-600 hover:text-black transition-colors mb-10 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span>Back to articles</span>
                </Link>

                <div className="mb-12">
                    <div className="flex items-center space-x-3 mb-6">
                        <span className="px-3 py-1.5 bg-linear-to-r from-purple-100 to-blue-100 text-purple-700 rounded-lg uppercase tracking-wider font-semibold text-xs">
                            {article.category}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="text-sm text-gray-600">{formatDate(article.publishedAt)}</span>
                        <span className="text-gray-400">•</span>
                        <div className="flex items-center space-x-1.5 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            {/* <span>{article.readTime} min read</span> */}
                        </div>
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 leading-[1.1] tracking-tight text-gray-900">
                        {article.title}
                    </h1>

                    <div className="flex items-center justify-between">
                        <p className="text-lg text-gray-600">By <span className="font-medium text-gray-900">{article.author.name}</span></p>
                        <div className="flex items-center space-x-2">
                            <button className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors">
                                <Bookmark className="w-5 h-5 text-gray-600" />
                            </button>
                            <button className="flex items-center space-x-2 px-4 py-2.5 hover:bg-gray-100 rounded-lg transition-colors">
                                <Share2 className="w-4 h-4 text-gray-600" />
                                <span className="text-sm font-medium text-gray-700">Share</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="relative mb-16 h-[500px] rounded-2xl overflow-hidden shadow-2xl shadow-gray-200/50">
                    <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 896px"
                        className="object-cover"
                        priority
                    />
                    {isLocked && (
                        <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/40 to-black/80 flex items-end p-10">
                            <div className="flex items-center space-x-3 text-white">
                                <div className="p-3 bg-white/20 backdrop-blur-md rounded-xl">
                                    <Lock className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="font-semibold text-lg">Premium Content</p>
                                    <p className="text-sm text-gray-200">Subscribe to unlock</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {isLocked ? (
                    <div className="bg-linear-to-br from-purple-50 via-blue-50 to-purple-50 rounded-3xl p-12 sm:p-16 text-center mb-16 border border-purple-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-200/30 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl" />

                        <div className="relative z-10">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-purple-600 to-blue-600 rounded-2xl mb-8 shadow-xl shadow-purple-500/30">
                                <Lock className="w-10 h-10 text-white" />
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                Premium Content
                            </h2>
                            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto leading-relaxed">
                                This article is exclusive to Vercel Daily Pro members. Subscribe to unlock this and all premium content.
                            </p>
                            {/* <button
                                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-10 py-4 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all font-semibold shadow-xl shadow-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/40 hover:scale-105"
                                >
                                    Subscribe to Read
                                </button> */}
                            <p className="text-sm text-gray-500 mt-4">Starting at $0 • Cancel anytime</p>
                        </div>
                    </div>
                ) : (
                    <div className="max-w-none mb-16">
                        <ContentRenderer blocks={article.content} />
                    </div>
                )}

                {/* TODO: Add a subscription logi */}
                {/* Upgrade to Pro */}
                <div className="relative overflow-hidden bg-linear-to-r from-gray-900 via-black to-gray-900 text-white rounded-3xl p-12 sm:p-16 mb-16">
                    <div className="absolute inset-0 bg-linear-to-r from-purple-600/10 via-blue-600/10 to-purple-600/10" />
                    <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

                    <div className="relative z-10">
                        <h3 className="text-3xl font-bold mb-4">Enjoying this article?</h3>
                        <p className="text-gray-300 text-lg mb-8 max-w-xl leading-relaxed">
                            Subscribe to Vercel Daily Pro for unlimited access to all premium content, early releases, and exclusive insights.
                        </p>
                        <button
                            className="bg-white text-black px-8 py-4 rounded-xl hover:bg-gray-100 transition-all font-semibold shadow-2xl hover:scale-105"
                        >
                            Upgrade to Pro
                        </button>
                    </div>
                </div>
            </div>

            {/* Trending Articles */}
            <div className="bg-linear-to-b from-gray-50 to-white py-20">
                <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
                    <div className="flex items-center space-x-2 mb-10">
                        <TrendingUp className="w-6 h-6 text-purple-600" />
                        <h2 className="text-3xl font-bold text-gray-900">Trending Articles</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {trendingArticles.map((article) => (
                            <Card key={article.id} article={article} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}