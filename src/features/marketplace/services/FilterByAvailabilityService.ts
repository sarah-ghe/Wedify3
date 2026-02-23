import { VendorsRestDaysService } from "@/features/vendors/services/VendorsRestDaysService";
import { VendorUnavailableDatesService } from "@/features/vendors/services/VendorUnavailableDatesService";
import { Vendor } from "@/features/vendors/services/VendorService";

export async function filterByAvailability(
  vendors: Vendor[],
  date?: string,
): Promise<Vendor[]> {
  if (!date) return vendors;
  const dayOfWeek = new Date(date).toLocaleString("en-US", { weekday: "long" });
  const vendorIds = vendors.map((v) => v.id);
  const { data: restDays } =
    await VendorsRestDaysService.getBySetOfIds(vendorIds);
  const { data: unavailableDates } =
    await VendorUnavailableDatesService.getBySetOfIds(vendorIds);

  const unavailableVendorIds = new Set(
    (unavailableDates || [])
      .filter((entry) => entry.date === date)
      .map((entry) => entry.vendor_id),
  );
  const restDayVendorIds = new Set(
    (restDays || [])
      .filter((entry) => entry.day_of_week === dayOfWeek)
      .map((entry) => entry.vendor_id),
  );

  return vendors.filter(
    (v) => !unavailableVendorIds.has(v.id) && !restDayVendorIds.has(v.id),
  );
}
