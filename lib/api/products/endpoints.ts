// lib/api/products/endpoints.ts

import { apiRequest, buildUrl, API_CONFIG } from '../client';
import {
  Product,
  ProductsResponse,
  ProductQueryParams,
  ProductFormData,
  DeleteProductResponse,
} from '@/lib/types/product';

/**
 * Fetch all products with optional filters
 */
export async function fetchProducts(
  params: ProductQueryParams = {}
): Promise<ProductsResponse> {
  const { limit = 10, skip = 0, search, category, select } = params;

  let url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTS}`;

  // Handle search
  if (search) {
    url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTS_SEARCH}`;
    url = buildUrl(url, { q: search, limit, skip, select });
  }
  // Handle category filter
  else if (category && category !== 'all') {
    url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTS_CATEGORY}/${category}`;
    url = buildUrl(url, { limit, skip, select });
  }
  // Default list
  else {
    url = buildUrl(url, { limit, skip, select });
  }

  return apiRequest<ProductsResponse>(url);
}

/**
 * Fetch single product by ID
 */
export async function fetchProductById(id: number): Promise<Product> {
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTS}/${id}`;
  return apiRequest<Product>(url);
}

/**
 * Create new product
 */
export async function createProduct(
  data: ProductFormData
): Promise<Product> {
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTS}/add`;
  return apiRequest<Product>(url, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Update existing product
 */
export async function updateProduct(
  id: number,
  data: Partial<ProductFormData>
): Promise<Product> {
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTS}/${id}`;
  return apiRequest<Product>(url, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Delete product
 */
export async function deleteProduct(
  id: number
): Promise<DeleteProductResponse> {
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTS}/${id}`;
  return apiRequest<DeleteProductResponse>(url, {
    method: 'DELETE',
  });
}

/**
 * Fetch all categories
 */
export async function fetchCategories(): Promise<string[]> {
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CATEGORIES}`;
  return apiRequest<string[]>(url);
}