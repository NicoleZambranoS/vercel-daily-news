import { Sparkles } from 'lucide-react';
import SearchComponent from '@/components/ui/search';
import { getCategories } from '@/lib/api';
import Filters from '@/components/ui/filters';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
    title: 'Search Results',
    description: `Search for articles, announcements, and updates from Vercel Daily`,
}

export default async function SearchPage() {
    // Fetch categories
    const categories = await getCategories();

    return (
        <div className="min-h-screen bg-linear-to-b from-white via-gray-50 to-white">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-linear-to-b from-purple-50/50 to-transparent">
                <div className="absolute top-0 left-1/3 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />
                <div className="absolute top-0 right-1/3 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />

                <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-16 sm:py-20 relative">
                    <div className="max-w-3xl mx-auto text-center mb-12">
                        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/60 backdrop-blur-sm border border-purple-200 rounded-full mb-6 shadow-sm">
                            <Sparkles className="w-4 h-4 text-purple-600" />
                            <span className="text-sm font-medium text-gray-700">Discover articles</span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight tracking-tight">
                            <span className="bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                Explore Our
                            </span>
                            <br />
                            <span className="bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                Knowledge Base
                            </span>
                        </h1>

                        <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                            Find articles, announcements, and updates from Vercel Daily
                        </p>

                        {/* Search and Filters */}
                        <Suspense>
                            <SearchComponent placeholder="Search articles" />
                        </Suspense>
                        <div className="flex items-center justify-between mb-5 p-6">
                            <h3 className="font-semibold text-lg">Filter by Category</h3>
                            <Suspense>
                                <Filters categories={categories} />
                            </Suspense>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
