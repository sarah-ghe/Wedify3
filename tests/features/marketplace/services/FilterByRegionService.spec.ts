import { describe, it, expect, vi, beforeEach } from "vitest";
import { filterByRegion } from "@/features/marketplace/services/FilterByRegionService";
import { VendorRegionService } from "@/features/vendors/services/VendorRegionService";

vi.mock("@/features/vendors/services/VendorRegionService", () => ({
    VendorRegionService: {
        getBySetOfIds: vi.fn(),
    },
}));

const vendors = [
    { id: "1", business_name: "A" },
    { id: "2", business_name: "B" },
    { id: "3", business_name: "C" },
];

describe("filterByRegion", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("returns all vendors if region is undefined", async () => {
        const result = await filterByRegion(vendors, undefined);
        expect(result).toEqual(vendors);
    });

    it("returns all vendors if region is null", async () => {
        const result = await filterByRegion(vendors, null as any);
        expect(result).toEqual(vendors);
    });

    it("returns empty array if no regionData", async () => {
        (VendorRegionService.getBySetOfIds as any).mockResolvedValue({ data: [] });
        const result = await filterByRegion(vendors, "Algiers");
        expect(result).toEqual([]);
    });

    it("returns empty array if no vendors match the region", async () => {
        (VendorRegionService.getBySetOfIds as any).mockResolvedValue({
            data: [
                { vendor_id: "1", region_name: "Oran" },
                { vendor_id: "2", region_name: "Constantine" },
            ],
        });
        const result = await filterByRegion(vendors, "Algiers");
        expect(result).toEqual([]);
    });

    it("returns only vendors matching the region", async () => {
        (VendorRegionService.getBySetOfIds as any).mockResolvedValue({
            data: [
                { vendor_id: "1", region_name: "Algiers" },
                { vendor_id: "2", region_name: "Oran" },
                { vendor_id: "3", region_name: "Algiers" },
            ],
        });
        const result = await filterByRegion(vendors, "Algiers");
        expect(result.map(v => v.id).sort()).toEqual(["1", "3"]);
    });

    it("handles undefined regionData gracefully", async () => {
        (VendorRegionService.getBySetOfIds as any).mockResolvedValue({ data: undefined });
        const result = await filterByRegion(vendors, "Algiers");
        expect(result).toEqual([]);
    });
});
