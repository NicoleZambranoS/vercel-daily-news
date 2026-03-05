import { Article, ApiResponse, BreakingNews } from "@/types/article";

const BASE_URL = process.env.VERCEL_API_URL!;
const BYPASS_TOKEN = process.env.VERCEL_PROTECTION_BYPASS!;

async function fetchApi<T>(
  path: string,
  options?: RequestInit,
): Promise<T | null> {
  try {
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

    const json: ApiResponse<T> = await res.json();
    return json.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getFeaturedArticles(): Promise<Article[]> {
  const articles = await fetchApi<Article[]>("/articles?featured=true", {
    next: { revalidate: 3600 },
  });
  return articles || [];
}

export async function getBreakingNews(): Promise<BreakingNews | null> {
  const breakingNews = await fetchApi<BreakingNews>(`/breaking-news`, {
    next: { revalidate: 3600 },
  });
  return breakingNews;
}

export async function getArticleDetails(slug: string): Promise<Article | null> {
  const article = await fetchApi<Article>(`/articles/${slug}`, {
    next: { revalidate: 3600 },
  });
  return article || null;
}

export async function getTrendingNews(): Promise<Article[]> {
  const trendingNews = await fetchApi<Article[]>(`/articles/trending`, {
    next: { revalidate: 3600 },
  });
  return trendingNews || [];
}

export async function getCategories(): Promise<string[]> {
  const categories = await fetchApi<string[]>("/categories", {
    next: { revalidate: 3600 },
  });
  return categories || [];
}
