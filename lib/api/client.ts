// lib/api/client.ts

/**
 * Base API Client Configuration
 * Centralized API configuration for all requests
 */

export const API_CONFIG = {
  BASE_URL: 'https://dummyjson.com',
  ENDPOINTS: {
    PRODUCTS: '/products',
    PRODUCTS_SEARCH: '/products/search',
    PRODUCTS_CATEGORY: '/products/category-list',
    CATEGORIES: '/products/category-list',
  },
  DEFAULT_LIMIT: 10,
} as const;

/**
 * Generic API request handler with error handling
 */
export async function apiRequest<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`API Request Failed: ${error.message}`);
    }
    throw new Error('Unknown API Error');
  }
}

/**
 * Build URL with query parameters
 */
export function buildUrl(
  baseUrl: string,
  params?: Record<string, string | number | undefined>
): string {
  if (!params) return baseUrl;

  const filteredParams = Object.entries(params)
    .filter(([_, value]) => value !== undefined)
    .reduce((acc, [key, value]) => {
      acc[key] = String(value);
      return acc;
    }, {} as Record<string, string>);

  const queryString = new URLSearchParams(filteredParams).toString();
  const separator = baseUrl.includes('?') ? '&' : '?';
  
  return queryString ? `${baseUrl}${separator}${queryString}` : baseUrl;
}