'use client';

import { useMemo, useEffect } from "react";
import { Download, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useProducts } from "@/lib/api/products";
import ProductStatusTabs from "./ProductStatusTabs";
import ProductList from "./ProductList";
import ProductsBulkActions from "./ProductsBulkActions";
import SearchProduct from "./Search";
import Skeleton from "@/components/ui/skeleton";
import { useProductManagement } from "./_hooks/useProductManagement";
import { ITEMS_PER_PAGE } from "./constants";
import Pagination from "@/lib/providers/pagination";
import PageHeader from "@/components/header/globle-header";
import ExportProgressModal from "@/components/custom-ui/export-progress-modal";
import { useAllProductIds } from "@/lib/api/products/queries";

export default function ProductsPage() {
  const router = useRouter();

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
    handleBulkDelete,
    resetNavigation,
  } = useProductManagement();

  const skip = (currentPage - 1) * ITEMS_PER_PAGE;

  const { data, isLoading, isFetching } = useProducts({
    limit: ITEMS_PER_PAGE,
    skip,
    select: "title,price,sku,stock,category,thumbnail,meta",
  });

  // ── Keep this! Your bulk selection across pages depends on it ──
  const { data: allProductIdsData } = useAllProductIds();
  const allProductIds = useMemo(
    () => new Set((allProductIdsData || []) as number[]),
    [allProductIdsData]
  );

  const products = data?.products || [];
  const totalProducts = data?.total || 0;
  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);

  const showSkeleton = isLoading || (isNavigating && isFetching);

  useEffect(() => {
    if (!isFetching && isNavigating) {
      resetNavigation();
    }
  }, [isFetching, isNavigating, resetNavigation]);

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Products"
        showSearch={true}
        searchPlaceholder="Search product..."
        actions={[
          {
            label: "Export Excel",
            icon: <Download className="w-4 h-4" />,
            variant: "outline",
            onClick: handleExport,
            disabled: exportHook.isExporting || products.length === 0,
            loading: exportHook.isExporting,
          },
          {
            label: "Add Product",
            icon: <Plus className="w-4 h-4" />,
            onClick: () => router.push("/products/add"),
          },
        ]}
        notificationCount={2}
      />

      {/* Modern tabs + search row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 bg-white px-8 py-4">
        <ProductStatusTabs
          activeStatus={activeStatus}
          onStatusChange={handleStatusChange}
        />
        <div className="w-full sm:w-auto pr-0 sm:pr-8">
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
                allSelectedAcrossAllPages={allSelectedAcrossAllPages(allProductIds)}
                allSelectedOnCurrentPage={allSelectedOnCurrentPage(products)}
                onSelectAll={(checked) => handleSelectAll(checked, allProductIds)}
                onSelectAllCurrentPage={() => handleSelectAllCurrentPage(products)}
                onClearSelection={handleClearSelection}
                onBulkDelete={() => handleBulkDelete(selectedProducts)}
              />
            )}

            <ProductList
              products={products}
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