import { describe, it, expect, vi, beforeEach } from "vitest";
import { useVendorPublicProfile } from "@/features/marketplace/composables/useVendorPublicProfile";
import * as VendorServiceModule from "@/features/vendors/services/VendorService";
import * as VendorPackageServiceModule from "@/features/vendors/services/VendorPackageService";
import * as VendorPortfolioFilesServiceModule from "@/features/vendors/services/VendorPortfolioFilesService";
import * as VendorRegionServiceModule from "@/features/vendors/services/VendorRegionService";
import * as VendorPromotionServiceModule from "@/features/vendors/services/VendorPromotionService";
import * as VendorReviewServiceModule from "@/features/vendors/services/VendorReviewService";
import * as VendorsPortfolioTagsServiceModule from "@/features/vendors/services/VendorsPortfolioTagsService";
import * as ServiceTypesServiceModule from "@/features/vendors/services/ServiceTypesService";
import * as ServiceTypeBeautyOptionsServiceModule from "@/features/vendors/services/ServiceTypeBeautyOptionsService";
import * as ServiceTypeClothingOptionsDzServiceModule from "@/features/vendors/services/ServiceTypeClothingOptionsDzService";
import * as ServiceTypeMusicOptionsDzServiceModule from "@/features/vendors/services/ServiceTypeMusicOptionsDzService";
import * as ServiceTypeOrganizerOptionsServiceModule from "@/features/vendors/services/ServiceTypeOrganizerOptionsService";
import * as ServiceTypeSavoryOptionsServiceModule from "@/features/vendors/services/ServiceTypeSavoryOptionsService";
import * as ServiceTypeTransportOptionsServiceModule from "@/features/vendors/services/ServiceTypeTransportOptionsService";
import * as ServiceTypeVenueOptionsServiceModule from "@/features/vendors/services/ServiceTypeVenueOptionsService";
import * as SimilarVendorsServiceModule from "@/features/marketplace/services/SimilarVendorsService";

