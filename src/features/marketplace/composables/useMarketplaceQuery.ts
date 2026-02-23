import { ref } from "vue";
import {
  Vendor,
  VendorService,
} from "@/features/vendors/services/VendorService";
import { filterByRegion } from "@/features/marketplace/services/FilterByRegionService";
import { filterByVendorType } from "@/features/marketplace/services/FilterByVendorTypeService";
import { filterByServiceTypeOptions } from "@/features/marketplace/services/FilterByServiceTypeOptionsService";
import { filterBySearch } from "@/features/marketplace/services/FilterBySearchService";
import { filterByAvailability } from "@/features/marketplace/services/FilterByAvailabilityService";
import { filterByPromotionHighlights } from "@/features/marketplace/services/FilterByPromotionHighlightsService";
import { filterByPrice } from "@/features/marketplace/services/FilterByPriceService";
import { filterByMinRating } from "@/features/marketplace/services/FilterByMinRatingService";

export function useMarketplaceQuery() {
  const vendors = ref<Vendor[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchVendors(filters: {
    region?: string;
    vendorType?: string;
    serviceType?: string;
    selectedOptions?: Record<string, any>;
    search?: string;
    date?: string;
    promotionHighlights?: boolean;
    maxPrice?: number;
    minRating?: number;
    [key: string]: any;
  }) {
    loading.value = true;
    error.value = null;

    const { data: vendorData, error: vendorErr } = await VendorService.getAll();
    if (vendorErr) {
      error.value = "Failed to fetch vendors";
      loading.value = false;
      return;
    }

    let filteredVendors = vendorData || [];
    filteredVendors = await filterBySearch(filteredVendors, filters.search);
    filteredVendors = await filterByRegion(filteredVendors, filters.region);
    filteredVendors = await filterByVendorType(
      filteredVendors,
      filters.vendorType,
    );
    filteredVendors = await filterByMinRating(
      filteredVendors,
      filters.minRating,
    );
    filteredVendors = await filterByServiceTypeOptions(
      filteredVendors,
      filters.serviceType,
      filters.selectedOptions,
    );
    filteredVendors = await filterByPrice(filteredVendors, filters.maxPrice);
    if (filters.promotionHighlights) {
      filteredVendors = await filterByPromotionHighlights(
        filteredVendors,
        filters.date,
      );
    }
    filteredVendors = await filterByAvailability(filteredVendors, filters.date);

    vendors.value = filteredVendors;
    loading.value = false;
  }

  return { vendors, loading, error, fetchVendors };
}
