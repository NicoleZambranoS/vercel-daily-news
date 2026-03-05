import { Search, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Header() {

    return (
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
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

                    <div className="flex items-center space-x-3">
                        <Link
                            href="/search"
                            className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <Search className="w-5 h-5 text-gray-600" />
                        </Link>
                        {/* TODO: Add subscription logic */}
                        {/* {isSubscribed && (
                            <div className="hidden sm:flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                                PRO
                            </div>
                        )} */}
                        <button className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors">
                            <User className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
