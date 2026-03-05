'use client';

import Link from 'next/link';
import { Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

interface BannerItem {
    title: string;
    link: string;
}

interface BannerProps {
    items: BannerItem[];
    intervalMs?: number;
}

// slide-up-out → swap → slide-up-in animation phases
type Phase = 'idle' | 'exit' | 'enter';

export function Banner({ items, intervalMs = 5000 }: BannerProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [phase, setPhase] = useState<Phase>('idle');

    useEffect(() => {
        if (items.length <= 1) return;

        const timer = setInterval(() => {
            // Phase 1: slide text up and out
            setPhase('exit');

            setTimeout(() => {
                // Phase 2: swap index while invisible, then slide in from below
                setCurrentIndex((prev) => (prev + 1) % items.length);
                setPhase('enter');

                setTimeout(() => setPhase('idle'), 400);
            }, 350);
        }, intervalMs);

        return () => clearInterval(timer);
    }, [items.length, intervalMs]);

    const current = items[currentIndex];

    const textStyle: React.CSSProperties = {
        transition: 'opacity 350ms cubic-bezier(0.4,0,0.2,1), transform 350ms cubic-bezier(0.4,0,0.2,1)',
        ...(phase === 'exit' && { opacity: 0, transform: 'translateY(-110%)' }),
        ...(phase === 'enter' && { opacity: 0, transform: 'translateY(110%)' }),
        ...(phase === 'idle' && { opacity: 1, transform: 'translateY(0%)' }),
    };

    return (
        <div className="bg-linear-to-r from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
            {/* Shimmer overlay */}
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent animate-pulse pointer-events-none" />

            <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-3.5 relative">
                <Link href={current.link} className="flex items-center gap-4 group">

                    {/* Left badge */}
                    <div className="flex items-center gap-2.5 shrink-0">
                        <div className="p-1.5 bg-linear-to-r from-yellow-400 to-orange-500 rounded-md shadow-lg shadow-orange-500/30">
                            <Zap className="w-3.5 h-3.5 text-black fill-black" />
                        </div>
                        <span className="px-2.5 py-1 bg-white/10 backdrop-blur-sm text-white text-xs uppercase tracking-wider font-semibold rounded-md border border-white/20">
                            Breaking
                        </span>
                    </div>

                    {/* Divider */}
                    <span className="w-px h-4 bg-white/20 shrink-0" />

                    {/* Masked sliding title */}
                    <div className="flex-1 overflow-hidden h-6 flex items-center min-w-0">
                        <span style={textStyle} className="text-sm sm:text-base font-medium text-white/90 group-hover:text-white truncate block w-full">
                            {current.title}
                        </span>
                    </div>
                </Link>
            </div>
        </div>
    );
}
