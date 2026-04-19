import { Zap } from "lucide-react";
import { BreakingNews } from "@/types/article";

type BreakingNewsBannerProps = {
  news: BreakingNews | null;
};
export default function BreakingNewsBanner({ news }: BreakingNewsBannerProps) {
  if (!news) return null;
  return (
    <div className="bg-linear-to-r from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
      {/* Shimmer overlay */}
      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent pointer-events-none" />

      <div className="site-container py-3.5 relative">
        <div className="flex items-center gap-4 group">
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
            <span className="text-sm sm:text-base font-medium text-white/90 group-hover:text-white truncate block w-full">
              {news.headline}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
