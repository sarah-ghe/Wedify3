import { ref } from "vue";
import { WeddingProfile } from "@/features/couples/types";
import { WeddingProfileService } from "@/features/couples/services/WeddingProfileService";

export function useCoupleProfile() {
  const weddingProfile = ref<WeddingProfile | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchWeddingProfile(userId: string) {
    loading.value = true;
    error.value = null;
    const { data, error: err } =
      await WeddingProfileService.getByUserId(userId);
    if (err) error.value = err.message;
    weddingProfile.value = data;
    loading.value = false;
    return data;
  }

  async function createWeddingProfile(
    profile: Omit<WeddingProfile, "id" | "created_at">,
  ) {
    loading.value = true;
    error.value = null;
    const { data, error: err } = await WeddingProfileService.create(profile);
    if (err) error.value = err.message;
    weddingProfile.value = data;
    loading.value = false;
    return data;
  }

  async function updateWeddingProfile(
    id: string,
    updates: Partial<Omit<WeddingProfile, "id" | "created_at">>,
  ) {
    loading.value = true;
    error.value = null;
    const { data, error: err } = await WeddingProfileService.update(
      id,
      updates,
    );
    if (err) error.value = err.message;
    weddingProfile.value = data;
    loading.value = false;
    return data;
  }

  return {
    weddingProfile,
    loading,
    error,
    fetchWeddingProfile,
    createWeddingProfile,
    updateWeddingProfile,
  };
}
