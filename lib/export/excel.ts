// lib/export/excel.ts
import * as XLSX from 'xlsx';

export function collectKeys<T extends Record<string, any>>(rows: T[]): string[] {
  const keySet = new Set<string>();
  rows.forEach(row => {
    if (row && typeof row === 'object') {
      Object.keys(row).forEach(key => keySet.add(key));
    }
  });
  return Array.from(keySet);
}

export function coerceDateMaybe(value: any): any {
  if (typeof value === 'string') {
    const date = new Date(value);
    if (!isNaN(date.getTime())) return date;
  }
  return value;
}

export function exportRowsToXlsx<T extends Record<string, any>>(
  rows: T[],
  keys: string[],
  fileName: string,
  sheetName: string = 'Sheet1'
): void {
  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(rows, { header: keys });
  
  // Auto-size columns
  const colWidths = keys.map((key, index) => {
    let maxLength = key.length;
    rows.forEach(row => {
      const value = row[key];
      const length = value ? value.toString().length : 0;
      maxLength = Math.max(maxLength, length);
    });
    return { wch: Math.min(Math.max(maxLength + 2, 10), 50) };
  });
  
  worksheet['!cols'] = colWidths;
  
  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  
  // Download
  XLSX.writeFile(workbook, fileName);
}