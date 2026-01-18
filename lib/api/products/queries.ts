// lib/api/products/queries.ts

import { useQuery } from '@tanstack/react-query';
import { fetchProducts, fetchProductById, fetchCategories } from './endpoints';
import { Product, ProductsResponse, ProductQueryParams } from '@/app/products/_types/product';

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (params: ProductQueryParams) => [...productKeys.lists(), params] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: number) => [...productKeys.details(), id] as const,
  categories: ['categories'] as const,
};

export function useProducts(params: ProductQueryParams = {}) {
  return useQuery<ProductsResponse, Error>({
    queryKey: productKeys.list(params),
    queryFn: () => fetchProducts(params),
    placeholderData: (prev) => prev,
  });
}

export function useProduct(id: number) {
  return useQuery<Product, Error>({
    queryKey: productKeys.detail(id),
    queryFn: () => fetchProductById(id),
    enabled: !!id,
  });
}

export function useCategories() {
  return useQuery<string[], Error>({
    queryKey: productKeys.categories,
    queryFn: fetchCategories,
    staleTime: 3600000, // 1 hour
  });
}

export function useAllProductIds() {
  return useQuery<number[], Error>({
    queryKey: productKeys.list({ limit: 1000, select: 'id' }),
    queryFn: () => 
      fetchProducts({ limit: 1000, select: 'id' })
        .then(res => res.products.map(p => p.id)),
    staleTime: 600000, // 10 minutes
  });
}