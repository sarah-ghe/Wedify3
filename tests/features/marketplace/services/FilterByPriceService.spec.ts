import { describe, it, expect, vi, beforeEach } from "vitest";
import { filterByPrice } from "@/features/marketplace/services/FilterByPriceService";
import { Vendor } from "@/features/vendors/services/VendorService";
import { VendorPackageService } from "@/features/vendors/services/VendorPackageService";
import { VendorPromotionService } from "@/features/vendors/services/VendorPromotionService";

vi.mock("@/features/vendors/services/VendorPackageService", () => ({
    VendorPackageService: {
        getBySetOfVendorIds: vi.fn(),
    },
}));
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

describe("filterByPrice", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("returns all vendors if maxPrice is undefined", async () => {
        const result = await filterByPrice(vendors, undefined);
        expect(result).toEqual(vendors);
    });

    it("returns all vendors if maxPrice is null", async () => {
        const result = await filterByPrice(vendors, null as any);
        expect(result).toEqual(vendors);
    });

    it("filters vendors by package price only", async () => {
        (VendorPackageService.getBySetOfVendorIds as any).mockResolvedValue({
            data: [
                { vendor_id: "1", price: 100 },
                { vendor_id: "2", price: 300 },
            ],
        });
        (VendorPromotionService.getBySetOfVendorIds as any).mockResolvedValue({
            data: [],
        });

        const result = await filterByPrice(vendors, 200);
        expect(result.map(v => v.id)).toEqual(["1"]);
    });

    it("filters vendors by promotion discount_price and price", async () => {
        (VendorPackageService.getBySetOfVendorIds as any).mockResolvedValue({
            data: [],
        });
        (VendorPromotionService.getBySetOfVendorIds as any).mockResolvedValue({
            data: [
                { vendor_id: "2", price: 250, discount_price: 150 },
                { vendor_id: "3", price: 400 },
            ],
        });

        const result = await filterByPrice(vendors, 200);
        expect(result.map(v => v.id)).toEqual(["2"]);
    });

    it("filters vendors by both packages and promotions", async () => {
        (VendorPackageService.getBySetOfVendorIds as any).mockResolvedValue({
            data: [
                { vendor_id: "1", price: 100 },
            ],
        });
        (VendorPromotionService.getBySetOfVendorIds as any).mockResolvedValue({
            data: [
                { vendor_id: "2", price: 300, discount_price: 200 },
                { vendor_id: "3", price: 150 },
            ],
        });

        const result = await filterByPrice(vendors, 200);
        // vendor 1 (package), vendor 2 (discount_price), vendor 3 (promotion price)
        expect(result.map(v => v.id).sort()).toEqual(["1", "2", "3"]);
    });

    it("returns empty array if no vendors match", async () => {
        (VendorPackageService.getBySetOfVendorIds as any).mockResolvedValue({
            data: [
                { vendor_id: "1", price: 500 },
            ],
        });
        (VendorPromotionService.getBySetOfVendorIds as any).mockResolvedValue({
            data: [
                { vendor_id: "2", price: 600, discount_price: 550 },
                { vendor_id: "3", price: 700 },
            ],
        });

        const result = await filterByPrice(vendors, 100);
        expect(result).toEqual([]);
    });

    it("handles empty packages and promotions arrays", async () => {
        (VendorPackageService.getBySetOfVendorIds as any).mockResolvedValue({
            data: [],
        });
        (VendorPromotionService.getBySetOfVendorIds as any).mockResolvedValue({
            data: [],
        });

        const result = await filterByPrice(vendors, 100);
        expect(result).toEqual([]);
    });

    it("handles undefined packages and promotions", async () => {
        (VendorPackageService.getBySetOfVendorIds as any).mockResolvedValue({
            data: undefined,
        });
        (VendorPromotionService.getBySetOfVendorIds as any).mockResolvedValue({
            data: undefined,
        });

        const result = await filterByPrice(vendors, 100);
        expect(result).toEqual([]);
    });

    it("includes vendor if package or promotion price equals maxPrice", async () => {
        (VendorPackageService.getBySetOfVendorIds as any).mockResolvedValue({
            data: [
                { vendor_id: "1", price: 100 },
            ],
        });
        (VendorPromotionService.getBySetOfVendorIds as any).mockResolvedValue({
            data: [
                { vendor_id: "2", price: 200 },
            ],
        });

        const result = await filterByPrice(vendors, 100);
        expect(result.map(v => v.id)).toEqual(["1"]);
        const result2 = await filterByPrice(vendors, 200);
        expect(result2.map(v => v.id).sort()).toEqual(["1", "2"]);
    });
});
