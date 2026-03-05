'use client';

import Link from "next/link";

export default function Error() {
    return (
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-24 text-center">
            <h1 className="text-4xl font-bold mb-4">Article Not Found</h1>
            <p className="text-gray-600 mb-8">The article you&apos;re looking for doesn&apos;t exist.</p>
            <Link href="/" className="text-blue-600 hover:underline font-medium">
                Return to homepage
            </Link>
        </div>
    );
}