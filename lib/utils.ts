import { type ClassValue, clsx } from "clsx";
import { isAfter, subDays } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractCategories(categories: string[]) {
  return Array.from(
    new Set(categories?.join(" / ").split(" / ").join(" & ").split(" & "))
  );
}

export function truncateTxt({
  text,
  nbChars,
}: {
  text: string;
  nbChars: number;
}) {
  if (text.length > nbChars) {
    return { text: text.substring(0, nbChars) + "...", isTruncated: true };
  } else {
    return { text, isTruncated: false };
  }
}

export function isNewUpdate(updateDate?: Date) {
  if (!updateDate) return false;

  const dateThreshold = subDays(new Date(), 30);

  return isAfter(new Date(updateDate), dateThreshold);
}

export const suggestedBooksCacheTime = 1000 * 60 * 60 * 24; // 24 hours
