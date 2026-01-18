'use client';
import { useParams } from 'next/navigation';
import { useProduct } from '@/lib/api/products';
import { ProductForm } from '../ProductForm';

export default function ProductPage() {
  const { slug } = useParams<{ slug: string[] }>();

  // Determine mode and productId
  const isAdd = slug?.[0] === 'add';
  const isEdit = slug?.length === 2 && slug[1] === 'edit';
  const mode = isAdd ? 'add' : isEdit ? 'edit' : 'view';
  const productId = !isAdd ? parseInt(slug[0]) : null;

  // Fetch product (skip if add mode)
  const { data: product, isLoading, error } = useProduct(productId as number);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  // Error state
  if (!isAdd && (!product || error)) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500">Product not found</div>
      </div>
    );
  }
//   dynamic based on mode edit, view or add
  return <ProductForm mode={mode} product={isAdd ? null : product} />;
}