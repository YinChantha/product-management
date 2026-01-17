// app/products/[id]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { useProduct } from '@/lib/api/products';
import ProductForm from '../ProductForm';

export default function ViewProductPage() {
  const params = useParams();
  const id = parseInt(params.id as string);
  
  const { data: product, isLoading } = useProduct(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Loading product...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500">Product not found</div>
      </div>
    );
  }

  return <ProductForm mode="view" product={product} />;
}