import type { ContentBlock } from "@/types/article";
import { getSubscriptionStatus } from "@/lib/api";
import ArticleContent from "./article-content";
import SubscribeCTA from "./subscribe-cta";

type PaywallProps = {
  content: ContentBlock[];
};

export default async function Paywall({ content }: PaywallProps) {
  const subscribed = await getSubscriptionStatus();

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
