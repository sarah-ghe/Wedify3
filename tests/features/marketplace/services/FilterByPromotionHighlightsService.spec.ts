import { describe, it, expect, vi, beforeEach } from "vitest";
import { filterByPromotionHighlights } from "@/features/marketplace/services/FilterByPromotionHighlightsService";
import { VendorPromotionService } from "@/features/vendors/services/VendorPromotionService";
import { Vendor } from "@/features/vendors/services/VendorService";

vi.mock("@/features/vendors/services/VendorPromotionService", () => ({
    VendorPromotionService: {
        getBySetOfVendorIds: vi.fn(),
    },
}));

const vendors: Vendor[] = [
    { id: "1", user_id: "u1", business_name: "A", created_at: "", service_type_id: "s1" },
    { id: "2", user_id: "u2", business_name: "B", created_at: "", service_type_id: "s2" },
    { id: "3", user_id: "u3", business_name: "C", created_at: "", service_type_id: "s3" },
];

describe("filterByPromotionHighlights", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("returns all vendors if no date is provided", async () => {
        const result = await filterByPromotionHighlights(vendors, undefined);
        expect(result).toEqual(vendors);
    });

    it("returns empty array if no promotions are found", async () => {
        (VendorPromotionService.getBySetOfVendorIds as any).mockResolvedValue({ data: [] });
        const result = await filterByPromotionHighlights(vendors, "2024-06-10");
        expect(result).toEqual([]);
    });

    it("returns empty array if promotions are not active", async () => {
        (VendorPromotionService.getBySetOfVendorIds as any).mockResolvedValue({
            data: [
                { vendor_id: "1", start_date: "2024-06-01", end_date: "2024-06-30", status: "inactive" },
            ],
        });
        const result = await filterByPromotionHighlights(vendors, "2024-06-10");
        expect(result).toEqual([]);
    });

    it("returns empty array if promotions are active but not in date range", async () => {
        (VendorPromotionService.getBySetOfVendorIds as any).mockResolvedValue({
            data: [
                { vendor_id: "1", start_date: "2024-06-11", end_date: "2024-06-20", status: "active" },
            ],
        });
        const result = await filterByPromotionHighlights(vendors, "2024-06-10");
        expect(result).toEqual([]);
    });

    it("returns vendors with active promotions in date range", async () => {
        (VendorPromotionService.getBySetOfVendorIds as any).mockResolvedValue({
            data: [
                { vendor_id: "1", start_date: "2024-06-01", end_date: "2024-06-30", status: "active" },
                { vendor_id: "2", start_date: "2024-06-10", end_date: "2024-06-10", status: "active" },
                { vendor_id: "3", start_date: "2024-06-05", end_date: "2024-06-09", status: "active" },
            ],
        });
        const result = await filterByPromotionHighlights(vendors, "2024-06-10");
        expect(result.map(v => v.id).sort()).toEqual(["1", "2"]);
    });

    it("handles undefined promotions data gracefully", async () => {
        (VendorPromotionService.getBySetOfVendorIds as any).mockResolvedValue({ data: undefined });
        const result = await filterByPromotionHighlights(vendors, "2024-06-10");
        expect(result).toEqual([]);
    });

    it("handles null promotions data gracefully", async () => {
        (VendorPromotionService.getBySetOfVendorIds as any).mockResolvedValue({ data: null });
        const result = await filterByPromotionHighlights(vendors, "2024-06-10");
        expect(result).toEqual([]);
    });

    it("returns only vendors with matching vendor_id", async () => {
        (VendorPromotionService.getBySetOfVendorIds as any).mockResolvedValue({
            data: [
                { vendor_id: "2", start_date: "2024-06-01", end_date: "2024-06-30", status: "active" },
                { vendor_id: "4", start_date: "2024-06-01", end_date: "2024-06-30", status: "active" },
            ],
        });
        const result = await filterByPromotionHighlights(vendors, "2024-06-10");
        expect(result.map(v => v.id)).toEqual(["2"]);
    });
});
