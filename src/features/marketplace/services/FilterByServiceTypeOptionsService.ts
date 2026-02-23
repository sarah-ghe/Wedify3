import { ServiceTypeBeautyOptionsService } from "@/features/vendors/services/ServiceTypeBeautyOptionsService";
import { ServiceTypeClothingOptionsDzService } from "@/features/vendors/services/ServiceTypeClothingOptionsDzService";
import { ServiceTypeMusicOptionsDzService } from "@/features/vendors/services/ServiceTypeMusicOptionsDzService";
import { ServiceTypeOrganizerOptionsService } from "@/features/vendors/services/ServiceTypeOrganizerOptionsService";
import { ServiceTypeSavoryOptionsService } from "@/features/vendors/services/ServiceTypeSavoryOptionsService";
import { ServiceTypeTransportOptionsService } from "@/features/vendors/services/ServiceTypeTransportOptionsService";
import { ServiceTypeVenueOptionsService } from "@/features/vendors/services/ServiceTypeVenueOptionsService";

type ServiceTypeOptionsMap = {
  [key: string]: () => Promise<{ data: any[] | null; error: any }>;
};

const serviceTypeOptionsMap: ServiceTypeOptionsMap = {
  beauty: ServiceTypeBeautyOptionsService.getAll,
  clothing: ServiceTypeClothingOptionsDzService.getAll,
  music: ServiceTypeMusicOptionsDzService.getAll,
  organizer: ServiceTypeOrganizerOptionsService.getAll,
  savory: ServiceTypeSavoryOptionsService.getAll,
  transport: ServiceTypeTransportOptionsService.getAll,
  venue: ServiceTypeVenueOptionsService.getAll,
};

export async function filterByServiceTypeOptions(
  vendors: any[],
  serviceType?: string,
  selectedOptions?: Record<string, any>,
) {
  if (!serviceType) return vendors;
  const getAll = serviceTypeOptionsMap[serviceType.toLowerCase()];
  if (!getAll) return vendors;

  const { data: optionsDataRaw } = await getAll();
  let optionsData = optionsDataRaw || [];

  // Only consider options for vendors in the received array
  const vendorIdsSet = new Set(vendors.map((v) => v.id));
  optionsData = optionsData.filter((option) =>
    vendorIdsSet.has(option.vendor_id),
  );

  // If options are selected, filter optionsData by those fields
  if (selectedOptions && Object.keys(selectedOptions).length > 0) {
    optionsData = optionsData.filter((option) =>
      Object.entries(selectedOptions).every(
        ([key, value]) => option[key] === value,
      ),
    );
  }

  const filteredVendorIds = new Set(optionsData.map((o) => o.vendor_id));
  return vendors.filter((v) => filteredVendorIds.has(v.id));
}
