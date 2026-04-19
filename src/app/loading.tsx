export default function HomeLoading() {
  return (
    <>
      {/* Breaking news skeleton */}
      <div className="bg-linear-to-r from-gray-900 via-black to-gray-900 text-white">
        <div className="site-container py-3.5">
          <div className="flex items-center gap-4">
            <div className="h-7 w-20 bg-white/10 rounded-md animate-pulse" />
            <span className="w-px h-4 bg-white/20 shrink-0" />
            <div className="h-4 w-64 bg-white/10 rounded animate-pulse" />
          </div>
        </div>
      </div>

      {/* Hero skeleton */}
      <div className="relative overflow-hidden">
        <div className="site-container py-16 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-6">
              <div className="h-8 w-48 bg-gray-200 rounded-full animate-pulse" />
              <div className="space-y-3">
                <div className="h-12 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-12 w-3/4 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="h-6 w-96 max-w-full bg-gray-200 rounded animate-pulse" />
              <div className="flex gap-4">
                <div className="h-12 w-40 bg-gray-200 rounded-lg animate-pulse" />
                <div className="h-12 w-36 bg-gray-200 rounded-lg animate-pulse" />
              </div>
            </div>
            <div className="aspect-4/3 bg-gray-200 rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>

      {/* Featured articles skeleton */}
      <div className="site-container pb-24">
        <section className="mb-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="h-4 w-28 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-9 w-48 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
          <div className="article-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl overflow-hidden border border-gray-200/60"
              >
                <div className="h-56 bg-gray-200 animate-pulse" />
                <div className="p-6 space-y-3">
                  <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                  <div className="h-5 w-full bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
