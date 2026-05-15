import { PART_CATEGORIES, VEHICLE_CATEGORIES } from "@/lib/constants";

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

export const PRODUCTS: ReadonlyArray<Product> = [];

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

export function isValidPartSlug(slug: string): boolean {
  return PART_CATEGORIES.some((p) => p.slug === slug);
}

export function isValidVehicleSlug(slug: string): boolean {
  return VEHICLE_CATEGORIES.some((v) => v.slug === slug);
}
