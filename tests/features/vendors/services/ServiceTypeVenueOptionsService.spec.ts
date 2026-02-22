import { describe, it, expect, vi, beforeEach } from "vitest";
import { ServiceTypeTransportOptionsService } from "@/features/vendors/services/ServiceTypeTransportOptionsService";
import { supabase } from "@/lib/supabase";

vi.mock("@/lib/supabase");

describe("ServiceTypeTransportOptionsService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should fetch all transport options", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            select: vi.fn().mockResolvedValue({ data: [{ id: 1, vendor_id: "v1" }], error: null }),
        } as any);

        const { data, error } = await ServiceTypeTransportOptionsService.getAll();
        expect(data).toEqual([{ id: 1, vendor_id: "v1" }]);
        expect(error).toBeNull();
    });

    it("should fetch transport option by id", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                    single: vi.fn().mockResolvedValue({ data: { id: 1, vendor_id: "v1" }, error: null }),
                }),
            }),
        } as any);

        const { data, error } = await ServiceTypeTransportOptionsService.getById(1);
        expect(data).toEqual({ id: 1, vendor_id: "v1" });
        expect(error).toBeNull();
    });

    it("should fetch transport options by vendor id", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            select: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ data: [{ id: 1, vendor_id: "v1" }], error: null }),
            }),
        } as any);

        const { data, error } = await ServiceTypeTransportOptionsService.getByVendorId("v1");
        expect(data).toEqual([{ id: 1, vendor_id: "v1" }]);
        expect(error).toBeNull();
    });

    it("should create a transport option", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            insert: vi.fn().mockReturnValue({
                select: vi.fn().mockReturnValue({
                    single: vi.fn().mockResolvedValue({ data: { id: 1, vendor_id: "v1" }, error: null }),
                }),
            }),
        } as any);

        const { data, error } = await ServiceTypeTransportOptionsService.create({ vendor_id: "v1", has_limousines: true, has_sport_cars: false, has_suv_cars: false, has_motorbikes: false });
        expect(data).toEqual({ id: 1, vendor_id: "v1" });
        expect(error).toBeNull();
    });

    it("should create batch transport options", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            insert: vi.fn().mockResolvedValue({ data: [{ id: 1, vendor_id: "v1" }], error: null }),
        } as any);

        const { data, error } = await ServiceTypeTransportOptionsService.createBatch([{ vendor_id: "v1", has_limousines: true, has_sport_cars: false, has_suv_cars: false, has_motorbikes: false }]);
        expect(data).toEqual([{ id: 1, vendor_id: "v1" }]);
        expect(error).toBeNull();
    });

    it("should update a transport option", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            update: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                    select: vi.fn().mockReturnValue({
                        single: vi.fn().mockResolvedValue({ data: { id: 1, vendor_id: "v1", has_suv_cars: true }, error: null }),
                    }),
                }),
            }),
        } as any);

        const { data, error } = await ServiceTypeTransportOptionsService.update(1, { has_suv_cars: true });
        expect(data).toEqual({ id: 1, vendor_id: "v1", has_suv_cars: true });
        expect(error).toBeNull();
    });

    it("should delete a transport option", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            delete: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ error: null }),
            }),
        } as any);

        const { error } = await ServiceTypeTransportOptionsService.delete(1);
        expect(error).toBeNull();
    });

    it("should delete batch transport options", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            delete: vi.fn().mockReturnValue({
                in: vi.fn().mockResolvedValue({ error: null }),
            }),
        } as any);

        const { error } = await ServiceTypeTransportOptionsService.deleteBatch([1, 2]);
        expect(error).toBeNull();
    });

    it("should delete transport options by vendor id", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            delete: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ error: null }),
            }),
        } as any);

        const { error } = await ServiceTypeTransportOptionsService.deleteByVendorId("v1");
        expect(error).toBeNull();
    });
});
