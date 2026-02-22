import { supabase } from "@/lib/supabase";

export interface ServiceTypeClothingOptionDz {
  id: number;
  vendor_id: string;
  accessories?: boolean;
  badroune?: boolean;
  benouare?: boolean;
  blouza_wahrani?: boolean;
  bouza_mansouj?: boolean;
  caftan?: boolean;
  chedda?: boolean;
  evening_dress?: boolean;
  gandoura?: boolean;
  ghelila?: boolean;
  karakou?: boolean;
  katifa_fergani?: boolean;
  leffa?: boolean;
  naili?: boolean;
  wedding_dress?: boolean;
  barnous?: boolean;
  suit?: boolean;
  tuxedo?: boolean;
  other?: boolean;
  created_at: string;
}

export class ServiceTypeClothingOptionsDzService {
  static async getAll() {
    const { data, error } = await supabase
      .from("data_clothing_options")
      .select("*");
    return { data, error };
  }

  static async getById(id: number) {
    const { data, error } = await supabase
      .from("data_clothing_options")
      .select("*")
      .eq("id", id)
      .single();
    return { data, error };
  }

  static async getByVendorId(vendorId: string) {
    const { data, error } = await supabase
      .from("data_clothing_options")
      .select("*")
      .eq("vendor_id", vendorId);
    return { data, error };
  }

  static async create(
    option: Omit<ServiceTypeClothingOptionDz, "id" | "created_at">,
  ) {
    const { data, error } = await supabase
      .from("data_clothing_options")
      .insert([option])
      .select()
      .single();
    return { data, error };
  }

  static async createBatch(
    options: Array<Omit<ServiceTypeClothingOptionDz, "id" | "created_at">>,
  ) {
    const { data, error } = await supabase
      .from("data_clothing_options")
      .insert(options);
    return { data, error };
  }

  static async update(
    id: number,
    updates: Partial<Omit<ServiceTypeClothingOptionDz, "id" | "created_at">>,
  ) {
    const { data, error } = await supabase
      .from("data_clothing_options")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    return { data, error };
  }

  static async delete(id: number) {
    const { error } = await supabase
      .from("data_clothing_options")
      .delete()
      .eq("id", id);
    return { error };
  }

  static async deleteBatch(ids: number[]) {
    const { error } = await supabase
      .from("data_clothing_options")
      .delete()
      .in("id", ids);
    return { error };
  }

  static async deleteByVendorId(vendorId: string) {
    const { error } = await supabase
      .from("data_clothing_options")
      .delete()
      .eq("vendor_id", vendorId);
    return { error };
  }
}