describe("useVendorPublicProfile", () => {
    const vendorId = "vendor-1";
    const vendor = { id: vendorId, service_type_id: "beauty", business_name: "Test", created_at: "", user_id: "u", description: "", rating: 5 };
    const serviceType = { id: "beauty", name: "beauty" };
    const packages = [{ id: "pkg1", vendor_id: vendorId, name: "P", price: 10, features: {}, is_daily_booking: false }];
    const portfolioFiles = [{ id: "file1", vendor_id: vendorId, file_url: "url", file_type: "image", created_at: "" }];
    const regions = [{ id: "r1", vendor_id: vendorId, region_name: "A" }];
    const promotions = [{ id: 1, vendor_id: vendorId, name: "Promo", price: 10, discount_price: 5, start_date: "", end_date: "", status: "active", created_at: "" }];
    const reviews = [{ id: "rev1", vendor_id: vendorId, user_id: "u", rating: 5, review: "Great", created_at: "" }];
    const portfolioTags = [{ id: "tag1", vendor_id: vendorId, tagged_vendor_id: "v2", file_id: "file1" }];
    const nicheData = [{ id: 1, vendor_id: vendorId, hair_styling: true, makeup: false, nail_services: false, skin_care: false, other: false, created_at: "" }];
    const similarVendors = [
        { id: "vendor-2", service_type_id: "beauty", business_name: "Similar 1", created_at: "", user_id: "u2", description: "", rating: 4 },
        { id: "vendor-3", service_type_id: "beauty", business_name: "Similar 2", created_at: "", user_id: "u3", description: "", rating: 4.5 }
    ];

    beforeEach(() => {
        vi.resetAllMocks();
        vi.spyOn(VendorServiceModule.VendorService, "getById").mockResolvedValue({ data: vendor, error: null });
        vi.spyOn(VendorPackageServiceModule.VendorPackageService, "getByVendorId").mockResolvedValue({ data: packages, error: null });
        vi.spyOn(VendorPortfolioFilesServiceModule.VendorPortfolioFilesService, "getByVendorId").mockResolvedValue({ data: portfolioFiles, error: null });
        vi.spyOn(VendorRegionServiceModule.VendorRegionService, "getByVendorId").mockResolvedValue({ data: regions, error: null });
        vi.spyOn(VendorPromotionServiceModule.VendorPromotionService, "getByVendorId").mockResolvedValue({ data: promotions, error: null });
        vi.spyOn(VendorReviewServiceModule.VendorReviewService, "getByVendorId").mockResolvedValue({ data: reviews, error: null });
        vi.spyOn(VendorsPortfolioTagsServiceModule.VendorsPortfolioTagsService, "getByVendorId").mockResolvedValue({ data: portfolioTags, error: null });
        vi.spyOn(ServiceTypesServiceModule.ServiceTypesService, "getById").mockResolvedValue({ data: serviceType, error: null });
        vi.spyOn(ServiceTypeBeautyOptionsServiceModule.ServiceTypeBeautyOptionsService, "getByVendorId").mockResolvedValue({ data: nicheData, error: null });
        vi.spyOn(ServiceTypeClothingOptionsDzServiceModule.ServiceTypeClothingOptionsDzService, "getByVendorId").mockResolvedValue({ data: [], error: null });
        vi.spyOn(ServiceTypeMusicOptionsDzServiceModule.ServiceTypeMusicOptionsDzService, "getByVendorId").mockResolvedValue({ data: [], error: null });
        vi.spyOn(ServiceTypeOrganizerOptionsServiceModule.ServiceTypeOrganizerOptionsService, "getByVendorId").mockResolvedValue({ data: [], error: null });
        vi.spyOn(ServiceTypeSavoryOptionsServiceModule.ServiceTypeSavoryOptionsService, "getByVendorId").mockResolvedValue({ data: [], error: null });
        vi.spyOn(ServiceTypeTransportOptionsServiceModule.ServiceTypeTransportOptionsService, "getByVendorId").mockResolvedValue({ data: [], error: null });
        vi.spyOn(ServiceTypeVenueOptionsServiceModule.ServiceTypeVenueOptionsService, "getByVendorId").mockResolvedValue({ data: [], error: null });
        vi.spyOn(SimilarVendorsServiceModule.SimilarVendorsService, "getSimilarVendors").mockResolvedValue(similarVendors);
    });

    it("fetches and populates all vendor public profile data including similar vendors", async () => {
        const { fetchVendorProfile, profile, loading, error } = useVendorPublicProfile();
        await fetchVendorProfile(vendorId);
        expect(loading.value).toBe(false);
        expect(error.value).toBeNull();
        expect(profile.value).toMatchObject({
            vendor,
            packages,
            portfolioFiles,
            regions,
            promotions,
            reviews,
            nicheInfo: nicheData[0],
            portfolioTags,
            similarVendors
        });
    });

    it("handles vendor not found", async () => {
        vi.spyOn(VendorServiceModule.VendorService, "getById").mockResolvedValue({ data: null, error: null });
        const { fetchVendorProfile, profile, loading, error } = useVendorPublicProfile();
        await fetchVendorProfile("bad-id");
        expect(loading.value).toBe(false);
        expect(error.value).toBe("Vendor not found");
        expect(profile.value).toBeNull();
    });

    it("handles service type not found", async () => {
        vi.spyOn(ServiceTypesServiceModule.ServiceTypesService, "getById").mockResolvedValue({ data: null, error: null });
        const { fetchVendorProfile, profile } = useVendorPublicProfile();
        await fetchVendorProfile(vendorId);
        expect(profile.value?.nicheInfo).toBeNull();
        expect(profile.value?.similarVendors).toEqual(similarVendors);
    });

    it("handles known service type with no niche options", async () => {
        vi.spyOn(ServiceTypesServiceModule.ServiceTypesService, "getById").mockResolvedValue({ data: { id: "photography", name: "photography" }, error: null });
        const { fetchVendorProfile, profile } = useVendorPublicProfile();
        await fetchVendorProfile(vendorId);
        expect(profile.value?.nicheInfo).toBeNull();
        expect(profile.value?.similarVendors).toEqual(similarVendors);
    });

    it("calls correct niche service for each type", async () => {
        const types = [
            { name: "beauty", service: ServiceTypeBeautyOptionsServiceModule.ServiceTypeBeautyOptionsService },
            { name: "clothing", service: ServiceTypeClothingOptionsDzServiceModule.ServiceTypeClothingOptionsDzService },
            { name: "music", service: ServiceTypeMusicOptionsDzServiceModule.ServiceTypeMusicOptionsDzService },
            { name: "organizer", service: ServiceTypeOrganizerOptionsServiceModule.ServiceTypeOrganizerOptionsService },
            { name: "savory", service: ServiceTypeSavoryOptionsServiceModule.ServiceTypeSavoryOptionsService },
            { name: "transport", service: ServiceTypeTransportOptionsServiceModule.ServiceTypeTransportOptionsService },
            { name: "venue", service: ServiceTypeVenueOptionsServiceModule.ServiceTypeVenueOptionsService },
        ];
        for (const { name, service } of types) {
            vi.spyOn(ServiceTypesServiceModule.ServiceTypesService, "getById").mockResolvedValue({ data: { id: name, name }, error: null });
            const spy = vi.spyOn(service, "getByVendorId");
            const { fetchVendorProfile } = useVendorPublicProfile();
            await fetchVendorProfile(vendorId);
            expect(spy).toHaveBeenCalledWith(vendorId);
        }
    });

    it("handles no similar vendors", async () => {
        vi.spyOn(SimilarVendorsServiceModule.SimilarVendorsService, "getSimilarVendors").mockResolvedValue([]);
        const { fetchVendorProfile, profile } = useVendorPublicProfile();
        await fetchVendorProfile(vendorId);
        expect(profile.value?.similarVendors).toEqual([]);
    });
});
