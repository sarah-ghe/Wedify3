import { useFavoriteVendors } from "@/features/couples/composables/useFavoriteVendors";
import { CouplesFavoriteVendorsService } from "@/features/couples/services/CouplesFavoriteVendorsService";
import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/features/couples/services/CouplesFavoriteVendorsService", () => ({
    CouplesFavoriteVendorsService: {
        getByUserId: vi.fn(),
        addFavorite: vi.fn(),
        removeFavorite: vi.fn(),
        isFavorite: vi.fn(),
    },
}));

describe("useFavoriteVendors", () => {
    beforeEach(() => vi.clearAllMocks());

    it("fetches favorites", async () => {
        const favs = [{ id: "1", user_id: "u", vendor_id: "v" }];
        (CouplesFavoriteVendorsService.getByUserId as any).mockResolvedValue({ data: favs, error: null });
        const { fetchFavorites, favorites } = useFavoriteVendors("u");
        await fetchFavorites();
        expect(favorites.value).toEqual(favs);
    });

    it("adds favorite", async () => {
        const fav = { id: "1", user_id: "u", vendor_id: "v" };
        (CouplesFavoriteVendorsService.addFavorite as any).mockResolvedValue({ data: fav, error: null });
        const { addFavorite, favorites } = useFavoriteVendors("u");
        await addFavorite("v");
        expect(favorites.value).toContainEqual(fav);
    });

    it("removes favorite", async () => {
        (CouplesFavoriteVendorsService.removeFavorite as any).mockResolvedValue({ error: null });
        const { removeFavorite, favorites } = useFavoriteVendors("u");
        favorites.value = [{ id: "1", user_id: "u", vendor_id: "v" }];
        await removeFavorite("v");
        expect(favorites.value).toEqual([]);
    });

    it("checks if vendor is favorite", async () => {
        (CouplesFavoriteVendorsService.isFavorite as any).mockResolvedValue({ isFavorite: true, error: null });
        const { checkIsFavorite, isFavorite } = useFavoriteVendors("u");
        await checkIsFavorite("v");
        expect(isFavorite.value).toBe(true);
    });
});
