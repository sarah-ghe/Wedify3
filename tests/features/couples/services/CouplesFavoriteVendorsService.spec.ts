import { CouplesFavoriteVendorsService } from "@/features/couples/services/CouplesFavoriteVendorsService";
import { supabase } from "@/lib/supabase";
import { vi, describe, it, expect, beforeEach } from "vitest";

const mockSelect = vi.fn().mockReturnThis();
const mockEq = vi.fn().mockReturnThis();
const mockInsert = vi.fn().mockReturnThis();
const mockDelete = vi.fn().mockReturnThis();
const mockSingle = vi.fn();

vi.mock("@/lib/supabase", () => ({
    supabase: {
        from: vi.fn(() => ({
            select: mockSelect,
            eq: mockEq,
            insert: mockInsert,
            delete: mockDelete,
            single: mockSingle,
        })),
    },
}));

describe("CouplesFavoriteVendorsService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("gets by user id", async () => {
        mockSelect.mockReturnThis();
        mockEq.mockResolvedValueOnce({ data: [], error: null });

        const { data } = await CouplesFavoriteVendorsService.getByUserId("u");
        expect(data).toEqual([]);
    });

    it("adds favorite", async () => {
        mockInsert.mockReturnThis();
        mockSelect.mockReturnThis();
        mockSingle.mockResolvedValueOnce({ data: { id: "1" }, error: null });

        const { data } = await CouplesFavoriteVendorsService.addFavorite("u", "v");
        expect(data).toEqual({ id: "1" });
    });

    it("removes favorite", async () => {
        mockDelete.mockReturnThis();
        // Chain two eq mocks: first returns an object with eq, second resolves the value
        const eqSecond = vi.fn().mockResolvedValueOnce({ error: null });
        mockEq.mockReturnValueOnce({ eq: eqSecond });
        // Call the method
        const { error } = await CouplesFavoriteVendorsService.removeFavorite("u", "v");
        expect(error).toBeNull();
        expect(eqSecond).toHaveBeenCalledWith("vendor_id", "v");
    });

    it("checks if vendor is favorite", async () => {
        mockSelect.mockReturnThis();
        const eqSecond = vi.fn().mockReturnThis();
        const mockSingle = vi.fn().mockResolvedValueOnce({ data: { id: "1" }, error: null });
        mockEq.mockReturnValueOnce({ eq: eqSecond, single: mockSingle });
        eqSecond.mockReturnValueOnce({ single: mockSingle });

        const { isFavorite, error } = await CouplesFavoriteVendorsService.isFavorite("u", "v");
        expect(isFavorite).toBe(true);
        expect(error).toBeNull();
        expect(mockSingle).toHaveBeenCalled();
    });
});
