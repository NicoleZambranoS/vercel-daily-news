import type { ApiResponse } from "@/types/api";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

const BASE_URL = requireEnv("VERCEL_API_URL");
const BYPASS_TOKEN = requireEnv("VERCEL_PROTECTION_BYPASS");

export async function fetchApi<T>(
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
    throw new Error(`${res.status}`);
  }

  return res.json();
}
