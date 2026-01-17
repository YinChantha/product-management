// lib/api/products/index.ts
/**
 * Centralized exports for products API
 * Makes imports cleaner throughout the app
 */

// Queries
export {
  useProducts,
  useProduct,
  useCategories,
  productKeys,
} from './queries';

// Mutations
export {
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from './mutations';

// Direct endpoint functions (if needed)
export {
  fetchProducts,
  fetchProductById,
  fetchCategories,
  createProduct,
  updateProduct,
  deleteProduct,
} from './endpoints';

