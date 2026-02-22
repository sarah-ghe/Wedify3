import { describe, it, expect, vi, beforeEach } from "vitest";
import { ServiceTypeMusicOptionsDzService } from "@/features/vendors/services/ServiceTypeMusicOptionsDzService";
import { supabase } from "@/lib/supabase";

vi.mock("@/lib/supabase");

describe("ServiceTypeMusicOptionsDzService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should fetch all music options", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            select: vi.fn().mockResolvedValue({ data: [{ id: 1, vendor_id: "v1" }], error: null }),
        } as any);

        const { data, error } = await ServiceTypeMusicOptionsDzService.getAll();
        expect(data).toEqual([{ id: 1, vendor_id: "v1" }]);
        expect(error).toBeNull();
    });

    it("should fetch music option by id", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                    single: vi.fn().mockResolvedValue({ data: { id: 1, vendor_id: "v1" }, error: null }),
                }),
            }),
        } as any);

        const { data, error } = await ServiceTypeMusicOptionsDzService.getById(1);
        expect(data).toEqual({ id: 1, vendor_id: "v1" });
        expect(error).toBeNull();
    });

    it("should fetch music options by vendor id", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            select: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ data: [{ id: 1, vendor_id: "v1" }], error: null }),
            }),
        } as any);

        const { data, error } = await ServiceTypeMusicOptionsDzService.getByVendorId("v1");
        expect(data).toEqual([{ id: 1, vendor_id: "v1" }]);
        expect(error).toBeNull();
    });

    it("should create a music option", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            insert: vi.fn().mockReturnValue({
                select: vi.fn().mockReturnValue({
                    single: vi.fn().mockResolvedValue({ data: { id: 1, vendor_id: "v1" }, error: null }),
                }),
            }),
        } as any);

        const { data, error } = await ServiceTypeMusicOptionsDzService.create({ vendor_id: "v1", malouf: true, gasba: false, fkairat: false, band: false, dj: false, solo_artist: false });
        expect(data).toEqual({ id: 1, vendor_id: "v1" });
        expect(error).toBeNull();
    });

    it("should create batch music options", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            insert: vi.fn().mockResolvedValue({ data: [{ id: 1, vendor_id: "v1" }], error: null }),
        } as any);

        const { data, error } = await ServiceTypeMusicOptionsDzService.createBatch([{ vendor_id: "v1", malouf: true, gasba: false, fkairat: false, band: false, dj: false, solo_artist: false }]);
        expect(data).toEqual([{ id: 1, vendor_id: "v1" }]);
        expect(error).toBeNull();
    });

    it("should update a music option", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            update: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                    select: vi.fn().mockReturnValue({
                        single: vi.fn().mockResolvedValue({ data: { id: 1, vendor_id: "v1", dj: true }, error: null }),
                    }),
                }),
            }),
        } as any);

        const { data, error } = await ServiceTypeMusicOptionsDzService.update(1, { dj: true });
        expect(data).toEqual({ id: 1, vendor_id: "v1", dj: true });
        expect(error).toBeNull();
    });

    it("should delete a music option", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            delete: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ error: null }),
            }),
        } as any);

        const { error } = await ServiceTypeMusicOptionsDzService.delete(1);
        expect(error).toBeNull();
    });

    it("should delete batch music options", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            delete: vi.fn().mockReturnValue({
                in: vi.fn().mockResolvedValue({ error: null }),
            }),
        } as any);

        const { error } = await ServiceTypeMusicOptionsDzService.deleteBatch([1, 2]);
        expect(error).toBeNull();
    });

});