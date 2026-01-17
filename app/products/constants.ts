// // app/products/constants.ts
// export const ITEMS_PER_PAGE = 10;

// // Remove 'as const' to make it mutable
// export const EXPORT_COLUMNS = [
//   'ID',
//   'Product Name',
//   'SKU',
//   'Category',
//   'Stock',
//   'Stock Status',
//   'Price',
//   'Image URL',
//   'Created Date'
// ];

// // export const STATUS_TABS = [
// //   { label: 'All', value: 'all' },
// //   { label: 'Published', value: 'published' },
// //   { label: 'Low Stock', value: 'lowstock' },
// //   { label: 'Draft', value: 'draft' },
// // ];



// app/products/constants.ts
import { ColumnConfig } from '@/components/table/dynamic-table';

export const ITEMS_PER_PAGE = 10;

export const EXPORT_COLUMNS = [
  'ID',
  'Product Name',
  'SKU',
  'Category',
  'Stock',
  'Stock Status',
  'Price',
  'Image URL',
  'Created Date'
];

export const STATUS_TABS = [
  { label: 'All', value: 'all' },
  { label: 'Published', value: 'published' },
  { label: 'Low Stock', value: 'lowstock' },
  { label: 'Draft', value: 'draft' },
];

// Predefined column configurations
export const TABLE_COLUMN_CONFIGS: Record<string, ColumnConfig[]> = {
  DEFAULT: [
    {
      key: 'thumbnail',
      label: 'Image',
      width: '80px',
      align: 'center',
    },
    {
      key: 'title',
      label: 'Product Name',
      width: '200px',
    },
    {
      key: 'sku',
      label: 'SKU',
      width: '120px',
    },
    {
      key: 'category',
      label: 'Category',
    },
    {
      key: 'stock',
      label: 'Stock',
      width: '80px',
      align: 'center',
    },
    {
      key: 'price',
      label: 'Price',
      width: '100px',
      align: 'right',
    },
    {
      key: 'meta.createdAt',
      label: 'Added',
      width: '120px',
    },
  ],
  COMPACT: [
    {
      key: 'title',
      label: 'Product',
      width: '250px',
    },
    {
      key: 'sku',
      label: 'SKU',
      width: '120px',
    },
    {
      key: 'stock',
      label: 'Stock',
      width: '80px',
      align: 'center',
    },
    {
      key: 'price',
      label: 'Price',
      width: '100px',
      align: 'right',
    },
  ],
  DETAILED: [
    {
      key: 'thumbnail',
      label: 'Image',
      width: '80px',
      align: 'center',
    },
    {
      key: 'title',
      label: 'Product Name',
      width: '180px',
    },
    {
      key: 'sku',
      label: 'SKU',
      width: '100px',
    },
    {
      key: 'category',
      label: 'Category',
      width: '120px',
    },
    {
      key: 'stock',
      label: 'Stock',
      width: '80px',
      align: 'center',
    },
    {
      key: 'price',
      label: 'Price',
      width: '90px',
      align: 'right',
    },
    {
      key: 'meta.createdAt',
      label: 'Created',
      width: '110px',
    },
    {
      key: 'meta.updatedAt',
      label: 'Updated',
      width: '110px',
    },
    {
      key: 'meta.barcode',
      label: 'Barcode',
      width: '130px',
    },
  ],
};