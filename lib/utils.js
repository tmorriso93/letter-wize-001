import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

// Utility function to combine class names and merge Tailwind classes
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
