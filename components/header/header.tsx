'use client';
import { Button } from '@/components/ui/button';
import { Search, Plus, Download } from 'lucide-react';
import { Input } from '../ui/input';

interface HeaderProps {
  onAddNew: () => void;
  onExport: () => void;
  isExporting: boolean;
  productsCount: number;
}

export default function Header({

  onAddNew,
  onExport,
  isExporting,
  productsCount
}: HeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Product</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Nik Shop</span>
              <select className="text-sm border-none bg-transparent text-gray-900 cursor-pointer focus:outline-none">
                <option>Nik Shop</option>
              </select>
            </div>
            <div className="relative">
              <Button variant="ghost" size="sm" className="relative p-2">
                <span className="text-xl">🔔</span>
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-medium">
                  2
                </span>
              </Button>
            </div>
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search order..."
                className="pl-10 bg-gray-50 border-gray-200"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={onExport}
              disabled={isExporting || productsCount === 0}
            >
              <Download className="w-4 h-4" />
              {isExporting ? 'Exporting...' : 'Export Excel'}
            </Button>
            <Button 
              className="gap-2 bg-blue-600 hover:bg-blue-700"
              onClick={onAddNew}
            >
              <Plus className="w-4 h-4" />
              Add Product
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}