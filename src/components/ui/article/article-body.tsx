import { getArticleDetails } from "@/lib/api";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import ArticleContent from "./article-content";
import SubscribeCTA from "./subscribe-cta";

type ArticleBodyProps = {
  slug: string;
};

export default async function ArticleBody({ slug }: ArticleBodyProps) {
  const [article, headersList] = await Promise.all([
    getArticleDetails(slug),
    headers(),
  ]);

  if (!article) notFound();

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
