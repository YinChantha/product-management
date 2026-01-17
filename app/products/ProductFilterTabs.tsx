'use client';

import { ProductStatus } from '@/lib/types/product';

interface ProductFilterTabsProps {
  activeStatus: ProductStatus;
  onStatusChange: (status: ProductStatus) => void;
}

const statusOptions: Array<{ label: string; value: ProductStatus }> = [
  { label: 'All', value: 'all' },
  { label: 'Published', value: 'published' },
  { label: 'Low Stock', value: 'lowstock' },
  { label: 'Draft', value: 'draft' },
];

export default function ProductFilterTabs({
  activeStatus,
  onStatusChange,
}: ProductFilterTabsProps) {
  return (
      <nav className="flex space-x-8 px-8" aria-label="Tabs">
        {statusOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onStatusChange(option.value)}
            className={`
              whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium
              ${activeStatus === option.value
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }
            `}
            aria-current={activeStatus === option.value ? 'page' : undefined}
          >
            {option.label}
          </button>
        ))}
      </nav>
  );
}