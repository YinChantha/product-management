// app/products/ProductList.tsx
'use client';

import { Product } from '@/app/products/_types/product';
import { useDeleteProduct } from '@/lib/api/products';
import { formatDate, formatPrice } from '@/lib/utils';
import DynamicTable, { ColumnConfig } from '@/components/table/dynamic-table';
import { useToast } from '@/components/custom-ui/toast';

const PRODUCT_COLUMNS: ColumnConfig[] = [
  { key: 'thumbnail', label: 'Image', width: '80px', align: 'center' },
  { key: 'title', label: 'Product Name', width: '240px' },
  { key: 'sku', label: 'SKU', width: '130px' },
  {
    key: 'category',
    label: 'Category',
    format: (v: string) => (
      <span className="text-gray-700 text-sm capitalize">{v?.replace(/-/g, ' ') || '—'}</span>
    ),
  },
  { key: 'stock', label: 'Stock', width: '90px', align: 'center' },
  {
    key: 'price',
    label: 'Price',
    width: '110px',
    align: 'right',
    format: formatPrice,
  },
  {
    key: 'meta.createdAt',
    label: 'Added',
    width: '130px',
    format: formatDate,
  },
];

interface ProductListProps {
  products: Product[];
  selectedProducts: number[];
  onSelectProduct: (id: number, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
}

export default function ProductList({
  products,
  selectedProducts,
  onSelectProduct,
  onSelectAll,
}: ProductListProps) {
  const deleteMutation = useDeleteProduct();
  const { showToast } = useToast();

  const handleEdit = (product: Product) => {
    window.location.href = `/products/${product.id}/edit`;
  };

  const handleDelete = async (product: Product) => {
    try {
      await deleteMutation.mutateAsync(product.id);
      showToast({
        title: "Product Deleted",
        message: `"${product.title}" has been deleted.`,
        type: "success",
      });
    } catch (err: any) {
      showToast({
        title: "Delete Failed",
        message: err?.message || "Please try again",
        type: "error",
      });
    }
  };

  return (
    <DynamicTable
      data={products}
      columns={PRODUCT_COLUMNS}
      selectedRows={selectedProducts.map(id => id.toString())} // Convert to strings
      onSelectRow={(id, checked) => onSelectProduct(Number(id), checked)}
      onSelectAll={onSelectAll}
      onEdit={handleEdit}
      onDelete={handleDelete}
      getRowId={(p: Product) => p.id.toString()}
      showSelection={true}
      showActions={true}
      emptyMessage="No products found"
      deleteMessage={(p: Product) => `Delete "${p.title}" permanently?`}
    />
  );

}