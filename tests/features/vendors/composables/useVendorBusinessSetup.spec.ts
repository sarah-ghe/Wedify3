import { describe, it, expect, vi, beforeEach } from "vitest";
import { useVendorBusinessSetup } from "@/features/vendors/composables/useVendorBusinessSetup";
import { VendorService } from "@/features/vendors/services/VendorService";
import { VendorRegionService } from "@/features/vendors/services/VendorRegionService";
import { ServiceTypesService } from "@/features/vendors/services/ServiceTypesService";
import { ServiceTypeBeautyOptionsService } from "@/features/vendors/services/ServiceTypeBeautyOptionsService";
import { VendorPackageService } from "@/features/vendors/services/VendorPackageService";
import { VendorPromotionService } from "@/features/vendors/services/VendorPromotionService";
import { VendorsRestDaysService } from "@/features/vendors/services/VendorsRestDaysService";
import { VendorsPortfolioTagsService } from "@/features/vendors/services/VendorsPortfolioTagsService";
import type { PostgrestError } from "@supabase/supabase-js";

vi.mock("@/features/vendors/services/VendorService");
vi.mock("@/features/vendors/services/VendorRegionService");
vi.mock("@/features/vendors/services/ServiceTypesService");
vi.mock("@/features/vendors/services/ServiceTypeBeautyOptionsService");
vi.mock("@/features/vendors/services/VendorPackageService");
vi.mock("@/features/vendors/services/VendorPromotionService");
vi.mock("@/features/vendors/services/VendorsRestDaysService");
vi.mock("@/features/vendors/services/VendorsPortfolioTagsService");

describe("useVendorBusinessSetup", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should setup vendor business successfully", async () => {
        const vendorId = "vendor123";
        vi.mocked(VendorService.create).mockResolvedValue({ data: { id: vendorId }, error: null });
        vi.mocked(ServiceTypesService.getById).mockResolvedValue({ data: { name: "beauty" }, error: null });
        vi.mocked(ServiceTypeBeautyOptionsService.create).mockResolvedValue({
            data: null,
            error: null
        });
        vi.mocked(VendorRegionService.createBatch).mockResolvedValue({
            data: null,
            error: null
        });
        vi.mocked(VendorPackageService.createBatch).mockResolvedValue({ data: null, error: null });
        vi.mocked(VendorPromotionService.createBatch).mockResolvedValue({ data: null, error: null });
        vi.mocked(VendorsRestDaysService.createBatch).mockResolvedValue({ data: null, error: null });
        vi.mocked(VendorsPortfolioTagsService.createBatch).mockResolvedValue({ data: null, error: null });

        const { setupVendorBusiness, error, loading } = useVendorBusinessSetup();

        const result = await setupVendorBusiness({
            vendorData: { id: "v1", user_id: "u1", business_name: "Test", service_type_id: "beauty", created_at: "" },
            regions: [{ id: "r1", vendor_id: "v1", region_name: "Algiers" }],
            serviceTypeId: "beauty",
            nicheInfo: { id: 1, vendor_id: "v1", hair_styling: true, makeup: true, created_at: "" },
            packages: [{ id: "p1", vendor_id: "v1", name: "Basic", price: 100, features: {}, is_daily_booking: true }],
            promotions: [],
            restDays: [],
            portfolioTags: [],
        });

        expect(result.success).toBe(true);
        expect(result.vendorId).toBe(vendorId);
        expect(error.value).toBeNull();
        expect(loading.value).toBe(false);
    });

    it("should fail if vendor creation fails", async () => {
        // Mock a PostgrestError object
        const fakeError: PostgrestError = {
            name: "", stack: "",
            message: "fail",
            details: "",
            hint: "",
            code: "1234"
        };

        vi.mocked(VendorService.create).mockResolvedValue({ data: null, error: fakeError });

        const { setupVendorBusiness, error, loading } = useVendorBusinessSetup();

        const result = await setupVendorBusiness({
            vendorData: { id: "v1", user_id: "u1", business_name: "Test", service_type_id: "beauty", created_at: "" },
            regions: [],
            serviceTypeId: "beauty",
            nicheInfo: undefined,
            packages: [],
            promotions: [],
            restDays: [],
            portfolioTags: [],
        });

        expect(result.success).toBe(false);
        expect(result.vendorId).toBeNull();
        expect(error.value).toBe("Vendor creation failed");
        expect(loading.value).toBe(false);
    });
});
