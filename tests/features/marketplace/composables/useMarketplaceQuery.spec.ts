import { describe, it, expect, vi, beforeEach } from "vitest";
import { useMarketplaceQuery } from "@/features/marketplace/composables/useMarketplaceQuery";
import { VendorService } from "@/features/vendors/services/VendorService";
import { VendorRegionService } from "@/features/vendors/services/VendorRegionService";
import { VendorPackageService } from "@/features/vendors/services/VendorPackageService";
import { VendorPromotionService } from "@/features/vendors/services/VendorPromotionService";
import { VendorsRestDaysService } from "@/features/vendors/services/VendorsRestDaysService";
import { VendorUnavailableDatesService } from "@/features/vendors/services/VendorUnavailableDatesService";
import { ServiceTypeBeautyOptionsService } from "@/features/vendors/services/ServiceTypeBeautyOptionsService";

vi.mock("@/features/vendors/services/VendorService", () => ({
    VendorService: { getAll: vi.fn() }
}));
vi.mock("@/features/vendors/services/VendorRegionService", () => ({
    VendorRegionService: { getBySetOfIds: vi.fn() }
}));
vi.mock("@/features/vendors/services/VendorPackageService", () => ({
    VendorPackageService: { getBySetOfVendorIds: vi.fn() }
}));
vi.mock("@/features/vendors/services/VendorPromotionService", () => ({
    VendorPromotionService: { getBySetOfVendorIds: vi.fn() }
}));
vi.mock("@/features/vendors/services/VendorsRestDaysService", () => ({
    VendorsRestDaysService: { getBySetOfIds: vi.fn() }
}));
vi.mock("@/features/vendors/services/VendorUnavailableDatesService", () => ({
    VendorUnavailableDatesService: { getBySetOfIds: vi.fn() }
}));
vi.mock("@/features/vendors/services/ServiceTypeBeautyOptionsService", () => ({
    ServiceTypeBeautyOptionsService: { getAll: vi.fn() }
}));

const vendors = [
    { id: "1", user_id: "u1", business_name: "A", created_at: "", service_type_id: "beauty", rating: 4.5, description: "desc1" },
    { id: "2", user_id: "u2", business_name: "B", created_at: "", service_type_id: "music", rating: 3.9, description: "desc2" },
    { id: "3", user_id: "u3", business_name: "C", created_at: "", service_type_id: "beauty", description: "desc3" }
];

function setupAllMocks() {
    (VendorService.getAll as any).mockResolvedValue({ data: vendors, error: null });
    (VendorRegionService.getBySetOfIds as any).mockResolvedValue({ data: [
            { vendor_id: "1", region_name: "Algiers" },
            { vendor_id: "2", region_name: "Oran" },
            { vendor_id: "3", region_name: "Algiers" }
        ]});
    (VendorPackageService.getBySetOfVendorIds as any).mockResolvedValue({ data: [
            { vendor_id: "1", price: 100 },
            { vendor_id: "2", price: 300 }
        ]});
    (VendorPromotionService.getBySetOfVendorIds as any).mockResolvedValue({ data: [
            { vendor_id: "2", price: 250, discount_price: 150, start_date: "2024-06-01", end_date: "2024-06-30", status: "active" }
        ]});
    (VendorsRestDaysService.getBySetOfIds as any).mockResolvedValue({ data: [
            { vendor_id: "2", day_of_week: "Monday" }
        ]});
    (VendorUnavailableDatesService.getBySetOfIds as any).mockResolvedValue({ data: [
            { vendor_id: "3", date: "2024-06-10" }
        ]});
    (ServiceTypeBeautyOptionsService.getAll as any).mockResolvedValue({ data: [
            { vendor_id: "1", hair_styling: true },
            { vendor_id: "3", hair_styling: false }
        ]});
}

