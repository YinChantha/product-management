'use client';
import { Product, ProductStatus } from '@/lib/types/product';
import { useDeleteProduct } from '@/lib/api/products';
import { filterProductsByStatus, formatDate, formatPrice } from '@/lib/utils';
import DynamicTable, { ColumnConfig } from '@/components/table/dynamic-table';
import { useToast } from '@/components/customer-ui/toast';

interface ProductListProps {
  products: Product[];
  status: ProductStatus;
  selectedProducts: number[];
  onSelectProduct: (id: number, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
}

const DEFAULT_PRODUCT_COLUMNS: ColumnConfig[] = [
  {
    key: 'thumbnail',
    label: 'Image',
    width: '80px',
    align: 'center',
  },
  {
    key: 'title',
    label: 'Product Name',
    width: '200px',
  },
  {
    key: 'sku',
    label: 'SKU',
    width: '120px',
  },
  {
    key: 'category',
    label: 'Category',
    format: (value: string) => (
      <span className="text-gray-700 text-sm capitalize">
        {value?.replace(/-/g, ' ') || '-'}
      </span>
    ),
  },
  {
    key: 'stock',
    label: 'Stock',
    width: '80px',
    align: 'center',
  },
  {
    key: 'price',
    label: 'Price',
    width: '100px',
    align: 'right',
    format: formatPrice,
  },
  {
    key: 'meta.createdAt',
    label: 'Added',
    width: '120px',
    format: formatDate,
  },
];

export default function ProductList({
  products,
  status,
  selectedProducts,
  onSelectProduct,
  onSelectAll,
}: ProductListProps) {
  const deleteMutation = useDeleteProduct();
  const { showToast } = useToast();
  const filteredProducts = filterProductsByStatus(products, status);

  const handleEdit = (product: Product) => {
    window.location.href = `/products/${product.id}/edit`;
  };

  const handleDelete = async (product: Product) => {
    try {
      await deleteMutation.mutateAsync(product.id);
      
      showToast({
        title: 'Product Deleted',
        message: `"${product.title}" has been deleted.`,
        type: 'success',
        duration: 5000,
        action: {
          label: 'Undo',
          onClick: () => {
            showToast({
              title: 'Undo',
              message: `"${product.title}" restoration in progress...`,
              type: 'info',
              duration: 3000,
            });
          },
        },
      });
    } catch (error: any) {
      showToast({
        title: 'Delete Failed',
        message: `Failed to delete "${product.title}": ${error?.message || 'Please try again.'}`,
        type: 'error',
        duration: 5000,
      });
      throw error;
    }
  };

  return (
    <DynamicTable
      data={filteredProducts}
      columns={DEFAULT_PRODUCT_COLUMNS}
      selectedRows={selectedProducts}
      onSelectRow={(id: string | number, checked: boolean) => 
        onSelectProduct(id as number, checked)
      }
      onSelectAll={onSelectAll}
      onEdit={handleEdit}
      onDelete={handleDelete}
      getRowId={(product: Product) => product.id.toString()}
      showSelection={true}
      showActions={true}
      emptyMessage="No products found"
      deleteMessage={(product: Product) => 
        `Are you sure you want to delete "${product.title}"? This action cannot be undone.`
      }
    />
  );
}