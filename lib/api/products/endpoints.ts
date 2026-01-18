// lib/api/products/endpoints.ts

import { apiRequest, buildUrl, API_CONFIG } from '../client';
import {
  Product,
  ProductsResponse,
  ProductQueryParams,
  ProductFormData,
  DeleteProductResponse,
} from '@/app/products/_types/product';

export async function fetchProducts(params: ProductQueryParams = {}): Promise<ProductsResponse> {
  const { limit = 10, skip = 0, search, category, select } = params;

  let url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTS}`;

  if (search) {
    url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTS_SEARCH}`;
  } else if (category && category !== 'all') {
    url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTS_CATEGORY}/${category}`;
  }

  return apiRequest<ProductsResponse>(buildUrl(url, { limit, skip, select }));
}

export async function fetchProductById(id: number): Promise<Product> {
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTS}/${id}`;
  return apiRequest<Product>(url);
}

export async function createProduct(data: ProductFormData): Promise<Product> {
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTS}/add`;
  return apiRequest<Product>(url, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateProduct(id: number, data: Partial<ProductFormData>): Promise<Product> {
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTS}/${id}`;
  return apiRequest<Product>(url, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteProduct(id: number): Promise<DeleteProductResponse> {
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTS}/${id}`;
  return apiRequest<DeleteProductResponse>(url, {
    method: 'DELETE',
  });
}

export async function fetchCategories(): Promise<string[]> {
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CATEGORIES}`;
  return apiRequest<string[]>(url);
}