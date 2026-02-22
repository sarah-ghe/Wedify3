import { describe, it, expect, vi, beforeEach } from "vitest";
import { VendorUnavailableDatesService } from "@/features/vendors/services/VendorUnavailableDatesService";
import { supabase } from "@/lib/supabase";

vi.mock("@/lib/supabase");

describe("VendorUnavailableDatesService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should fetch all unavailable dates", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            select: vi.fn().mockResolvedValue({ data: [{ id: "ud1", vendor_id: "v1" }], error: null }),
        } as any);

        const { data, error } = await VendorUnavailableDatesService.getAll();
        expect(data).toEqual([{ id: "ud1", vendor_id: "v1" }]);
        expect(error).toBeNull();
    });

    it("should fetch unavailable date by id", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                    single: vi.fn().mockResolvedValue({ data: { id: "ud1", vendor_id: "v1" }, error: null }),
                }),
            }),
        } as any);

        const { data, error } = await VendorUnavailableDatesService.getById("ud1");
        expect(data).toEqual({ id: "ud1", vendor_id: "v1" });
        expect(error).toBeNull();
    });

    it("should fetch unavailable dates by vendor id", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            select: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ data: [{ id: "ud1", vendor_id: "v1" }], error: null }),
            }),
        } as any);

        const { data, error } = await VendorUnavailableDatesService.getByVendorId("v1");
        expect(data).toEqual([{ id: "ud1", vendor_id: "v1" }]);
        expect(error).toBeNull();
    });

    it("should create an unavailable date", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            insert: vi.fn().mockReturnValue({
                select: vi.fn().mockReturnValue({
                    single: vi.fn().mockResolvedValue({ data: { id: "ud1", vendor_id: "v1" }, error: null }),
                }),
            }),
        } as any);

        const { data, error } = await VendorUnavailableDatesService.create({ vendor_id: "v1", date: "2024-06-01" });
        expect(data).toEqual({ id: "ud1", vendor_id: "v1" });
        expect(error).toBeNull();
    });

    it("should create batch unavailable dates", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            insert: vi.fn().mockResolvedValue({ data: [{ id: "ud1", vendor_id: "v1" }], error: null }),
        } as any);

        const { data, error } = await VendorUnavailableDatesService.createBatch([{ vendor_id: "v1", date: "2024-06-01" }]);
        expect(data).toEqual([{ id: "ud1", vendor_id: "v1" }]);
        expect(error).toBeNull();
    });

    it("should update an unavailable date", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            update: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                    select: vi.fn().mockReturnValue({
                        single: vi.fn().mockResolvedValue({ data: { id: "ud1", date: "2024-06-02" }, error: null }),
                    }),
                }),
            }),
        } as any);

        const { data, error } = await VendorUnavailableDatesService.update("ud1", { date: "2024-06-02" });
        expect(data).toEqual({ id: "ud1", date: "2024-06-02" });
        expect(error).toBeNull();
    });

    it("should delete an unavailable date", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            delete: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ error: null }),
            }),
        } as any);

        const { error } = await VendorUnavailableDatesService.delete("ud1");
        expect(error).toBeNull();
    });

    it("should delete batch unavailable dates", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            delete: vi.fn().mockReturnValue({
                in: vi.fn().mockResolvedValue({ error: null }),
            }),
        } as any);

        const { error } = await VendorUnavailableDatesService.deleteBatch(["ud1", "ud2"]);
        expect(error).toBeNull();
    });

    it("should delete unavailable dates by vendor id", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            delete: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ error: null }),
            }),
        } as any);

        const { error } = await VendorUnavailableDatesService.deleteByVendorId("v1");
        expect(error).toBeNull();
    });
});
