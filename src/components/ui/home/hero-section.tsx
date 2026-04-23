import Link from "next/link";
import Image from "next/image";
import { ArrowRight, TrendingUp } from "lucide-react";
import SubmitButton from "../subscription/submit-button";
import { getSubscriptionStatus } from "@/lib/api";
import { Suspense } from "react";

async function HeroSubscribeButton() {
  const subscribed = await getSubscriptionStatus();
  if (subscribed) return null;
  return <SubmitButton className="btn-gradient gap-2" />;
}

export default function HeroSection() {
  return (
    <div className="relative overflow-hidden">
      <div className="site-container py-16 sm:py-24 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text content */}
          <div>
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/60 backdrop-blur-sm border border-gray-200 rounded-full mb-8 shadow-sm">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">
                Latest news and insights
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-5xl xl:text-6xl font-bold mb-8 leading-[1.1] tracking-tight">
              <span className="bg-linear-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                News and insights for
              </span>
              <br />
              <span className="bg-linear-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                modern web developers
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-gray-600 mb-10 max-w-xl leading-relaxed">
              Changelogs, engineering deep dives, customer stories, and
              community updates — all in one place.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/search" className="group btn-primary space-x-2">
                <span>Explore Articles</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Suspense
                fallback={
                  <div className="h-14 w-36 bg-gray-200 rounded-xl animate-pulse" />
                }
              >
                <HeroSubscribeButton />
              </Suspense>
            </div>
          </div>

          {/* Hero image */}
          <div className="relative">
            {/* Decorative background glow */}
            <div className="absolute -inset-4 bg-linear-to-r from-purple-100 to-blue-100 rounded-3xl blur-2xl opacity-60" />

            <div className="relative aspect-4/3 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-gray-900/10">
              <Image
                src="https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBuZXdzcm9vbSUyMGpvdXJuYWxpc20lMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc3MzMzOTg1OHww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Modern newsroom and journalism technology"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
