import { ref, onMounted } from "vue";
import { supabase } from "@/lib/supabase";
import { useRouter } from "vue-router";
import type { User } from "@supabase/supabase-js";

export function useSessionRestore() {
  const user = ref<User | null>(null);
  const router = useRouter();

  onMounted(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session?.user) {
      user.value = session.user;
      const { data, error } = await supabase
        .from("users")
        .select("role")
        .eq("id", session.user.id)
        .single();
      if (!error && data?.role && session?.user?.id) {
        await router.replace(`/dashboard/${session.user.id}`);
      }
    }
  });

  return { user };
}
