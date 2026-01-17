'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Calendar, SlidersHorizontal } from 'lucide-react';

export default function SearchProduct() {
  return (
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search product..."
            className="pl-10 bg-gray-50 border-gray-200"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Calendar className="w-4 h-4" />
          Select Date
        </Button>
        <Button variant="outline" className="gap-2">
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </Button>
      </div>
  );
}
