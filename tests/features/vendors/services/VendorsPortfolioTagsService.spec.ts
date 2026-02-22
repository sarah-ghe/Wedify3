import { describe, it, expect, vi, beforeEach } from "vitest";
import { VendorsPortfolioTagsService } from "@/features/vendors/services/VendorsPortfolioTagsService";
import { supabase } from "@/lib/supabase";

vi.mock("@/lib/supabase");

describe("VendorsPortfolioTagsService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should fetch all portfolio tags", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            select: vi.fn().mockResolvedValue({ data: [{ id: "t1", vendor_id: "v1" }], error: null }),
        } as any);

        const { data, error } = await VendorsPortfolioTagsService.getAll();
        expect(data).toEqual([{ id: "t1", vendor_id: "v1" }]);
        expect(error).toBeNull();
    });

    it("should fetch portfolio tag by id", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                    single: vi.fn().mockResolvedValue({ data: { id: "t1", vendor_id: "v1" }, error: null }),
                }),
            }),
        } as any);

        const { data, error } = await VendorsPortfolioTagsService.getById("t1");
        expect(data).toEqual({ id: "t1", vendor_id: "v1" });
        expect(error).toBeNull();
    });

    it("should fetch portfolio tags by vendor id", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            select: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ data: [{ id: "t1", vendor_id: "v1" }], error: null }),
            }),
        } as any);

        const { data, error } = await VendorsPortfolioTagsService.getByVendorId("v1");
        expect(data).toEqual([{ id: "t1", vendor_id: "v1" }]);
        expect(error).toBeNull();
    });

    it("should fetch portfolio tags by tagged vendor id", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            select: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ data: [{ id: "t1", tagged_vendor_id: "tv1" }], error: null }),
            }),
        } as any);

        const { data, error } = await VendorsPortfolioTagsService.getByTaggedVendorId("tv1");
        expect(data).toEqual([{ id: "t1", tagged_vendor_id: "tv1" }]);
        expect(error).toBeNull();
    });

    it("should create a portfolio tag", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            insert: vi.fn().mockReturnValue({
                select: vi.fn().mockReturnValue({
                    single: vi.fn().mockResolvedValue({ data: { id: "t1", vendor_id: "v1" }, error: null }),
                }),
            }),
        } as any);

        const { data, error } = await VendorsPortfolioTagsService.create({ vendor_id: "v1", tagged_vendor_id: "tv1", file_id: "f1" });
        expect(data).toEqual({ id: "t1", vendor_id: "v1" });
        expect(error).toBeNull();
    });

    it("should create batch portfolio tags", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            insert: vi.fn().mockResolvedValue({ data: [{ id: "t1", vendor_id: "v1" }], error: null }),
        } as any);

        const { data, error } = await VendorsPortfolioTagsService.createBatch([{ vendor_id: "v1", tagged_vendor_id: "tv1", file_id: "f1" }]);
        expect(data).toEqual([{ id: "t1", vendor_id: "v1" }]);
        expect(error).toBeNull();
    });

    it("should update a portfolio tag", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            update: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                    select: vi.fn().mockReturnValue({
                        single: vi.fn().mockResolvedValue({ data: { id: "t1", file_id: "f2" }, error: null }),
                    }),
                }),
            }),
        } as any);

        const { data, error } = await VendorsPortfolioTagsService.update("t1", { file_id: "f2" });
        expect(data).toEqual({ id: "t1", file_id: "f2" });
        expect(error).toBeNull();
    });

    it("should delete a portfolio tag", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            delete: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ error: null }),
            }),
        } as any);

        const { error } = await VendorsPortfolioTagsService.delete("t1");
        expect(error).toBeNull();
    });

    it("should delete portfolio tags by vendor id", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            delete: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ error: null }),
            }),
        } as any);

        const { error } = await VendorsPortfolioTagsService.deleteByVendorId("v1");
        expect(error).toBeNull();
    });
});
