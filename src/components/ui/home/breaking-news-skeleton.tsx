export default function BreakingNewsSkeleton() {
  return (
    <div className="bg-linear-to-r from-gray-900 via-black to-gray-900 text-white">
      <div className="site-container py-3.5">
        <div className="flex items-center gap-4">
          <div className="h-7 w-20 bg-white/10 rounded-md animate-pulse" />
          <span className="w-px h-4 bg-white/20 shrink-0" />
          <div className="h-4 w-64 bg-white/10 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
