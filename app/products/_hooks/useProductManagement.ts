import { useState, useCallback } from 'react';
import { ProductStatus } from '@/app/products/_types/product';
import { useToast } from '@/components/custom-ui/toast';
import { useExcelExport } from './useExcelExport';
import { EXPORT_COLUMNS } from '../constants';

interface ExportConfig {
  exportBatchSize?: number;
  sheetName?: string;
  getFileName?: () => string;
  makeKey: (skip: number, limit: number) => readonly unknown[];
  fetchPage: (skip: number, limit: number, signal?: AbortSignal) => Promise<any>;
  transformRow?: (original: any) => Record<string, any>;
}

export function useProductManagement() {
  const [activeStatus, setActiveStatus] = useState<ProductStatus>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isNavigating, setIsNavigating] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(new Set());
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const { showToast } = useToast();

  // Export configuration
  const exportConfig: ExportConfig = {
    exportBatchSize: 10,
    sheetName: 'Products',
    getFileName: () => {
      const date = new Date().toISOString().split('T')[0];
      const statusText = activeStatus !== 'all' ? `-${activeStatus}` : '';
      return `products${statusText}-${date}.xlsx`;
    },
    makeKey: (skip: number, limit: number) => [
      'products', 
      { limit, skip, select: 'id,title,sku,category,stock,price,thumbnail,meta' }
    ] as const,
    fetchPage: async (skip: number, limit: number, signal?: AbortSignal) => {
      const params = new URLSearchParams({
        limit: limit.toString(),
        skip: skip.toString(),
      });
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/search?${params.toString()}`,
        { signal }
      );
      
      if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);
      
      return await response.json();
    },
    transformRow: (original: any) => ({
      'ID': original.id,
      'Product Name': original.title,
      'SKU': original.sku || 'N/A',
      'Category': original.category ? 
        original.category.charAt(0).toUpperCase() + original.category.slice(1).replace(/-/g, ' ') : 'Uncategorized',
      'Stock': original.stock || 0,
      'Stock Status': (original.stock || 0) > 0 ? 'In Stock' : 'Out of Stock',
      'Price': `$${parseFloat(original.price || 0).toFixed(2)}`,
      'Image URL': original.thumbnail || '',
      'Created Date': original.meta?.createdAt ? 
        new Date(original.meta.createdAt).toLocaleDateString() : new Date().toLocaleDateString()
    }),
  };

  const exportHook = useExcelExport(exportConfig);

  // Selection helpers
  const allSelectedAcrossAllPages = useCallback(
    (allProductIds: Set<number>) => 
      allProductIds.size > 0 && 
      selectedProducts.size > 0 &&
      Array.from(allProductIds).every(id => selectedProducts.has(id)),
    [selectedProducts]
  );

  const allSelectedOnCurrentPage = useCallback(
    (products: any[]) => 
      products.length > 0 && 
      products.every(product => selectedProducts.has(product.id)),
    [selectedProducts]
  );

  // Selection handlers
  const handleSelectProduct = useCallback((id: number, checked: boolean) => {
    setSelectedProducts(prev => {
      const newSet = new Set(prev);
      checked ? newSet.add(id) : newSet.delete(id);
      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback((checked: boolean, allProductIds: Set<number>) => {
    setSelectedProducts(checked ? new Set(allProductIds) : new Set());
  }, []);

  const handleSelectAllCurrentPage = useCallback((products: any[]) => {
    const currentPageIds = new Set(products.map(p => p.id));
    const newSelected = new Set(selectedProducts);
    const allSelected = products.every(p => selectedProducts.has(p.id));
    
    allSelected 
      ? currentPageIds.forEach(id => newSelected.delete(id))
      : currentPageIds.forEach(id => newSelected.add(id));
    
    setSelectedProducts(newSelected);
  }, [selectedProducts]);

  const handleClearSelection = useCallback(() => {
    setSelectedProducts(new Set());
  }, []);

  // Export handlers
  const handleExport = useCallback(async () => {
    if (exportHook.isExporting) return;
    
    setExportError(null);
    setIsExportModalOpen(true);
    
    try {
      await exportHook.exportAll(EXPORT_COLUMNS);
      
      showToast({
        title: "Export Successful",
        message: "Products exported successfully!",
        type: "success",
        duration: 3000,
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        console.log('Export cancelled by user');
        return;
      }
      
      const errorMsg = error instanceof Error ? error.message : 'Export failed';
      setExportError(errorMsg);
      showToast({
        title: "Export Failed",
        message: errorMsg,
        type: "error",
        duration: 5000,
      });
    }
  }, [exportHook, showToast]);

  const handleCancelExport = useCallback(() => {
    if (!exportHook.isExporting) return;
    
    exportHook.cancelExport();
    
    showToast({
      title: "Export Cancelled",
      message: "Export process has been cancelled.",
      type: "info",
      duration: 3000,
    });
  }, [exportHook, showToast]);

  const handleExportModalClose = useCallback(() => {
    if (exportHook.isExporting) {
      showToast({
        title: "Export in Progress",
        message: "Export is still running. Click to cancel or wait.",
        type: "warning",
        duration: 0,
        action: {
          label: "Cancel Export",
          onClick: handleCancelExport,
        },
      });
      return;
    }
    
    setIsExportModalOpen(false);
    setExportError(null);
  }, [exportHook.isExporting, showToast, handleCancelExport]);

  // Navigation handlers
  const handlePageChange = useCallback(async (page: number, totalPages: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    
    setIsNavigating(true);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const handleStatusChange = useCallback((status: ProductStatus) => {
    setActiveStatus(status);
    setCurrentPage(1);
    handleClearSelection();
  }, [handleClearSelection]);

  // Bulk actions
  const handleBulkDelete = useCallback((selectedProducts: Set<number>) => {
    if (selectedProducts.size === 0) return;
    
    showToast({
      title: "Delete Products?",
      message: `Are you sure you want to delete ${selectedProducts.size} selected products?`,
      type: "warning",
      duration: 0,
      action: {
        label: "Delete",
        onClick: () => {
          console.log('Bulk deleting:', Array.from(selectedProducts));
          handleClearSelection();
          showToast({
            title: "Products Deleted",
            message: `Deleted ${selectedProducts.size} products successfully.`,
            type: "success",
            duration: 5000,
          });
        }
      }
    });
  }, [handleClearSelection, showToast]);

  const handleAddNew = useCallback(() => {
    window.location.href = '/products/add';
  }, []);

  const resetNavigation = useCallback(() => {
    setIsNavigating(false);
  }, []);

  return {
    // State
    activeStatus,
    currentPage,
    isNavigating,
    selectedProducts,
    isExportModalOpen,
    exportError,
    
    // Export
    exportHook,
    handleExport,
    handleCancelExport,
    handleExportModalClose,
    
    // Selection
    allSelectedAcrossAllPages,
    allSelectedOnCurrentPage,
    handleSelectProduct,
    handleSelectAll,
    handleSelectAllCurrentPage,
    handleClearSelection,
    
    // Navigation
    handlePageChange,
    handleStatusChange,
    resetNavigation,
    
    // Actions
    handleAddNew,
    handleBulkDelete,
    
    // For component use if needed
    setActiveStatus,
    setCurrentPage,
    setIsNavigating,
    setSelectedProducts,
    setIsExportModalOpen,
    setExportError,
  };
}