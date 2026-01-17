// lib/utils/product-helpers.ts

import { Product, ProductStatus } from '@/lib/types/product';

/**
 * Determine product status based on stock level
 */
export function getProductStatus(stock: number): ProductStatus {
  if (stock === 0) return 'draft';
  if (stock < 50) return 'lowstock';
  return 'published';
}

/**
 * Filter products by status
 */
// export function filterProductsByStatus(
//   products: Product[],
//   status: ProductStatus
// ): Product[] {
//   if (status === 'all') return products;

//   return products.filter((product) => {
//     const productStatus = getProductStatus(product.stock);
//     return productStatus === status;
//   });
// }

/**
 * Format date string to readable format
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Format price with currency symbol
 */
export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

/**
 * Generate variant count (temporary until API provides)
 */
export function getVariantCount(productId: number): number {
  return (productId % 5) + 1;
}


export function filterProductsByStatus(products: any[], status: ProductStatus) {
  return products.filter(p => {
    if (status === 'all') return true;
    if (status === 'published') return p.stock > 0;
    if (status === 'lowstock') return p.stock > 0 && p.stock <= 10;
    if (status === 'draft') return p.stock === 0;
    return true;
  });
}

export function getSelectAllState(
  selectedCount: number,
  allSelectedAcrossAllPages: boolean,
  allSelectedOnCurrentPage: boolean,
  someSelectedOnCurrentPage: boolean
) {
  if (selectedCount === 0) return false;
  if (allSelectedAcrossAllPages) return true;
  if (allSelectedOnCurrentPage || someSelectedOnCurrentPage) return 'indeterminate';
  return false;
}