import type { PaginationMeta } from "@/types/api";
import type { Article, BreakingNews } from "@/types/article";
import type { Category } from "@/types/categories";
import { fetchApi } from "@/lib/fetch";
import { cacheLife } from "next/cache";

export async function getBreakingNews(): Promise<BreakingNews | null> {
  "use cache";
  cacheLife({ stale: 60, revalidate: 300, expire: 3600 });

  try {
    const res = await fetchApi<BreakingNews>("/breaking-news");
    return res.data ?? null;
  } catch {
    return null;
  }
}

export async function getArticles(searchParams?: {
  query?: string;
  category?: string;
  page?: string;
  limit?: string;
}): Promise<{ articles: Article[]; pagination: PaginationMeta }> {
  "use cache";
  cacheLife({ stale: 300, revalidate: 1800, expire: 3600 });

  const { query, category, page, limit } = searchParams ?? {};

  const params = new URLSearchParams({ limit: limit ?? "5" });
  if (query) params.set("search", query);
  if (category) params.set("category", category);
  if (page) params.set("page", page);

  const res = await fetchApi<Article[]>(`/articles?${params}`);

  return {
    articles: res.data ?? [],
    pagination: res.meta?.pagination ?? {
      page: 1,
      limit: parseInt(limit ?? "5"),
      total: 0,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  };
}

export async function getArticleDetails(slug: string): Promise<Article | null> {
  "use cache";
  cacheLife({ stale: 600, revalidate: 3600, expire: 86400 });

  try {
    const res = await fetchApi<Article>(`/articles/${slug}`);
    return res.data ?? null;
  } catch (error) {
    if (error instanceof Error && error.message === "404") return null;
    throw error;
  }
}

export async function getTrendingArticles(exclude: string): Promise<Article[]> {
  "use cache";
  cacheLife({ stale: 300, revalidate: 1800, expire: 3600 });

  try {
    const res = await fetchApi<Article[]>(
      `/articles/trending?exclude=${exclude}`,
    );
    return res.data ?? [];
  } catch {
    return [];
  }
}

export async function getCategories(): Promise<Category[]> {
  "use cache";
  cacheLife({ stale: 3600, revalidate: 3600, expire: 86400 });

  try {
    const res = await fetchApi<Category[]>("/categories");
    return res.data ?? [];
  } catch {
    return [];
  }
}
