// lib/api/client.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  ENDPOINTS: {
    PRODUCTS: '/products',
    PRODUCTS_SEARCH: '/products/search',
    PRODUCTS_CATEGORY: '/products/category',
    CATEGORIES: '/products/categories',
  },
} as const;

export async function apiRequest<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error (${response.status}): ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Request Failed:', error);
    throw error;
  }
}

export function buildUrl(baseUrl: string, params?: Record<string, any>): string {
  if (!params) return baseUrl;

  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}