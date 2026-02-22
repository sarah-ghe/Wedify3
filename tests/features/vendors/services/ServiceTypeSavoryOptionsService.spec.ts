import { describe, it, expect, vi, beforeEach } from "vitest";
import { ServiceTypeSavoryOptionsService } from "@/features/vendors/services/ServiceTypeSavoryOptionsService";
import { supabase } from "@/lib/supabase";

vi.mock("@/lib/supabase");

describe("ServiceTypeSavoryOptionsService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should fetch all savory options", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            select: vi.fn().mockResolvedValue({ data: [{ id: 1, vendor_id: "v1" }], error: null }),
        } as any);

        const { data, error } = await ServiceTypeSavoryOptionsService.getAll();
        expect(data).toEqual([{ id: 1, vendor_id: "v1" }]);
        expect(error).toBeNull();
    });

    it("should fetch savory option by id", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                    single: vi.fn().mockResolvedValue({ data: { id: 1, vendor_id: "v1" }, error: null }),
                }),
            }),
        } as any);

        const { data, error } = await ServiceTypeSavoryOptionsService.getById(1);
        expect(data).toEqual({ id: 1, vendor_id: "v1" });
        expect(error).toBeNull();
    });

    it("should fetch savory options by vendor id", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            select: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ data: [{ id: 1, vendor_id: "v1" }], error: null }),
            }),
        } as any);

        const { data, error } = await ServiceTypeSavoryOptionsService.getByVendorId("v1");
        expect(data).toEqual([{ id: 1, vendor_id: "v1" }]);
        expect(error).toBeNull();
    });

    it("should create a savory option", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            insert: vi.fn().mockReturnValue({
                select: vi.fn().mockReturnValue({
                    single: vi.fn().mockResolvedValue({ data: { id: 1, vendor_id: "v1" }, error: null }),
                }),
            }),
        } as any);

        const { data, error } = await ServiceTypeSavoryOptionsService.create({ vendor_id: "v1", appetizers: true, buffet: false, drinks: true, pastry: false, wedding_cake: false, dinner: true });
        expect(data).toEqual({ id: 1, vendor_id: "v1" });
        expect(error).toBeNull();
    });

    it("should create batch savory options", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            insert: vi.fn().mockResolvedValue({ data: [{ id: 1, vendor_id: "v1" }], error: null }),
        } as any);

        const { data, error } = await ServiceTypeSavoryOptionsService.createBatch([{ vendor_id: "v1", appetizers: true, buffet: false, drinks: true, pastry: false, wedding_cake: false, dinner: true }]);
        expect(data).toEqual([{ id: 1, vendor_id: "v1" }]);
        expect(error).toBeNull();
    });

    it("should update a savory option", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            update: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                    select: vi.fn().mockReturnValue({
                        single: vi.fn().mockResolvedValue({ data: { id: 1, vendor_id: "v1", buffet: true }, error: null }),
                    }),
                }),
            }),
        } as any);

        const { data, error } = await ServiceTypeSavoryOptionsService.update(1, { buffet: true });
        expect(data).toEqual({ id: 1, vendor_id: "v1", buffet: true });
        expect(error).toBeNull();
    });

    it("should delete a savory option", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            delete: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ error: null }),
            }),
        } as any);

        const { error } = await ServiceTypeSavoryOptionsService.delete(1);
        expect(error).toBeNull();
    });

    it("should delete batch savory options", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            delete: vi.fn().mockReturnValue({
                in: vi.fn().mockResolvedValue({ error: null }),
            }),
        } as any);

        const { error } = await ServiceTypeSavoryOptionsService.deleteBatch([1, 2]);
        expect(error).toBeNull();
    });

    it("should delete savory options by vendor id", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            delete: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ error: null }),
            }),
        } as any);

        const { error } = await ServiceTypeSavoryOptionsService.deleteByVendorId("v1");
        expect(error).toBeNull();
    });
});
