import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractCategories(categories: string[]) {
  return Array.from(
    new Set(categories?.join(" / ").split(" / ").join(" & ").split(" & "))
  );
}
