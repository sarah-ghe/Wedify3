import { describe, it, expect, vi, beforeEach } from "vitest";
import { VendorPromotionService } from "@/features/vendors/services/VendorPromotionService";
import { supabase } from "@/lib/supabase";

vi.mock("@/lib/supabase");

describe("VendorPromotionService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should fetch all vendor promotions", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            select: vi.fn().mockResolvedValue({ data: [{ id: 1, vendor_id: "v1" }], error: null }),
        } as any);

        const { data, error } = await VendorPromotionService.getAll();
        expect(data).toEqual([{ id: 1, vendor_id: "v1" }]);
        expect(error).toBeNull();
    });

    it("should fetch vendor promotion by id", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                    single: vi.fn().mockResolvedValue({ data: { id: 1, vendor_id: "v1" }, error: null }),
                }),
            }),
        } as any);

        const { data, error } = await VendorPromotionService.getById(1);
        expect(data).toEqual({ id: 1, vendor_id: "v1" });
        expect(error).toBeNull();
    });

    it("should fetch vendor promotions by vendor id", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            select: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ data: [{ id: 1, vendor_id: "v1" }], error: null }),
            }),
        } as any);

        const { data, error } = await VendorPromotionService.getByVendorId("v1");
        expect(data).toEqual([{ id: 1, vendor_id: "v1" }]);
        expect(error).toBeNull();
    });

    it("should create a vendor promotion", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            insert: vi.fn().mockReturnValue({
                select: vi.fn().mockReturnValue({
                    single: vi.fn().mockResolvedValue({ data: { id: 1, vendor_id: "v1" }, error: null }),
                }),
            }),
        } as any);

        const { data, error } = await VendorPromotionService.create({ vendor_id: "v1", name: "Promo", price: 100, discount_price: 80, start_date: "2024-01-01", end_date: "2024-01-10", status: "active" });
        expect(data).toEqual({ id: 1, vendor_id: "v1" });
        expect(error).toBeNull();
    });

    it("should create batch vendor promotions", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            insert: vi.fn().mockResolvedValue({ data: [{ id: 1, vendor_id: "v1" }], error: null }),
        } as any);

        const { data, error } = await VendorPromotionService.createBatch([{ vendor_id: "v1", name: "Promo", price: 100, discount_price: 80, start_date: "2024-01-01", end_date: "2024-01-10", status: "active" }]);
        expect(data).toEqual([{ id: 1, vendor_id: "v1" }]);
        expect(error).toBeNull();
    });

    it("should update a vendor promotion", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            update: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                    select: vi.fn().mockReturnValue({
                        single: vi.fn().mockResolvedValue({ data: { id: 1, vendor_id: "v1", name: "Updated" }, error: null }),
                    }),
                }),
            }),
        } as any);

        const { data, error } = await VendorPromotionService.update(1, { name: "Updated" });
        expect(data).toEqual({ id: 1, vendor_id: "v1", name: "Updated" });
        expect(error).toBeNull();
    });

    it("should delete a vendor promotion", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            delete: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ error: null }),
            }),
        } as any);

        const { error } = await VendorPromotionService.delete(1);
        expect(error).toBeNull();
    });

    it("should delete vendor promotions by vendor id", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            delete: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ error: null }),
            }),
        } as any);

        const { error } = await VendorPromotionService.deleteByVendorId("v1");
        expect(error).toBeNull();
    });
});
