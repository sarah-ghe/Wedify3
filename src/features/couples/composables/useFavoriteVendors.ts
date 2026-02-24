import { ref } from "vue";
import { CouplesFavoriteVendorsService } from "@/features/couples/services/CouplesFavoriteVendorsService";
import { CouplesFavoriteVendors } from "@/features/shared/types/types";

export function useFavoriteVendors(userId: string) {
  const favorites = ref<CouplesFavoriteVendors[]>([]);
  const isFavorite = ref<boolean>(false);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchFavorites() {
    loading.value = true;
    error.value = null;
    const { data, error: err } =
      await CouplesFavoriteVendorsService.getByUserId(userId);
    if (err) error.value = err.message;
    favorites.value = data || [];
    loading.value = false;
  }

  async function addFavorite(vendorId: string) {
    loading.value = true;
    error.value = null;
    const { data, error: err } =
      await CouplesFavoriteVendorsService.addFavorite(userId, vendorId);
    if (err) error.value = err.message;
    if (data) favorites.value.push(data);
    loading.value = false;
  }

  async function removeFavorite(vendorId: string) {
    loading.value = true;
    error.value = null;
    const { error: err } = await CouplesFavoriteVendorsService.removeFavorite(
      userId,
      vendorId,
    );
    if (err) error.value = err.message;
    favorites.value = favorites.value.filter((f) => f.vendor_id !== vendorId);
    loading.value = false;
  }

  async function checkIsFavorite(vendorId: string) {
    const { isFavorite: fav, error } =
      await CouplesFavoriteVendorsService.isFavorite(userId, vendorId);
    if (!error) isFavorite.value = fav;
  }

  return {
    favorites,
    isFavorite,
    loading,
    error,
    fetchFavorites,
    addFavorite,
    removeFavorite,
    checkIsFavorite,
  };
}
