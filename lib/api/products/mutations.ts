// lib/api/products/mutations.ts

import {
  useMutation,
  useQueryClient,
  UseMutationResult,
} from '@tanstack/react-query';
import {
  createProduct,
  updateProduct,
  deleteProduct,
} from './endpoints';
import { productKeys } from './queries';
import {
  Product,
  ProductFormData,
  DeleteProductResponse,
} from '@/lib/types/product';

/**
 * Hook: Create Product
 * Usage:
 * const createMutation = useCreateProduct();
 * createMutation.mutate({ title: 'New Product', ... })
 */
export function useCreateProduct(): UseMutationResult<
  Product,
  Error,
  ProductFormData
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,
    // Invalidate and refetch products list after success
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}

/**
 * Hook: Update Product
 * Usage:
 * const updateMutation = useUpdateProduct();
 * updateMutation.mutate({ id: 1, data: { title: 'Updated' } })
 */
export function useUpdateProduct(): UseMutationResult<
  Product,
  Error,
  { id: number; data: Partial<ProductFormData> }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateProduct(id, data),
    // Update cache optimistically
    onSuccess: (updatedProduct) => {
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      // Update single product cache
      queryClient.setQueryData(
        productKeys.detail(updatedProduct.id),
        updatedProduct
      );
    },
  });
}

/**
 * Hook: Delete Product
 * Usage:
 * const deleteMutation = useDeleteProduct();
 * deleteMutation.mutate(1)
 */
export function useDeleteProduct(): UseMutationResult<
  DeleteProductResponse,
  Error,
  number
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    // Optimistic update: remove from list immediately
    onMutate: async (productId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: productKeys.lists() });

      // Get current lists
      const previousProducts = queryClient.getQueriesData({
        queryKey: productKeys.lists(),
      });

      // Optimistically update lists
      queryClient.setQueriesData(
        { queryKey: productKeys.lists() },
        (old: any) => {
          if (!old) return old;
          return {
            ...old,
            products: old.products.filter((p: Product) => p.id !== productId),
            total: old.total - 1,
          };
        }
      );

      // Return context for rollback
      return { previousProducts };
    },
    // Rollback on error
    onError: (err, productId, context) => {
      if (context?.previousProducts) {
        context.previousProducts.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    // Always refetch after error or success
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}