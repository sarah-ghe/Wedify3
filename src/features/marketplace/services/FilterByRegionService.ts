import { VendorRegionService } from "@/features/vendors/services/VendorRegionService";

export async function filterByRegion(vendors: any[], region?: string) {
  if (!region) return vendors;
  const vendorIds = vendors.map((v) => v.id);
  const { data: regionData } =
    await VendorRegionService.getBySetOfIds(vendorIds);
  const regionVendorIds = (regionData || [])
    .filter((r) => r.region_name === region)
    .map((r) => r.vendor_id);
  return vendors.filter((v) => regionVendorIds.includes(v.id));
}
