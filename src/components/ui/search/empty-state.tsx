import { Search } from "lucide-react";

export default function EmptyState() {
    return (
        <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-gray-100 to-gray-200 rounded-2xl mb-6">
                <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-3xl font-bold mb-3 text-gray-900">No articles found</h2>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
                Try adjusting your search or filters to find what you&apos;re looking for
            </p>
        </div>

    );
}