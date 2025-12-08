import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Fungsi cn (classNames)
 * Menggabungkan clsx (untuk logika kondisional) dan tailwind-merge (untuk mengatasi konflik style).
 * Wajib digunakan untuk komponen yang reusable.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}