// components/ui/progress.tsx
"use client";

interface ProgressProps {
  value?: number;
  className?: string;
}

export function Progress({ value = 0, className = '' }: ProgressProps) {
  const clampedValue = Math.max(0, Math.min(100, value));
  
  return (
    <div className={`relative h-2 w-full overflow-hidden rounded-full bg-gray-200 ${className}`}>
      <div
        className="h-full w-full flex-1 bg-blue-600 transition-all duration-300 ease-out"
        style={{ transform: `translateX(-${100 - clampedValue}%)` }}
      />
    </div>
  );
}