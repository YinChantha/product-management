'use client';

import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';

interface ProductsBulkActionsProps {
  selectedCount: number;
  totalProducts: number;
  allSelectedAcrossAllPages: boolean;
  allSelectedOnCurrentPage: boolean;
  onSelectAll: (checked: boolean) => void;
  onSelectAllCurrentPage: () => void;
  onClearSelection: () => void;
  onBulkDelete: () => void;
}

export default function ProductsBulkActions({
  selectedCount,
  totalProducts,
  allSelectedAcrossAllPages,
  allSelectedOnCurrentPage,
  onSelectAll,
  onSelectAllCurrentPage,
  onClearSelection,
  onBulkDelete
}: ProductsBulkActionsProps) {
  return (
    <div className="from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-4 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <Check className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <span className="text-blue-800 font-semibold">
              {selectedCount} product{selectedCount !== 1 ? 's' : ''} selected
            </span>
            <p className="text-blue-600 text-sm mt-1">
              {allSelectedAcrossAllPages 
                ? 'All products selected' 
                : `${selectedCount} of ${totalProducts} selected`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!allSelectedAcrossAllPages && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSelectAll(true)}
              className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 border-blue-200"
            >
              <Check className="w-4 h-4 mr-1" />
              Select All {totalProducts} Products
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={onSelectAllCurrentPage}
            className="text-gray-600 hover:text-gray-800 hover:bg-gray-100"
          >
            {allSelectedOnCurrentPage ? 'Deselect' : 'Select'} Current Page
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
          >
            <X className="w-4 h-4 mr-1" />
            Clear All
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={onBulkDelete}
          >
            Delete Selected
          </Button>
        </div>
      </div>
    </div>
  );
}