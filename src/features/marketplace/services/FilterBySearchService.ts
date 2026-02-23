import { Vendor } from "@/features/vendors/services/VendorService";

export async function filterBySearch(
  vendors: Vendor[],
  search?: string,
): Promise<Vendor[]> {
  if (!search) return vendors;
  const lowerSearch = search.toLowerCase();
  return vendors.filter(
    (v) =>
      v.business_name.toLowerCase().includes(lowerSearch) ||
      (v.description && v.description.toLowerCase().includes(lowerSearch)),
  );
}
