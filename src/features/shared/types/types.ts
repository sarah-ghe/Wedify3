import { Vendor } from "@/features/vendors/services/VendorService";
import { VendorRegion } from "@/features/vendors/services/VendorRegionService";
import { VendorPackage } from "@/features/vendors/services/VendorPackageService";
import { VendorPromotion } from "@/features/vendors/services/VendorPromotionService";
import { VendorsRestDay } from "@/features/vendors/services/VendorsRestDaysService";
import { VendorsPortfolioTag } from "@/features/vendors/services/VendorsPortfolioTagsService";
import {
  ServiceTypeBeautyOption,
  ServiceTypeBeautyOptionsService,
} from "@/features/vendors/services/ServiceTypeBeautyOptionsService";
import {
  ServiceTypeClothingOptionDz,
  ServiceTypeClothingOptionsDzService,
} from "@/features/vendors/services/ServiceTypeClothingOptionsDzService";
import {
  ServiceTypeMusicOptionDz,
  ServiceTypeMusicOptionsDzService,
} from "@/features/vendors/services/ServiceTypeMusicOptionsDzService";
import {
  ServiceTypeOrganizerOption,
  ServiceTypeOrganizerOptionsService,
} from "@/features/vendors/services/ServiceTypeOrganizerOptionsService";
import {
  ServiceTypeSavoryOption,
  ServiceTypeSavoryOptionsService,
} from "@/features/vendors/services/ServiceTypeSavoryOptionsService";
import {
  ServiceTypeTransportOption,
  ServiceTypeTransportOptionsService,
} from "@/features/vendors/services/ServiceTypeTransportOptionsService";
import {
  ServiceTypeVenueOption,
  ServiceTypeVenueOptionsService,
} from "@/features/vendors/services/ServiceTypeVenueOptionsService";

export interface AuthResponse {
  user: any | null;
  session: any | null;
}

export type LoginParams = {
  email: string;
  password: string;
};

export type SignUpParams = {
  email: string;
  password: string;
  username: string;
  phoneNumber: string;
  role: userRole;
};

export enum userRole {
  COUPLE = "couple",
  Vendor = "vendor",
}

export type NicheInfo =
  | ServiceTypeBeautyOption
  | ServiceTypeClothingOptionDz
  | ServiceTypeMusicOptionDz
  | ServiceTypeOrganizerOption
  | ServiceTypeSavoryOption
  | ServiceTypeTransportOption
  | ServiceTypeVenueOption;

export type SetupVendorBusinessParams = {
  vendorData: Vendor;
  regions: VendorRegion[];
  serviceTypeId: string;
  nicheInfo?: NicheInfo;
  packages: VendorPackage[];
  promotions: VendorPromotion[];
  restDays: VendorsRestDay[];
  portfolioTags: VendorsPortfolioTag[];
};

export interface VendorPortfolioFile {
  id: string;
  vendor_id: string;
  file_url: string;
  file_type: "image" | "video";
  description?: string;
  created_at: string;
}
