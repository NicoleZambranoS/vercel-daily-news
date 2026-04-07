import { AlertCircle } from "lucide-react";
import Link from "next/link";

export default function ErrorState() {
    return (
        <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-gray-100 to-gray-200 rounded-2xl mb-6">
                <AlertCircle className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-3xl font-bold mb-3 text-gray-900">Failed to load articles</h2>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
                Something went wrong fetching articles. Please try again.
            </p>
            <Link
                href="/search"
                className="text-sm text-gray-600 hover:text-black transition-colors border border-gray-200 hover:border-gray-400 px-5 py-2.5 rounded-lg"
            >
                Try again
            </Link>
        </div>
    );
}
