import { Vendor } from "@/features/vendors/services/VendorService";

export async function filterByMinRating(
  vendors: Vendor[],
  minRating?: number,
): Promise<Vendor[]> {
  if (minRating == null) return vendors;
  return vendors.filter((v) => (v.rating ?? 0) >= minRating);
}
