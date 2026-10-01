import type { Product } from "@/types/productType";

export type SortOption =
  | "newest"
  | "oldest"
  | "name-asc"
  | "name-desc"
  | "price-asc"
  | "price-desc";

// Labels shown in the sort dropdown. Price means selling price.
export const sortOptions: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "name-desc", label: "Name: Z to A" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

const timeOf = (product: Product) => new Date(product.createdAt).getTime();

export function filterAndSortProducts(
  products: Product[],
  search: string,
  sort: SortOption,
): Product[] {
  // 1. Filter by name
  const query = search.trim().toLowerCase();
  const matching = query
    ? products.filter((product) => product.name.toLowerCase().includes(query))
    : products;

  // 2. Sort (copy first so the original list isn't changed)
  return [...matching].sort((a, b) => {
    switch (sort) {
      case "newest":
        return timeOf(b) - timeOf(a);
      case "oldest":
        return timeOf(a) - timeOf(b);
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "price-asc":
        return a.sellingPrice - b.sellingPrice;
      case "price-desc":
        return b.sellingPrice - a.sellingPrice;
    }
  });
}