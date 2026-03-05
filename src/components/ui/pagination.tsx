'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type PaginationProps = {
    currentPage: number;
    totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    function goToPage(page: number) {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', String(page));
        replace(`${pathname}?${params.toString()}`, { scroll: false });
    }

    // Build the visible page range: always show first, last, current +/- 1, with ellipsis gaps
    function getPageRange(): (number | '...')[] {
        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const range: (number | '...')[] = [1];

        if (currentPage > 3) range.push('...');

        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);
        for (let i = start; i <= end; i++) range.push(i);

        if (currentPage < totalPages - 2) range.push('...');

        range.push(totalPages);
        return range;
    }

    // If there is only one page, don't show pagination
    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center gap-1.5 mt-12">
            {/* Previous */}
            <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-30 disabled:pointer-events-none"
            >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Previous</span>
            </button>

            {/* Page numbers */}
            <div className="flex items-center gap-1">
                {getPageRange().map((page, i) =>
                    page === '...' ? (
                        <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-sm text-gray-400 select-none">
                            &hellip;
                        </span>
                    ) : (
                        <button
                            key={page}
                            onClick={() => goToPage(page)}
                            className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${page === currentPage
                                ? 'bg-black text-white'
                                : 'text-gray-600 hover:text-black hover:bg-gray-100'
                                }`}
                        >
                            {page}
                        </button>
                    )
                )}
            </div>

            {/* Next */}
            <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-30 disabled:pointer-events-none"
            >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
}
