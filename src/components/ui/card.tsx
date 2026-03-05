import { formatDate } from "@/lib/format";
import { Article } from "@/types/article";
import { ArrowUpRight, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type CardProps = {
    article: Article;
}

export function Card({ article }: CardProps) {
    const featured = article.featured;
    // const isPremium = true;

    return (
        <Link
            href={`/articles/${article.slug}`}
            className={`group block bg-white rounded-2xl overflow-hidden border border-gray-200/60 hover:border-gray-300 transition-all hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1 ${featured ? 'h-full' : ''
                }`}
        >
            <div className={`relative ${featured ? 'h-72' : 'h-56'} overflow-hidden bg-linear-to-br from-gray-100 to-gray-200`}>
                <Image
                    src={`https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80`}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    width={100}
                    height={100}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* {article.isPremium && (
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md text-gray-900 px-3 py-1.5 rounded-full flex items-center space-x-1.5 text-xs font-medium shadow-lg">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Premium</span>
                    </div>
                )} */}

                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <div className="p-2 bg-white rounded-full shadow-lg">
                        <ArrowUpRight className="w-4 h-4 text-gray-900" />
                    </div>
                </div>
            </div>

            <div className="p-6">
                <div className="flex items-center space-x-2 text-xs text-gray-500 mb-3">
                    <span className="px-2 py-1 bg-gray-100 rounded-md uppercase tracking-wider font-medium text-[10px]">
                        {article.category}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span>{formatDate(article.publishedAt)}</span>
                </div>

                <h3 className={`font-semibold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-linear-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all leading-snug ${featured ? 'text-2xl' : 'text-xl'
                    }`}>
                    {article.title}
                </h3>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {article.excerpt}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-xs text-gray-500 font-medium">{article.author.name}</span>
                    <div className="flex items-center space-x-1.5 text-xs text-gray-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{formatDate(article.publishedAt)}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}