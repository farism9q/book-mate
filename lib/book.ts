export function extractCategories(categories: string[]) {
  return Array.from(
    new Set(categories?.join(" / ").split(" / ").join(" & ").split(" & "))
  );
}
