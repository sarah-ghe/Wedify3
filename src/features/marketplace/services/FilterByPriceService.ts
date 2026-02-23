import { Vendor } from "@/features/vendors/services/VendorService";
import { VendorPackageService } from "@/features/vendors/services/VendorPackageService";
import { VendorPromotionService } from "@/features/vendors/services/VendorPromotionService";

export async function filterByPrice(
  vendors: Vendor[],
  maxPrice?: number,
): Promise<Vendor[]> {
  if (maxPrice == null) return vendors;
  const vendorIds = vendors.map((v) => v.id);
  const { data: packages } =
    await VendorPackageService.getBySetOfVendorIds(vendorIds);
  const { data: promotions } =
    await VendorPromotionService.getBySetOfVendorIds(vendorIds);

  // Filter packages and promotions by price
  const validVendorIds = new Set<string>();
  (packages || []).forEach((pkg) => {
    if (maxPrice == null || pkg.price <= maxPrice) {
      validVendorIds.add(pkg.vendor_id);
    }
  });
  (promotions || []).forEach((promo) => {
    const price = promo.discount_price ?? promo.price;
    if (maxPrice == null || price <= maxPrice) {
      validVendorIds.add(promo.vendor_id);
    }
  });

  return vendors.filter((v) => validVendorIds.has(v.id));
}
