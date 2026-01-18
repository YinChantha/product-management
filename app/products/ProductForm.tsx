"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/app/products/_types/product";
import {
  useCreateProduct,
  useUpdateProduct,
  useCategories,
} from "@/lib/api/products";
import { Input } from "@/components/ui/input";
import { X, Plus } from "lucide-react";
import PageHeader from "@/components/header/header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductFormProps {
  mode: "add" | "edit" | "view";
  product?: Product | null;
}

export function ProductForm({ mode, product }: ProductFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    discountPercentage: "",
    sku: "",
    stock: "",
    category: "",
  });

  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const { data: categories } = useCategories();

  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";
  const isAddMode = mode === "add";
  const isLoading = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || "",
        description: product.description || "",
        price: product.price?.toString() || "",
        discountPercentage: "0",
        sku: product.sku || "",
        stock: product.stock?.toString() || "",
        category: product.category || "",
      });
    }
  }, [product]);

  const handleSubmit = async () => {
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
        await updateMutation.mutateAsync({ id: product.id, data: productData });
      } else {
        await createMutation.mutateAsync(productData);
      }
      router.push("/products");
    } catch (error) {
      console.error("Failed to save product:", error);
    }
  };

  const pageTitle = isAddMode
    ? "Add Product"
    : isEditMode
    ? "Edit Product"
    : "Product Details";

  // Actions based on mode - shown in header
  const headerActions = isViewMode
    ? []
    : [
        {
          label: "Cancel",
          icon: <X className="w-4 h-4" />,
          variant: "outline" as const,
          onClick: () => router.push("/products"),
        },
        {
          label: isEditMode ? "Save Product" : "Add Product",
          icon: <Plus className="w-4 h-4" />,
          onClick: handleSubmit,
          disabled: isLoading,
          loading: isLoading,
        },
      ];

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title={pageTitle}
        breadcrumbs={[
          { label: "Product", onClick: () => router.push("/products") },
          { label: pageTitle },
        ]}
        actions={headerActions}
        notificationCount={2}
      />

      <div className="px-8 py-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
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
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="Type product name here..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      disabled={isViewMode}
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
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
                        onChange={(e) =>
                          setFormData({ ...formData, price: e.target.value })
                        }
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
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          discountPercentage: e.target.value,
                        })
                      }
                      placeholder="Type discount percentage..."
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
                      onChange={(e) =>
                        setFormData({ ...formData, sku: e.target.value })
                      }
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
                      onChange={(e) =>
                        setFormData({ ...formData, stock: e.target.value })
                      }
                      placeholder="Type product quantity here..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Category
                </h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Category
                  </label>

                  <Select
                    disabled={isViewMode}
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                    required
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>

                    <SelectContent>
                      {Array.isArray(categories) &&
                        categories.map((cat, index) => {
                          // Normalize category value & display (handles string or object cases)
                          const value =
                            typeof cat === "string" ? cat : JSON.stringify(cat);
                          const label =
                            typeof cat === "string" ? cat : JSON.stringify(cat);

                          return (
                            <SelectItem
                              key={index}
                              value={value}
                              className="capitalize"
                            >
                              {label}
                            </SelectItem>
                          );
                        })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
