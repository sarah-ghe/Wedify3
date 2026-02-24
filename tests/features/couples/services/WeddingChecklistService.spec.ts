import { WeddingChecklistService } from "@/features/couples/services/WeddingChecklistService";
import { supabase } from "@/lib/supabase";
import { vi, describe, it, expect, beforeEach } from "vitest";

function mockChain(finalReturn: any) {
    const select = vi.fn().mockReturnThis();
    const eq = vi.fn().mockReturnThis();
    const insert = vi.fn().mockReturnThis();
    const update = vi.fn().mockReturnThis();
    const del = vi.fn().mockReturnThis();
    const single = vi.fn().mockResolvedValue(finalReturn);
    return { select, eq, insert, update, delete: del, single };
}

vi.mock("@/lib/supabase", () => {
    const chain = mockChain({ data: {}, error: null });
    return {
        supabase: {
            from: vi.fn(() => chain),
        },
    };
});

describe("WeddingChecklistService", () => {
    let chain: any;

    beforeEach(() => {
        chain = mockChain({ data: {}, error: null });
        (supabase.from as any).mockReturnValue(chain);
    });

    it("gets by wedding id", async () => {
        chain.eq.mockReturnValueOnce({ data: [], error: null });
        const { data } = await WeddingChecklistService.getByWeddingId("w");
        expect(data).toEqual([]);
    });

    it("adds task", async () => {
        chain.single.mockResolvedValue({ data: { id: "1" }, error: null });
        const { data } = await WeddingChecklistService.addTask({ wedding_id: "w", task: "T", due_date: "", is_completed: false });
        expect(data).toEqual({ id: "1" });
    });

    it("updates task", async () => {
        chain.single.mockResolvedValue({ data: { id: "1", is_completed: true }, error: null });
        const { data } = await WeddingChecklistService.updateTask("1", { is_completed: true });
        expect(data.is_completed).toBe(true);
    });

    it("removes task", async () => {
        chain.eq.mockReturnValueOnce({ error: null });
        const { error } = await WeddingChecklistService.removeTask("1");
        expect(error).toBeNull();
    });
});
