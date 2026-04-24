import { PaginationMeta } from "@/types/api";
import { Article, BreakingNews } from "@/types/article";
import { Category } from "@/types/categories";
import { fetchApi } from "@/lib/fetch";
import { cacheLife } from "next/cache";
import { cookies } from "next/headers";

export async function getBreakingNews(): Promise<BreakingNews | null> {
  "use cache";
  cacheLife({ revalidate: 300 });

  try {
    const breakingNews = await fetchApi<BreakingNews>(`/breaking-news`);
    return breakingNews.data || null;
  } catch (error) {
    console.error(error);
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
  cacheLife({ revalidate: 1800 });

  const { query, category, page, limit } = searchParams ?? {};

  const params = new URLSearchParams({ limit: "5" });
  if (query) params.set("search", query);
  if (category) params.set("category", category);
  if (page) params.set("page", page);
  if (limit) params.set("limit", limit);

  const result = await fetchApi<Article[]>(`/articles?${params}`);

  return {
    articles: result.data ?? [],
    pagination: result.meta?.pagination ?? {
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
  cacheLife({ revalidate: 3600 });

  try {
    const article = await fetchApi<Article>(`/articles/${slug}`);
    return article.data || null;
  } catch (error) {
    if (error instanceof Error && error.message.includes("404")) return null;
    throw error;
  }
}

export async function getTrendingArticles(exclude: string): Promise<Article[]> {
  "use cache";
  cacheLife({ revalidate: 1800 });

  try {
    const trendingNews = await fetchApi<Article[]>(
      `/articles/trending?exclude=${exclude}`,
    );
    return trendingNews.data || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getCategories(): Promise<Category[]> {
  "use cache";
  cacheLife({ revalidate: 3600 });

  try {
    const categories = await fetchApi<Category[]>("/categories");
    return categories.data || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getSubscriptionStatus(): Promise<boolean> {
  const cookieStore = await cookies();
  return !!cookieStore.get("subscription-token")?.value;
}
