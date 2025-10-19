import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
   * Converts file size from bytes to human-readable format
   * @param bytes - File size in bytes
   * @returns Formatted string with appropriate unit (Bytes, KB, or MB)
   */
  export const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    
    // 1024 bytes = 1 KB (using binary, not decimal)
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    
    // Calculate which unit to use (0 = Bytes, 1 = KB, 2 = MB)
    // Math.log(bytes) / Math.log(k) gives us the power of 1024
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    // Divide bytes by 1024^i and round to 2 decimal places
    // Example: 2048 bytes -> 2048 / 1024^1 = 2 KB
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };
