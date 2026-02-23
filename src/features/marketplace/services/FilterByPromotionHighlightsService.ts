import { VendorPromotionService } from "@/features/vendors/services/VendorPromotionService";
import { Vendor } from "@/features/vendors/services/VendorService";

export async function filterByPromotionHighlights(
  vendors: Vendor[],
  date?: string,
): Promise<Vendor[]> {
  if (!date) return vendors;
  const vendorIds = vendors.map((v) => v.id);
  const { data: promotions } =
    await VendorPromotionService.getBySetOfVendorIds(vendorIds);
  const activeVendorIds = new Set(
    (promotions || [])
      .filter(
        (promo) =>
          promo.start_date <= date &&
          promo.end_date >= date &&
          promo.status === "active",
      )
      .map((promo) => promo.vendor_id),
  );
  return vendors.filter((v) => activeVendorIds.has(v.id));
}
