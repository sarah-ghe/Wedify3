import { useCoupleProfile } from "@/features/couples/composables/useCoupleProfile";
import { WeddingProfileService } from "@/features/couples/services/WeddingProfileService";
import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/features/couples/services/WeddingProfileService", () => ({
    WeddingProfileService: {
        getByUserId: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
    },
}));

describe("useCoupleProfile", () => {
    beforeEach(() => vi.clearAllMocks());

    it("fetches wedding profile", async () => {
        const profile = { id: "1", user_id: "u", wedding_date: "", budget: 0, region: "", guest_count: 0 };
        (WeddingProfileService.getByUserId as any).mockResolvedValue({ data: profile, error: null });
        const { fetchWeddingProfile, weddingProfile } = useCoupleProfile();
        await fetchWeddingProfile("u");
        expect(weddingProfile.value).toEqual(profile);
    });

    it("creates wedding profile", async () => {
        const profile = { id: "1", user_id: "u", wedding_date: "", budget: 0, region: "", guest_count: 0 };
        (WeddingProfileService.create as any).mockResolvedValue({ data: profile, error: null });
        const { createWeddingProfile, weddingProfile } = useCoupleProfile();
        await createWeddingProfile(profile);
        expect(weddingProfile.value).toEqual(profile);
    });

    it("updates wedding profile", async () => {
        const profile = { id: "1", user_id: "u", wedding_date: "", budget: 0, region: "", guest_count: 0 };
        (WeddingProfileService.update as any).mockResolvedValue({ data: profile, error: null });
        const { updateWeddingProfile, weddingProfile } = useCoupleProfile();
        await updateWeddingProfile("1", { region: "new" });
        expect(weddingProfile.value).toEqual(profile);
    });
});
