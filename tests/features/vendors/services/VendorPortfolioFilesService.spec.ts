import { describe, it, expect, vi, beforeEach } from "vitest";
import { VendorPortfolioFilesService } from "@/features/vendors/services/VendorPortfolioFilesService";
import { supabase } from "@/lib/supabase";

vi.mock("@/lib/supabase");

describe("VendorPortfolioFilesService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should upload a file and return public url", async () => {
        const file = new File(["content"], "test.jpg", { type: "image/jpeg" });
        vi.mocked(supabase.storage.from).mockReturnValue({
            upload: vi.fn().mockResolvedValue({ error: null }),
            getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: "https://url/test.jpg" } }),
            remove: vi.fn(),
        } as any);

        const { url, error } = await VendorPortfolioFilesService.uploadFile(file, "v1");
        expect(url).toBe("https://url/test.jpg");
        expect(error).toBeNull();
    });

    it("should create a portfolio file entry", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            insert: vi.fn().mockReturnValue({
                select: vi.fn().mockReturnValue({
                    single: vi.fn().mockResolvedValue({ data: { id: "f1", vendor_id: "v1" }, error: null }),
                }),
            }),
        } as any);

        const { data, error } = await VendorPortfolioFilesService.create({ vendor_id: "v1", file_url: "url", file_type: "image" });
        expect(data).toEqual({ id: "f1", vendor_id: "v1" });
        expect(error).toBeNull();
    });

    it("should get portfolio files by vendor id", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            select: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ data: [{ id: "f1", vendor_id: "v1" }], error: null }),
            }),
        } as any);

        const { data, error } = await VendorPortfolioFilesService.getByVendorId("v1");
        expect(data).toEqual([{ id: "f1", vendor_id: "v1" }]);
        expect(error).toBeNull();
    });

    it("should delete a portfolio file", async () => {
        // Mock fetching file metadata
        vi.mocked(supabase.from).mockReturnValueOnce({
            select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                    single: vi.fn().mockResolvedValue({ data: { id: "f1", file_url: "https://url/storage/v1/object/public/vendor_portfolio/v1/test.jpg" }, error: null }),
                }),
            }),
        } as any);

        // Mock removing file from storage
        vi.mocked(supabase.storage.from).mockReturnValue({
            remove: vi.fn().mockResolvedValue({}),
        } as any);

        // Mock deleting metadata
        vi.mocked(supabase.from).mockReturnValueOnce({
            delete: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ error: null }),
            }),
        } as any);

        const { error } = await VendorPortfolioFilesService.delete("f1");
        expect(error).toBeNull();
    });

    it("should return error if file metadata not found on delete", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                    single: vi.fn().mockResolvedValue({ data: null, error: { message: "not found" } }),
                }),
            }),
        } as any);

        const { error } = await VendorPortfolioFilesService.delete("f1");
        expect(error).toBeTruthy();
    });
});
