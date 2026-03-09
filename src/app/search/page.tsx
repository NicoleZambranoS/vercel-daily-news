import { getCategories } from '@/lib/api';
import { Metadata } from 'next';
import { Suspense } from 'react';
import Articles from '@/components/ui/search/articles';
import ArticlesSkeleton from '@/components/ui/search/articles-skeleton';
import SearchHeroSection from '@/components/ui/search/search-hero-section';
import SearchInput from '@/components/ui/search/search-input';
import CategoryFilter from '@/components/ui/search/category-filter';

export const metadata: Metadata = {
    title: 'Search Results',
    description: `Search for articles, announcements, and updates from Vercel Daily`,
}

export default async function SearchPage(props: { searchParams: Promise<{ query?: string; category?: string; page?: string }> }) {
    const searchParams = await props.searchParams;
    const { query, category, page } = searchParams ?? {};

    // Fetch categories
    const categories = await getCategories();

    return (
        <div className="min-h-screen bg-linear-to-b from-white via-gray-50 to-white">
            {/* Hero Section */}
            <SearchHeroSection />

            <div className="site-container pb-24">
                {/* Search Input */}
                <div className="max-w-3xl mx-auto text-center">
                    <Suspense>
                        <SearchInput placeholder="Search articles" />
                    </Suspense>
                </div>
                {/* Category Filter */}
                <div className="flex items-center justify-between mb-5 p-6">
                    <h3 className="font-semibold text-lg">Filter by Category</h3>
                    <Suspense>
                        <CategoryFilter categories={categories} />
                    </Suspense>
                </div>

                {/* Articles Section */}
                <Suspense key={`${query}-${category}-${page}`} fallback={<ArticlesSkeleton />}>
                    <Articles query={query ?? ''} category={category ?? ''} page={page ?? '1'} />
                </Suspense>
            </div>
        </div>
    );
}
