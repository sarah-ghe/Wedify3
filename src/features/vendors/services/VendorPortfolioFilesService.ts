import { VendorPortfolioFile } from "@/features/shared/types/types";
import { supabase } from "@/lib/supabase";

export class VendorPortfolioFilesService {

  static async uploadFile(file: File, vendorId: string) {
    const filePath = `${vendorId}/${Date.now()}_${file.name}`;
    const { error } = await supabase.storage
      .from("vendor_portfolio")
      .upload(filePath, file);
    if (error) return { error };
    const { data: urlData } = supabase.storage
      .from("vendor_portfolio")
      .getPublicUrl(filePath);
    return { url: urlData.publicUrl, error: null };
  }

  static async create(
    fileMeta: Omit<VendorPortfolioFile, "id" | "created_at">,
  ) {
    const { data, error } = await supabase
      .from("vendor_portfolio_files")
      .insert([fileMeta])
      .select()
      .single();
    return { data, error };
  }

  static async getByVendorId(vendorId: string) {
    const { data, error } = await supabase
      .from("vendor_portfolio_files")
      .select("*")
      .eq("vendor_id", vendorId);
    return { data, error };
  }

  static async delete(id: string) {
    // Fetch file metadata first
    const { data, error } = await supabase
      .from("vendor_portfolio_files")
      .select("*")
      .eq("id", id)
      .single();
    if (error || !data) return { error };

    // Delete file from storage
    const fileUrl = data.file_url;
    const filePath = fileUrl.split(
      "/storage/v1/object/public/vendor_portfolio/",
    )[1];
    await supabase.storage.from("vendor_portfolio").remove([filePath]);

    // Delete metadata
    const { error: metaError } = await supabase
      .from("vendor_portfolio_files")
      .delete()
      .eq("id", id);
    return { error: metaError };
  }
}
