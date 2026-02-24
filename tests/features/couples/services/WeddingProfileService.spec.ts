import { WeddingProfileService } from "@/features/couples/services/WeddingProfileService";
import { supabase } from "@/lib/supabase";
import { vi, describe, it, expect, beforeEach } from "vitest";

function mockChain(finalReturn: any) {
    const single = vi.fn().mockResolvedValue(finalReturn);
    const select = vi.fn().mockReturnThis();
    const eq = vi.fn().mockReturnThis();
    const insert = vi.fn().mockReturnThis();
    const update = vi.fn().mockReturnThis();
    return { select, eq, single, insert, update };
}

vi.mock("@/lib/supabase", () => {
    const chain = mockChain({ data: {}, error: null });
    return {
        supabase: {
            from: vi.fn(() => chain),
        },
    };
});

describe("WeddingProfileService", () => {
    let chain: any;

    beforeEach(() => {
        // Re-create the chain for each test
        chain = mockChain({ data: {}, error: null });
        (supabase.from as any).mockReturnValue(chain);
    });

    it("gets by user id", async () => {
        chain.single.mockResolvedValue({ data: { id: "1" }, error: null });
        const { data } = await WeddingProfileService.getByUserId("u");
        expect(data.id).toBe("1");
    });

    it("creates profile", async () => {
        chain.single.mockResolvedValue({ data: { id: "1" }, error: null });
        const { data } = await WeddingProfileService.create({ user_id: "u", wedding_date: "", budget: 0, region: "", guest_count: 0 });
        expect(data.id).toBe("1");
    });

    it("updates profile", async () => {
        chain.single.mockResolvedValue({ data: { id: "1", region: "new" }, error: null });
        const { data } = await WeddingProfileService.update("1", { region: "new" });
        expect(data.region).toBe("new");
    });
});
