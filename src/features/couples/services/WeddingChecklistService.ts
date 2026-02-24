import { supabase } from "@/lib/supabase";
import { CoupleTasks } from "@/features/shared/types/types";

export class WeddingChecklistService {
  static async getByWeddingId(weddingId: string) {
    const { data, error } = await supabase
      .from("couple_wedding_tasks")
      .select("*")
      .eq("wedding_id", weddingId);
    return { data, error };
  }

  static async addTask(task: Omit<CoupleTasks, "id">) {
    const { data, error } = await supabase
      .from("couple_wedding_tasks")
      .insert([task])
      .select()
      .single();
    return { data, error };
  }

  static async updateTask(
    id: string,
    updates: Partial<Omit<CoupleTasks, "id" | "wedding_id">>,
  ) {
    const { data, error } = await supabase
      .from("couple_wedding_tasks")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    return { data, error };
  }

  static async removeTask(id: string) {
    const { error } = await supabase
      .from("couple_wedding_tasks")
      .delete()
      .eq("id", id);
    return { error };
  }
}
