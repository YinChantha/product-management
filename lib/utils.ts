import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export {
  getProductStatus,
  filterProductsByStatus,
  formatDate,
  formatPrice,
  getVariantCount,
} from './utils/product-helpers';
