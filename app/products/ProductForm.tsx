// app/products/ProductForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/lib/types/product';
import { useCreateProduct, useUpdateProduct, useCategories } from '@/lib/api/products';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

interface ProductFormProps {
  mode: 'add' | 'edit' | 'view';
  product?: Product | null;
}

export default function ProductForm({ mode, product }: ProductFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    discountPercentage: '',
    sku: '',
    stock: '',
    category: '',
  });

  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const { data: categories } = useCategories();

  const isViewMode = mode === 'view';
  const isEditMode = mode === 'edit';
  const isAddMode = mode === 'add';

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || '',
        description: product.description || '', // DummyJSON doesn't return description in list
        price: product.price?.toString() || '',
        discountPercentage: '0',
        sku: product.sku || '',
        stock: product.stock?.toString() || '',
        category: product.category || '',
      });
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isViewMode) return;

    const productData = {
      title: formData.title,
      price: parseFloat(formData.price),
      sku: formData.sku,
      stock: parseInt(formData.stock),
      category: formData.category,
    };

    try {
      if (isEditMode && product) {
        await updateMutation.mutateAsync({
          id: product.id,
          data: productData,
        });
      } else {
        await createMutation.mutateAsync(productData);
      }
      router.push('/products');
    } catch (error) {
      console.error('Failed to save product:', error);
    }
  };

  const handleCancel = () => {
    router.push('/products');
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              {isAddMode && 'Add Product'}
              {isEditMode && 'Edit Product'}
              {isViewMode && 'Product Details'}
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Nik Shop</span>
                <select className="text-sm border-none bg-transparent text-gray-900 cursor-pointer focus:outline-none">
                  <option>Nik Shop</option>
                </select>
              </div>
              <div className="relative">
                <Button variant="ghost" size="sm" className="relative p-2">
                  <span className="text-xl">🔔</span>
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-medium">
                    2
                  </span>
                </Button>
              </div>
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            </div>
          </div>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <button 
              onClick={() => router.push('/products')}
              className="text-blue-600 hover:underline"
            >
              Product
            </button>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">
              {isAddMode && 'Add Product'}
              {isEditMode && 'Edit Product'}
              {isViewMode && 'Product Details'}
            </span>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="px-8 py-6">
        <form onSubmit={handleSubmit} className="max-w-4xl">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            {/* Action Buttons - Top Right */}
            <div className="flex justify-end gap-3 mb-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </Button>
              {!isViewMode && (
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? 'Saving...' : isEditMode ? 'Save Product' : 'Add Product'}
                </Button>
              )}
              {isViewMode && (
                <Button
                  type="button"
                  onClick={() => router.push(`/products/${product?.id}/edit`)}
                  className="gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  Edit Product
                </Button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* General Information */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    General Information
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Name
                      </label>
                      <Input
                        type="text"
                        required
                        disabled={isViewMode}
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Type product name here..."
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        disabled={isViewMode}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Type product description here..."
                        className="w-full min-h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                      />
                    </div>
                  </div>
                </div>

                {/* Pricing */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Pricing
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Base Price
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                          $
                        </span>
                        <Input
                          type="number"
                          step="0.01"
                          required
                          disabled={isViewMode}
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          placeholder="Type base price here..."
                          className="pl-7"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Discount Percentage (%)
                      </label>
                      <Input
                        type="number"
                        step="0.1"
                        disabled={isViewMode}
                        value={formData.discountPercentage}
                        onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })}
                        placeholder="Type discount percentage..."
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Inventory */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Inventory
                  </h2>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        SKU
                      </label>
                      <Input
                        type="text"
                        required
                        disabled={isViewMode}
                        value={formData.sku}
                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                        placeholder="Type product SKU here..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantity
                      </label>
                      <Input
                        type="number"
                        required
                        disabled={isViewMode}
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        placeholder="Type product quantity here..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Category */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Category
                  </h2>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Category
                    </label>
                    {/* <select
                      required
                      disabled={isViewMode}
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    >
                      <option value="">Select a category</option>
                      {categories?.map((cat) => (
                        <option key={cat} value={cat} className="capitalize">
                          {cat}
                        </option>
                      ))}
                    </select> */}

                    <select
  required
  disabled={isViewMode}
  value={formData.category}
  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
>
  <option value="">Select a category</option>
  {Array.isArray(categories) && categories.map((cat, index) => (
    <option 
      key={index} // Use index as fallback key
      value={typeof cat === 'string' ? cat : JSON.stringify(cat)}
      className="capitalize"
    >
      {typeof cat === 'string' ? cat : JSON.stringify(cat)}
    </option>
  ))}
</select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}