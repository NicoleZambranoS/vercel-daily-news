import { getArticles } from "@/lib/api";
import EmptyState from "./empty-state";
import ErrorState from "./error-state";
import Card from "../card";
import Pagination from "@/components/ui/pagination";

type ArticlesProps = {
  query: string;
  category: string;
  page: string;
};

export default async function Articles({
  query,
  category,
  page,
}: ArticlesProps) {
  let articles, pagination;

  try {
    ({ articles, pagination } = await getArticles({ query, category, page }));
  } catch {
    return <ErrorState />;
  }

  // Empty state
  if (articles.length === 0) {
    return <EmptyState />;
  }

  // Render articles
  return (
    <>
      <div className="article-grid">
        {articles.map((article) => (
          <Card key={article.id} article={article} />
        ))}
      </div>
      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
      />
    </>
  );
}
