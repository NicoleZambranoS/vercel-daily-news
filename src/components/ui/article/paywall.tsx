import type { ContentBlock } from "@/types/article";
import ArticleContent from "./article-content";
import SubscribeCTA from "./subscribe-cta";
import { headers } from "next/headers";
import { fetchApi } from "@/lib/fetch";
import { Subscription } from "@/types/subscription";

type PaywallProps = {
  content: ContentBlock[];
};

const checkSubscription = async (token: string) => {
  const response = await fetchApi<Subscription>("/subscription", {
    cache: "no-store",
    headers: { "x-subscription-token": token },
  });
  return response.success && response.data.status === "active";
};

export default async function Paywall({ content }: PaywallProps) {
  const headersList = await headers();
  const token = headersList.get("x-subscription-token");

  const isActive = token ? await checkSubscription(token) : false;

  if (isActive) {
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
