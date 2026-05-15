import { PART_CATEGORIES, VEHICLE_CATEGORIES } from "@/lib/constants";
import productsJson from "@/data/products.json";

export type ProductTier = "oem" | "oem-equivalent" | "aftermarket";

export type Product = {
  slug: string;
  name: string;
  description: string;
  partSlug: string;
  vehicleSlugs: ReadonlyArray<string>;
  brand?: string;
  tier?: ProductTier;
  image?: string;
};

export const PRODUCTS: ReadonlyArray<Product> = productsJson as Product[];

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export type ProductFilter = {
  vehicle?: string;
  part?: string;
};

export function filterProducts(products: ReadonlyArray<Product>, filter: ProductFilter): Product[] {
  return products.filter((p) => {
    if (filter.part && p.partSlug !== filter.part) return false;
    if (filter.vehicle && !p.vehicleSlugs.includes(filter.vehicle)) return false;
    return true;
  });
}

export function searchProducts(products: ReadonlyArray<Product>, q?: string): Product[] {
  if (!q) return [...products];
  const lq = q.toLowerCase().trim();
  if (!lq) return [...products];
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(lq) ||
      p.description.toLowerCase().includes(lq)
  );
}

export type SortKey = "default" | "name-asc" | "name-desc";

export function sortProducts(products: ReadonlyArray<Product>, sort: SortKey): Product[] {
  switch (sort) {
    case "name-asc":
      return [...products].sort((a, b) => a.name.localeCompare(b.name));
    case "name-desc":
      return [...products].sort((a, b) => b.name.localeCompare(a.name));
    default:
      return [...products];
  }
}

export type Paginated<T> = {
  items: T[];
  total: number;
  pages: number;
  page: number;
  pageSize: number;
};

export function paginate<T>(items: ReadonlyArray<T>, page: number, pageSize: number): Paginated<T> {
  const total = items.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), pages);
  const start = (safePage - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    total,
    pages,
    page: safePage,
    pageSize,
  };
}

export function isValidPartSlug(slug: string): boolean {
  return PART_CATEGORIES.some((p) => p.slug === slug);
}

export function isValidVehicleSlug(slug: string): boolean {
  return VEHICLE_CATEGORIES.some((v) => v.slug === slug);
}

export function isValidSortKey(s: string): s is SortKey {
  return s === "default" || s === "name-asc" || s === "name-desc";
}
