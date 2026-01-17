'use client';

import { Button } from '@/components/ui/button';
import { X, AlertCircle, CheckCircle } from 'lucide-react';
import { Progress } from '../customer-ui/progress';

interface ExportProgressModalProps {
  isOpen: boolean;
  isExporting: boolean;
  progress: number;
  processedCount: number;
  totalCount: number;
  error: string | null;
  onCancel: () => void;
  onClose: () => void;
}

export default function ExportProgressModal({
  isOpen,
  isExporting,
  progress,
  processedCount,
  totalCount,
  error,
  onCancel,
  onClose,
}: ExportProgressModalProps) {
  if (!isOpen) return null;

  const isComplete = !isExporting && !error && progress === 100;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {error ? 'Export Failed' : 
             isComplete ? 'Export Complete' : 
             isExporting ? 'Exporting Products...' : 'Export'}
          </h3>
          {!isExporting && (
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {error ? (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">Export Failed</span>
            </div>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress: {processedCount} of {totalCount}</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {isExporting ? (
              <div className="text-center text-sm text-gray-500 mb-4">
                Please wait while we export your products...
              </div>
            ) : isComplete ? (
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-green-700 font-medium">Export completed successfully!</p>
                <p className="text-gray-600 text-sm mt-1">
                  File has been downloaded automatically.
                </p>
              </div>
            ) : null}
          </>
        )}

        <div className="flex justify-end gap-3">
          {isExporting ? (
            <Button
              variant="outline"
              onClick={onCancel}
              className="text-red-600 border-red-200 hover:bg-red-50"
              disabled={!isExporting}
            >
              Cancel Export
            </Button>
          ) : error ? (
            <>
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button onClick={onClose}>
                Try Again
              </Button>
            </>
          ) : (
            <Button onClick={onClose}>
              {isComplete ? 'Done' : 'Close'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}