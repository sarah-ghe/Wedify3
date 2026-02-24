import { defineStore } from "pinia";
import { ref } from "vue";
import { supabase } from "@/lib/supabase";
import { Couple, WeddingProfile } from "@/features/couples/types/CoupleTypes";

export const useCoupleStore = defineStore("couple", () => {
  const couple = ref<Couple | null>(null);
  const weddingProfile = ref<WeddingProfile | null>(null);

  async function fetchCouple(userId: string) {
    const { data, error } = await supabase
      .from("couples")
      .select("*")
      .eq("user_id", userId)
      .single();
    if (!error) couple.value = data;
  }

  async function fetchWeddingProfile(userId: string) {
    const { data, error } = await supabase
      .from("couple_weddings")
      .select("*")
      .eq("user_id", userId)
      .single();
    if (!error) weddingProfile.value = data;
  }

  return {
    couple,
    weddingProfile,
    fetchCouple,
    fetchWeddingProfile,
  };
});
