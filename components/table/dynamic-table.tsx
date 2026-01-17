// components/ui/dynamic-table.tsx
'use client';

import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table/table';
import Skeleton from '../ui/skeleton';
import { ModelAlert } from '../model/model';

export interface ColumnConfig {
  key: string;
  label: string;
  format?: (value: any, row: any) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface DynamicTableProps<T> {
  data: T[];
  columns: ColumnConfig[];
  selectedRows?: (string | number)[];
  onSelectRow?: (id: string | number, checked: boolean) => void;
  onSelectAll?: (checked: boolean) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => Promise<void> | void;
  getRowId?: (row: T) => string | number;
  isLoading?: boolean;
  emptyMessage?: string;
  showActions?: boolean;
  showSelection?: boolean;
  deleteMessage?: (row: T) => string;
}

const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

const getRowId = (row: any): string => row.id?.toString() || '';

export default function DynamicTable<T extends Record<string, any>>({
  data,
  columns,
  selectedRows = [],
  onSelectRow,
  onSelectAll,
  onEdit,
  onDelete,
  getRowId: customGetRowId = getRowId,
  isLoading = false,
  emptyMessage = 'No data found',
  showActions = false,
  showSelection = false,
  deleteMessage = (row: T) => `Are you sure you want to delete this item?`,
}: DynamicTableProps<T>) {
  const [rowToDelete, setRowToDelete] = useState<T | null>(null);

  if (isLoading) return <Skeleton />;

  const allSelected = data.length > 0 && data.every(row => selectedRows.includes(customGetRowId(row)));
  const colSpan = columns.length + (showSelection ? 1 : 0) + (showActions && (onEdit || onDelete) ? 1 : 0);
  const hasActions = showActions && (onEdit || onDelete);

  const handleDelete = async (row: T) => {
    try {
      await onDelete?.(row);
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const getItemName = (row: T): string => {
    const item = row as any;
    return item?.title || item?.name || 'this item';
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            {showSelection && (
              <TableHead className="w-12">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={() => onSelectAll?.(!allSelected)}
                  disabled={data.length === 0}
                />
              </TableHead>
            )}
            
            {columns.map(({ key, label, align, width }) => (
              <TableHead
                key={key}
                className={`text-xs font-medium text-gray-600 uppercase tracking-wider ${
                  align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left'
                }`}
                style={{ width }}
              >
                {label}
              </TableHead>
            ))}
            
            {hasActions && (
              <TableHead className="text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</TableHead>
            )}
          </TableRow>
        </TableHeader>
        
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={colSpan} className="h-24 text-center">
                <div className="flex flex-col items-center justify-center text-gray-500">
                  <p className="text-sm">{emptyMessage}</p>
                  <p className="text-xs text-gray-400 mt-1">No records to display</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => {
              const rowId = customGetRowId(row);
              const isSelected = selectedRows.includes(rowId);
              
              return (
                <TableRow
                  key={rowId}
                  className={isSelected ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-gray-50'}
                >
                  {showSelection && (
                    <TableCell>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) => onSelectRow?.(rowId, checked as boolean)}
                      />
                    </TableCell>
                  )}
                  
                  {columns.map(({ key, format, align }) => {
                    const value = getNestedValue(row, key);
                    let displayValue: React.ReactNode;
                    
                    if (format) {
                      displayValue = format(value, row);
                    } else if (key.includes('image') || key.includes('thumbnail')) {
                      displayValue = value ? (
                        <Image src={value} alt="Image" width={48} height={48} className="w-12 h-12 rounded-md object-cover" />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                          <span className="text-xs text-gray-500">No Image</span>
                        </div>
                      );
                    } else if (key.includes('price') || key.includes('amount')) {
                      displayValue = <span className="font-semibold">${typeof value === 'number' ? value.toFixed(2) : value}</span>;
                    } else if (key.includes('date') || key.includes('At')) {
                      displayValue = <span className="text-gray-600 text-sm">{value ? new Date(value).toLocaleDateString() : '-'}</span>;
                    } else if (key.includes('status')) {
                      const colors: Record<string, string> = {
                        active: 'bg-green-100 text-green-800',
                        inactive: 'bg-gray-100 text-gray-800',
                        pending: 'bg-yellow-100 text-yellow-800',
                      };
                      displayValue = (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[value] || 'bg-gray-100 text-gray-800'}`}>
                          {value}
                        </span>
                      );
                    } else if (key.includes('stock')) {
                      const stockNum = Number(value);
                      const color = stockNum > 10 ? 'text-green-600' : stockNum > 0 ? 'text-yellow-600' : 'text-red-600';
                      displayValue = <span className={`font-medium ${color}`}>{value ?? 0}</span>;
                    } else if (typeof value === 'boolean') {
                      displayValue = (
                        <span className={`px-2 py-1 rounded text-xs ${value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {value ? 'Yes' : 'No'}
                        </span>
                      );
                    } else {
                      displayValue = value != null ? value.toString() : '-';
                    }
                    
                    return (
                      <TableCell
                        key={`${rowId}-${key}`}
                        className={align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left'}
                      >
                        {displayValue}
                      </TableCell>
                    );
                  })}
                  
                  {hasActions && (
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {onEdit && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                            onClick={() => onEdit?.(row)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                        )}
                        {onDelete && (
                          <ModelAlert
                            trigger={
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-gray-600 hover:text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            }
                            title={`Delete ${getItemName(row)}`}
                            description={deleteMessage(row)}
                            onConfirm={() => handleDelete(row)}
                          />
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}