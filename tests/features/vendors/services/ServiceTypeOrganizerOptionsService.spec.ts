import { describe, it, expect, vi, beforeEach } from "vitest";
import { ServiceTypeClothingOptionsDzService } from "@/features/vendors/services/ServiceTypeClothingOptionsDzService";
import { supabase } from "@/lib/supabase";

vi.mock("@/lib/supabase");

describe("ServiceTypeClothingOptionsDzService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should fetch all clothing options", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            select: vi.fn().mockResolvedValue({ data: [{ id: 1, vendor_id: "v1" }], error: null }),
        } as any);

        const { data, error } = await ServiceTypeClothingOptionsDzService.getAll();
        expect(data).toEqual([{ id: 1, vendor_id: "v1" }]);
        expect(error).toBeNull();
    });

    it("should fetch clothing option by id", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                    single: vi.fn().mockResolvedValue({ data: { id: 1, vendor_id: "v1" }, error: null }),
                }),
            }),
        } as any);

        const { data, error } = await ServiceTypeClothingOptionsDzService.getById(1);
        expect(data).toEqual({ id: 1, vendor_id: "v1" });
        expect(error).toBeNull();
    });

    it("should fetch clothing options by vendor id", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            select: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ data: [{ id: 1, vendor_id: "v1" }], error: null }),
            }),
        } as any);

        const { data, error } = await ServiceTypeClothingOptionsDzService.getByVendorId("v1");
        expect(data).toEqual([{ id: 1, vendor_id: "v1" }]);
        expect(error).toBeNull();
    });

    it("should create a clothing option", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            insert: vi.fn().mockReturnValue({
                select: vi.fn().mockReturnValue({
                    single: vi.fn().mockResolvedValue({ data: { id: 1, vendor_id: "v1" }, error: null }),
                }),
            }),
        } as any);

        const { data, error } = await ServiceTypeClothingOptionsDzService.create({ vendor_id: "v1" });
        expect(data).toEqual({ id: 1, vendor_id: "v1" });
        expect(error).toBeNull();
    });

    it("should create batch clothing options", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            insert: vi.fn().mockResolvedValue({ data: [{ id: 1, vendor_id: "v1" }], error: null }),
        } as any);

        const { data, error } = await ServiceTypeClothingOptionsDzService.createBatch([{ vendor_id: "v1" }]);
        expect(data).toEqual([{ id: 1, vendor_id: "v1" }]);
        expect(error).toBeNull();
    });

    it("should update a clothing option", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            update: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                    select: vi.fn().mockReturnValue({
                        single: vi.fn().mockResolvedValue({ data: { id: 1, vendor_id: "v1", caftan: true }, error: null }),
                    }),
                }),
            }),
        } as any);

        const { data, error } = await ServiceTypeClothingOptionsDzService.update(1, { caftan: true });
        expect(data).toEqual({ id: 1, vendor_id: "v1", caftan: true });
        expect(error).toBeNull();
    });

    it("should delete a clothing option", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            delete: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ error: null }),
            }),
        } as any);

        const { error } = await ServiceTypeClothingOptionsDzService.delete(1);
        expect(error).toBeNull();
    });

    it("should delete batch clothing options", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            delete: vi.fn().mockReturnValue({
                in: vi.fn().mockResolvedValue({ error: null }),
            }),
        } as any);

        const { error } = await ServiceTypeClothingOptionsDzService.deleteBatch([1, 2]);
        expect(error).toBeNull();
    });

    it("should delete clothing options by vendor id", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            delete: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ error: null }),
            }),
        } as any);

        const { error } = await ServiceTypeClothingOptionsDzService.deleteByVendorId("v1");
        expect(error).toBeNull();
    });
});
