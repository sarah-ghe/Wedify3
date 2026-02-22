import { ref } from "vue";
import { supabase } from "@/lib/supabase";
import { SignUpParams, userRole } from "@/features/shared/types/types";

export function useSignup() {
  const error = ref<string | null>(null);
  const loading = ref(false);

  const signup = async (params: SignUpParams & { role: userRole }) => {
    error.value = null;
    loading.value = true;
    try {
      console.log("Attempting signup with params:", params);
      const { email, password, role } = params;
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (signUpError) {
        error.value = signUpError.message || "An error occurred during signup.";
        loading.value = false;
        return null;
      }
      const userId = data.user?.id;
      if (userId) {
        const { error: dbError } = await supabase.from("users").insert([
          {
            id: userId,
            phone_number: params.phoneNumber,
            full_name: params.username,
            email: email,
            role: role,
            is_profile_completed: false,
          },
        ]);
        if (dbError) {
          error.value = dbError.message || "Failed to save user role.";
          loading.value = false;
          return null;
        }
      }
      return data;
    } catch (err: any) {
      error.value = err.message || "An error occurred during signup.";
      return null;
    } finally {
      loading.value = false;
    }
  };

  return {
    signup,
    error,
    loading,
  };
}
