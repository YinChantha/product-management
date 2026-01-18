'use client';
import { cn } from "@/lib/utils";
interface StatusTabOption<T> {
  label: string;
  value: T;
  count?: number;
}

interface StatusTabsProps<T> {
  options: StatusTabOption<T>[];
  activeValue: T;
  onChange: (value: T) => void;
  className?: string;
  variant?: 'default' | 'pills' | 'underline';
}

export function StatusTabs<T>({
  options,
  activeValue,
  onChange,
  className,
}: StatusTabsProps<T>) {
  return (
    <nav
      className={cn(
        "flex items-center gap-4 ",
        className
      )}
      aria-label="Filter tabs"
    >
      {options.map((option) => {
        const isActive = activeValue === option.value;
        return (
          <button
            key={String(option.value)}
            onClick={() => onChange(option.value)}
            className={cn(
              "relative whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium transition-colors",
              isActive
                ? "border-blue-600 text-blue-700"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
            )}
            aria-current={isActive ? "page" : undefined}
          >
            {option.label}
            {option.count !== undefined && (
              <span className="ml-1.5 text-xs font-normal opacity-70">
                {option.count}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}