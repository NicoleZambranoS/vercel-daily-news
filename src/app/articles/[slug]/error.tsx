'use client';

import StatusPage from "@/components/ui/status-page";

export default function ArticleError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
    return (
        <StatusPage
            code={500}
            message="Something went wrong loading this article. Please try again later."
            link={{ href: "/search", label: "Go to all articles" }}
            reset={reset}
        />
    );
}
