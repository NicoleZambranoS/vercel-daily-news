import Link from "next/link";
import { formatDate } from "@/lib/format";
import { ArrowLeft, Bookmark, Share2 } from "lucide-react";

type ArticleHeaderProps = {
    title: string;
    category: string;
    publishedAt: string;
    author: string;
}

export default function ArticleHeader({ title, category, publishedAt, author }: ArticleHeaderProps) {
    return (
        <>
            <Link
                href="/search"
                className="inline-flex items-center space-x-2 text-gray-600 hover:text-black transition-colors mb-10 group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>Back to articles</span>
            </Link>
            <div className="mb-12">
                <div className="flex items-center space-x-3 mb-6">
                    <span className="px-3 py-1.5 bg-linear-to-r from-purple-100 to-blue-100 text-purple-700 rounded-lg uppercase tracking-wider font-semibold text-xs">
                        {category}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-gray-600">{formatDate(publishedAt)}</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 leading-[1.1] tracking-tight text-gray-900">
                    {title}
                </h1>
            </div>
        </>
    );
}