import type { ContentBlock } from "@/types/article";
import ArticleContent from "./article-content";
import SubscribeCTA from "./subscribe-cta";
import { headers } from "next/headers";

type PaywallProps = {
  content: ContentBlock[];
};

export default async function Paywall({ content }: PaywallProps) {
  const headersList = await headers();
  const subscribed = headersList.has("x-subscription-token");

  if (subscribed) {
    return <ArticleContent blocks={content} />;
  }

  return (
    <>
      <ArticleContent blocks={content.slice(0, 2)} />
      <div className="relative mt-16">
        <div className="h-32 bg-linear-to-b from-transparent to-white absolute inset-x-0 -top-32 pointer-events-none" />
        <SubscribeCTA />
      </div>
    </>
  );
}
