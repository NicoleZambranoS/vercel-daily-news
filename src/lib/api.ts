import { ApiResponse, PaginationMeta } from "@/types/api";
import { Article, BreakingNews } from "@/types/article";
import { Category } from "@/types/categories";

const BASE_URL = process.env.VERCEL_API_URL!;
const BYPASS_TOKEN = process.env.VERCEL_PROTECTION_BYPASS!;

async function fetchApi<T>(
  path: string,
  options?: RequestInit,
): Promise<ApiResponse<T>> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "x-vercel-protection-bypass": BYPASS_TOKEN,
      ...options?.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function getBreakingNews(): Promise<BreakingNews | null> {
  try {
    const breakingNews = await fetchApi<BreakingNews>(`/breaking-news`, {
      next: { revalidate: 3600 },
    });
    return breakingNews.data || null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getArticles({
  searchParams,
}: {
  searchParams?: Promise<{
    query?: string;
    category?: string;
    page?: string;
    limit?: string;
  }>;
}): Promise<{ articles: Article[]; pagination: PaginationMeta }> {
  const { query, category, page, limit } = (await searchParams) ?? {};

  const params = new URLSearchParams({ limit: "5" });
  if (query) params.set("search", query);
  if (category) params.set("category", category);
  if (page) params.set("page", page);
  if (limit) params.set("limit", limit);

  const result = await fetchApi<Article[]>(`/articles?${params}`, {
    next: { revalidate: 3600 },
  });

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
  try {
    const article = await fetchApi<Article>(`/articles/${slug}`, {
      next: { revalidate: 3600 },
    });
    return article.data || null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getTrendingArticles(exclude: string): Promise<Article[]> {
  try {
    const trendingNews = await fetchApi<Article[]>(
      `/articles/trending?exclude=${exclude}`,
      {
        next: { revalidate: 3600 },
      },
    );
    return trendingNews.data || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const categories = await fetchApi<Category[]>("/categories", {
      next: { revalidate: 3600 },
    });
    return categories.data || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}
