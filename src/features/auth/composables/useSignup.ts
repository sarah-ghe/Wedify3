import { ref } from 'vue';
import { supabase } from '@/lib/supabase';
import type { LoginParams } from '@/lib/types';

export function useSignup() {
    const error = ref<string | null>(null);
    const loading = ref(false);

    const signup = async (params: LoginParams) => {
        error.value = null;
        loading.value = true;
        try {
            console.log('Attempting signup with params:', params)
            const { email, password } = params;
            const { data, error: signUpError } = await supabase.auth.signUp({
                email,
                password
            });
            if (signUpError) {
                error.value = signUpError.message || 'An error occurred during signup.';
                loading.value = false;
                return null;
            }
            console.log('Signup successful:', data);
            return data;
        } catch (err: any) {
            error.value = err.message || 'An error occurred during signup.';
            return null;
        } finally {
            loading.value = false;
        }
    };

    return {
        signup,
        error,
        loading
    };
}
