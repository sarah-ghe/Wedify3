import { describe, it, expect, vi, beforeEach } from "vitest";
import { ServiceTypeBeautyOptionsService } from "@/features/vendors/services/ServiceTypeBeautyOptionsService";
import { supabase } from "@/lib/supabase";

vi.mock("@/lib/supabase");

describe("ServiceTypeBeautyOptionsService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should fetch all beauty options", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            select: vi.fn().mockResolvedValue({ data: [{ id: 1, vendor_id: "v1" }], error: null }),
        } as any);

        const { data, error } = await ServiceTypeBeautyOptionsService.getAll();
        expect(data).toEqual([{ id: 1, vendor_id: "v1" }]);
        expect(error).toBeNull();
    });

    it("should fetch beauty option by id", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                    single: vi.fn().mockResolvedValue({ data: { id: 1, vendor_id: "v1" }, error: null }),
                }),
            }),
        } as any);

        const { data, error } = await ServiceTypeBeautyOptionsService.getById(1);
        expect(data).toEqual({ id: 1, vendor_id: "v1" });
        expect(error).toBeNull();
    });

    it("should fetch beauty options by vendor id", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            select: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ data: [{ id: 1, vendor_id: "v1" }], error: null }),
            }),
        } as any);

        const { data, error } = await ServiceTypeBeautyOptionsService.getByVendorId("v1");
        expect(data).toEqual([{ id: 1, vendor_id: "v1" }]);
        expect(error).toBeNull();
    });

    it("should create a beauty option", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            insert: vi.fn().mockReturnValue({
                select: vi.fn().mockReturnValue({
                    single: vi.fn().mockResolvedValue({ data: { id: 1, vendor_id: "v1" }, error: null }),
                }),
            }),
        } as any);

        const { data, error } = await ServiceTypeBeautyOptionsService.create({ vendor_id: "v1" });
        expect(data).toEqual({ id: 1, vendor_id: "v1" });
        expect(error).toBeNull();
    });

    it("should create batch beauty options", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            insert: vi.fn().mockResolvedValue({ data: [{ id: 1, vendor_id: "v1" }], error: null }),
        } as any);

        const { data, error } = await ServiceTypeBeautyOptionsService.createBatch([{ vendor_id: "v1" }]);
        expect(data).toEqual([{ id: 1, vendor_id: "v1" }]);
        expect(error).toBeNull();
    });

    it("should update a beauty option", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            update: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                    select: vi.fn().mockReturnValue({
                        single: vi.fn().mockResolvedValue({ data: { id: 1, vendor_id: "v1", makeup: true }, error: null }),
                    }),
                }),
            }),
        } as any);

        const { data, error } = await ServiceTypeBeautyOptionsService.update(1, { makeup: true });
        expect(data).toEqual({ id: 1, vendor_id: "v1", makeup: true });
        expect(error).toBeNull();
    });

    it("should delete a beauty option", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            delete: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ error: null }),
            }),
        } as any);

        const { error } = await ServiceTypeBeautyOptionsService.delete(1);
        expect(error).toBeNull();
    });

    it("should delete batch beauty options", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            delete: vi.fn().mockReturnValue({
                in: vi.fn().mockResolvedValue({ error: null }),
            }),
        } as any);

        const { error } = await ServiceTypeBeautyOptionsService.deleteBatch([1, 2]);
        expect(error).toBeNull();
    });

    it("should delete beauty options by vendor id", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            delete: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ error: null }),
            }),
        } as any);

        const { error } = await ServiceTypeBeautyOptionsService.deleteByVendorId("v1");
        expect(error).toBeNull();
    });
});
