import type { Article } from "@/types/article";
import { headers } from "next/headers";
import ArticleContent from "./article-content";
import SubscribeCTA from "./subscribe-cta";

type ArticleBodyProps = {
  article: Article;
};

export default async function ArticleBody({ article }: ArticleBodyProps) {
  const headersList = await headers();
  const subscribed = headersList.get("x-subscription-access") === "full";

  return (
    <div className="max-w-none mb-16">
      {subscribed ? (
        <ArticleContent blocks={article.content} />
      ) : (
        <>
          <ArticleContent blocks={article.content.slice(0, 2)} />
          <div className="relative mt-16">
            <div className="h-32 bg-linear-to-b from-transparent to-white absolute inset-x-0 -top-32 pointer-events-none" />
            <SubscribeCTA />
          </div>
        </>
      )}
    </div>
  );
}
