import { supabase } from "@/lib/supabase";
import { WeddingProfile } from "@/features/couples/types/CoupleTypes";

export class WeddingProfileService {
  static async getByUserId(userId: string) {
    const { data, error } = await supabase
      .from("couple_weddings")
      .select("*")
      .eq("user_id", userId)
      .single();
    return { data, error };
  }

  static async create(profile: Omit<WeddingProfile, "id" | "created_at">) {
    const { data, error } = await supabase
      .from("couple_weddings")
      .insert([profile])
      .select()
      .single();
    return { data, error };
  }

  static async update(
    id: string,
    updates: Partial<Omit<WeddingProfile, "id" | "created_at">>,
  ) {
    const { data, error } = await supabase
      .from("couple_weddings")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    return { data, error };
  }
}
