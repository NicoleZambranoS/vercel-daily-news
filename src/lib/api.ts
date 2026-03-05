import { Article, ApiResponse } from "@/types/article";

const BASE_URL = process.env.VERCEL_API_URL!;
const BYPASS_TOKEN = process.env.VERCEL_PROTECTION_BYPASS!;

async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
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
}

export async function getFeaturedArticles(): Promise<Article[]> {
  return fetchApi<Article[]>("/articles?featured=true", {
    next: { revalidate: 3600 },
  });
}

export async function getBreakingNews(): Promise<Article[]> {
  return fetchApi<Article[]>("/articles/trending", {
    headers: {
      "x-vercel-protection-bypass": BYPASS_TOKEN,
    },
    next: { revalidate: 3600 },
  });
}
