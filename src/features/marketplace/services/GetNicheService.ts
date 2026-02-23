import { ServiceTypeBeautyOptionsService } from "@/features/vendors/services/ServiceTypeBeautyOptionsService";
import { ServiceTypeClothingOptionsDzService } from "@/features/vendors/services/ServiceTypeClothingOptionsDzService";
import { ServiceTypeMusicOptionsDzService } from "@/features/vendors/services/ServiceTypeMusicOptionsDzService";
import { ServiceTypeOrganizerOptionsService } from "@/features/vendors/services/ServiceTypeOrganizerOptionsService";
import { ServiceTypeSavoryOptionsService } from "@/features/vendors/services/ServiceTypeSavoryOptionsService";
import { ServiceTypeTransportOptionsService } from "@/features/vendors/services/ServiceTypeTransportOptionsService";
import { ServiceTypeVenueOptionsService } from "@/features/vendors/services/ServiceTypeVenueOptionsService";

export function GetNicheService(serviceTypeName?: string) {
  switch (serviceTypeName) {
    case "beauty":
      return ServiceTypeBeautyOptionsService;
    case "clothing":
      return ServiceTypeClothingOptionsDzService;
    case "music":
      return ServiceTypeMusicOptionsDzService;
    case "organizer":
      return ServiceTypeOrganizerOptionsService;
    case "savory":
      return ServiceTypeSavoryOptionsService;
    case "transport":
      return ServiceTypeTransportOptionsService;
    case "venue":
      return ServiceTypeVenueOptionsService;
    default:
      return null;
  }
}
