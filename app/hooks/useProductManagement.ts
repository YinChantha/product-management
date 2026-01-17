// app/products/hooks/useProductManagement.ts
import { useState, useCallback } from 'react';
import { ProductStatus } from '@/lib/types/product';
import { useToast } from '@/components/customer-ui/toast';
import { useExcelExport } from './useExcelExport';
import { EXPORT_COLUMNS } from '../products/constants';

export function useProductManagement() {
  const [activeStatus, setActiveStatus] = useState<ProductStatus>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isNavigating, setIsNavigating] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(new Set());
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const { showToast } = useToast();

  // Export hook with all export logic
  const exportHook = useExcelExport({
    exportBatchSize: 10,
    sheetName: 'Products',
    getFileName: () => {
      const date = new Date().toISOString().split('T')[0];
      const statusText = activeStatus !== 'all' ? `-${activeStatus}` : '';
      return `products${statusText}-${date}.xlsx`;
    },
    
    makeKey: (skip: number, limit: number) => [
      'products', 
      { 
        limit, 
        skip,
        select: 'id,title,sku,category,stock,price,thumbnail,meta' 
      }
    ],
    
    fetchPage: async (skip: number, limit: number, signal?: AbortSignal) => {
      const params = new URLSearchParams({
        limit: limit.toString(),
        skip: skip.toString(),
      });
      
      const response = await fetch(
        `https://dummyjson.com/products/search?${params.toString()}`,
        { signal }
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }
      
      const data = await response.json();
      return {
        products: data.products,
        total: data.total,
        skip: data.skip,
        limit: data.limit
      };
    },
    
    transformRow: (original: any) => {
      return {
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
      };
    },
  });

  // Selection management
  const allSelectedAcrossAllPages = useCallback((allProductIds: Set<number>) => {
    if (allProductIds.size === 0 || selectedProducts.size === 0) return false;
    return Array.from(allProductIds).every(id => selectedProducts.has(id));
  }, [selectedProducts]);

  const allSelectedOnCurrentPage = useCallback((products: any[]) => {
    if (products.length === 0) return false;
    return products.every(product => selectedProducts.has(product.id));
  }, [selectedProducts]);

  const handleSelectProduct = useCallback((id: number, checked: boolean) => {
    setSelectedProducts(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback((checked: boolean, allProductIds: Set<number>) => {
    if (checked) {
      setSelectedProducts(new Set(allProductIds));
    } else {
      setSelectedProducts(new Set());
    }
  }, []);

  const handleSelectAllCurrentPage = useCallback((products: any[]) => {
    const currentPageIds = new Set(products.map(p => p.id));
    const newSelected = new Set(selectedProducts);
    
    const allSelected = products.every(p => selectedProducts.has(p.id));
    
    if (allSelected) {
      currentPageIds.forEach(id => newSelected.delete(id));
    } else {
      currentPageIds.forEach(id => newSelected.add(id));
    }
    
    setSelectedProducts(newSelected);
  }, [selectedProducts]);

  const handleClearSelection = useCallback(() => {
    setSelectedProducts(new Set());
  }, []);

  // Export functions
  const handleExport = useCallback(async () => {
    if (exportHook.isExporting) return;
    
    setExportError(null);
    setIsExportModalOpen(true);
    
    try {
      await exportHook.exportAll([...EXPORT_COLUMNS]);
      
      showToast({
        title: "Export Successful",
        message: "Products exported successfully!",
        type: "success",
        duration: 3000,
      });
      
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        console.log('Export cancelled by user');
        // Don't show error for cancellation
      } else {
        const errorMsg = error instanceof Error ? error.message : 'Export failed';
        setExportError(errorMsg);
        showToast({
          title: "Export Failed",
          message: errorMsg,
          type: "error",
          duration: 5000,
        });
      }
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
      // Show confirmation toast
      showToast({
        title: "Export in Progress",
        message: "Export is still running. Click to cancel or wait.",
        type: "warning",
        duration: 0,
        action: {
          label: "Cancel Export",
          onClick: handleCancelExport,
        },
        onClose: () => {
          // When toast is dismissed, keep modal open
        }
      });
      return;
    }
    
    setIsExportModalOpen(false);
    setExportError(null);
  }, [exportHook.isExporting, showToast, handleCancelExport]);

  // Page change handler
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

  // Bulk delete with toast confirmation
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
          // Here you would call your bulk delete API
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

  // Add a function to reset navigation state
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
    
    // Setters
    setActiveStatus,
    setCurrentPage,
    setIsNavigating,
    setSelectedProducts,
    setIsExportModalOpen,
    setExportError,
    
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
    
    // UI Actions
    handleAddNew: () => window.location.href = '/products/add',
    handleBulkDelete,
  };
}