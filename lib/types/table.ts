// lib/types/table.ts
export type Column = {
  key: string;
  label: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
};

export type RowData = Record<string, any>;