import Image from "next/image";
import { CurrentYear } from "@/components/ui/current-year";
import { Suspense } from "react";

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="site-container py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-2">
            <Image
              src="/vercel-icon.png"
              alt="Vercel Daily"
              width={28}
              height={28}
            />
            <span className="text-sm text-gray-600">
              ©{" "}
              <Suspense fallback="2026">
                <CurrentYear />
              </Suspense>{" "}
              Vercel Daily. All rights reserved.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
