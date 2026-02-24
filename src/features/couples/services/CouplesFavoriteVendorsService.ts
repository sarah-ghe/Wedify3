import { supabase } from "@/lib/supabase";

export class CouplesFavoriteVendorsService {
  static async getByUserId(userId: string) {
    const { data, error } = await supabase
      .from("CouplesFavoriteVendors")
      .select("*")
      .eq("user_id", userId);
    return { data, error };
  }

  static async addFavorite(userId: string, vendorId: string) {
    const { data, error } = await supabase
      .from("CouplesFavoriteVendors")
      .insert([{ user_id: userId, vendor_id: vendorId }])
      .select()
      .single();
    return { data, error };
  }

  static async removeFavorite(userId: string, vendorId: string) {
    const { error } = await supabase
      .from("CouplesFavoriteVendors")
      .delete()
      .eq("user_id", userId)
      .eq("vendor_id", vendorId);
    return { error };
  }

  static async isFavorite(userId: string, vendorId: string) {
    const { data, error } = await supabase
      .from("CouplesFavoriteVendors")
      .select("*")
      .eq("user_id", userId)
      .eq("vendor_id", vendorId)
      .single();
    return { isFavorite: !!data, error };
  }
}
