"use client";

import StatusPage from "@/components/ui/status-page";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <StatusPage
      code={500}
      message="Something went wrong. Please try again later."
      link={{ href: "/", label: "Back to Home" }}
      reset={reset}
    />
  );
}
