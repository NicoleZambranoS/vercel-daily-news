'use client';
import { Category } from "@/types/categories";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type FiltersProps = {
    categories: Category[];
}

export default function Filters({ categories }: FiltersProps) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleCategoryChange = (categoryId: string) => {
        const params = new URLSearchParams(searchParams);
        if (categoryId) {
            params.set('category', categoryId);
        } else {
            params.delete('category');
        }
        replace(`${pathname}?${params.toString()}`);
    }

    return (
        <select className="bg-white border-2 border-gray-200 rounded-2xl p-6 mb-6 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300" onChange={(e) => handleCategoryChange(e.target.value)}>
            <option value="all">All</option>
            <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                    <option key={category.slug} value={category.slug} className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${searchParams.get('category') === category.slug
                        ? 'bg-linear-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/30'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}>{category.name}</option>
                ))}
            </div>
        </select>
    );
}