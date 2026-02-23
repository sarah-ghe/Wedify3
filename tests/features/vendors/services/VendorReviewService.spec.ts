import { describe, it, expect, vi, beforeEach } from "vitest";
import { VendorReviewService } from "@/features/vendors/services/VendorReviewService";
import { supabase } from "@/lib/supabase";

vi.mock("@/lib/supabase");

describe("VendorReviewService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should fetch all reviews", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            select: vi.fn().mockResolvedValue({ data: [{ id: "1" }], error: null }),
        } as any);

        const { data, error } = await VendorReviewService.getAll();
        expect(data).toEqual([{ id: "1" }]);
        expect(error).toBeNull();
    });

    it("should fetch review by id", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                    single: vi.fn().mockResolvedValue({ data: { id: "1" }, error: null }),
                }),
            }),
        } as any);

        const { data, error } = await VendorReviewService.getById("1");
        expect(data).toEqual({ id: "1" });
        expect(error).toBeNull();
    });

    it("should fetch reviews by vendor id", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            select: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ data: [{ vendor_id: "v1" }], error: null }),
            }),
        } as any);

        const { data, error } = await VendorReviewService.getByVendorId("v1");
        expect(data).toEqual([{ vendor_id: "v1" }]);
        expect(error).toBeNull();
    });

    it("should fetch reviews by user id", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            select: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ data: [{ user_id: "u1" }], error: null }),
            }),
        } as any);

        const { data, error } = await VendorReviewService.getByUserId("u1");
        expect(data).toEqual([{ user_id: "u1" }]);
        expect(error).toBeNull();
    });

    it("should create a new review", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            insert: vi.fn().mockReturnValue({
                select: vi.fn().mockReturnValue({
                    single: vi.fn().mockResolvedValue({ data: { id: "1" }, error: null }),
                }),
            }),
        } as any);

        const review = { user_id: "u1", vendor_id: "v1", rating: 5, review: "Great!" };
        const { data, error } = await VendorReviewService.create(review as any);
        expect(data).toEqual({ id: "1" });
        expect(error).toBeNull();
    });

    it("should update a review", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            update: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                    select: vi.fn().mockReturnValue({
                        single: vi.fn().mockResolvedValue({ data: { id: "1", rating: 4 }, error: null }),
                    }),
                }),
            }),
        } as any);

        const { data, error } = await VendorReviewService.update("1", { rating: 4 });
        expect(data).toEqual({ id: "1", rating: 4 });
        expect(error).toBeNull();
    });

    it("should delete a review", async () => {
        vi.mocked(supabase.from).mockReturnValue({
            delete: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ error: null }),
            }),
        } as any);

        const { error } = await VendorReviewService.delete("1");
        expect(error).toBeNull();
    });
});
