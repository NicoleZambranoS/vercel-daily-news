import Image from "next/image";
import Link from "next/link";

type StatusPageProps = {
    code: number;
    message: string;
    link: { href: string; label: string };
    reset?: () => void;
};

export default function StatusPage({ code, message, link, reset }: StatusPageProps) {
    return (
        <main className="flex-1 flex items-center justify-center min-h-[calc(100vh-160px)] bg-white px-6">
            <div className="site-container flex flex-col items-center text-center gap-6">
                <Image src="/vercel-black.svg" alt="Vercel Daily" width={40} height={40} className="opacity-20" />
                <h1 className="text-8xl font-semibold text-black tracking-tight">{code}</h1>
                <p className="text-lg text-gray-600 max-w-md">{message}</p>
                <div className="w-px h-8 bg-gray-200" />
                <div className="flex items-center gap-4">
                    {reset && (
                        <button
                            onClick={reset}
                            className="text-sm text-gray-600 hover:text-black transition-colors border border-gray-200 hover:border-gray-400 px-5 py-2.5 rounded-lg cursor-pointer"
                        >
                            Try again
                        </button>
                    )}
                    <Link
                        href={link.href}
                        className="text-sm text-gray-600 hover:text-black transition-colors border border-gray-200 hover:border-gray-400 px-5 py-2.5 rounded-lg"
                    >
                        {link.label}
                    </Link>
                </div>
            </div>
        </main>
    );
}
