import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
    return (
        <main className="flex-1 flex items-center justify-center min-h-[calc(100vh-160px)] bg-white px-6">
            <div className="site-container flex flex-col items-center text-center gap-6">
                <Image src="/vercel-black.svg" alt="Vercel Daily" width={40} height={40} className="opacity-20" />
                <h1 className="text-8xl font-semibold text-black tracking-tight">404</h1>
                <p className="text-lg text-gray-600 max-w-md">
                    This page could not be found. It may have been moved or deleted.
                </p>
                <div className="w-px h-8 bg-gray-200" />
                <Link
                    href="/"
                    className="text-sm text-gray-600 hover:text-black transition-colors border border-gray-200 hover:border-gray-400 px-5 py-2.5 rounded-lg"
                >
                    Back to Home
                </Link>
            </div>
        </main>
    );
}