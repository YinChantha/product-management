"use client";

import { useMemo, useEffect } from "react";
import { useProducts } from "@/lib/api/products";
import { useAllProductIds } from "@/lib/api/products/queries";
import ProductFilterTabs from "./ProductFilterTabs";
import ProductList from "./ProductList";
import ProductsBulkActions from "./ProductsBulkActions";
import SearchProduct from "./Search";
import Skeleton from "@/components/ui/skeleton";
import { useProductManagement } from "../hooks/useProductManagement";
import { ITEMS_PER_PAGE } from "./constants";
import Header from "@/components/header/header";
import Pagination from "@/lib/providers/pagination";
import ExportProgressModal from "@/components/customer-ui/export-progress-modal";

export default function ProductsPage() {
  const {
    activeStatus,
    currentPage,
    isNavigating,
    selectedProducts,
    isExportModalOpen,
    exportError,
    exportHook,
    handleExport,
    handleCancelExport,
    handleExportModalClose,
    allSelectedAcrossAllPages,
    allSelectedOnCurrentPage,
    handleSelectProduct,
    handleSelectAll,
    handleSelectAllCurrentPage,
    handleClearSelection,
    handlePageChange,
    handleStatusChange,
    handleAddNew,
    handleBulkDelete,
    resetNavigation,
  } = useProductManagement();

  // Calculate skip value
  const skip = (currentPage - 1) * ITEMS_PER_PAGE;

  // Fetch data
  const { data, isLoading, isFetching } = useProducts({
    limit: ITEMS_PER_PAGE,
    skip,
    select: "title,price,sku,stock,category,thumbnail,meta",
  });

  const { data: allProductIdsData } = useAllProductIds();

  // Process data
  const products = data?.products || [];
  const totalProducts = data?.total || 0;
  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);
  const allProductIds = useMemo(
    () => new Set(allProductIdsData || []),
    [allProductIdsData]
  );

  // Loading states
  const showSkeleton = isLoading || (isNavigating && isFetching);

  // Reset navigation state when data loads
  useEffect(() => {
    if (!isFetching && isNavigating) {
      resetNavigation();
    }
  }, [isFetching, isNavigating, resetNavigation]);

  return (
    <div >
      <Header
        onAddNew={handleAddNew}
        onExport={handleExport}
        isExporting={exportHook.isExporting}
        productsCount={products.length}
      />
      
      <div className="flex justify-between items-center border-b border-gray-200 bg-white">
        <ProductFilterTabs
          activeStatus={activeStatus}
          onStatusChange={handleStatusChange}
        />
        <div className="pr-8">
          <SearchProduct />
        </div>
      </div>

      <ExportProgressModal
        isOpen={isExportModalOpen}
        isExporting={exportHook.isExporting}
        progress={exportHook.progress}
        processedCount={exportHook.processedCount}
        totalCount={exportHook.totalCount}
        error={exportError}
        onCancel={handleCancelExport}
        onClose={handleExportModalClose}
      />
      
      <div className="px-8 py-6">
        {showSkeleton ? (
          <Skeleton />
        ) : (
          <>
            {selectedProducts.size > 0 && (
              <ProductsBulkActions
                selectedCount={selectedProducts.size}
                totalProducts={totalProducts}
                allSelectedAcrossAllPages={allSelectedAcrossAllPages(
                  allProductIds
                )}
                allSelectedOnCurrentPage={allSelectedOnCurrentPage(products)}
                onSelectAll={(checked) =>
                  handleSelectAll(checked, allProductIds)
                }
                onSelectAllCurrentPage={() =>
                  handleSelectAllCurrentPage(products)
                }
                onClearSelection={handleClearSelection}
                onBulkDelete={() => handleBulkDelete(selectedProducts)}
              />
            )}

            <ProductList
              products={products}
              status={activeStatus}
              selectedProducts={Array.from(selectedProducts)}
              onSelectProduct={handleSelectProduct}
              onSelectAll={(checked) => handleSelectAll(checked, allProductIds)}
            />

            {totalProducts > 0 && (
              <Pagination
                currentPage={currentPage}
                totalItems={totalProducts}
                itemsPerPage={ITEMS_PER_PAGE}
                selectedCount={selectedProducts.size}
                showSelectAll={selectedProducts.size < totalProducts}
                onPageChange={(page) => handlePageChange(page, totalPages)}
                onSelectAll={() => handleSelectAll(true, allProductIds)}
                isLoading={isFetching || isNavigating}
                showResultsInfo={true}
                className="mt-6"
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}