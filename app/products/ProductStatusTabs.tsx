'use client';

import { ProductStatus } from '@/app/products/_types/product';
import { StatusTabs } from '@/components/ui/status-tabs';

const STATUS_OPTIONS = [
  { label: 'All', value: 'all' as const },
  { label: 'Published', value: 'published' as const },
  { label: 'Low Stock', value: 'lowstock' as const },
  { label: 'Draft', value: 'draft' as const },
] satisfies Array<{ label: string; value: ProductStatus }>;

interface ProductStatusTabsProps {
  activeStatus: ProductStatus;
  onStatusChange: (status: ProductStatus) => void;
  className?: string;
}

export default function ProductStatusTabs({
  activeStatus,
  onStatusChange,
  className,
}: ProductStatusTabsProps) {
  return (
    <StatusTabs<ProductStatus>
      options={STATUS_OPTIONS}
      activeValue={activeStatus}
      onChange={onStatusChange}
      className={className}
    />
  );
}