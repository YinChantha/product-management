// Main Product Interface
export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  sku: string;
  stock: number;
  category: string;
  thumbnail: string;
  meta: {
    createdAt: string;
    updatedAt: string;
    barcode: string;
    qrCode: string;
  };
}

// API Response from DummyJSON
export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

// Single Product Response
export interface ProductResponse {
  id: number;
  title: string;
  [key: string]: any;
}

// Filter Status Types
export type ProductStatus = 'all' | 'published' | 'lowstock' | 'draft';

// Query Parameters for fetching products
export interface ProductQueryParams {
  limit?: number;
  skip?: number;
  search?: string;
  category?: string;
  select?: string;
}

// Form Data for Create/Update
export interface ProductFormData {
  title: string;
  price: number;
  sku: string;
  stock: number;
  category: string;
  thumbnail?: string;
}

// Delete Response
export interface DeleteProductResponse {
  id: number;
  isDeleted: boolean;
  deletedOn: string;
}