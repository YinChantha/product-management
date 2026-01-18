"use client";

import { useCallback, useState, useRef } from "react";
import { useQueryClient, QueryKey } from "@tanstack/react-query";
import { collectKeys, coerceDateMaybe, exportRowsToXlsx } from "@/lib/export/excel";

export type PagedResponse<T> = { 
  products?: T[];
  total: number;
  skip: number;
  limit: number;
};

type UseExcelExportOptions<T> = {
  exportBatchSize?: number;
  keys?: string[];
  excludeKeys?: string[];
  coerceDates?: boolean;
  sheetName?: string;
  getFileName?: () => string;
  makeKey: (skip: number, limit: number) => QueryKey;
  fetchPage: (skip: number, limit: number, signal?: AbortSignal) => Promise<PagedResponse<T>>;
  transformRow?: (row: Record<string, any>, original: T) => Record<string, any>;
  onProgress?: (progress: number, processed: number, total: number) => void;
};

const ensureXlsx = (name?: string): string => {
  const base = (name ?? "").trim() || "export";
  const safe = base.replace(/[\\/:*?"<>|]/g, "-");
  return safe.toLowerCase().endsWith(".xlsx") ? safe : `${safe}.xlsx`;
};

export function useExcelExport<T>(opts: UseExcelExportOptions<T>) {
  const {
    exportBatchSize = 100,
    keys,
    excludeKeys = [],
    coerceDates = true,
    sheetName = "Sheet1",
    getFileName = () => `products-export-${new Date().toISOString().split('T')[0]}.xlsx`,
    makeKey,
    fetchPage,
    transformRow,
    onProgress,
  } = opts;

  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processedCount, setProcessedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const queryClient = useQueryClient();
  
  // Add abort controller ref
  const abortControllerRef = useRef<AbortController | null>(null);
  const isCancelledRef = useRef(false);

  const updateProgress = useCallback((processed: number, total: number) => {
    const percentage = total > 0 ? Math.round((processed / total) * 100) : 0;
    setProgress(percentage);
    setProcessedCount(processed);
    setTotalCount(total);
    onProgress?.(percentage, processed, total);
  }, [onProgress]);

  const exportAll = useCallback(
    async (visibleKeys?: string[], fileNameOverride?: string) => {
      // Reset cancellation flag
      isCancelledRef.current = false;
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;
      
      setIsExporting(true);
      setProgress(0);
      setProcessedCount(0);
      setTotalCount(0);

      try {
        // Get total count - with abort signal
        updateProgress(0, 1);
        const firstPage = await fetchPage(0, 1, signal);
        const totalItems = firstPage?.total || 0;
        
        // Check if cancelled
        if (signal.aborted || isCancelledRef.current) {
          throw new DOMException('Export cancelled', 'AbortError');
        }
        
        if (totalItems === 0) {
          throw new Error("No data to export.");
        }
        
        updateProgress(0, totalItems);

        // Fetch all data in batches
        const allData: T[] = [];
        const totalBatches = Math.ceil(totalItems / exportBatchSize);
        
        for (let batch = 0; batch < totalBatches; batch++) {
          // Check cancellation before each batch
          if (signal.aborted || isCancelledRef.current) {
            throw new DOMException('Export cancelled', 'AbortError');
          }
          
          const skip = batch * exportBatchSize;
          const limit = Math.min(exportBatchSize, totalItems - skip);
          
          // Try cache first
          const cacheKey = makeKey(skip, limit);
          let page = queryClient.getQueryData<PagedResponse<T>>(cacheKey);
          
          if (!page) {
            page = await queryClient.fetchQuery({
              queryKey: cacheKey,
              queryFn: () => fetchPage(skip, limit, signal), // Pass signal
              staleTime: 60000,
            });
          }
          
          const rows = page?.products || [];
          allData.push(...rows);
          updateProgress(allData.length, totalItems);
          
          // Check cancellation after batch
          if (signal.aborted || isCancelledRef.current) {
            throw new DOMException('Export cancelled', 'AbortError');
          }
          
          // Small delay but check cancellation
          if (batch < totalBatches - 1) {
            await new Promise((resolve, reject) => {
              const timeout = setTimeout(resolve, 50);
              signal.addEventListener('abort', () => {
                clearTimeout(timeout);
                reject(new DOMException('Export cancelled', 'AbortError'));
              });
            });
          }
        }

        if (allData.length === 0) {
          throw new Error("Failed to fetch data.");
        }

        // Determine export columns
        let exportKeys: string[] = visibleKeys || collectKeys(allData as any[]);
        
        if (excludeKeys.length) {
          exportKeys = exportKeys.filter(k => !excludeKeys.includes(k));
        }
        if (keys?.length) {
          exportKeys = keys.filter(k => exportKeys.includes(k));
        }

        if (exportKeys.length === 0) {
          throw new Error("No columns to export.");
        }

        // Transform data
        const transformedData = allData.map((original) => {
          const row: Record<string, any> = {};
          
          exportKeys.forEach(key => {
            let value: any;
            
            // Handle nested keys
            if (key.includes('.')) {
              value = key.split('.').reduce((obj, k) => obj?.[k], original as any);
            } else {
              value = (original as any)[key];
            }
            
            if (coerceDates && value) {
              value = coerceDateMaybe(value);
            }
            
            row[key] = value;
          });
          
          return transformRow ? transformRow(row, original) : row;
        });

        // Export - check cancellation one more time
        if (signal.aborted || isCancelledRef.current) {
          throw new DOMException('Export cancelled', 'AbortError');
        }
        
        const finalFileName = ensureXlsx(fileNameOverride || getFileName());
        exportRowsToXlsx(transformedData, exportKeys, finalFileName, sheetName);
        
        // On success, keep progress at 100%
        updateProgress(totalItems, totalItems);
        
      } catch (error) {
        // Don't log cancellation errors
        if (!(error instanceof DOMException && error.name === 'AbortError')) {
          console.error("Export failed:", error);
        }
        throw error;
      } finally {
        setIsExporting(false);
        abortControllerRef.current = null;
        
        // Don't reset progress on success or cancellation
        // Only reset if there was an error (not cancellation)
        const shouldResetProgress = isCancelledRef.current || progress === 100;
        if (shouldResetProgress) {
          setTimeout(() => {
            setProgress(0);
            setProcessedCount(0);
            setTotalCount(0);
          }, 2000);
        }
      }
    },
    [
      exportBatchSize,
      keys,
      excludeKeys,
      coerceDates,
      sheetName,
      getFileName,
      makeKey,
      fetchPage,
      transformRow,
      onProgress,
      queryClient,
      updateProgress,
      progress,
    ]
  );

  const cancelExport = useCallback(() => {
    isCancelledRef.current = true;
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsExporting(false);
    // Keep the current progress for 2 seconds before resetting
    setTimeout(() => {
      setProgress(0);
      setProcessedCount(0);
      setTotalCount(0);
    }, 2000);
  }, []);

  const resetExport = useCallback(() => {
    isCancelledRef.current = true;
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsExporting(false);
    setProgress(0);
    setProcessedCount(0);
    setTotalCount(0);
  }, []);

  return { 
    exportAll, 
    isExporting, 
    progress, 
    processedCount, 
    totalCount,
    cancelExport,
    resetExport
  };
}