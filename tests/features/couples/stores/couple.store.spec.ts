import { setActivePinia, createPinia } from "pinia";
import { useCoupleStore } from "@/features/couples/composables/coupleStore";
import { vi, describe, it, expect, beforeEach } from "vitest";

const mockSelect = vi.fn().mockReturnThis();
const mockEq = vi.fn().mockReturnThis();
const mockSingle = vi.fn();

vi.mock("@/lib/supabase", () => ({
    supabase: {
        from: vi.fn(() => ({
            select: mockSelect,
            eq: mockEq,
            single: mockSingle,
        })),
    },
}));

describe("useCoupleStore", () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        vi.clearAllMocks();
    });

    it("fetches couple", async () => {
        const store = useCoupleStore();
        const coupleData = { id: "1", user_id: "u", email: "a@b.com", created_at: "" };
        mockSelect.mockReturnThis();
        mockEq.mockReturnThis();
        mockSingle.mockResolvedValueOnce({ data: coupleData, error: null });
        await store.fetchCouple("u");
        expect(store.couple).not.toBeNull();
        expect(store.couple?.id).toBe("1");
    });

    it("fetches wedding profile", async () => {
        const store = useCoupleStore();
        const profile = { id: "1", user_id: "u", wedding_date: "", budget: 0, region: "", guest_count: 0 };
        mockSelect.mockReturnThis();
        mockEq.mockReturnThis();
        mockSingle.mockResolvedValueOnce({ data: profile, error: null });
        await store.fetchWeddingProfile("u");
        expect(store.weddingProfile).not.toBeNull();
        expect(store.weddingProfile?.id).toBe("1");
    });
});
