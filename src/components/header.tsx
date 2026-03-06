import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";

export default function Header() {

    return (
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
            <div className="site-container">
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center space-x-12">
                        <Link href="/" className="flex items-center space-x-2 group">
                            <Image src="/vercel-black.svg" alt="Vercel Daily" width={28} height={28} />
                            <span className="font-medium text-xl text-black">Vercel Daily</span>
                        </Link>

                        <nav className="hidden md:flex items-center space-x-8">
                            <Link
                                href="/"
                                className="text-sm text-gray-600 hover:text-black transition-colors"
                            >
                                Home
                            </Link>
                            <Link
                                href="/search"
                                className="text-sm text-gray-600 hover:text-black transition-colors"
                            >
                                Explore
                            </Link>
                        </nav>
                    </div>


                    <div className="flex items-center gap-2">
                        <Link
                            href="/search"
                            aria-label="Search articles"
                            className="flex md:hidden items-center justify-center w-9 h-9 rounded-lg text-gray-600 hover:text-black hover:bg-gray-100 transition-colors"
                        >
                            <Search className="w-5 h-5" />
                        </Link>

                        {/* TODO: Add subscription logic */}
                        <div className="hidden sm:flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-linear-to-r from-purple-600 to-blue-600 text-white">
                            PRO
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
