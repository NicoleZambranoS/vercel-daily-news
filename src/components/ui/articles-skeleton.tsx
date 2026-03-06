export default function ArticlesSkeleton() {
    return (
        <div className="article-grid">
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-200/60 animate-pulse">
                    <div className="h-56 bg-gray-200" />
                    <div className="p-6 space-y-3">
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-16 bg-gray-200 rounded-md" />
                            <div className="h-4 w-24 bg-gray-100 rounded-md" />
                        </div>
                        <div className="h-5 w-full bg-gray-200 rounded-md" />
                        <div className="h-5 w-3/4 bg-gray-200 rounded-md" />
                        <div className="h-4 w-full bg-gray-100 rounded-md" />
                        <div className="h-4 w-5/6 bg-gray-100 rounded-md" />
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div className="h-3 w-24 bg-gray-200 rounded-md" />
                            <div className="h-3 w-20 bg-gray-200 rounded-md" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}