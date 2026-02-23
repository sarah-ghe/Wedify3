import { ref } from "vue";
import {
  VendorService,
  Vendor,
} from "@/features/vendors/services/VendorService";
import {
  VendorPackageService,
  VendorPackage,
} from "@/features/vendors/services/VendorPackageService";
import { VendorPortfolioFilesService } from "@/features/vendors/services/VendorPortfolioFilesService";
import {
  VendorRegionService,
  VendorRegion,
} from "@/features/vendors/services/VendorRegionService";
import {
  VendorPromotionService,
  VendorPromotion,
} from "@/features/vendors/services/VendorPromotionService";
import { VendorReviewService } from "@/features/vendors/services/VendorReviewService";
import {
  VendorsPortfolioTagsService,
  VendorsPortfolioTag,
} from "@/features/vendors/services/VendorsPortfolioTagsService";
import { ServiceTypesService } from "@/features/vendors/services/ServiceTypesService";
import type {
  NicheInfo,
  VendorPortfolioFile,
  VendorReview,
} from "@/features/shared/types/types";
import { SimilarVendorsService } from "@/features/marketplace/services/SimilarVendorsService";
import { GetNicheService } from "@/features/marketplace/services/getNicheService";

export interface VendorPublicProfile {
  vendor: Vendor | null;
  packages: VendorPackage[];
  portfolioFiles: VendorPortfolioFile[];
  regions: VendorRegion[];
  promotions: VendorPromotion[];
  reviews: VendorReview[];
  nicheInfo: NicheInfo | null;
  portfolioTags: VendorsPortfolioTag[];
  similarVendors: Vendor[];
}

export function useVendorPublicProfile() {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const profile = ref<VendorPublicProfile | null>(null);

  async function fetchVendorProfile(vendorId: string) {
    loading.value = true;
    error.value = null;
    profile.value = null;

    // 1. Fetch vendor main data
    const { data: vendor, error: vendorErr } =
      await VendorService.getById(vendorId);
    if (vendorErr || !vendor) {
      error.value = "Vendor not found";
      loading.value = false;
      return;
    }

    // 2. Fetch all related data in parallel
    const [
      packagesRes,
      portfolioFilesRes,
      regionsRes,
      promotionsRes,
      reviewsRes,
      portfolioTagsRes,
      serviceTypeRes,
      similarVendorsRes,
    ] = await Promise.all([
      VendorPackageService.getByVendorId(vendorId),
      VendorPortfolioFilesService.getByVendorId(vendorId),
      VendorRegionService.getByVendorId(vendorId),
      VendorPromotionService.getByVendorId(vendorId),
      VendorReviewService.getByVendorId(vendorId),
      VendorsPortfolioTagsService.getByVendorId(vendorId),
      ServiceTypesService.getById(vendor.service_type_id),
      SimilarVendorsService.getSimilarVendors(vendor),
    ]);

    // 3. Fetch niche info
    let nicheInfo: NicheInfo | null = null;
    if (serviceTypeRes.data) {
      const serviceTypeName = serviceTypeRes.data.name?.toLowerCase();
      const nicheService = GetNicheService(serviceTypeName);
      if (nicheService) {
        const { data: nicheData } = await nicheService.getByVendorId(vendorId);
        nicheInfo = (nicheData && nicheData[0]) || null;
      }
    }

    profile.value = {
      vendor: vendor,
      packages: packagesRes.data || [],
      portfolioFiles: portfolioFilesRes.data || [],
      regions: regionsRes.data || [],
      promotions: promotionsRes.data || [],
      reviews: reviewsRes.data || [],
      nicheInfo: nicheInfo,
      portfolioTags: portfolioTagsRes.data || [],
      similarVendors: similarVendorsRes || [],
    };

    loading.value = false;
  }

  return {
    loading,
    error,
    profile,
    fetchVendorProfile,
  };
}
