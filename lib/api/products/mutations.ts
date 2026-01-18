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
import { DeleteProductResponse, Product, ProductFormData } from '@/app/products/_types/product';

export function useCreateProduct(): UseMutationResult<
  Product,
  Error,
  ProductFormData
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}

export function useUpdateProduct(): UseMutationResult<
  Product,
  Error,
  { id: number; data: Partial<ProductFormData> }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateProduct(id, data),
    onSuccess: (updatedProduct) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.setQueryData(
        productKeys.detail(updatedProduct.id),
        updatedProduct
      );
    },
  });
}

export function useDeleteProduct(): UseMutationResult<
  DeleteProductResponse,
  Error,
  number
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: productKeys.lists() });

      const previousProducts = queryClient.getQueriesData({
        queryKey: productKeys.lists(),
      });

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

      return { previousProducts };
    },
    onError: (err, productId, context) => {
      if (context?.previousProducts) {
        context.previousProducts.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}