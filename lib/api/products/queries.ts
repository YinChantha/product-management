// lib/api/products/queries.ts

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import {
  fetchProducts,
  fetchProductById,
  fetchCategories,
} from './endpoints';
import {
  Product,
  ProductsResponse,
  ProductQueryParams,
} from '@/lib/types/product';

/**
 * Query Keys
 * Centralized for cache management
 */
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (params: ProductQueryParams) => [...productKeys.lists(), params] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: number) => [...productKeys.details(), id] as const,
  categories: ['category-list'] as const,
};

/**
 * Hook: Fetch Products List
 * Usage: const { data, isLoading, error } = useProducts({ limit: 10, skip: 0 })
 */
export function useProducts(
  params: ProductQueryParams = {}
): UseQueryResult<ProductsResponse, Error> {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => fetchProducts(params),
    // Keep previous data while fetching new data
    placeholderData: (prev) => prev,
  });
}

/**
 * Hook: Fetch Single Product
 * Usage: const { data, isLoading } = useProduct(1)
 */
export function useProduct(
  id: number
): UseQueryResult<Product, Error> {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => fetchProductById(id),
    // Only fetch if we have a valid ID
    enabled: !!id && id > 0,
  });
}

/**
 * Hook: Fetch Categories
 * Usage: const { data: categories } = useCategories()
 */
export function useCategories(): UseQueryResult<string[], Error> {
  return useQuery({
    queryKey: productKeys.categories,
    queryFn: fetchCategories,
    // Categories rarely change, cache for 1 hour
    staleTime: 60 * 60 * 1000,
  });
}




// lib/api/products/queries.ts - Add this function
/**
 * Hook: Fetch All Product IDs (for bulk selection)
 * This fetches only IDs for efficiency
 */
export function useAllProductIds(): UseQueryResult<number[], Error> {
  return useQuery({
    queryKey: productKeys.list({ limit: 1000, select: 'id' }),
    queryFn: () => 
      fetchProducts({ limit: 1000, select: 'id' })
        .then(res => res.products.map(p => p.id)),
    // Cache for 10 minutes
    staleTime: 10 * 60 * 1000,
  });
}