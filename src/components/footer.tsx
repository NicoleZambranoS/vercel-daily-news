import Image from "next/image";

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white border-t border-gray-100 mt-auto">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-12">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center space-x-2">
                        <Image src="/vercel-black.svg" alt="Vercel Daily" width={28} height={28} />
                        <span className="text-sm text-gray-600">© {currentYear} Vercel Daily. All rights reserved.</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
