
'use client';
// this is for global pagination component
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ITEMS_PER_PAGE } from '@/app/products/constants';

interface PaginationProps {
  // Required props
  currentPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  
  // Optional props
  itemsPerPage?: number;
  totalPages?: number;
  selectedCount?: number;
  showSelectAll?: boolean;
  onSelectAll?: () => void;
  isLoading?: boolean;
  showResultsInfo?: boolean;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalItems,
  onPageChange,
  itemsPerPage = ITEMS_PER_PAGE,
  totalPages: propTotalPages,
  selectedCount = 0,
  showSelectAll = false,
  onSelectAll,
  isLoading = false,
  showResultsInfo = true,
  className = '',
}: PaginationProps) {
  // Calculate total pages if not provided
  const totalPages = propTotalPages || Math.ceil(totalItems / itemsPerPage);
  
  // Calculate display range
  const startItem = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const handlePageChange = (page: number) => {
    if (isLoading || page < 1 || page > totalPages || page === currentPage) {
      return;
    }
    onPageChange(page);
  };

  // Don't render if no pages and no results info
  if (totalPages <= 1 && !showResultsInfo && selectedCount === 0) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Results Info and Select All Section */}
      {showResultsInfo && (showSelectAll || selectedCount > 0 || totalItems > 0) && (
        <div className="flex items-center justify-between px-4 py-3 rounded-lg">
          <div className="text-sm text-gray-600">
            Showing {startItem}-{endItem} of {totalItems} items
            {selectedCount > 0 && (
              <span className="ml-2 text-blue-600 font-medium">
                • {selectedCount} selected
              </span>
            )}
          </div>
          
          {/* Quick Select All Button */}
          {showSelectAll && onSelectAll && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onSelectAll}
              className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
              disabled={isLoading}
            >
              Select All {totalItems} Items
            </Button>
          )}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 py-2">
          {/* Previous Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
            className="h-10 w-10 p-0"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          {/* Page Numbers */}
          {getPageNumbers().map((page, index) => (
            <div key={index}>
              {page === '...' ? (
                <span className="px-3 py-2 text-gray-400 select-none">...</span>
              ) : (
                <Button
                  variant={currentPage === page ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => handlePageChange(page as number)}
                  disabled={isLoading}
                  className={`
                    h-10 w-10 p-0 font-medium transition-colors duration-150
                    ${currentPage === page
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }
                    ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}
                  `}
                  aria-label={`Go to page ${page}`}
                  aria-current={currentPage === page ? 'page' : undefined}
                >
                  {page}
                </Button>
              )}
            </div>
          ))}

          {/* Next Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || isLoading}
            className="h-10 w-10 p-0"
            aria-label="Next page"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      )}
    </div>
  );
}