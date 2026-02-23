import { supabase } from "@/lib/supabase";
import { VendorReview } from "@/features/shared/types/types";

export class VendorReviewService {
  static async getAll() {
    const { data, error } = await supabase.from("reviews").select("*");
    return { data, error };
  }

  static async getById(id: string) {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("id", id)
      .single();
    return { data, error };
  }

  static async getByVendorId(vendorId: string) {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("vendor_id", vendorId);
    return { data, error };
  }

  static async getByUserId(userId: string) {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("user_id", userId);
    return { data, error };
  }

  static async create(review: Omit<VendorReview, "id" | "created_at">) {
    const { data, error } = await supabase
      .from("reviews")
      .insert([review])
      .select()
      .single();
    return { data, error };
  }

  static async update(
    id: string,
    updates: Partial<Omit<VendorReview, "id" | "created_at">>,
  ) {
    const { data, error } = await supabase
      .from("reviews")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    return { data, error };
  }

  static async delete(id: string) {
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    return { error };
  }
}
