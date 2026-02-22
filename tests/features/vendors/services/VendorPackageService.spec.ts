import { describe, it, expect, vi, beforeEach } from "vitest";
import { VendorPackageService } from "@/features/vendors/services/VendorPackageService";
import { supabase } from "@/lib/supabase";

vi.mock("@/lib/supabase");

describe("VendorPackageService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should fetch all vendor packages", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            select: vi.fn().mockResolvedValue({ data: [{ id: "p1", vendor_id: "v1" }], error: null }),
        } as any);

        const { data, error } = await VendorPackageService.getAll();
        expect(data).toEqual([{ id: "p1", vendor_id: "v1" }]);
        expect(error).toBeNull();
    });

    it("should fetch vendor package by id", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                    single: vi.fn().mockResolvedValue({ data: { id: "p1", vendor_id: "v1" }, error: null }),
                }),
            }),
        } as any);

        const { data, error } = await VendorPackageService.getById("p1");
        expect(data).toEqual({ id: "p1", vendor_id: "v1" });
        expect(error).toBeNull();
    });

    it("should create a vendor package", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            insert: vi.fn().mockReturnValue({
                select: vi.fn().mockReturnValue({
                    single: vi.fn().mockResolvedValue({ data: { id: "p1", vendor_id: "v1" }, error: null }),
                }),
            }),
        } as any);

        const { data, error } = await VendorPackageService.create({ vendor_id: "v1", name: "Basic", price: 100, features: {}, is_daily_booking: true });
        expect(data).toEqual({ id: "p1", vendor_id: "v1" });
        expect(error).toBeNull();
    });

    it("should create batch vendor packages", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            insert: vi.fn().mockResolvedValue({ data: [{ id: "p1", vendor_id: "v1" }], error: null }),
        } as any);

        const { data, error } = await VendorPackageService.createBatch([{ vendor_id: "v1", name: "Basic", price: 100, features: {}, is_daily_booking: true }]);
        expect(data).toEqual([{ id: "p1", vendor_id: "v1" }]);
        expect(error).toBeNull();
    });

    it("should update a vendor package", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            update: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                    select: vi.fn().mockReturnValue({
                        single: vi.fn().mockResolvedValue({ data: { id: "p1", vendor_id: "v1", name: "Updated" }, error: null }),
                    }),
                }),
            }),
        } as any);

        const { data, error } = await VendorPackageService.update("p1", { name: "Updated" });
        expect(data).toEqual({ id: "p1", vendor_id: "v1", name: "Updated" });
        expect(error).toBeNull();
    });

    it("should delete a vendor package", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            delete: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ error: null }),
            }),
        } as any);

        const { error } = await VendorPackageService.delete("p1");
        expect(error).toBeNull();
    });

    it("should fetch vendor packages by vendor id", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            select: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ data: [{ id: "p1", vendor_id: "v1" }], error: null }),
            }),
        } as any);

        const { data, error } = await VendorPackageService.getByVendorId("v1");
        expect(data).toEqual([{ id: "p1", vendor_id: "v1" }]);
        expect(error).toBeNull();
    });

    it("should delete vendor packages by vendor id", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            delete: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ error: null }),
            }),
        } as any);

        const { error } = await VendorPackageService.deleteByVendorId("v1");
        expect(error).toBeNull();
    });
});