describe("useMarketplaceQuery", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        setupAllMocks();
    });

    it("fetches all vendors with no filters", async () => {
        // Verifies all vendors are returned when no filters are applied
        const { vendors: result, fetchVendors, loading, error } = useMarketplaceQuery();
        await fetchVendors({});
        expect(result.value.length).toBe(3);
        expect(loading.value).toBe(false);
        expect(error.value).toBeNull();
    });

    it("filters by search", async () => {
        const { vendors: result, fetchVendors } = useMarketplaceQuery();
        await fetchVendors({ search: "A" });
        expect(result.value.map(v => v.id)).toEqual(["1"]);
    });

    it("filters by region", async () => {
        const { vendors: result, fetchVendors } = useMarketplaceQuery();
        await fetchVendors({ region: "Algiers" });
        expect(result.value.map(v => v.id).sort()).toEqual(["1", "3"]);
    });

    it("filters by vendorType", async () => {
        const { vendors: result, fetchVendors } = useMarketplaceQuery();
        await fetchVendors({ vendorType: "beauty" });
        expect(result.value.map(v => v.id).sort()).toEqual(["1", "3"]);
    });

    it("filters by minRating", async () => {
        const { vendors: result, fetchVendors } = useMarketplaceQuery();
        await fetchVendors({ minRating: 4 });
        expect(result.value.map(v => v.id)).toEqual(["1"]);
    });

    it("filters by serviceTypeOptions", async () => {
        const { vendors: result, fetchVendors } = useMarketplaceQuery();
        await fetchVendors({ serviceType: "beauty", selectedOptions: { hair_styling: true } });
        expect(result.value.map(v => v.id)).toEqual(["1"]);
    });

    it("filters by maxPrice", async () => {
        const { vendors: result, fetchVendors } = useMarketplaceQuery();
        await fetchVendors({ maxPrice: 150 });
        expect(result.value.map(v => v.id)).toEqual(["1", "2"]);
    });

    it("filters by promotionHighlights", async () => {
        // Ensures vendor 2 is available and has a promotion
        mockVendor2Available();
        const { vendors: result, fetchVendors } = useMarketplaceQuery();
        await fetchVendors({ promotionHighlights: true, date: "2024-06-10" });
        expect(result.value.map(v => v.id)).toEqual(["2"]);
    });

    it("filters by availability (date)", async () => {
        const { vendors: result, fetchVendors } = useMarketplaceQuery();
        await fetchVendors({ date: "2024-06-10" }); // Monday
        expect(result.value.map(v => v.id)).toEqual(["1"]);
    });

    it("applies all filters together", async () => {
        // Ensures vendor 1 passes all filters
        mockPromotionForVendor1();
        (VendorsRestDaysService.getBySetOfIds as any).mockResolvedValue({ data: [] });
        (VendorUnavailableDatesService.getBySetOfIds as any).mockResolvedValue({ data: [] });

        const { vendors: result, fetchVendors } = useMarketplaceQuery();
        await fetchVendors({
            search: "A",
            region: "Algiers",
            vendorType: "beauty",
            minRating: 4,
            serviceType: "beauty",
            selectedOptions: { hair_styling: true },
            maxPrice: 150,
            promotionHighlights: true,
            date: "2024-06-10"
        });
        expect(result.value.map(v => v.id)).toEqual(["1"]);
    });

    it("returns empty if no vendors match after all filters", async () => {
        (VendorService.getAll as any).mockResolvedValue({ data: vendors, error: null });
        (VendorRegionService.getBySetOfIds as any).mockResolvedValue({ data: [] });
        const { vendors: result, fetchVendors } = useMarketplaceQuery();
        await fetchVendors({ region: "Nonexistent" });
        expect(result.value).toEqual([]);
    });

    it("sets error if vendor fetch fails", async () => {
        (VendorService.getAll as any).mockResolvedValue({ data: null, error: "fail" });
        const { vendors: result, fetchVendors, error } = useMarketplaceQuery();
        await fetchVendors({});
        expect(result.value).toEqual([]);
        expect(error.value).toBe("Failed to fetch vendors");
    });

    it("resets error and loading on each fetch", async () => {
        (VendorService.getAll as any).mockResolvedValue({ data: null, error: "fail" });
        const { fetchVendors, error, loading } = useMarketplaceQuery();
        await fetchVendors({});
        expect(error.value).toBe("Failed to fetch vendors");
        (VendorService.getAll as any).mockResolvedValue({ data: vendors, error: null });
        await fetchVendors({});
        expect(error.value).toBeNull();
        expect(loading.value).toBe(false);
    });

    it("handles undefined, null, and empty filter values", async () => {
        const { vendors: result, fetchVendors } = useMarketplaceQuery();
        await fetchVendors({ region: undefined, vendorType: undefined, search: "" });
        expect(result.value.length).toBe(3);
    });

    it("handles empty vendor list", async () => {
        (VendorService.getAll as any).mockResolvedValue({ data: [], error: null });
        const { vendors: result, fetchVendors } = useMarketplaceQuery();
        await fetchVendors({});
        expect(result.value).toEqual([]);
    });
});

function mockVendor2Available() {
    (VendorsRestDaysService.getBySetOfIds as any).mockResolvedValue({ data: [] });
    (VendorUnavailableDatesService.getBySetOfIds as any).mockResolvedValue({ data: [] });
}

function mockPromotionForVendor1() {
    (VendorPromotionService.getBySetOfVendorIds as any).mockResolvedValue({
        data: [
            {
                vendor_id: "1",
                price: 120,
                discount_price: 100,
                start_date: "2024-06-01",
                end_date: "2024-06-30",
                status: "active"
            }
        ]
    });
}